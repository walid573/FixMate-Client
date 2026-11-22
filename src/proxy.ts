
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

type Role = "customer" | "technician" | "admin";

const DASHBOARDS: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

// Route prefix -> role allowed to access it
const ROLE_ROUTES: Record<string, Role> = {
  "/dashboard/customer": "customer",
  "/payment/success": "customer",
  "/payment/cancel": "customer",
  "/dashboard/technician": "technician",
  "/dashboard/admin": "admin",
};

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  const isAuthPage =
    pathname === "/sign-in" || pathname === "/sign-up";


  const session = await auth.api.getSession({
    headers: request.headers,
  });


  if (!session) {
    return isAuthPage
      ? NextResponse.next()
      : redirect("/sign-in");
  }

 
  const roleValue = (
    session.user as { role?: string }
  ).role?.toLowerCase();

  const role =
    roleValue && Object.hasOwn(DASHBOARDS, roleValue)
      ? (roleValue as Role)
      : undefined;

  const home = role ? DASHBOARDS[role] : undefined;

  // Reject missing or invalid roles
  if (!home) {
    return redirect("/forbidden");
  }

  // Redirect authenticated users away from auth pages. If they arrived with a
  // callbackUrl (e.g. from "Log In to Request Repair" on a service page),
  // honour it instead of sending them to the role dashboard.
  if (isAuthPage || pathname === "/dashboard") {
    const callback = request.nextUrl.searchParams.get("callbackUrl");
    if (
      isAuthPage &&
      callback &&
      callback.startsWith("/") &&
      !callback.startsWith("//")
    ) {
      const callbackRole = Object.entries(ROLE_ROUTES).find(([route]) =>
        matches(callback, route)
      )?.[1];
      if (!callbackRole || callbackRole === role) {
        return redirect(callback);
      }
    }
    return redirect(home);
  }

  // Find the required role for the requested route
  const requiredRole = Object.entries(ROLE_ROUTES).find(
    ([route]) => matches(pathname, route)
  )?.[1];

  // Redirect users who don't have the required role
  if (requiredRole && requiredRole !== role) {
    return redirect(home);
  }

  // Allow access to authorized routes
  // Includes /dashboard/profile for all authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/payment/success",
    "/payment/cancel",
    "/sign-in",
    "/sign-up",
  ],
};