'use client'

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    setTheme(saved || 'system');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appliedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

    root.setAttribute('data-theme', appliedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const iconClass = 'w-6 h-6';

  const activePosition = {
    light: 'left-2',
    dark: 'left-14',
    system: 'left-25.5',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative w-[144px] h-12 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-full px-1 py-1 flex items-center gap-2 transition-colors duration-500">
        <div
          className={`absolute top-1.5 w-8 h-8 rounded-full bg-blue-500 transition-all duration-300 ${activePosition[theme]}`}
        />

        {/* Buttons */}
        <button
          onClick={() => setTheme('light')}
          className="z-10 w-10 h-10 flex items-center justify-center text-white"
          title="Light"
        >
          <SunIcon className={iconClass} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="z-10 w-10 h-10 flex items-center justify-center text-slate-700 dark:text-white"
          title="Dark"
        >
          <MoonIcon className={iconClass} />
        </button>
        <button
          onClick={() => setTheme('system')}
          className="z-10 w-10 h-10 flex items-center justify-center text-slate-700 dark:text-white"
          title="System"
        >
          <ComputerDesktopIcon className={iconClass} />
        </button>
      </div>
    </div>
  );

}
