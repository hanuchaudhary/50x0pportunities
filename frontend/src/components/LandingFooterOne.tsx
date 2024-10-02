import { Briefcase, Building2, Search, Users } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const LandingFooterOne = () => {
  return (
    <div>
      <section className="w-full py-12 md:py-24 rounded-xl transition-colors duration-500 lg:py-32 bg-neutral-2cd f00 dark:bg-neutral-900 dark:bg-opacity-75 border dark:border-neutral-800 border-neutral-300">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <motion.div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                For Job Seekers
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 md:text-xl">
                Discover opportunities that align with your career goals. Our
                platform offers:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  Advanced job search filters
                </li>
                <li className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Direct communication with employers
                </li>
                <li className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-primary" />
                  Career development resources
                </li>
              </ul>
              <Link to={"/signup"}>
                <Button size="lg">Find Jobs</Button>
              </Link>
            </motion.div>
            <motion.div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                For Employers
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 md:text-xl">
                Find the perfect candidates to grow your team. Our platform
                provides:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  Targeted job postings
                </li>
                <li className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Applicant tracking system
                </li>
                <li className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Employer branding tools
                </li>
              </ul>
              <Link to={"/signup"}>
                <Button size="lg">Post a Job</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingFooterOne;
