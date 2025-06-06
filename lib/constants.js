// File: /lib/constants.js
// Shared constants to eliminate code duplication

export const PROVERBS = [
  "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
  "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
  "We are the drums, we are the dance. — Afro-Caribbean Proverb",
  "A tree cannot stand without its roots. — Jamaican Proverb",
  "Unity is strength, division is weakness. — Swahili Proverb",
  "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
  "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
  "However long the night, the dawn will break. — African Proverb",
  "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
  "It takes a village to raise a child. — African Proverb",
  "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
  "You must act as if it is impossible to fail. — Yoruba Wisdom",
  "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
  "The fool speaks, the wise listen. — Ethiopian Proverb",
  "When the music changes, so does the dance. — Haitian Proverb",
  "The best way to eat an elephant in your path is to cut it up into little pieces. — African Proverb",
  "When the spider webs unite, they can tie up a lion. — Ethiopian Proverb",
  "Smooth seas do not make skillful sailors. — African Proverb"
];

// Storage keys for consistency
export const STORAGE_KEYS = {
  THEME: 'griotbot-theme',
  CHAT_HISTORY: 'griotbot-history',
  USER_PREFERENCES: 'griotbot-preferences'
};

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// API configuration constants
export const API_CONFIG = {
  MAX_TOKENS: {
    STANDARD: 180,
    STORYTELLER: 250
  },
  TEMPERATURE: {
    MIN: 0.3,
    MAX: 0.7,
    BASE: 0.4
  },
  MODEL_PARAMS: {
    TOP_P: 0.8,
    FREQUENCY_PENALTY: 0.2,
    PRESENCE_PENALTY: 0.1
  }
};

// Utility function for random proverb selection
export const getRandomProverb = () => {
  const randomIndex = Math.floor(Math.random() * PROVERBS.length);
  return PROVERBS[randomIndex];
};
