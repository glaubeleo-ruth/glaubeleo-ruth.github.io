import { defineMiddleware } from "astro:middleware";
import { isAuthenticated } from "./lib/auth";

const PUBLIC_DASHBOARD_PATHS = new Set(["/dashboard/login", "/dashboard/login/"]);

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");

  // Prerendered pages run middleware at build time with no request cookies; skip them.
  if (!isDashboard || context.isPrerendered || PUBLIC_DASHBOARD_PATHS.has(pathname)) {
    return next();
  }

  if (!isAuthenticated(context.cookies)) {
    return pathname.startsWith("/api/")
      ? new Response("Unauthorized", { status: 401 })
      : context.redirect("/dashboard/login");
  }

  return next();
});
