import { NextResponse } from "next/server";

// Define the protected routes
const protectedRoutes = ["/rental/cart"];

// Routes where module parameter should NOT be added automatically
const excludeModuleRoutes = [
  "/",
  "/404",
  "/500",
  "/app-redirect",
  "/maintainance",
  "/checkout",
  "/profile",
  "/about-us",
  "/cancellation-policy",
  "/privacy-policy",
  "/refund-policy",
  "/shipping-policy",
  "/terms-and-conditions",
  "/help-and-support",
  "/forgot-password",
  "/deliveryman-registration",
  "/store-registration",
];

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Get module parameter from cookie (set on client)
  const moduleFromCookie = request.cookies.get("selectedModule")?.value;

  // Check if request already has module/module_id param
  const hasModuleParam =
    searchParams.has("module") || searchParams.has("module_id");

  // Check if this route should skip module parameter
  const shouldSkipModule = excludeModuleRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If no module param in URL but we have one saved, and route is not excluded, add it
  if (!hasModuleParam && moduleFromCookie && !shouldSkipModule) {
    searchParams.set("module", moduleFromCookie);
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  // Remove legacy module_id if module exists (keep only module)
  if (searchParams.has("module") && searchParams.has("module_id")) {
    searchParams.delete("module_id");
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  // Convert old module_id to module
  if (searchParams.has("module_id") && !searchParams.has("module")) {
    const moduleId = searchParams.get("module_id");
    searchParams.delete("module_id");
    searchParams.set("module", moduleId);
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  if (protectedRoutes.includes(pathname)) {
    const cartListCookie = request.cookies.get("cart-list");
    const cartListValue = cartListCookie?.value;

    // Only redirect when the cookie explicitly says the cart is empty. On
    // the very first visit the cookie isn't set yet (the client writes it
    // after the cart fetch resolves) — bouncing to /home in that case was
    // the cause of the "redirected the first time, ok the second time" bug.
    if (cartListValue === "0") {
      const url = new URL("/home", request.url);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-middleware-check", "working");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.sw\\.js|firebase-messaging-sw\\.js|workbox-.*\\.js|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|eot|mp4|webm|mp3|wav|pdf|zip)).*)",
  ],
};
