import Footer from "@/components/Footer";
import LandingFooterOne from "@/components/LandingFooterOne";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
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
            <Link to={"/signup"}>
              <Button size={"xl"}>Get Started Your Carrier</Button>
            </Link>
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
