import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "This endpoint is disabled.",
    },
    { status: 404 }
  );
}