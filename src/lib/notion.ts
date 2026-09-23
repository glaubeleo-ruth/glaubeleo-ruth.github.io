import { Client, collectPaginatedAPI, isFullBlock, isFullPage } from "@notionhq/client";
import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client";
import { siteConfig, type Project } from "../config";

// "Projects" data source in Jungwoo's Hub. Override with NOTION_PROJECTS_DATA_SOURCE_ID.
const DEFAULT_PROJECTS_DATA_SOURCE_ID = "4087838e-f4c8-44b1-bc01-6390738c9939";

export type NotionProject = Project & { notionId?: string };
export type NotionBlock = BlockObjectResponse & { children: NotionBlock[] };

type Property = PageObjectResponse["properties"][string];

function client(): Client | null {
  const token = import.meta.env.NOTION_TOKEN;
  return token ? new Client({ auth: token }) : null;
}

function plainText(prop: Property | undefined): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((t) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t) => t.plain_text).join("");
  return "";
}

function toProject(page: PageObjectResponse): NotionProject {
  const p = page.properties;
  const tags = p.Tags?.type === "multi_select" ? p.Tags.multi_select.map((t) => t.name) : [];
  const github = p.GitHub?.type === "url" ? p.GitHub.url : null;

  return {
    name: plainText(p.Name),
    description: plainText(p.Summary),
    highlight: plainText(p.Highlight) || undefined,
    context: plainText(p.Context) || undefined,
    period: plainText(p.Period) || undefined,
    slug: plainText(p.Slug) || undefined,
    link: github ?? undefined,
    skills: tags,
    notionId: page.id,
  };
}

/**
 * Loads public projects from Notion at build time, ordered by the "Order" property.
 * Falls back to `siteConfig.projects` when NOTION_TOKEN is unset or the request fails,
 * so local dev and builds without credentials still work.
 */
export async function getProjects(): Promise<NotionProject[]> {
  const notion = client();
  if (!notion) return siteConfig.projects;

  const dataSourceId =
    import.meta.env.NOTION_PROJECTS_DATA_SOURCE_ID ?? DEFAULT_PROJECTS_DATA_SOURCE_ID;

  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Public", checkbox: { equals: true } },
      sorts: [{ property: "Order", direction: "ascending" }],
    });
    return response.results.filter(isFullPage).map(toProject);
  } catch (error) {
    console.warn("[notion] Falling back to siteConfig.projects:", error);
    return siteConfig.projects;
  }
}

/**
 * Fetches a page's block tree with the given client, recursing into blocks that have
 * children. Requests run one at a time to stay under Notion's ~3 requests/second limit.
 */
export async function fetchBlockTree(notion: Client, blockId: string): Promise<NotionBlock[]> {
  const blocks = (await collectPaginatedAPI(notion.blocks.children.list, { block_id: blockId }))
    .filter(isFullBlock);
  const tree: NotionBlock[] = [];
  for (const block of blocks) {
    tree.push({ ...block, children: block.has_children ? await fetchBlockTree(notion, block.id) : [] });
  }
  return tree;
}

/** Block tree for the build-time (portfolio) token. */
export async function getBlocks(blockId: string): Promise<NotionBlock[]> {
  const notion = client();
  return notion ? fetchBlockTree(notion, blockId) : [];
}
