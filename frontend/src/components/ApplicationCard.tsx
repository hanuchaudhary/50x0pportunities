import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicationCardProps {
  application: {
    id: string
    title: string
    education: string
    experience: string
    skills: string
    status: string
    createdAt: string
  }
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-500'
      case 'under review':
        return 'bg-yellow-500'
      case 'accepted':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{application.title}</CardTitle>
        <Badge className={`${getStatusColor(application.status)} text-white`}>
          {application.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-1 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Education:</dt>
            <dd>{application.education}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Experience:</dt>
            <dd>{application.experience}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium text-muted-foreground">Skills:</dt>
            <dd>{application.skills}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Applied on: {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  )
}