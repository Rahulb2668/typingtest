import { getServerSession } from "next-auth/next";
import { client } from "@/sanity/lib/client";

import { Link } from "lucide-react";
import { LinkCopyDialog } from "@/components/LinkCopyDialog";
import { GET_TEST_RESULT_QUERY } from "@/sanity/lib/queries";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import TableComponent from "@/components/TableComponent";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const testResults = await client.fetch(GET_TEST_RESULT_QUERY, {
      userId: session.user.id,
    });

    return (
      <div>
        <h1>Welcome, {session.user.name}!</h1>
        <LinkCopyDialog id={session.user.id} />

        <h2>Your Test Results</h2>
        <TableComponent testResults={testResults} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
