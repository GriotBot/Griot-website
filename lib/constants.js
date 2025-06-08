// File: lib/constants.js

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
  "Smooth seas do not make skillful sailors. — African Proverb",
  "The time is always right to do what is right. — Martin Luther King Jr.",
  "If there's a book that you want to read, but it hasn't been written yet, then you must write it. — Toni Morrison",
  "Not everything that is faced can be changed, but nothing can be changed until it is faced. — James Baldwin",
  "Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly. — Langston Hughes",
  "If there is no struggle, there is no progress. — Frederick Douglass",
  "The most common way people give up their power is by thinking they don't have any. — Alice Walker",
  "There are years that ask questions and years that answer. — Zora Neale Hurston",
  "Your silence will not protect you. — Audre Lorde",
  "The future belongs to those who prepare for it today. — Malcolm X",
  "Nothing will work unless you do. — Maya Angelou"
];

// NEW: Expanded and verified array of greetings from across the diaspora
export const GREETINGS = [
    // African-American
    { text: "What's good?", origin: "African-American Vernacular" },
    
    // Afro-Caribbean
    { text: "Wah Gwaan?", origin: "Jamaica" },
    { text: "Sak Pase?", origin: "Haiti" },
    { text: "Waz di scene?", origin: "Trinidad & Tobago" },
    { text: "Wuh gine on?", origin: "Barbados" },

    // Afro-Latin American
    { text: "¿Qué bolá?", origin: "Cuba" },
    { text: "E aí, tudo joia?", origin: "Brazil" },
    { text: "¿Qué lo qué?", origin: "Dominican Republic" },
    
    // Continental African
    { text: "Akwaaba", origin: "Ghana (Akan)" },
    { text: "Jambo", origin: "East Africa (Swahili)" },
    { text: "Molo", origin: "South Africa (Xhosa)" },
    { text: "Bawo ni?", origin: "Nigeria (Yoruba)" },
    { text: "Nanga def?", origin: "Senegal (Wolof)" },
    { text: "Selam", origin: "Ethiopia & Eritrea" }
];

export const MAX_HISTORY_LENGTH = 50;
export const CHAT_HISTORY_KEY = 'griotbot-history';

// Utility function to get a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomProverb = () => getRandomItem(PROVERBS);
export const getRandomGreeting = () => getRandomItem(GREETINGS);
