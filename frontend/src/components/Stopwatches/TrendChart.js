import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrendChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get_trends/');
        const data = response.data;

        if (!data.dates || !data.study_time || !data.time_wasted) {
          setError('No data available.');
          return;
        }

        // Format dates using native JavaScript
        const formattedDates = data.dates.map(date => {
          const dateObj = new Date(date);
          return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        });

        const sanitizedStudyTime = data.study_time.map(time => Math.max(0, time));
        const sanitizedTimeWasted = data.time_wasted.map(time => Math.max(0, time));

        setChartData({
          labels: formattedDates,
          datasets: [
            {
              label: 'Study Time (seconds)',
              data: sanitizedStudyTime,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
            {
              label: 'Time Wasted (seconds)',
              data: sanitizedTimeWasted,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching trend data:', error);
        setError('Failed to load trend data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!chartData) {
    return <p>Loading trend data...</p>;
  }

  return (
    <div>
      <h2>Daily Trend Chart</h2>
      <Line 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value} seconds`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time (seconds)',
              },
              ticks: {
                stepSize: 1,
              },
            },
          },
        }} 
      />
    </div>
  );
};

export default TrendChart;