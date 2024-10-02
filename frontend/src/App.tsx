import Landing from "./pages/Landing";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import FullViewJob from "./pages/FullViewJob";
import Profile from "./pages/Profile";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const getUserRole = () => {
  const role = localStorage.getItem("role");
  return role;
};

const PrivateRoute = ({ children, restrictedRole, redirectPath }: any) => {
  const role = getUserRole();

  if (role === restrictedRole) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathsToRedirect = ["/", "/signup", "/signin"];
    const token = localStorage.getItem("token");
    if (token && pathsToRedirect.includes(location.pathname)) {
      navigate("/jobs");
    }
  }, [navigate]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
        <Route
          path="/signin"
          element={
            <PageTransition>
              <SigninPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute restrictedRole="Candidate" redirectPath="/jobs">
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route
          path="/jobs"
          element={
            <PageTransition>
              <Jobs />
            </PageTransition>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <PageTransition>
              <FullViewJob />
            </PageTransition>
          }
        />
      </Routes>
      <Toaster />
    </AnimatePresence>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

const WrappedApp = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default WrappedApp;
