import Landing from "./pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProviser";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div className="bg-neutral-800 h-screen">
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};

export default App;
