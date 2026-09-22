import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";
import { siteConfig, type Project } from "../config";

// "Projects" data source in Jungwoo's Hub. Override with NOTION_PROJECTS_DATA_SOURCE_ID.
const DEFAULT_PROJECTS_DATA_SOURCE_ID = "4087838e-f4c8-44b1-bc01-6390738c9939";

type Property = PageObjectResponse["properties"][string];

function plainText(prop: Property | undefined): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((t) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t) => t.plain_text).join("");
  return "";
}

function toProject(page: PageObjectResponse): Project {
  const p = page.properties;
  const tags = p.Tags?.type === "multi_select" ? p.Tags.multi_select.map((t) => t.name) : [];
  const github = p.GitHub?.type === "url" ? p.GitHub.url : null;

  return {
    name: plainText(p.Name),
    description: plainText(p.Summary),
    highlight: plainText(p.Highlight) || undefined,
    link: github ?? undefined,
    skills: tags,
  };
}

/**
 * Loads public projects from Notion at build time, ordered by the "Order" property.
 * Falls back to `siteConfig.projects` when NOTION_TOKEN is unset or the request fails,
 * so local dev and builds without credentials still work.
 */
export async function getProjects(): Promise<Project[]> {
  const token = import.meta.env.NOTION_TOKEN;
  if (!token) return siteConfig.projects;

  const dataSourceId =
    import.meta.env.NOTION_PROJECTS_DATA_SOURCE_ID ?? DEFAULT_PROJECTS_DATA_SOURCE_ID;

  try {
    const notion = new Client({ auth: token });
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
