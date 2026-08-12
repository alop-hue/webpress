/**
 * New project wizard page.
 */
import { Suspense } from "react";
import NewProjectPage from "@/components/new-project";

export const metadata = { title: "New site" };

export default function Page() {
  return (
    <Suspense>
      <NewProjectPage />
    </Suspense>
  );
}