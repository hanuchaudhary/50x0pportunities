import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButton {
  href: string;
  title: string;
  replace?: boolean;
}

export default function BackButton({ href, title, replace }: BackButton) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Link replace={replace} to={href}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
          {title}
        </Button>
      </Link>
    </motion.div>
  );
}
