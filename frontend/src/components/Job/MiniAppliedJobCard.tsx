import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AppliedJobCardProps {
  jobId: string;
  companyName: string;
  logo: string;
  position: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  createdAt: Date;
  skills: string[];
  className?: string;
  status: string;
}

export default function AppliedJobCard({
  companyName,
  logo,
  position,
  location,
  type,
  salary,
  experience,
  createdAt,
  skills,
  status,
  className,
  jobId
}: AppliedJobCardProps) {
  return (
    <Link
      to={`/jobs/${jobId}`}
      className={cn(
        "w-full max-w-3xl",
        className
      )}
    >
      <div className="p-3  dark:hover:bg-neutral-900 hover:bg-neutral-100 transition-colors duration-300 rounded-xl">
        <div className="flex gap-4">
          <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-secondary border p-2">
            <img
              src={logo}
              alt={companyName}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">
                {position}{" "}
                <span className="text-muted-foreground">at {companyName}</span>
              </h3>
              <Badge
                className={`font-semibold ${
                  status === "Applied"
                    ? "bg-blue-500 text-white"
                    : status === "Interviewing"
                    ? "bg-yellow-500 text-black"
                    : status === "Hired"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{location}</span>
              <span>•</span>
              <span>{type}</span>
              <span>•</span>
              <span>{salary}</span>
              <span>•</span>
              <span>{experience}</span>
              <span>•</span>
              <span>
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 flex items-center gap-1"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 4 && (
                <Badge variant="secondary" className="rounded-full px-3 py-0.5">
                  +{skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
