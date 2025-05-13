// In /pages/index.js
export default function Home() {
  return (
    <>
      <Head>
        {/* head content */}
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
