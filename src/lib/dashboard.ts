import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse, QueryDataSourceParameters } from "@notionhq/client";
import { NOTION_DASHBOARD_TOKEN } from "astro:env/server";

// Data sources in Jungwoo's Hub. The dashboard integration must be connected to the Hub page.
export const SOURCES = {
  coursework: "e1153e23-b1cf-4596-941d-7821d98ddf98",
  research: "b851a3ad-ec75-4238-987e-df602656d835",
  papers: "25e6c780-57bf-4af7-86d0-0c57fc941467",
  competitions: "be93addd-5cda-479a-a0d9-6714625f72f8",
  semesterGpa: "eb02d510-5378-4904-bae5-24769d5269f9",
  graduation: "abe2042e-bb9c-4999-8561-3630cb143f85",
  inbox: "980ede7f-4424-4510-b5b5-c3fbc7238e9e",
} as const;

/** Pages the dashboard may mark as done, and the select value that means "done". */
export const COMPLETABLE = {
  coursework: { source: SOURCES.coursework, property: "Status", value: "Done" },
  research: { source: SOURCES.research, property: "Status", value: "Done" },
} as const;
export type CompletableKind = keyof typeof COMPLETABLE;

type Props = PageObjectResponse["properties"];
type Property = Props[string];

export interface Task {
  id: string;
  url: string;
  title: string;
  label?: string; // course or project
  type?: string;
  status?: string;
  due?: string; // YYYY-MM-DD
}
export interface Paper { id: string; url: string; title: string; stage?: string; venue?: string; deadline?: string }
export interface Competition {
  id: string; url: string; title: string; status?: string;
  applyBy?: string; finals?: string; runsFrom?: string; runsTo?: string;
}
export interface SemesterGpa { term: string; gpa: number; credits: number; planned: boolean }
export interface Requirement { area: string; earned: number; required: number }
export interface InboxItem { id: string; url: string; note: string; created: string }

export interface DashboardData {
  today: string;
  coursework: Task[];
  research: Task[];
  papers: Paper[];
  competitions: Competition[];
  gpa: SemesterGpa[];
  graduation: Requirement[];
  inbox: InboxItem[];
}

function notion(): Client {
  if (!NOTION_DASHBOARD_TOKEN) throw new Error("NOTION_DASHBOARD_TOKEN is not set");
  return new Client({ auth: NOTION_DASHBOARD_TOKEN });
}

/** Today's date in Seoul as YYYY-MM-DD, so "due today" matches the user's calendar. */
export function seoulToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

/** Whole days from `from` to `to` (both YYYY-MM-DD); negative when `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

const text = (p?: Property): string =>
  p?.type === "title" ? p.title.map((t) => t.plain_text).join("")
  : p?.type === "rich_text" ? p.rich_text.map((t) => t.plain_text).join("")
  : "";
const select = (p?: Property): string | undefined =>
  p?.type === "select" ? p.select?.name : undefined;
const number = (p?: Property): number | undefined =>
  p?.type === "number" ? (p.number ?? undefined) : undefined;
const dateStart = (p?: Property): string | undefined =>
  p?.type === "date" ? p.date?.start.slice(0, 10) : undefined;
const dateEnd = (p?: Property): string | undefined =>
  p?.type === "date" ? p.date?.end?.slice(0, 10) : undefined;

/** Queries a data source, dropping blank rows (pages whose title is empty). */
async function query(
  client: Client,
  dataSourceId: string,
  params: Omit<QueryDataSourceParameters, "data_source_id"> = {},
): Promise<PageObjectResponse[]> {
  const response = await client.dataSources.query({ data_source_id: dataSourceId, ...params });
  return response.results
    .filter(isFullPage)
    .filter((page) =>
      Object.values(page.properties).some((p) => p.type === "title" && text(p).trim() !== ""),
    );
}

const notDone = (property: string) => ({
  property,
  select: { does_not_equal: "Done" },
});

export async function loadDashboard(): Promise<DashboardData> {
  const client = notion();
  const [coursework, research, papers, competitions, gpa, graduation, inbox] = await Promise.all([
    query(client, SOURCES.coursework, {
      filter: notDone("Status"),
      sorts: [{ property: "Due", direction: "ascending" }],
    }),
    query(client, SOURCES.research, {
      filter: notDone("Status"),
      sorts: [{ property: "Due", direction: "ascending" }],
    }),
    query(client, SOURCES.papers, { sorts: [{ property: "Deadline", direction: "ascending" }] }),
    query(client, SOURCES.competitions, {
      filter: {
        and: [
          { property: "상태", select: { does_not_equal: "수상" } },
          { property: "상태", select: { does_not_equal: "미수상" } },
        ],
      },
      sorts: [{ property: "신청 마감", direction: "ascending" }],
    }),
    query(client, SOURCES.semesterGpa, { sorts: [{ property: "순서", direction: "ascending" }] }),
    query(client, SOURCES.graduation),
    query(client, SOURCES.inbox, {
      filter: { property: "Done", checkbox: { equals: false } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 10,
    }),
  ]);

  return {
    today: seoulToday(),
    coursework: coursework.map(({ id, url, properties: p }) => ({
      id, url,
      title: text(p.Name),
      label: select(p.Course),
      type: select(p.Type),
      status: select(p.Status),
      due: dateStart(p.Due),
    })),
    research: research.map(({ id, url, properties: p }) => ({
      id, url,
      title: text(p.Task),
      label: select(p.Project),
      type: select(p.Type),
      status: select(p.Status),
      due: dateStart(p.Due),
    })),
    papers: papers
      .map(({ id, url, properties: p }) => ({
        id, url,
        title: text(p.Paper),
        stage: select(p.Stage),
        venue: select(p.Venue),
        deadline: dateStart(p.Deadline),
      }))
      .filter((paper) => paper.stage && paper.stage !== "Accepted"),
    competitions: competitions.map(({ id, url, properties: p }) => ({
      id, url,
      title: text(p["대회명"]),
      status: select(p["상태"]),
      applyBy: dateStart(p["신청 마감"]),
      finals: dateStart(p["본선·발표"]),
      runsFrom: dateStart(p["대회 기간"]),
      runsTo: dateEnd(p["대회 기간"]),
    })),
    gpa: gpa
      .map(({ properties: p }) => ({
        term: text(p["학기"]),
        gpa: number(p.GPA) ?? NaN,
        credits: number(p["학점"]) ?? 0,
        planned: select(p["구분"]) === "예정",
      }))
      .filter((row) => !Number.isNaN(row.gpa)),
    graduation: graduation.map(({ properties: p }) => ({
      area: text(p["영역"]),
      earned: number(p["이수학점"]) ?? 0,
      required: number(p["필요학점"]) ?? 0,
    })),
    inbox: inbox.map(({ id, url, properties: p, created_time }) => ({
      id, url, note: text(p.Note), created: created_time,
    })),
  };
}

/**
 * Throws unless the page lives in `dataSourceId`, so a forged request cannot edit
 * arbitrary pages the token can reach.
 */
async function assertParent(client: Client, pageId: string, dataSourceId: string): Promise<void> {
  const page = await client.pages.retrieve({ page_id: pageId });
  const parent = isFullPage(page) ? page.parent : null;
  const normalize = (id: string) => id.replace(/-/g, "");
  if (parent?.type !== "data_source_id" || normalize(parent.data_source_id) !== normalize(dataSourceId)) {
    throw new Error(`Page ${pageId} is not in data source ${dataSourceId}`);
  }
}

/** Marks a coursework or research task as done. */
export async function completeTask(kind: CompletableKind, pageId: string): Promise<void> {
  const client = notion();
  const target = COMPLETABLE[kind];
  await assertParent(client, pageId, target.source);
  await client.pages.update({
    page_id: pageId,
    properties: { [target.property]: { select: { name: target.value } } },
  });
}

export async function addInboxNote(note: string): Promise<void> {
  await notion().pages.create({
    parent: { type: "data_source_id", data_source_id: SOURCES.inbox },
    properties: { Note: { title: [{ text: { content: note } }] } },
  });
}

/** Marks an inbox note as handled. */
export async function archiveInboxNote(pageId: string): Promise<void> {
  const client = notion();
  await assertParent(client, pageId, SOURCES.inbox);
  await client.pages.update({ page_id: pageId, properties: { Done: { checkbox: true } } });
}
