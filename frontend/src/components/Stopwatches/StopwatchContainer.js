import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';
import TrendChart from './TrendChart';
import axios from 'axios';

const StopwatchContainer = () => {
  const [studyTimeSeconds, setStudyTimeSeconds] = useState(0);
  const [timeWastedSeconds, setTimeWastedSeconds] = useState(0);
  const [isStudyTimeRunning, setIsStudyTimeRunning] = useState(false);
  const [isTimeWastedRunning, setIsTimeWastedRunning] = useState(false);

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    const storedDate = localStorage.getItem('lastSavedDate');
    const storedStudyTime = localStorage.getItem('studyTime');
    const storedTimeWasted = localStorage.getItem('timeWasted');

    // If localStorage values exist, set them, else reset them
    if (storedStudyTime && storedTimeWasted && storedDate === currentDate) {
      // If data exists for the current day, set values from localStorage
      setStudyTimeSeconds(parseInt(storedStudyTime));
      setTimeWastedSeconds(parseInt(storedTimeWasted));
    } else {
      // If it's a new day or no data exists, reset values
      localStorage.setItem('studyTime', '0');
      localStorage.setItem('timeWasted', '0');
      localStorage.setItem('lastSavedDate', currentDate); // Save today's date
      setStudyTimeSeconds(0);
      setTimeWastedSeconds(0);
    }

    // Add a storage event listener to update state when localStorage changes
    const handleStorageChange = () => {
      const updatedStudyTime = localStorage.getItem('studyTime');
      const updatedTimeWasted = localStorage.getItem('timeWasted');
      const updatedDate = localStorage.getItem('lastSavedDate');

      if (updatedDate === currentDate) {
        setStudyTimeSeconds(parseInt(updatedStudyTime || '0'));
        setTimeWastedSeconds(parseInt(updatedTimeWasted || '0'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentDate]);

  // Save data to localStorage when it changes
  useEffect(() => {
    // Only save if study time or time wasted has changed
    if (studyTimeSeconds !== 0 || timeWastedSeconds !== 0) {
      localStorage.setItem('studyTime', studyTimeSeconds);
      localStorage.setItem('timeWasted', timeWastedSeconds);
      localStorage.setItem('lastSavedDate', currentDate); // Save the current date
    }
  }, [studyTimeSeconds, timeWastedSeconds, currentDate]);

  const toggleStudyTime = () => {
    if (!isStudyTimeRunning) {
      setIsStudyTimeRunning(true);
      setIsTimeWastedRunning(false);
    }
  };

  const toggleTimeWasted = () => {
    if (!isTimeWastedRunning) {
      setIsTimeWastedRunning(true);
      setIsStudyTimeRunning(false);
    }
  };

  const endDay = async () => {
    // Stop both timers
    setIsStudyTimeRunning(false);
    setIsTimeWastedRunning(false);

    const data = [
      { reason: "Study", time_spent: studyTimeSeconds, type: "Study time" },
      { reason: "Time Wasted", time_spent: timeWastedSeconds, type: "Time wasted" }
    ];

    try {
      const response = await axios.post('http://localhost:8000/save_data/', data);
      console.log(response.data);

      // Fetch updated trend data
      fetchTrendData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const fetchTrendData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_trends/');
      console.log("Updated trend data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching updated trend data:", error);
    }
  };

  return (
    <div>
      <Stopwatch
        startOn={isStudyTimeRunning}
        setSeconds={setStudyTimeSeconds}
        type="Study time"
        onClick={toggleStudyTime}
        initialSeconds={studyTimeSeconds}
      />
      <Stopwatch
        startOn={isTimeWastedRunning}
        setSeconds={setTimeWastedSeconds}
        type="Time wasted"
        onClick={toggleTimeWasted}
        initialSeconds={timeWastedSeconds}
      />
      <button onClick={endDay}>End the Day</button>
      <TrendChart />
    </div>
  );
};

export default StopwatchContainer;