// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa'; // Added FaTimes for the Clear button
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) { // Check for empty or whitespace-only input
      setError('Please enter a city name.');
      setWeatherData(null); // Clear previous weather data
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(`https://weatherdashboardapi.onrender.com/api/WeatherForecast/${city}`);
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name and try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCity(''); // Clear the input field
    setWeatherData(null); // Clear the weather data
    setError(''); // Clear any error messages
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (description) => {
    if (!description) return null;
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return <WiDaySunny className="weather-icon" />;
    if (desc.includes('cloud')) return <WiCloudy className="weather-icon" />;
    if (desc.includes('rain')) return <WiRain className="weather-icon" />;
    if (desc.includes('snow')) return <WiSnow className="weather-icon" />;
    if (desc.includes('thunder')) return <WiThunderstorm className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  };

  return (
    <div className="container">
      <h1>Weather Dashboard</h1>
      <br/>
      <div className="search-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name (e.g., Lisbon)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? <FaSpinner className="spinner" /> : <FaSearch />}
          {loading ? 'Loading...' : 'Search'}
        </button>
        <button className="btn btn-secondary" onClick={handleClear} disabled={loading}>
          <FaTimes /> Clear
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {weatherData ? (
        <div className="weather-card">
          <h2>{weatherData.city}</h2>
          {getWeatherIcon(weatherData.description)}
          <h3>{weatherData.temperature.toFixed(1)}°C</h3>
          <p className="text-capitalize">{weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="placeholder-text">
            Search for a city to see the weather! ☀️
          </p>
        )
      )}
    </div>
  );
}

export default App;