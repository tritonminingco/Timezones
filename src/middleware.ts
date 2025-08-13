/**
 * NextAuth Middleware
 * 
 * Protects routes that require authentication
 */

import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    console.log("Protected route accessed:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has a valid token
        if (token) return true;

        // Allow access to public routes
        const publicRoutes = ['/auth/signin', '/auth/error'];
        if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return true;
        }

        return false;
      },
    },
  }
);

// Configure which routes require authentication
export const config = {
  matcher: [
    // Protect all routes except public ones
    '/((?!api/auth|auth/signin|auth/error|_next/static|_next/image|favicon.ico).*)',
  ],
};
