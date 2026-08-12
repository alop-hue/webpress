import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

export default async function HomePage() {
  await requireUser();
  redirect("/projects");
}