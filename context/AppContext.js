// context/AppContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { proverbs } from '../data/proverbs';

// Define the context shape
const AppContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  storytellerMode: false,
  setStorytellerMode: () => {},
  currentProverb: '',
  getRandomProverb: () => {},
});

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('griotbot-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Pick a random proverb
  const getRandomProverb = () => {
    const index = Math.floor(Math.random() * proverbs.length);
    setCurrentProverb(proverbs[index]);
  };

  useEffect(() => {
    // Only run client-side
    if (typeof window === 'undefined') return;

    // Theme initialization
    const savedTheme = localStorage.getItem('griotbot-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initTheme);
    document.documentElement.setAttribute('data-theme', initTheme);

    // Storyteller mode
    const savedMode = localStorage.getItem('storyteller-mode');
    if (savedMode === 'true' || savedMode === 'false') {
      setStorytellerMode(savedMode === 'true');
    }

    // Proverb rotation
    getRandomProverb();
    const interval = setInterval(getRandomProverb, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        storytellerMode,
        setStorytellerMode,
        currentProverb,
        getRandomProverb,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for easy consumption
export function useAppContext() {
  return useContext(AppContext);
}
