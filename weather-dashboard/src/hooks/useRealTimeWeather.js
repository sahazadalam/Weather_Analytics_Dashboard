import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather } from '../store/weatherSlice';

const useRealTimeWeather = () => {
  const dispatch = useDispatch();
  const { current, autoRefresh, refreshInterval, lastUpdated } = useSelector(state => state.weather);
  const { isAuthenticated } = useSelector(state => state.auth);
  const intervalRef = useRef();

  // Wrap refreshData in useCallback to prevent unnecessary recreations
  const refreshData = useCallback(() => {
    const cities = Object.keys(current);
    cities.forEach(city => {
      const lastUpdate = lastUpdated[city] || 0;
      const now = Date.now();
      
      // Only refresh if data is older than 60 seconds
      if (now - lastUpdate > 60000) {
        dispatch(fetchCurrentWeather(city));
      }
    });
  }, [current, lastUpdated, dispatch]);

  useEffect(() => {
    if (isAuthenticated && autoRefresh) {
      // Refresh immediately
      refreshData();
      
      // Set up interval for real-time updates
      intervalRef.current = setInterval(() => {
        refreshData();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isAuthenticated, autoRefresh, refreshInterval, refreshData]); // Add refreshData to dependencies

  const toggleAutoRefresh = () => {
    // This would dispatch an action to toggle autoRefresh
    console.log('Toggle auto refresh');
  };

  return { toggleAutoRefresh, refreshData };
};

export default useRealTimeWeather;