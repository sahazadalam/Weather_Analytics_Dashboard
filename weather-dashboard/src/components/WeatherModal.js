import React from 'react';
import { useSelector } from 'react-redux';
import TemperatureChart from './TemperatureChart';

const WeatherModal = ({ cityName, onClose }) => {
  const currentWeather = useSelector(state => state.weather.current[cityName]);
  const forecast = useSelector(state => state.weather.forecast[cityName]);
  const unit = useSelector(state => state.weather.unit);

  if (!currentWeather) return null;

  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const getTempUnit = () => unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{cityName} - Detailed Weather</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Current Weather */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img 
            src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
            alt={currentWeather.weather[0].description}
            style={{ width: '100px', height: '100px' }}
          />
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
              {Math.round(convertTemp(currentWeather.main.temp))}{getTempUnit()}
            </div>
            <div style={{ fontSize: '18px', color: '#666' }}>
              {currentWeather.weather[0].description}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>FEELS LIKE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {Math.round(convertTemp(currentWeather.main.feels_like))}{getTempUnit()}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>HUMIDITY</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.main.humidity}%</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>PRESSURE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.main.pressure} hPa</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>WIND SPEED</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.wind.speed} m/s</div>
          </div>
        </div>

        {/* Forecast Chart */}
        {forecast && <TemperatureChart forecastData={forecast} />}

        {/* Hourly Forecast */}
        {forecast && (
          <div>
            <h3>24-Hour Forecast</h3>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', padding: '10px 0' }}>
              {forecast.list.slice(0, 8).map((item, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  minWidth: '100px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
                  </div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                  />
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {Math.round(convertTemp(item.main.temp))}{getTempUnit()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {item.weather[0].description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherModal;