import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/auth/register"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.some(route => path.startsWith(route));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*","/auth/register/:path*"],
};