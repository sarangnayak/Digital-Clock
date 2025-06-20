const API_KEY = 'ac2dd25c2141409250251ac4aea5801a';

const clock = document.getElementById('clock');
const dateEl = document.getElementById('date');
const locationEl = document.getElementById('location');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const spinner = document.getElementById('spinner');
const darkModeToggle = document.getElementById('darkModeToggle');

function updateClock() {
  const now = new Date();

  let hrs = now.getHours().toString().padStart(2, '0');
  let mins = now.getMinutes().toString().padStart(2, '0');
  let secs = now.getSeconds().toString().padStart(2, '0');

  clock.textContent = `${hrs}:${mins}:${secs}`;

  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  dateEl.textContent = `${day}/${month}/${year}`;
}

setInterval(updateClock, 1000);
updateClock();

function fetchWeather(cityName) {
  locationEl.textContent = 'Loading weather...';
  weatherDesc.textContent = '';
  weatherIcon.style.display = 'none';
  spinner.style.display = 'inline-block'; // Show spinner

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      spinner.style.display = 'none'; // Hide spinner
      if (data.cod === 200) {
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        weatherDesc.textContent = `${Math.round(data.main.temp)}°C - ${data.weather[0].description}`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.style.display = 'inline';
      } else {
        locationEl.textContent = 'City not found';
        weatherDesc.textContent = '';
        weatherIcon.style.display = 'none';
      }
    })
    .catch(() => {
      spinner.style.display = 'none'; // Hide spinner
      locationEl.textContent = 'Weather data not available';
      weatherDesc.textContent = '';
      weatherIcon.style.display = 'none';
    });
}

getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name.');
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeatherBtn.click();
  }
});

// Dark mode toggle logic
darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// Load default city on page load
fetchWeather('Gurugram');
