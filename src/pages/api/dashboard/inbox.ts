import type { APIRoute } from "astro";
import { addInboxNote, archiveInboxNote } from "../../../lib/dashboard";

export const prerender = false;

// Notion caps a rich-text item at 2000 characters.
const MAX_NOTE_LENGTH = 2000;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const archiveId = form.get("archive");

  if (archiveId) {
    try {
      await archiveInboxNote(String(archiveId));
    } catch (error) {
      console.error("[dashboard] archive failed:", error);
      return new Response("Forbidden", { status: 403 });
    }
  } else {
    const note = String(form.get("note") ?? "").trim().slice(0, MAX_NOTE_LENGTH);
    if (note) await addInboxNote(note);
  }
  return redirect("/dashboard#inbox", 303);
};
