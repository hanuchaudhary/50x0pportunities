import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from 'lucide-react'
import { User } from "@/types/types"

const navItems = ["WORK", "RESUME", "COLLECTIONS", "ARTICLES", "POSTS"]

export default function ProfilePageCard(user: User) {
  return (
    <Card className="w-full">
      <div className="flex flex-col items-center py-8">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage
            className="object-cover"
            src={user.avatar}
            alt={user.fullName}
          />
          <AvatarFallback className="text-4xl font-bold uppercase">
            {user.fullName.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        
        <CardHeader className="text-center space-y-2 pb-0">
          <CardTitle className="text-3xl font-bold">
            {user.fullName}
          </CardTitle>
          <p className="text-base max-w-xl">{user.bio}</p>
          <p className="text-lg text-muted-foreground">
            Education {user.education}
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Aligarh, IN</span>
          </div>
        </CardHeader>

        <CardContent className="w-full mt-4">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {user.skills.split(",").map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-lg text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <nav className="border-t pt-6">
            <ul className="flex justify-center gap-8">
              {navItems.map((item, index) => (
                <li
                  key={item}
                  className={`text-sm font-medium ${
                    index === 0 ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </CardContent>
      </div>
    </Card>
  )
}

