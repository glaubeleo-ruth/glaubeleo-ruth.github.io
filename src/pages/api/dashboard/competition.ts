import type { APIRoute } from "astro";
import { createCompetition } from "../../../lib/dashboard";

export const prerender = false;

const clean = (value: FormDataEntryValue | null, max: number) =>
  String(value ?? "").trim().slice(0, max) || undefined;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const title = clean(form.get("title"), 200);
  if (!title) return new Response("Bad request", { status: 400 });

  try {
    const id = await createCompetition({
      title,
      host: clean(form.get("host"), 100),
      applyBy: clean(form.get("applyBy"), 10),
      status: clean(form.get("status"), 20),
      announcement: clean(form.get("announcement"), 500),
    });
    return redirect(`/dashboard/competitions/${id.replace(/-/g, "")}`, 303);
  } catch (error) {
    console.error("[dashboard] create competition failed:", error);
    return new Response("Forbidden", { status: 403 });
  }
};
