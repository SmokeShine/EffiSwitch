import React, { useState, useEffect } from 'react';
import styles from './styles/Stopwatch.module.css';

const Stopwatch = ({ startOn, setSeconds, type, onClick, initialSeconds }) => {
  const [seconds, setLocalSeconds] = useState(initialSeconds); // Use initialSeconds prop
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (startOn) {
      setTimer(setInterval(() => setLocalSeconds((prev) => prev + 1), 1000));
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup interval when stopped
  }, [startOn]);

  useEffect(() => {
    setSeconds(seconds);
  }, [seconds, setSeconds]);

  return (
    <div className={styles.stopwatch} onClick={onClick}>
      <p className={styles.timer}>
        {type}: {seconds} seconds
      </p>
    </div>
  );
};

export default Stopwatch;