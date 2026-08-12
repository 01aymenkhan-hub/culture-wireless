import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk needs to run for page requests and API requests so server-side auth()
// can read the request session. Individual protected resources still perform
// their own authorization checks.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
