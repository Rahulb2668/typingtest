import { getServerSession } from "next-auth/next";
import { client } from "@/sanity/lib/client";
import { GET_TEST_RESULT_QUERY } from "@/sanity/lib/queries";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TableComponent from "@/components/TableComponent";
import { LinkCopyDialog } from "@/components/LinkCopyDialog";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  let testResults;
  let isLoading = true;

  try {
    testResults = await client.fetch(GET_TEST_RESULT_QUERY, {
      userId: session.user.id,
    });
    isLoading = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="text-red-500 text-center mt-4">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className=" rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome, {session.user.name}! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <LinkCopyDialog id={session.user.id} />
          <h2 className="text-xl font-semibold mt-4">Your Test Results</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          ) : testResults.length > 0 ? (
            <TableComponent testResults={testResults} />
          ) : (
            <div className="text-gray-500">
              No results yet. Take a test to see your progress!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
