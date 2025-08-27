const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const locationEl = document.getElementById('location');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescEl = document.getElementById('weather-desc');
const spinner = document.getElementById('spinner');
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;


const API_KEY = 'ac2dd25c2141409250251ac4aea5801a';

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    clockEl.textContent = time;

    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Intl.DateTimeFormat('en-GB', dateOptions).format(now);
    dateEl.textContent = date;
}

async function fetchWeatherByCity(city) {
    if (!city) return;

    spinner.style.display = 'inline-block';
    weatherIconEl.style.display = 'none';
    weatherDescEl.textContent = '';
    locationEl.textContent = city;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                city
            )}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconEl.alt = data.weather[0].description;
        weatherIconEl.style.display = 'inline-block';
        weatherDescEl.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;
    } catch (error) {
        locationEl.textContent = 'Location not found';
        weatherDescEl.textContent = 'Unable to fetch weather';
        weatherIconEl.style.display = 'none';
    } finally {
        spinner.style.display = 'none';
    }
}

function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        locationEl.textContent = 'Getting your location...';
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const data = await response.json();
            
                locationEl.textContent = data.name;
                weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIconEl.alt = data.weather[0].description;
                weatherIconEl.style.display = 'inline-block';
                weatherDescEl.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;
            } catch (error) {
                console.error('Error fetching weather by location:', error);
                locationEl.textContent = 'Location not found';
                fetchWeatherByCity('New York'); // Fallback to a default city
            }
        }, (error) => {
            const errorMessages = {
                1: "Permission denied",
                2: "Position unavailable",
                3: "Request timeout"
            };
            console.error(`Geolocation error: ${errorMessages[error.code] || "Unknown error"}.`, error);
            console.log("Falling back to default city.");
            fetchWeatherByCity('Gurugram'); // Fallback on error
        });
    } else {
        
        fetchWeatherByCity('Gurugram');
    }
}


darkModeToggle.addEventListener('change', () => {
    body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    body.classList.toggle('dark-mode', darkModeToggle.checked);
});


getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        }
    }
});

updateClock();
setInterval(updateClock, 1000);
fetchWeatherByLocation(); // Fetch weather on page load
