import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect to the dashboard if authenticated
    redirect("/dashboard");
  } else {
    // Redirect to login if not authenticated
    redirect("/auth/signin");
  }
}
