import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  const linkId = `${crypto.randomUUID()}`;
  const newLink = await writeClient.create({
    _type: "testLink",
    linkId: linkId,
    isUsed: false,
    createdBy: {
      _type: "reference",
      _ref: id,
    },
  });

  return NextResponse.json(newLink);
}
