import { Skeleton } from "@/components/ui/skeleton"

export default function SingleJobSkeleton() {
  return (
    <div className="mt-32 md:mt-40 mx-0 md:px-20">
      <div className="title flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-16 w-16 rounded" />
      </div>
      <div className="flex items-center w-full justify-between pt-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="desc py-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="w-full mt-5">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}