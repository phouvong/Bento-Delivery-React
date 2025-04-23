import { NextResponse } from "next/server";

// Define the protected routes
const protectedRoutes = ["/rental/cart"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (protectedRoutes.includes(pathname)) {
    const cartListValue = request.cookies.get("cart-list");

    if (!cartListValue || cartListValue == "0") {
      const url = new URL("/home", request.url);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-middleware-check", "working");
  return response;
}

export const config = {
  matcher: ["/rental/cart"], // Explicitly match protected routes
};
