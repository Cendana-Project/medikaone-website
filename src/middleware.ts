import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guest auth routes: ONLY accessible when NOT logged in
const guestAuthRoutes = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/verify-pin",
    "/auth/change-password",
    "/auth/reset-password",
];

// Protected routes: REQUIRE authentication
const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/system",
    "/roles",
    "/doctors",
    "/appointments",
    "/chat",
    "/doctor-schedule",
    "/queue",
    "/patients",
    "/users",
    "/revenue",
];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const hasAuth = !!(token || refreshToken);
    const path = req.nextUrl.pathname;

    // 1. Root path "/" redirect
    if (path === "/") {
        if (hasAuth) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    // 2. If user is ALREADY logged in and tries to access guest auth routes -> Redirect to /dashboard
    const isGuestAuth = guestAuthRoutes.some((route) => path.startsWith(route));
    if (isGuestAuth && hasAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 3. If user is NOT logged in and tries to access protected routes -> Redirect to /auth/login
    const isProtected = protectedRoutes.some((route) => path.startsWith(route));
    if (isProtected && !hasAuth) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/profile/:path*",
        "/system/:path*",
        "/roles/:path*",
        "/doctors/:path*",
        "/appointments/:path*",
        "/chat/:path*",
        "/doctor-schedule/:path*",
        "/queue/:path*",
        "/patients/:path*",
        "/users/:path*",
        "/revenue/:path*",
        "/auth/:path*",
    ],
};