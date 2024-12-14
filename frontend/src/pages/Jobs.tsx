import { useEffect, useState } from "react";
import { State } from "country-state-city";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "@/components/JobCard";
import { BarLoader } from "react-spinners";
import { useJobsStore } from "@/store/jobsState";
import useProfileStore from "@/store/profileState";
import { Search, MapPin, Building, X } from "lucide-react";
import { useCompaniesStore } from "@/store/companiesState";

export default function Jobs() {
  const { fetchProfile } = useProfileStore();
  const { jobs, fetchJobs, loading } = useJobsStore();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchJobs(filter);
    fetchProfile();
  }, [filter, fetchJobs, fetchProfile]);

  const { companies } = useCompaniesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilter(value);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setFilter(value);
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setFilter(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCompany("");
    setFilter("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <main className="container mx-auto px-4 pb-12">
        <motion.h1
          className="text-4xl leading-none tracking-tighter text-center mb-12 sm:text-5xl font-[instrumental-regular]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your Next <span className="text-green-500">Opportunity.</span>
        </motion.h1>
        <motion.section
          className="space-y-2 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 shadow-none rounded-xl dark:bg-neutral-800 dark:bg-opacity-50 focus:ring-2 focus:ring-primary transition-all duration-300"
              placeholder="Search 50xOpportunities"
            />
            <Search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="rounded-xl shadow-none dark:bg-neutral-800 dark:bg-opacity-50 focus:ring-2 focus:ring-primary transition-all duration-300">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-800 dark:bg-opacity-85 backdrop-blur-lg rounded-lg">
                {State.getStatesOfCountry("IN").map((item: any) => (
                  <SelectItem key={item.isoCode} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCompany} onValueChange={handleCompanyChange}>
              <SelectTrigger className="rounded-xl shadow-none dark:bg-neutral-800 dark:bg-opacity-50 focus:ring-2 focus:ring-primary transition-all duration-300">
                <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-800 dark:bg-opacity-85 backdrop-blur-lg rounded-lg">
                {companies.length > 0 ? (
                  companies.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Nothing">Companies Not Found</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="rounded-xl shadow-none  hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </motion.section>
        <div className="py-10">
          {loading && (
            <div className="flex justify-center items-center w-full">
              <BarLoader color="hsl(var(--primary))" width={150} />
            </div>
          )}
        </div>
        <div className="max-w-6xl mx-auto">
          <motion.section
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <JobCard {...job} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4">
                  No Jobs Available
                </h2>
                <p className="text-muted-foreground">
                  We couldn't find any jobs matching your criteria. Try
                  adjusting your filters or check back later.
                </p>
              </motion.div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}
