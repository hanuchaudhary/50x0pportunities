import React from "react";
import { Input } from "./components/ui/input";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

const App = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
      <ModeToggle/>
    </ThemeProvider>
  );
};

export default App;
