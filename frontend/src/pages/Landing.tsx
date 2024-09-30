import Footer from "@/components/Footer";
import LandingFooterOne from "@/components/LandingFooterOne";
import Navbar from "@/components/Navbar";
import SigninPage from "@/components/Signin";
import SignupPage from "@/components/Signup";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Landing = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSigninVisible, setIsSigninVisible] = useState(false);

  function toggleAuthComponent() {
    setIsSignupVisible((prev) => !prev);
    setIsSigninVisible((prev) => !prev);
  }
  function handleClose() {
    setIsSignupVisible(false);
    setIsSigninVisible(false);
  }

  return (
    <div>
      <AnimatePresence>
        {isSignupVisible && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="fixed bg-black w-full  bg-opacity-50  z-50"
          >
            <div>
              <SignupPage
                handleClose={handleClose}
                onClick={toggleAuthComponent}
              />
            </div>
          </motion.div>
        )}

        {isSigninVisible && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="fixed w-full bg-black bg-opacity-50 z-50"
          >
            <div>
              <SigninPage
                handleClose={handleClose}
                onClick={toggleAuthComponent}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-neutral-100 bg-gradient-to-t dark:bg-black transition-colors duration-500">
        <Navbar />
        <div className="page pt-32 md:pt-40 px-4 md:px-20">
          <div className="flex items-center justify-center gap-5 flex-col py-10">
            <h1 className="text-5xl font-bold text-center">
              Connect to Your Dream Career
            </h1>
            <p className="text-center">
              Find the perfect job or the ideal candidate. JobConnect brings
              together top talent and leading companies.
            </p>
          </div>
          <div className="flex py-10 items-center justify-center gap-10">
            <div onClick={() => setIsSignupVisible(true)}>
              <Button size={"xl"}>Get Started Your Carrier</Button>
            </div>
          </div>
          <LandingFooterOne />
        </div>
        <div className="pt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Landing;
