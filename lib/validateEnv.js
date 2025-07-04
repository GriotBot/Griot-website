export default function validateEnv() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Please add it in your environment or through Vercel\'s Environment Variables page.'
    );
  }
}
