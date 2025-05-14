// context/AppContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { proverbs } from '../data/proverbs';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  
  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    setTheme(newTheme);
  };
  
  // Get random proverb
  const getRandomProverb = () => {
    const randomIndex = Math.floor(Math.random() * proverbs.length);
    setCurrentProverb(proverbs[randomIndex]);
  };
  
  // Initialize from localStorage
  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('griotbot-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Storyteller mode initialization
    const savedMode = localStorage.getItem('storyteller-mode');
    if (savedMode) {
      setStorytellerMode(savedMode === 'true');
    }
    
    // Initial proverb
    getRandomProverb();
    
    // Set up proverb rotation interval
    const interval = setInterval(getRandomProverb, 30000); // Change every 30 seconds
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
        getRandomProverb
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
