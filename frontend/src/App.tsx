import Landing from "./pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import FullViewJob from "./pages/FullViewJob";
import { ToastProvider } from "./components/ui/toast";
import { Profile } from "./pages/Profile";
// import Profile from "./pages/Profile"; // Uncomment if you have a Profile page

const App = () => {
  return (
    <div>
      <ToastProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<FullViewJob />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
