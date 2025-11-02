import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { fetchCurrentWeather, fetchForecast, DEFAULT_CITIES, setUnit } from './store/weatherSlice';
import { loginSuccess } from './store/authSlice'; // Remove 'logout' from import
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import WeatherModal from './components/WeatherModal';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import useRealTimeWeather from './hooks/useRealTimeWeather';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { current, loading, error, unit, autoRefresh } = useSelector(state => state.weather);
  const favorites = useSelector(state => state.favorites.cities);
  const { isAuthenticated, isGuest } = useSelector(state => state.auth); // Remove 'user' from destructuring
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeView, setActiveView] = useState('all');
  
  const { refreshData } = useRealTimeWeather();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const citiesToLoad = [...DEFAULT_CITIES, ...favorites];
      const uniqueCities = [...new Set(citiesToLoad)];
      
      uniqueCities.forEach(city => {
        dispatch(fetchCurrentWeather(city));
        dispatch(fetchForecast(city));
      });
    }
  }, [dispatch, favorites, isAuthenticated]);

  const handleCardClick = (cityName) => {
    setSelectedCity(cityName);
  };

  const handleCloseModal = () => {
    setSelectedCity(null);
  };

  const handleUnitToggle = () => {
    dispatch(setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleManualRefresh = () => {
    refreshData();
  };

  const filteredWeatherData = Object.values(current).filter(data => {
    if (activeView === 'favorites') {
      return favorites.includes(data.name);
    }
    return true;
  });

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">🌤️</div>
            <div className="header-titles">
              <h1 className="app-title">WeatherSphere</h1>
              <p className="app-subtitle">India and Nepal Weather</p>
            </div>
          </div>

          <div className="header-center">
            <SearchBar />
          </div>

          <div className="header-right">
            <div className="view-controls">
              <button 
                className={`view-btn ${activeView === 'all' ? 'active' : ''}`}
                onClick={() => setActiveView('all')}
              >
                All
              </button>
              <button 
                className={`view-btn ${activeView === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveView('favorites')}
              >
                ⭐ {favorites.length > 0 && <span className="fav-count">{favorites.length}</span>}
              </button>
            </div>

            <div className="utility-controls">
              <button 
                onClick={handleUnitToggle}
                className="unit-btn"
                title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              >
                °{unit === 'celsius' ? 'F' : 'C'}
              </button>
              <button 
                onClick={handleManualRefresh}
                className="refresh-btn"
                disabled={loading}
                title="Refresh data"
              >
                {loading ? (
                  <div className="btn-spinner"></div>
                ) : (
                  '↻'
                )}
              </button>
            </div>

            <UserProfile />
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span className="error-message">{error}</span>
          <button 
            onClick={() => dispatch({ type: 'weather/clearError' })}
            className="error-close"
          >
            ×
          </button>
        </div>
      )}

      <main className="app-main">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner-large"></div>
            <p>Updating weather data...</p>
          </div>
        )}

        <div className="cities-grid">
          {filteredWeatherData.map((data, index) => (
            <WeatherCard 
              key={data.name} 
              weatherData={data} 
              onCardClick={handleCardClick}
              index={index}
            />
          ))}
        </div>

        {filteredWeatherData.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏙️</div>
            <h3>No cities to display</h3>
            <p>
              {activeView === 'favorites' 
                ? 'Add some cities to your favorites to see them here.'
                : 'Search for cities to add them to your dashboard.'
              }
            </p>
          </div>
        )}
      </main>

      {selectedCity && (
        <WeatherModal 
          cityName={selectedCity} 
          onClose={handleCloseModal} 
        />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>Developed with ❤️ by <strong>Shahazad Alam</strong></p>
          <div className="footer-info">
            <span>Real-time data • Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
            <span>• Unit: {unit.toUpperCase()}</span>
            {isGuest && <span>• Guest Mode</span>}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;