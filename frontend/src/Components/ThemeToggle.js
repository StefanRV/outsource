import React, { useState, useEffect } from "react";
import styles from "../Styles/components/ThemeToggle.module.scss";

const ThemeToggle = ({ onThemeChange }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkTheme(savedTheme === "dark");
      document.documentElement.classList.toggle(
        "dark-theme",
        savedTheme === "dark"
      );
      onThemeChange(savedTheme === "dark"); // Уведомляем родителя о начальной теме
    }
  }, [onThemeChange]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark-theme", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      onThemeChange(newTheme); // Уведомляем родителя о смене темы
      return newTheme;
    });
  };

  return (
    <button onClick={toggleTheme} className={styles.toggleButton}>
      {isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
    </button>
  );
};

export default ThemeToggle;
