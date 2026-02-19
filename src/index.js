const myLocationBtn = document.querySelector('.my-location-btn');
const changeLocationBtn = document.querySelector('.change-location-btn');
const cityName = document.querySelector('.location h1');

myLocationBtn.addEventListener('click', getLocation);
changeLocationBtn.addEventListener('click', () => {
    const newCity = prompt("Enter a city name:");
    if (newCity) {
        cityName.textContent = newCity;
    }
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

