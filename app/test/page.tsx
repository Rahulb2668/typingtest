// app/test/page.tsx
import { client } from "@/sanity/lib/client";
import { GET_TEST_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import TestInterface from "@/components/TestInterface";

interface SearchParams {
  linkId?: string;
}

interface PageProps {
  params: {};
  searchParams: SearchParams;
}

interface Test {
  _id: string;
  linkId: string;
  isUsed: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { linkId } = await searchParams;

  if (!linkId) {
    notFound();
  }

  try {
    const test: Test = await client.fetch<Test>(GET_TEST_BY_ID_QUERY, {
      linkId,
    });

    if (!test) {
      notFound();
    }

    if (test.isUsed) {
      return (
        <div className="text-center text-red-500 mt-10 text-xl">
          This test link has already been used.
        </div>
      );
    }

    return <TestInterface test={test} />;
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="text-center text-red-500 mt-10 text-xl">
        Something went wrong. Please try again later.
      </div>
    );
  }
};

export default Page;
