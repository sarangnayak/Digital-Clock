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

// Update clock every second
function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  clockEl.textContent = time;

  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  dateEl.textContent = date;
}

// Fetch weather from OpenWeatherMap API
async function fetchWeather(city) {
  if (!city) return;

  spinner.style.display = 'inline-block';
  weatherIconEl.style.display = 'none';
  weatherDescEl.textContent = '';

  try {
    const apiKey = 'ac2dd25c2141409250251ac4aea5801a';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();

    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIconEl.alt = data.weather[0].description;
    weatherIconEl.style.display = 'inline-block';
    weatherDescEl.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;
  } catch (error) {
    weatherDescEl.textContent = 'Unable to fetch weather';
    weatherIconEl.style.display = 'none';
  } finally {
    spinner.style.display = 'none';
  }
}

// Dark mode toggle
darkModeToggle.addEventListener('change', () => {
  body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  if (darkModeToggle.checked) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
});

// Button click: Get weather
getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    locationEl.textContent = city;
    fetchWeather(city);
  }
});

// Press Enter in input: Get weather
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) {
      locationEl.textContent = city;
      fetchWeather(city);
    }
  }
});

// Init clock
updateClock();
setInterval(updateClock, 1000);
