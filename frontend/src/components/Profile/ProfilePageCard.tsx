import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ProfileData } from "@/store/profileState";
import DeactivateAccout from "./DeactivateAccout";

export default function ProfilePageCard({
  avatar,
  bio,
  email,
  fullName,
  role,
  skills,
}: ProfileData) {

  console.log("ProfileData: ", avatar, bio, email, fullName, role, skills);
  
  return (
    <Card className="w-full max-w-3xl mx-auto mt-24 md:mt-32 dark:bg-neutral-900 bg-blue-50 bg-opacity-75">
      <CardHeader className="flex flex-col items-center space-y-4 text-center">
        <Avatar className="w-32 h-32">
          <AvatarImage src={avatar} alt={fullName} />
          <AvatarFallback className="text-4xl font-bold uppercase">
            {fullName.length > 0
              ? fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "UN"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl capitalize">{fullName}</CardTitle>
          <p className="text-muted-foreground">{email}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {role}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Bio</h3>
          <p className="text-muted-foreground">{bio}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.split(",").map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No skills added</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/edit">Edit Profile</Link>
        </Button>
        <DeactivateAccout />
      </CardFooter>
    </Card>
  );
}
