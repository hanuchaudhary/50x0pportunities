import MiniJobCard from "./MiniJobCard";

export default function RecommendedJobs() {
  return (
    <div>
      <MiniJobCard
        jobId=""
        companyName="Lenskart"
        logo="/lenskart-logo.png"
        position="Software Engineer, Nexs Backend"
        location="In-Office (Hyderabad, India +2)"
        type="Full-time"
        experience="3+ years"
        createdAt="4h ago"
        skills={[
          "Java",
          "Spring Boot",
          "Microservices",
          "Data Structures",
          "AWS",
          "Docker",
          "Kubernetes",
          "MySQL",
        ]}
      />
    </div>
  );
}
