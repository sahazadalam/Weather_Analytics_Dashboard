import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const TemperatureChart = ({ forecastData }) => {
  const unit = useSelector(state => state.weather.unit);

  const processForecastData = () => {
    if (!forecastData || !forecastData.list) return [];

    const dailyData = forecastData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          count: 1
        };
      } else {
        acc[date].minTemp = Math.min(acc[date].minTemp, item.main.temp_min);
        acc[date].maxTemp = Math.max(acc[date].maxTemp, item.main.temp_max);
        acc[date].count++;
      }
      return acc;
    }, {});

    return Object.values(dailyData).map(day => ({
      date: day.date,
      minTemp: unit === 'fahrenheit' ? (day.minTemp * 9/5) + 32 : day.minTemp,
      maxTemp: unit === 'fahrenheit' ? (day.maxTemp * 9/5) + 32 : day.maxTemp,
    }));
  };

  const data = processForecastData();

  return (
    <div style={{ height: '300px', margin: '20px 0' }}>
      <h3>5-Day Temperature Forecast</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="maxTemp" 
            stroke="#ff7300" 
            name={`Max Temp (${unit === 'fahrenheit' ? '°F' : '°C'})`}
          />
          <Line 
            type="monotone" 
            dataKey="minTemp" 
            stroke="#0088fe" 
            name={`Min Temp (${unit === 'fahrenheit' ? '°F' : '°C'})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;