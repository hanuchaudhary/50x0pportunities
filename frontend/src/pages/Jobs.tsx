import { useEffect, useState } from "react";
import { State } from "country-state-city";

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
import { useFetchCompanies } from "@/hooks/FetchCompanies";
import { BarLoader } from "react-spinners";
import { useJobsStore } from "@/store/jobsState";

export default function Jobs() {
  const { jobs, fetchJobs, loading } = useJobsStore();
  const [filter, setFilter] = useState("");
  console.log(jobs);

  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs(filter);
    }
  }, [fetchJobs, jobs]);

  const { companies } = useFetchCompanies();
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

  console.log(jobs);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-3 md:pt-32 pt-24 pb-4 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 sm:text-4xl">
          Latest Jobs
        </h1>
        <section className="space-y-3 mb-12">
          <Input
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full dark:bg-neutral-900 dark:bg-opacity-50"
            placeholder="Search by title or location"
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="dark:bg-neutral-900 dark:bg-opacity-50">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-900 dark:bg-opacity-85 backdrop-blur-lg">
                {State.getStatesOfCountry("IN").map((item: any) => (
                  <SelectItem key={item.isoCode} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCompany} onValueChange={handleCompanyChange}>
              <SelectTrigger className="dark:bg-neutral-900 dark:bg-opacity-50">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-900 dark:bg-opacity-85 backdrop-blur-lg">
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
              variant="destructive"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </section>
        <div>
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <BarLoader color="white" width={"100%"} />
            </div>
          ) : (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map(({ id, description, location, title, company }) => (
                  <JobCard
                    key={id}
                    id={id}
                    companyLogo={company.logo}
                    companyName={company.name}
                    description={description}
                    location={location}
                    title={title}
                  />
                ))
              ) : (
                <div>
                  <h1 className="bg-red-300 text-red-950 font-semibold rounded-md  px-2 select-none">
                    !No Job Available
                  </h1>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
