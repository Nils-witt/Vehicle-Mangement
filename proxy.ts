export { auth as proxy } from "@/auth";

export const config = {
  // Run on every route except static assets, image optimization, and the
  // Auth.js API routes themselves.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
