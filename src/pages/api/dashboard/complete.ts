import type { APIRoute } from "astro";
import { COMPLETABLE, completeTask, type CompletableKind } from "../../../lib/dashboard";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const kind = String(form.get("kind"));
  const pageId = String(form.get("id") ?? "");

  if (!(kind in COMPLETABLE) || !pageId) {
    return new Response("Bad request", { status: 400 });
  }
  try {
    await completeTask(kind as CompletableKind, pageId);
  } catch (error) {
    console.error("[dashboard] complete failed:", error);
    return new Response("Forbidden", { status: 403 });
  }
  return redirect("/dashboard", 303);
};
