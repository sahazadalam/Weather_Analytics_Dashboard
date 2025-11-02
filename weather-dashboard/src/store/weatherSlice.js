import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '01c33699529ab0b7c6a829541065954d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Extended Indian and Nepali cities
export const DEFAULT_CITIES = [
  'Delhi,IN', 'Mumbai,IN', 'Bangalore,IN', 'Kolkata,IN',
  'Chennai,IN', 'Hyderabad,IN', 'Pune,IN', 'Jaipur,IN',
  'Kathmandu,NP', 'Pokhara,NP', 'Biratnagar,NP', 'Bharatpur,NP',
  'Siddharthnagar,NP', 'Bhadrapur,NP', 'Lucknow,IN', 'Ahmedabad,IN',
  'Surat,IN', 'Patna,IN', 'Indore,IN', 'Thiruvananthapuram,IN'
];

const CACHE_DURATION = 60 * 1000;

const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(`weather_${key}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    localStorage.removeItem(`weather_${key}`);
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
};

const setToCache = (key, data) => {
  try {
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(`weather_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// City suggestions for search
export const CITY_SUGGESTIONS = [
  'Delhi, India', 'Mumbai, India', 'Bangalore, India', 'Kolkata, India',
  'Chennai, India', 'Hyderabad, India', 'Pune, India', 'Jaipur, India',
  'Kathmandu, Nepal', 'Pokhara, Nepal', 'Biratnagar, Nepal', 'Bharatpur, Nepal',
  'Siddharthnagar, Nepal', 'Bhadrapur, Nepal', 'Lucknow, India', 'Ahmedabad, India',
  'Surat, India', 'Patna, India', 'Indore, India', 'Thiruvananthapuram, India',
  'London, UK', 'New York, US', 'Tokyo, Japan', 'Sydney, Australia',
  'Paris, France', 'Dubai, UAE', 'Singapore, SG'
];

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city) => {
    // Extract city name from "City, Country" format
    const cityName = city.split(',')[0].trim();
    const cacheKey = `current_${cityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      return { ...cachedData, fromCache: true };
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setToCache(cacheKey, response.data);
      return { ...response.data, fromCache: false };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city) => {
    const cityName = city.split(',')[0].trim();
    const cacheKey = `forecast_${cityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      return { ...cachedData, fromCache: true };
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setToCache(cacheKey, response.data);
      return { ...response.data, fromCache: false };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: {},
    forecast: {},
    loading: false,
    error: null,
    unit: 'celsius',
    lastUpdated: {},
    autoRefresh: true,
    refreshInterval: 30000,
  },
  reducers: {
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    forceRefresh: (state, action) => {
      const city = action.payload;
      if (city) {
        const cacheKey = `current_${city.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        localStorage.removeItem(`weather_${cacheKey}`);
      } else {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('weather_')) {
            localStorage.removeItem(key);
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        const cityName = action.payload.name;
        state.current[cityName] = action.payload;
        state.lastUpdated[cityName] = Date.now();
        state.error = null;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const cityName = action.payload.city.name;
        state.forecast[cityName] = action.payload;
      });
  },
});

export const { setUnit, clearError, setAutoRefresh, setRefreshInterval, forceRefresh } = weatherSlice.actions;
export default weatherSlice.reducer;