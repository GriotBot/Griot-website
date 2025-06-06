// lib/constants.js
// Shared constants for GriotBot - Single source of truth

/**
 * Cultural proverbs from across the African diaspora
 * Used in footer displays and educational content
 */
export const PROVERBS = [
  "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
  "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
  "We are the drums, we are the dance. — Afro-Caribbean Proverb",
  "A tree cannot stand without its roots. — Jamaican Proverb",
  "Unity is strength, division is weakness. — Swahili Proverb",
  "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
  "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
  "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
  "You must act as if it is impossible to fail. — Yoruba Wisdom",
  "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
  "However long the night, the dawn will break. — African Proverb",
  "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
  "It takes a village to raise a child. — African Proverb",
  "The fool speaks, the wise listen. — Ethiopian Proverb",
  "When the music changes, so does the dance. — Haitian Proverb",
  "The best way to eat an elephant in your path is to cut it up into little pieces. — African Proverb",
  "When the spider webs unite, they can tie up a lion. — Ethiopian Proverb",
  "Smooth seas do not make skillful sailors. — African Proverb"
];

/**
 * API Configuration constants
 */
export const API_CONFIG = {
  // Model configuration
  DEFAULT_MODEL: 'openai/gpt-3.5-turbo',
  FALLBACK_MODEL: 'anthropic/claude-3-haiku:beta',
  
  // Temperature settings for different contexts
  TEMPERATURE: {
    EMPATHETIC: 0.3,      // For pain/sensitive topics
    STANDARD: 0.4,        // Normal conversations
    CELEBRATORY: 0.5,     // Happy/excited contexts
    STORYTELLER: 0.45     // Storyteller mode
  },
  
  // Token limits
  MAX_TOKENS: {
    STANDARD: 800,
    STORYTELLER: 1000,
    EDUCATIONAL: 1200
  },
  
  // Rate limiting
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_DAY: 1000
};

/**
 * Emotional indicators for empathetic responses
 */
export const EMOTIONAL_INDICATORS = {
  frustration: ['tired', 'exhausted', 'frustrated', 'why me', 'stressed'],
  pain: ['hurt', 'pain', 'sad', 'crying', 'broken', 'depressed'],
  hope: ['trying', 'hoping', 'want to learn', 'help me grow', 'better'],
  cultural_disconnection: ['not black enough', 'lost my heritage', 'identity', 'don\'t belong'],
  celebration: ['proud', 'happy', 'excited', 'achieved', 'success', 'graduated']
};

/**
 * UI Constants
 */
export const UI_CONFIG = {
  // Layout dimensions
  HEADER_HEIGHT: '72px',
  FOOTER_HEIGHT: '120px',
  SIDEBAR_WIDTH: '280px',
  
  // Animation durations
  ANIMATION_DURATION: {
    FAST: '0.2s',
    STANDARD: '0.3s',
    SLOW: '0.5s'
  },
  
  // Breakpoints
  BREAKPOINTS: {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px'
  }
};

/**
 * Contact information
 */
export const CONTACT_INFO = {
  email: 'chat@griotbot.com',
  instagram: 'https://www.instagram.com/griotbot',
  twitter: 'https://twitter.com/griotbot',
  linkedin: 'https://www.linkedin.com/company/griotbot'
};

/**
 * Suggestion cards for welcome screen
 */
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
  }
];

/**
 * Theme storage key
 */
export const THEME_STORAGE_KEY = 'griotbot-theme';

/**
 * Chat history storage key
 */
export const CHAT_HISTORY_KEY = 'griotbot-history';

/**
 * Default messages
 */
export const DEFAULT_MESSAGES = {
  WELCOME: "Welcome to GriotBot! I'm here to share wisdom, stories, and guidance rooted in African diaspora culture. How can I help you today?",
  ERROR: "I'm sorry, I encountered an error. Please try again.",
  LOADING: "Let me think about that...",
  NO_RESPONSE: "I apologize, but I seem to be having trouble processing your request."
};
