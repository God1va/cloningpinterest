import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/user/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// menentukan route mana saja yang menggunakan middleware ini
export const config = {
  matcher: ["/", "/post", "/post/details/{id}", "/post/create", '/jelajah'],
};