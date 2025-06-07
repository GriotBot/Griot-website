// File: lib/constants.js - Shared constants for GriotBot
// This centralizes data to prevent duplication across components

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

export const SUGGESTION_CARDS = [
  {
    category: "Storytelling",
    title: "Tell me a diaspora story about resilience",
    prompt: "Tell me a story about resilience from the African diaspora"
  },
  {
    category: "Wisdom", 
    title: "African wisdom on community building",
    prompt: "Share some wisdom about community building from African traditions"
  },
  {
    category: "Personal Growth",
    title: "Connect with my cultural heritage", 
    prompt: "How can I connect more with my cultural heritage?"
  },
  {
    category: "History",
    title: "The historical significance of Juneteenth",
    prompt: "Explain the historical significance of Juneteenth"
  },
  {
    category: "Culture",
    title: "Explain the importance of call and response",
    prompt: "What is the cultural significance of call and response in African traditions?"
  },
  {
    category: "Modern Issues",
    title: "Navigating identity in the diaspora",
    prompt: "How can I navigate questions of cultural identity as part of the African diaspora?"
  }
];

// Configuration constants
export const MAX_HISTORY_LENGTH = 50; // Maximum number of messages to store in localStorage
export const CHAT_HISTORY_KEY = 'griotbot-history';
export const THEME_STORAGE_KEY = 'griotbot-theme';

// Utility function to get random proverb
export const getRandomProverb = () => {
  const randomIndex = Math.floor(Math.random() * PROVERBS.length);
  return PROVERBS[randomIndex];
};
