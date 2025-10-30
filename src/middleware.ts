import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // This function only runs for protected routes
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Only protect specific admin/dashboard routes - public content should be accessible without auth
export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*"
  ] 
};