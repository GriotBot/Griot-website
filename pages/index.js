// In /pages/index.js
export default function Home() {
  return (
    <>
      <Head>
        {  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
  <title>GriotBot - Your Digital Griot</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
  }
      </Head>
      
      <div id="header" role="banner">
        <button id="toggleSidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle"></button>
      </div>
      
      {/* Rest of your components */}
    </>
  );
}
