import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import { DASHBOARD_PASSWORD, DASHBOARD_SECRET } from "astro:env/server";

export const SESSION_COOKIE = "dashboard_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sign(value: string): string {
  return createHmac("sha256", DASHBOARD_SECRET ?? "").update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** True once both secrets are configured; the dashboard stays locked otherwise. */
export function authConfigured(): boolean {
  return Boolean(DASHBOARD_PASSWORD && DASHBOARD_SECRET);
}

export function checkPassword(candidate: string): boolean {
  return authConfigured() && safeEqual(sign(candidate), sign(DASHBOARD_PASSWORD!));
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get(SESSION_COOKIE)?.value;
  return authConfigured() && Boolean(token) && safeEqual(token!, sign("dashboard"));
}

export function startSession(cookies: AstroCookies): void {
  cookies.set(SESSION_COOKIE, sign("dashboard"), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
  });
}

export function endSession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: "/" });
}
