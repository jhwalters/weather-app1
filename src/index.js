import { API_KEY } from './config.js';

const myLocationBtn = document.querySelector('.my-location-btn');
const changeLocationBtn = document.querySelector('.change-location-btn');
const cityName = document.querySelector('.location h1');
const currentTemp = document.querySelector('.current-temp');
const currentConditionImg = document.querySelector('.current-weather img');
const hourlyDate = document.querySelector('.hourly-date');
const hoursContainer = document.querySelector('.hours');

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
            currentTemp.textContent = `${data.current.temp_f.toFixed(0)}°`;
            currentConditionImg.src = data.current.condition.icon;
            hourlyDate.textContent = getDate();
            getHourlyData(city);
            getForecastData(city);

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

function getHourlyData(city) {
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&alerts=no&days=1`;
    const date = new Date();
    const time = date.getHours();
    console.log(`Current hour: ${time}`);
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Update the UI with hourly weather data
            const hourlyData = data.forecast.forecastday[0].hour;
            // You can loop through hourlyData to display it as needed
            hoursContainer.innerHTML = ''; // Clear previous hour data
            for (let i = time; i < hourlyData.length; i++) {
                const hourContainer = document.createElement('div.hour');
                const hour = hourlyData[i];
                if (hour.time.split(' ')[1].slice(0, 2) >= 12) {
                    hourContainer.innerHTML = `
                        <h2>${hour.time.split(' ')[1].slice(0, 2) - 12} PM</h2>
                        <img src="${hour.condition.icon}" alt="Weather Icon">
                        <h3>${hour.temp_f.toFixed(0)}°</h3>
                    `
                } else if (hour.time.split(' ')[1].slice(0, 2) == 12) {
                    hourContainer.innerHTML = `
                        <h2>${hour.time.split(' ')[1].slice(0, 2)} PM</h2>
                        <img src="${hour.condition.icon}" alt="Weather Icon">
                        <h3>${hour.temp_f.toFixed(0)}°</h3>
                    `
                
                } else {
                    hourContainer.innerHTML = `
                        <h2>${hour.time.split(' ')[1].slice(0, 2)} AM</h2>
                        <img src="${hour.condition.icon}" alt="Weather Icon">
                        <h3>${hour.temp_f.toFixed(0)}°</h3>
                    `
                }
                
                hourContainer.classList.add('hour');                
                hoursContainer.appendChild(hourContainer);
            }

        }
    )
    .catch(error => {
        console.error('Error fetching hourly weather data:', error);
    });
}

function getForecastData(city) {
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&alerts=no&days=7`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Update the UI with forecast weather data
            const forecastData = data.forecast.forecastday;
            const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            console.log(forecastData);
            // You can loop through forecastData to display it as needed
            const forecastContainer = document.querySelector('.days');
            forecastContainer.innerHTML = ''; // Clear previous forecast data
            forecastData.forEach(day => {
                const dayContainer = document.createElement('div');
                const date = new Date(day.date);
                    dayContainer.classList.add('day');
                    dayContainer.innerHTML = `
                        <h2>${
                            daysOfTheWeek[date.getDay() + 1]
                        }</h2>
                        <img src="${day.day.condition.icon}" alt="Weather Icon">
                        <div class="temps">
                            <h3>${day.day.maxtemp_f.toFixed(0)}°</h3>
                            <h3>${day.day.mintemp_f.toFixed(0)}°</h3>
                        </div>
                    `;
                    forecastContainer.appendChild(dayContainer);
                }
        )})
        .catch(error => {
            console.error('Error fetching forecast weather data:', error);
        });
}