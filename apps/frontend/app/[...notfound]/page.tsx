import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to the dashboard
  redirect("/dashboard");
}