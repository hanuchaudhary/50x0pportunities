import Landing from "./pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import FullViewJob from "./pages/FullViewJob";
import  Profile  from "./pages/Profile";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <div>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<FullViewJob />} />
            </Routes>
            <Toaster/>
          </BrowserRouter>
        </ThemeProvider>
    </div>
  );
};

export default App;
