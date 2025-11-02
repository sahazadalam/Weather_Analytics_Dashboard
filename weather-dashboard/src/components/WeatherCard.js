import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';

const WeatherCard = ({ weatherData, onCardClick }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.cities);
  const unit = useSelector(state => state.weather.unit);
  const lastUpdated = useSelector(state => state.weather.lastUpdated[weatherData.name]);

  const isFavorite = favorites.includes(weatherData.name);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(weatherData.name));
    } else {
      dispatch(addFavorite(weatherData.name));
    }
  };

  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  const getTempUnit = () => unit === 'fahrenheit' ? '°F' : '°C';

  const getTimeAgo = () => {
    if (!lastUpdated) return 'Just now';
    const diff = Date.now() - lastUpdated;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div 
      className="weather-card"
      onClick={() => onCardClick(weatherData.name)}
    >
      <div className="weather-card-header">
        <div className="city-info">
          <h3 className="city-name">{weatherData.name}</h3>
          <span className="country-code">{weatherData.sys.country}</span>
        </div>
        <button 
          onClick={toggleFavorite}
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-icon-container">
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            className="weather-icon"
          />
        </div>
        <div className="temperature-section">
          <div className="current-temp">
            {Math.round(convertTemp(weatherData.main.temp))}{getTempUnit()}
          </div>
          <div className="weather-desc">
            {weatherData.weather[0].description}
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">
            {Math.round(convertTemp(weatherData.main.feels_like))}{getTempUnit()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weatherData.wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weatherData.main.pressure} hPa</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="update-time">Updated {getTimeAgo()}</span>
        {weatherData.fromCache && <span className="cache-indicator">♻️ Cached</span>}
      </div>
    </div>
  );
};

export default WeatherCard;