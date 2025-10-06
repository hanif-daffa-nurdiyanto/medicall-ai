'use client';

import { useEffect, useRef, useState } from 'react';

export default function TimerReminder() {
  const [inputMinutes, setInputMinutes] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // Load state from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem('timerEnd');
    if (savedTime) {
      const endTime = parseInt(savedTime);
      const diff = Math.floor((endTime - Date.now()) / 1000);
      if (diff > 0) {
        setTimeLeft(diff);
        setIsRunning(true);
      } else {
        localStorage.removeItem('timerEnd');
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleFinish();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    const minutes = parseInt(inputMinutes);
    if (isNaN(minutes) || minutes <= 0) return;

    const seconds = minutes;
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem('timerEnd', endTime.toString());

    Notification.requestPermission();
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const handleFinish = () => {
    setIsRunning(false);
    setTimeLeft(0);
    localStorage.removeItem('timerEnd');
    if (Notification.permission === 'granted') {
      new Notification('⏰ Waktu Habis!', {
        body: 'Sudah waktunya sholat!',
        icon: '/alarm-icon.png',
      });
    }
    alarmRef.current?.play();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(null);
    localStorage.removeItem('timerEnd');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">⏱ Ingatkan Saya</h1>

      {!isRunning && (
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="minutes" className="text-lg">
            Ingatkan saya dalam...
          </label>
          <input
            id="minutes"
            type="number"
            min="1"
            placeholder="misal 10"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            className="p-2 rounded border w-32 text-center dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleStart}
            className="btn btn-primary"
          >
            Mulai
          </button>
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="tooltip">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400  text-2xl font-black">Dont Click Me</div>
            </div>
            <button className="btn">Hover me</button>
          </div>
        </div>

      )}

      {isRunning && timeLeft !== null && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl font-mono">{formatTime(timeLeft)}</div>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Batalkan
          </button>
        </div>
      )}

      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}
