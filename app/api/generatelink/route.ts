import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  const linkId = `test-${Date.now()}`;
  const newLink = await writeClient.create({
    _type: "testLink",
    linkId: linkId,
    createdBy: {
      _type: "reference",
      _ref: id,
    },
  });

  return NextResponse.json(newLink);
}
