import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ReactElement } from "react";

interface LoadingButton {
  isLoading: boolean;
  loadingTitle: string;
  title: string;
  type: "button" | "submit" | "reset";
  icon?: ReactElement;
}

export default function LoadingButton({
  isLoading,
  loadingTitle,
  title,
  type,
  icon,
}: LoadingButton) {
  return (
    <Button type={type} size={"rounded"} disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-1">
          <Loader2 className="animate-spin h-4 w-4" />
          <span>{loadingTitle}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span>{title}</span>
          {icon}
        </div>
      )}
    </Button>
  );
}
