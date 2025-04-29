import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    message: "LINE Login API 預留接口完成",
    status: "success",
  });
}
