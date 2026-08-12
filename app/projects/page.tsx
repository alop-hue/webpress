/**
 * Projects dashboard page — server component that loads the signed-in user's projects.
 */
import ProjectsPage from "@/components/projects-page";

export const metadata = { title: "Projects" };

export default function Page() {
  return <ProjectsPage />;
}