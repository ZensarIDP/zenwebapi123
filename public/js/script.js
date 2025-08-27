// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentDate();
        
        // Load default city
        this.getWeather('Mumbai');
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.weatherContent = document.getElementById('weatherContent');
        
        // Current weather elements
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.currentTemp = document.getElementById('currentTemp');
        this.feelsLike = document.getElementById('feelsLike');
        this.minTemp = document.getElementById('minTemp');
        this.maxTemp = document.getElementById('maxTemp');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.sunrise = document.getElementById('sunrise');
        this.sunset = document.getElementById('sunset');
        
        // Forecast elements
        this.forecastContainer = document.getElementById('forecastContainer');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Quick city buttons
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                this.getWeather(city);
            });
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if (city) {
            this.getWeather(city);
        }
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.weatherContent.classList.add('hidden');
    }

    showWeatherContent() {
        this.hideLoading();
        this.errorMessage.classList.add('hidden');
        this.weatherContent.classList.remove('hidden');
    }

    async getWeather(city) {
        try {
            this.showLoading();
            
            // Get current weather
            const weatherResponse = await fetch(`/api/weather/${encodeURIComponent(city)}`);
            
            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                throw new Error(errorData.message || 'Failed to fetch weather data');
            }
            
            const weatherData = await weatherResponse.json();
            
            // Get forecast
            const forecastResponse = await fetch(`/api/forecast/${encodeURIComponent(city)}`);
            const forecastData = await forecastResponse.json();
            
            // Update UI
            this.updateCurrentWeather(weatherData);
            if (forecastResponse.ok) {
                this.updateForecast(forecastData);
            }
            
            this.showWeatherContent();
            
            // Clear input
            this.cityInput.value = '';
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.showError(error.message);
        }
    }

    updateCurrentWeather(data) {
        this.cityName.textContent = `${data.city}, ${data.country}`;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather.icon}@4x.png`;
        this.weatherIcon.alt = data.weather.description;
        this.weatherDescription.textContent = data.weather.description;
        this.currentTemp.textContent = data.temperature.current;
        this.feelsLike.textContent = data.temperature.feels_like;
        this.minTemp.textContent = data.temperature.min;
        this.maxTemp.textContent = data.temperature.max;
        this.humidity.textContent = `${data.humidity}%`;
        this.windSpeed.textContent = `${data.wind.speed} km/h`;
        this.pressure.textContent = `${data.pressure} hPa`;
        this.visibility.textContent = data.visibility ? `${data.visibility} km` : 'N/A';
        this.sunrise.textContent = data.sunrise;
        this.sunset.textContent = data.sunset;
    }

    updateForecast(data) {
        this.forecastContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const forecastCard = this.createForecastCard(day);
            this.forecastContainer.appendChild(forecastCard);
        });
    }

    createForecastCard(dayData) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        card.innerHTML = `
            <div class="forecast-day">${dayData.day}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${dayData.weather.icon}@2x.png" 
                     alt="${dayData.weather.description}">
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${dayData.temperature.max}°</span>
                <span class="forecast-low">${dayData.temperature.min}°</span>
            </div>
            <div class="forecast-details">
                <span><i class="fas fa-tint"></i> ${dayData.humidity}%</span>
                <span><i class="fas fa-wind"></i> ${dayData.wind} km/h</span>
            </div>
        `;
        
        return card;
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate header on load
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        header.style.transition = 'all 1s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    // Animate search section
    const searchSection = document.querySelector('.search-section');
    searchSection.style.opacity = '0';
    searchSection.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        searchSection.style.transition = 'all 1s ease';
        searchSection.style.opacity = '1';
        searchSection.style.transform = 'translateY(0)';
    }, 300);
});

// Add particle effect for background (optional)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles
setTimeout(createParticles, 1000);
