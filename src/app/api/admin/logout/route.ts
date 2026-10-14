import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(sessionCookieName(), "", { path: "/", maxAge: 0 });
  return response;
}
