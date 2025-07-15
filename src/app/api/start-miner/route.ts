import { NextResponse } from "next/server";

let miningActive = false;

export async function POST() {
  miningActive = true;
  // In a real implementation, start mining process here
  return NextResponse.json({ status: "mining started" });
}
