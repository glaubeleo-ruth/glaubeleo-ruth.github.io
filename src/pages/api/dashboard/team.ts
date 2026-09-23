import type { APIRoute } from "astro";
import { createTeamTask, setCompetitionStatus } from "../../../lib/dashboard";

export const prerender = false;

const MAX_TITLE_LENGTH = 200;
const clean = (value: FormDataEntryValue | null, max = MAX_TITLE_LENGTH) =>
  String(value ?? "").trim().slice(0, max) || undefined;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const back = clean(form.get("back"), 300) ?? "/dashboard";
  // Only same-site paths, so a crafted form can't bounce the user elsewhere.
  const target = back.startsWith("/") && !back.startsWith("//") ? back : "/dashboard";

  try {
    const status = clean(form.get("status"), 20);
    if (status) {
      const competitionId = clean(form.get("competition"), 64);
      if (!competitionId) return new Response("Bad request", { status: 400 });
      await setCompetitionStatus(competitionId, status);
    } else {
      const title = clean(form.get("title"));
      if (!title) return new Response("Bad request", { status: 400 });
      await createTeamTask({
        title,
        owner: clean(form.get("owner"), 50),
        due: clean(form.get("due"), 10),
        project: clean(form.get("project"), 50),
        competitionId: clean(form.get("competition"), 64),
      });
    }
  } catch (error) {
    console.error("[dashboard] team action failed:", error);
    return new Response("Forbidden", { status: 403 });
  }

  return redirect(target, 303);
};
