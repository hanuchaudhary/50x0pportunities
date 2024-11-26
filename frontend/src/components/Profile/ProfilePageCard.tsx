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
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { User } from "@/types/types";
import DeactivateAccout from "./DeactivateAccout";

export default function ProfilePageCard(user: User) {
  return (
    <Card className="w-full dark:bg-neutral-900 bg-blue-50 bg-opacity-75">
      <CardHeader className="flex flex-col items-center space-y-4 text-center">
        <Avatar className="w-32 h-32">
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback className="text-4xl font-bold uppercase">
            {user.fullName.length > 0
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "UN"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl capitalize">{user.fullName}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user.role}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills added</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6 md:border-l md:pl-6">
            <div>
              <h3 className="font-semibold mb-2">Education</h3>
              {user.education.length > 0 ? (
                <p>{user.education}</p>
              ) : (
                <p className="text-muted-foreground">
                  No education information added
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              {user.experience.length > 0 ? (
                <p>{user.experience}</p>
              ) : (
                <p className="text-muted-foreground">
                  No experience information added
                </p>
              )}
            </div>
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
