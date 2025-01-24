import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import PriceDisplay from "./PriceDisplay";
import PriceChart from "./PriceChart";
import DarkModeToggle from "./DarkModeToggle";
import Footer from "./Footer";
import "./App.css";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleSearchSelect = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <header className="App-header">
        <h1>Financial Dashboard</h1>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <SearchBar onSearchSelect={handleSearchSelect} />
      </header>
      <main>
        {selectedItem && <PriceDisplay item={selectedItem} />}
        {selectedItem && <PriceChart item={selectedItem} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
