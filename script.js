const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');
const cityInput = document.querySelector('.search-box input');

const weatherConditions = [
    { condition: 'Clear', icon: 'images/sunny.png' },
    { condition: 'Rain', icon: 'images/rain.png' },
    { condition: 'Snow', icon: 'images/snow.png' },
    { condition: 'Clouds', icon: 'images/cloudy.png' },
    { condition: 'Mist', icon: 'images/misty.png' },
    { condition: 'Haze', icon: 'images/misty.png' }
];

function handleSearch() {
    const apiKey = 'ed0b30a8170d52c7809a5e8813198c74';
    const city = cityInput.value.trim();

    if (!city) {
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod == '404') {
                cityHide.textContent = city;
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                adjustContainerHeight();
                return;
            }

            const weatherImage = weatherBox.querySelector('img');
            const temperature = weatherBox.querySelector('.temperature');
            const description = weatherBox.querySelector('.description');
            const humidity = weatherDetails.querySelector('.humidity span');
            const wind = weatherDetails.querySelector('.wind span');

            cityHide.textContent = city;
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active');
            setTimeout(() => {
                container.classList.remove('active');
            }, 2500);
            adjustContainerHeight();

            const currentCondition = data.weather[0].main;
            const weatherIcon = weatherConditions.find(condition => condition.condition === currentCondition)?.icon || 'images/default.png';

            weatherImage.src = weatherIcon;
            temperature.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
            description.innerHTML = data.weather[0].description;
            humidity.innerHTML = `${data.main.humidity}%`;
            wind.innerHTML = `${Math.round(data.wind.speed)}km/h`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

searchButton.addEventListener('click', handleSearch);

function adjustContainerHeight() {
    const currentWidth = window.innerWidth;
    if (error404.classList.contains('active')) {
        container.style.height = '435px';
    } else {
        container.style.height = '585px';
    }
}

window.addEventListener('resize', adjustContainerHeight);

cityInput.addEventListener('keypress', function handleEnterPress(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
