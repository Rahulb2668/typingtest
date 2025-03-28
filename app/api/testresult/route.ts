import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const result = await request.json();

    if (!result) {
      return NextResponse.json(
        { error: "Something Went Wrong" },
        { status: 400 }
      );
    }

    const res = await writeClient.create({
      _type: "testResult",
      ...result,
    });

    console.log(res);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating test:", error);
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}
