export { default } from "next-auth/middleware";

// Only protect dashboard routes - public content should be accessible without auth
export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ] 
};