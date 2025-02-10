import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login"); // Redirect if not logged in
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
      <p>Your email: {session.user?.email}</p>
    </div>
  );
}
