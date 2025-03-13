// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi'; // Weather icons

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(`https://weatherdashboard-api.onrender.com/api/weatherForecast?city=${city}`);
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name and try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Function to get the appropriate weather icon
  const getWeatherIcon = (description) => {
    if (!description) return null;
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return <WiDaySunny size={50} />;
    if (desc.includes('cloud')) return <WiCloudy size={50} />;
    if (desc.includes('rain')) return <WiRain size={50} />;
    if (desc.includes('snow')) return <WiSnow size={50} />;
    if (desc.includes('thunder')) return <WiThunderstorm size={50} />;
    return <WiDaySunny size={50} />; // Default to sunny
  };

  return (
    <div className="container">


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
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {weatherData ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="card-title">{weatherData.city}</h2>
                {getWeatherIcon(weatherData.description)}
                <h3>{weatherData.temperature}°C</h3>
                <p className="text-capitalize">{weatherData.description}</p>
                <p>Humidity: {weatherData.humidity}%</p>
                <p>Wind Speed: {weatherData.windSpeed} m/s</p>
              </div>
            </div>
          </div>
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