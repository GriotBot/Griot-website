// File: /pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Ensure fonts are loaded
  useEffect(() => {
    // Add font loading detection if needed
    setFontsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
