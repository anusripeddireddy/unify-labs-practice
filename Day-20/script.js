
class WeatherDashboard {
  constructor() {
    this.currentLat = null;
    this.currentLon = null;
    this.locationName = '';
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.loadLocation(); // Try to get user's location first
  }

  bindElements() {
    this.elements = {
      cityInput: document.getElementById('cityInput'),
      searchBtn: document.getElementById('searchBtn'),
      locationDisplay: document.getElementById('locationDisplay'),
      currentWeather: document.getElementById('currentWeather'),
      tempDisplay: document.getElementById('tempDisplay'),
      condition: document.getElementById('condition'),
      weatherIcon: document.getElementById('weatherIcon'),
      feelsLike: document.getElementById('feelsLike'),
      humidity: document.getElementById('humidity'),
      wind: document.getElementById('wind'),
      hourlyForecast: document.getElementById('hourlyForecast'),
      lastUpdated: document.getElementById('lastUpdated')
    };
  }

  bindEvents() {
    this.elements.searchBtn.addEventListener('click', () => this.searchWeather());
    this.elements.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchWeather();
    });
  }

  async loadLocation() {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLon = position.coords.longitude;
        await this.fetchWeatherByCoords();
      },
      () => {
        // Default to Vijayawada if geolocation fails
        this.searchWeather('Vijayawada');
      }
    );
  }

  async searchWeather(city = null) {
    const cityName = city || this.elements.cityInput.value.trim();
    
    if (!cityName) {
      this.showError('Please enter a city name');
      return;
    }

    this.setLoading(true);
    
    try {
      // Get coordinates from city name using Nominatim (free)
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        this.showError('City not found');
        return;
      }

      this.currentLat = parseFloat(geoData[0].lat);
      this.currentLon = parseFloat(geoData[0].lon);
      this.locationName = geoData[0].display_name.split(',')[0];

      await this.fetchWeatherByCoords();
      
    } catch (error) {
      this.showError('Failed to fetch weather data');
      console.error('Weather fetch error:', error);
    }
  }

  async fetchWeatherByCoords() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.currentLat}&longitude=${this.currentLon}&current=temperature_2m,apparent_temperature,precipitation,weather_code,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=auto`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      this.displayWeather(data);
      this.updateHourlyForecast(data);
      this.setLocationDisplay();
      
    } catch (error) {
      this.showError('Weather data unavailable');
    }
  }

  displayWeather(data) {
    const current = data.current;
    
    // Temperature
    this.elements.tempDisplay.textContent = `${Math.round(current.temperature_2m)}°C`;
    
    // Condition and icon
    const condition = this.getWeatherCondition(current.weather_code);
    this.elements.condition.textContent = condition.description;
    this.elements.weatherIcon.innerHTML = `<i class="fas ${condition.icon}"></i>`;
    
    // Details
    this.elements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    this.elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    this.elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    
    this.setLoading(false);
    this.updateLastUpdated();
  }

  updateHourlyForecast(data) {
    const hourly = data.hourly;
    const now = new Date();
    const hours = Array.from({length: 12}, (_, i) => {
      const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      return {
        time: hourTime.getHours(),
        temp: Math.round(hourly.temperature_2m[i]),
        code: hourly.weather_code[i]
      };
    });

    this.elements.hourlyForecast.innerHTML = hours.map(hour => {
      const condition = this.getWeatherCondition(hour.code);
      return `
        <div class="hourly-card">
          <div class="hourly-time">${hour.time}:00</div>
          <div class="hourly-icon"><i class="fas ${condition.icon}"></i></div>
          <div class="hourly-temp">${hour.temp}°</div>
        </div>
      `;
    }).join('');
  }

  getWeatherCondition(code) {
    const conditions = {
      0: { description: 'Clear sky', icon: 'fa-sun' },
      1: { description: 'Mainly clear', icon: 'fa-cloud-sun' },
      2: { description: 'Partly cloudy', icon: 'fa-cloud-sun' },
      3: { description: 'Overcast', icon: 'fa-cloud' },
      45: { description: 'Fog', icon: 'fa-smog' },
      48: { description: 'Depositing rime fog', icon: 'fa-smog' },
      51: { description: 'Light drizzle', icon: 'fa-cloud-rain' },
      53: { description: 'Moderate drizzle', icon: 'fa-cloud-rain' },
      55: { description: 'Dense drizzle', icon: 'fa-cloud-rain' },
      61: { description: 'Slight rain', icon: 'fa-cloud-rain' },
      63: { description: 'Moderate rain', icon: 'fa-cloud-rain' },
      65: { description: 'Heavy rain', icon: 'fa-cloud-rain' },
      71: { description: 'Slight snow', icon: 'fa-snowflake' },
      73: { description: 'Moderate snow', icon: 'fa-snowflake' },
      75: { description: 'Heavy snow', icon: 'fa-snowflake' },
      80: { description: 'Slight rain showers', icon: 'fa-cloud-showers-heavy' },
      95: { description: 'Thunderstorm', icon: 'fa-bolt' }
    };
    
    return conditions[code] || { description: 'Unknown', icon: 'fa-question' };
  }

  setLocationDisplay() {
    this.elements.locationDisplay.textContent = this.locationName || 'Unknown location';
  }

  updateLastUpdated() {
    this.elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  }

  setLoading(loading) {
    const elements = [this.elements.currentWeather, this.elements.hourlyForecast];
    elements.forEach(el => el.classList.toggle('loading', loading));
  }

  showError(message) {
    this.elements.condition.textContent = message;
    this.elements.weatherIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    this.setLoading(false);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new WeatherDashboard();
  
  // Auto-refresh every 10 minutes
  setInterval(() => {
    if (window.weatherDashboard?.currentLat) {
      window.weatherDashboard.fetchWeatherByCoords();
    }
  }, 10 * 60 * 1000);
});
