import { API_KEY } from './config.js';

const myLocationBtn = document.querySelector('.my-location-btn');
const changeLocationBtn = document.querySelector('.change-location-btn');
const cityName = document.querySelector('.location h1');
const currentTemp = document.querySelector('.current-temp');
const currentConditionImg = document.querySelector('.current-weather img');
const hourlyDate = document.querySelector('.hourly-date');

myLocationBtn.addEventListener('click', getLocation);

changeLocationBtn.addEventListener('click', () => {
    const newCity = prompt("Enter a city name:");
    if (newCity) {
        cityName.textContent = newCity;
    }
    fetchWeatherData(newCity);
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    cityName.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    fetchWeatherData(`${lat},${lon}`);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function fetchWeatherData(city) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no
`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Update the UI with weather data
            cityName.textContent = data.location.name;
            currentTemp.textContent = `${data.current.temp_f}°`;
            currentConditionImg.src = data.current.condition.icon;
            hourlyDate.textContent = getDate();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function getDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;

    switch (month) {
        case 1:
            return `Jan, ${day} `;
        case 2:
            return `Feb, ${day} `;
        case 3:
            return `Mar, ${day} `;
        case 4:
            return `Apr, ${day} `;
        case 5:
            return `May, ${day} `;
        case 6:
            return `Jun, ${day} `;
        case 7:
            return `Jul, ${day} `;
        case 8:
            return `Aug, ${day} `;
        case 9:
            return `Sep, ${day} `;
        case 10:
            return `Oct, ${day} `;
        case 11:
            return `Nov, ${day} `;
        case 12:
            return `Dec, ${day} `;
    }
}