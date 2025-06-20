// Clock & Date Update
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds().toString().padStart(2,'0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, options);
}

setInterval(updateTime, 1000);
updateTime();

// Dark Mode Toggle
const darkToggle = document.getElementById('darkModeToggle');

darkToggle.addEventListener('change', () => {
  if(darkToggle.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// Weather Functionality
const weatherDiv = document.getElementById('weather');
const locationDiv = document.getElementById('location');
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- Replace with your OpenWeatherMap API key
