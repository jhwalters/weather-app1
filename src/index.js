import { API_KEY } from './config.js';

const myLocationBtn = document.querySelector('.my-location-btn');
const changeLocationBtn = document.querySelector('.change-location-btn');
const cityName = document.querySelector('.location h1');
const currentTemp = document.querySelector('.current-temp');
const currentConditionImg = document.querySelector('.current-weather img');
const hourlyDate = document.querySelector('.hourly-date');
const hoursContainer = document.querySelector('.hours');
const forecastContainer = document.querySelector('.days');
const humidityContainer = document.querySelector('.humidity-info h3');
const windSpeedContainer = document.querySelector('.wind-info h3');

myLocationBtn.addEventListener('click', getLocation);

changeLocationBtn.addEventListener('click', () => {
    const newCity = prompt("Enter a city name:");
    if (newCity) fetchWeatherData(newCity);
});

function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(`${latitude},${longitude}`);
        },
        handleLocationError
    );
}

function handleLocationError(error) {
    alert(error.message);
}

async function fetchWeatherData(city) {
    try {
        const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
        const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;

        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        updateCurrentWeather(currentData);
        updateHourlyWeather(forecastData);
        updateForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateCurrentWeather(data) {
    cityName.textContent = data.location.name;
    currentTemp.textContent = `${Math.round(data.current.temp_f)}°F`;
    currentConditionImg.src = data.current.condition.icon;
    humidityContainer.textContent = `${data.current.humidity}%`;
    windSpeedContainer.textContent = `${Math.round(data.current.wind_mph)} mph`;
    hourlyDate.textContent = formatDate();
}

function updateHourlyWeather(data) {
    const currentHour = new Date().getHours();
    const hourlyData = data.forecast.forecastday[0].hour;

    hoursContainer.innerHTML = '';

    hourlyData.slice(currentHour).forEach(hour => {
        const hourEl = document.createElement('div');
        hourEl.classList.add('hour');

        const hourNumber = new Date(hour.time).getHours();

        hourEl.innerHTML = `
            <h2>${formatHour(hourNumber)}</h2>
            <img src="${hour.condition.icon}" alt="Weather Icon">
            <h3>${Math.round(hour.temp_f)}°</h3>
            `;

            hoursContainer.appendChild(hourEl);
    })
}

function updateForecast(data) {
    forecastContainer.innerHTML = '';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);

        const dayEl = document.createElement('div');
        dayEl.classList.add('day');

        dayEl.innerHTML = `
            <h2>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h2>
            <img src="${day.day.condition.icon}" alt="Weather Icon">
            <div class="temps">
                <h3>${Math.round(day.day.maxtemp_f)}°</h3>
                <h3>${Math.round(day.day.mintemp_f)}°</h3>
            </div>
        `;

        forecastContainer.appendChild(dayEl);
    })
}

function formatDate() {
    return new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour} ${period}`;
}