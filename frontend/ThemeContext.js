import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [displayMode, setDisplayMode] = useState("light");

  const theme = displayMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ displayMode, setDisplayMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const lightTheme = {
  background: "#fff",
  text: "#000",
  card: "#f5f5f5",
  divider: "#ddd",
};

const darkTheme = {
  background: "#121212",
  text: "#fff",
  card: "#1e1e1e",
  divider: "#333",
};
