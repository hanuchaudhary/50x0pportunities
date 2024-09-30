import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/FetchJobs";
import JobListingSkeleton from "@/components/JobListingSkeleton";
import { useFetchCompanies } from "@/hooks/FetchCompanies";

export default function Jobs() {
  const { loading, data, setFilter } = useFetchData();
  const { companies } = useFetchCompanies();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-32 md:pt-40 px-4 md:px-6">
        <h1 className="text-center text-4xl font-semibold mb-10">
          Latest Jobs
        </h1>
        <div className="space-y-4">
          <Input
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
            placeholder="Search by title or location"
          />
          <div className="grid grid-cols-3 gap-1">
            <div className="w-full">
              <Select onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {State.getStatesOfCountry("IN").map((item: any) => (
                    <SelectItem key={item.isoCode} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Button
                className="w-full"
                onClick={() => setFilter("")}
                variant={"destructive"}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <JobListingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {data.map(({ id, description, location, title, companyId }) => (
              <JobCard
                companyId={companyId}
                id={id}
                key={id}
                description={description}
                location={location}
                title={title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
