import React from "react";
import "./DarkModeToggle.css";

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button className="DarkModeToggle" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;
