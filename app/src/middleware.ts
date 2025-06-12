import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export function middleware(request: NextRequest) {
  // Only log API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const start = Date.now();

    // Log the incoming request
    logger.info(`🚀 Incoming API Request`, {
      method: request.method,
      url: request.url,
      pathname: request.nextUrl.pathname,
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    });

    // Continue with the request
    const response = NextResponse.next();

    // Add a custom header to track response time
    response.headers.set("x-response-time", `${Date.now() - start}ms`);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
