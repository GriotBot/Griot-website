// File: /pages/api/debug-env.js
// Temporary endpoint to debug environment variables
// DELETE THIS FILE after debugging is complete

export default async function handler(req, res) {
  // Only allow in development or with specific query parameter
  if (process.env.NODE_ENV === 'production' && req.query.debug !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }

  const envDebug = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    
    // Check for API key variations
    openrouterApiKey: {
      exists: !!process.env.OPENROUTER_API_KEY,
      length: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0,
      prefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) + '...' : 'N/A'
    },
    
    // All environment variables containing 'key', 'api', or 'open'
    relevantEnvVars: Object.keys(process.env).filter(key => 
      key.toLowerCase().includes('key') || 
      key.toLowerCase().includes('api') || 
      key.toLowerCase().includes('open')
    ),
    
    // Total environment variables count
    totalEnvVars: Object.keys(process.env).length,
    
    // First few characters of each relevant env var (for debugging)
    envVarPrefixes: Object.keys(process.env)
      .filter(key => 
        key.toLowerCase().includes('key') || 
        key.toLowerCase().includes('api') || 
        key.toLowerCase().includes('open')
      )
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? process.env[key].substring(0, 10) + '...' : 'empty';
        return acc;
      }, {})
  };

  return res.status(200).json(envDebug);
}
