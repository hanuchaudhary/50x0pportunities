import { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { WEB_URL } from "@/Config";
import useProfileStore, { getAuthHeaders } from "@/store/profileState";

interface ApplyForJobProps {
  companyName?: string;
  jobTitle?: string;
}

const ApplyForJob: React.FC<ApplyForJobProps> = ({ companyName, jobTitle }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [incompleteProfileDialogOpen, setIncompleteProfileDialogOpen] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();
  const { Authorization } = getAuthHeaders();
  const { profile } = useProfileStore();

  const [data] = useState({
    education: profile?.education,
    experience: profile?.experience,
    skills: profile?.skills,
    resume: profile?.resume,
  });

  const isProfileComplete =
    data.education && data.experience && data.skills && data.resume;
  const handleApplyClick = () => {
    if (isProfileComplete) {
      setConfirmationDialogOpen(true);
    } else {
      setIncompleteProfileDialogOpen(true);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/application/${id}`,
        {
          education: profile?.education,
          experience: profile?.experience,
          skills: profile?.skills,
          resume: profile?.resume,
        },
        {
          headers: { Authorization },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        toast({
          title: "Application Submitted",
          description: `Your application for ${jobTitle} at ${companyName} has been successfully submitted.`,
          variant: "success",
        });
        setConfirmationDialogOpen(false);
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An unexpected error occurred. Please try again later.";

      toast({
        title: "Application Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog
        open={incompleteProfileDialogOpen}
        onOpenChange={setIncompleteProfileDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Caution: Incomplete Profile
            </DialogTitle>
            <DialogDescription className="text-base">
              Your profile is incomplete, which may significantly reduce your
              chances of being considered for this position. It is strongly
              recommended that you complete your profile before applying.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Missing information may include your resume, education,
              experience, or skills. A complete profile helps employers
              understand your qualifications better.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              size={"sm"}
              variant="outline"
              onClick={() => setIncompleteProfileDialogOpen(false)}
            >
              Cancel Application
            </Button>
            <Link to="/profile">
              <Button size={"sm"}>Go to Profile </Button>
            </Link>
            <Link to="/edit">
              <Button size={"sm"}>Update Profile</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Application
            </DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to apply for the position of {jobTitle} at{" "}
              {companyName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              By confirming, your application will be submitted with the
              information from your profile. Make sure all details are up to
              date before proceeding.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setConfirmationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={loading}>
              {loading ? "Submitting..." : "Confirm and Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleApplyClick}
            disabled={loading || success}
            className="w-full max-w-xs"
          >
            {loading
              ? "Submitting Application..."
              : success
              ? "Application Submitted"
              : "Apply Now"}
          </Button>
          <Link to="/profile">
            <Button variant="outline" asChild className="w-full max-w-xs">
              Go to Profile
            </Button>
          </Link>
        </div>
      </div>

      {success && (
        <p className="text-center text-green-600">
          Your application has been successfully submitted. We'll be in touch
          soon!
        </p>
      )}
    </div>
  );
};

export default ApplyForJob;
