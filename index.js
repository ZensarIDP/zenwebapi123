const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Weather GUI App',
    version: '1.0.0'
  });
});

// API endpoint to get current weather
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        message: 'Please set OPENWEATHER_API_KEY environment variable'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: {
        current: Math.round(response.data.main.temp),
        feels_like: Math.round(response.data.main.feels_like),
        min: Math.round(response.data.main.temp_min),
        max: Math.round(response.data.main.temp_max)
      },
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      visibility: response.data.visibility ? Math.round(response.data.visibility / 1000) : null,
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      },
      wind: {
        speed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
        direction: response.data.wind.deg
      },
      sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
      timestamp: new Date().toISOString()
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'City not found',
        message: `Could not find weather data for city: ${req.params.city}`
      });
    } else if (error.response?.status === 401) {
      res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your OpenWeatherMap API key'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch weather data'
      });
    }
  }
});

// API endpoint to get 5-day forecast
app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        message: 'Please set OPENWEATHER_API_KEY environment variable'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    // Get daily forecasts (one per day at 12:00)
    const dailyForecasts = response.data.list
      .filter(item => item.dt_txt.includes('12:00:00'))
      .slice(0, 5)
      .map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: {
          min: Math.round(item.main.temp_min),
          max: Math.round(item.main.temp_max),
          current: Math.round(item.main.temp)
        },
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 3.6) // Convert to km/h
      }));

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: dailyForecasts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Forecast API Error:', error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'City not found',
        message: `Could not find forecast data for city: ${req.params.city}`
      });
    } else if (error.response?.status === 401) {
      res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your OpenWeatherMap API key'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch forecast data'
      });
    }
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `API route ${req.originalUrl} not found`
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌤️  Weather GUI App running on port ${PORT}`);
    console.log(`🌐 Open in browser: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
