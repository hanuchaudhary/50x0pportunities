import Landing from "./pages/Landing";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import FullViewJob from "./pages/FullViewJob";
// import Profile from "./pages/Profile";

const App = () => {
  return (
    <div >
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<FullViewJob />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};

export default App;
