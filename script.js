// DOM element references
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

// OpenWeather API Key (replace with your own if needed)
const API_KEY = 'ac2dd25c2141409250251ac4aea5801a';

// Function to update digital clock & date
function updateClock() {
    const now = new Date();

    // Format time in HH:MM:SS (24-hour format)
    const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    clockEl.textContent = time;

    // Format date in DD/MM/YYYY
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Intl.DateTimeFormat('en-GB', dateOptions).format(now);
    dateEl.textContent = date;
}

// Function to fetch weather data by city name
async function fetchWeatherByCity(city) {
    if (!city) return; // If no city entered, do nothing

    // Show spinner while loading
    spinner.style.display = 'inline-block';
    weatherIconEl.style.display = 'none';
    weatherDescEl.textContent = '';
    locationEl.textContent = city;

    try {
        // API call to OpenWeather
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                city
            )}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();

        // Update weather details
        weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconEl.alt = data.weather[0].description;
        weatherIconEl.style.display = 'inline-block';
        weatherDescEl.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;
    } catch (error) {
        // Handle errors (e.g., invalid city)
        locationEl.textContent = 'Location not found';
        weatherDescEl.textContent = 'Unable to fetch weather';
        weatherIconEl.style.display = 'none';
    } finally {
        // Hide spinner after response
        spinner.style.display = 'none';
    }
}

// Function to fetch weather by user's geolocation
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        locationEl.textContent = 'Getting your location...';

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // API call using latitude and longitude
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const data = await response.json();
            
                // Update UI with weather details
                locationEl.textContent = data.name;
                weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIconEl.alt = data.weather[0].description;
                weatherIconEl.style.display = 'inline-block';
                weatherDescEl.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;
            } catch (error) {
                // Error handling for failed API call
                console.error('Error fetching weather by location:', error);
                locationEl.textContent = 'Location not found';

                // Fallback city
                fetchWeatherByCity('New York'); 
            }
        }, (error) => {
            // Handle geolocation errors
            const errorMessages = {
                1: "Permission denied",
                2: "Position unavailable",
                3: "Request timeout"
            };
            console.error(`Geolocation error: ${errorMessages[error.code] || "Unknown error"}.`, error);
            console.log("Falling back to default city.");

            // Fallback city if geolocation fails
            fetchWeatherByCity('Gurugram');
        });
    } else {
        // If geolocation not supported, fallback to default
        fetchWeatherByCity('Gurugram');
    }
}

// Toggle dark mode on checkbox change
darkModeToggle.addEventListener('change', () => {
    body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    body.classList.toggle('dark-mode', darkModeToggle.checked);
});

// Fetch weather when "Get Weather" button is clicked
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
});

// Fetch weather when Enter key is pressed in input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        }
    }
});

// Start clock immediately and update every second
updateClock();
setInterval(updateClock, 1000);

// Fetch weather based on user's current location when page loads
fetchWeatherByLocation();
