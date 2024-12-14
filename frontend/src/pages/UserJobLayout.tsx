import BackButton from "@/components/BackButton";
import { Separator } from "@/components/ui/separator";
import { useJobCountDataStore } from "@/store/useJobCountDataState";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserJobLayout() {
  const { appliedJobCount, createdJobCount, fetchJobCount, savedJobCount } =
    useJobCountDataStore();
  useEffect(() => {
    fetchJobCount();
  }, [fetchJobCount]);
  console.log(appliedJobCount, createdJobCount, savedJobCount);

  return (
    <div className="container mx-auto px-4 pb-12 max-w-4xl">
      <BackButton href="/jobs" title="Jobs" />
      <h1 className="text-3xl font-[instrumental-regular] tracking-tighter text-center">
        Your Jobs
      </h1>
      <div className="navigation flex items-center gap-4 justify-center my-4">
        <NavLink
          replace
          to="recommended"
          className={({ isActive }) =>
            `font-semibold text-sm  ${
              isActive
                ? "text-green-500 underline"
                : "text-neutral-700 dark:text-neutral-400 hover:text-green-500"
            }`
          }
        >
          Reccommended
        </NavLink>
        <NavLink
          replace
          to="saved"
          className={({ isActive }) =>
            `font-semibold text-sm  ${
              isActive
                ? "text-green-500 underline"
                : "text-neutral-700 dark:text-neutral-400 hover:text-green-500"
            }`
          }
        >
          Saved • {savedJobCount}
        </NavLink>
        <NavLink
          replace
          to="applied"
          className={({ isActive }) =>
            `font-semibold text-sm  ${
              isActive
                ? "text-green-500 underline"
                : "text-neutral-700 dark:text-neutral-400 hover:text-green-500"
            }`
          }
        >
          Applied • {appliedJobCount}
        </NavLink>
      </div>
      <Separator />
      <div className="py-4 flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
