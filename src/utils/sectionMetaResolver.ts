import { fetchPageMetadata, processMetadata } from "utils/fetchPageMetaData";
import {
  getSectionDefaultLabel,
  SECTION_BACKEND_KEY_MAP,
  type ModuleKey,
} from "./sectionRegistry";

export type ResolvedMeta = ReturnType<typeof processMetadata>;

type ConfigDataLike = {
  business_name?: string;
  logo_full_url?: string;
} | null;

export const slugToTitleCase = (slug: string | null | undefined): string => {
  if (!slug) return "";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const buildFallbackMeta = (
  titleParts: Array<string | null | undefined>,
  configData: ConfigDataLike,
): ResolvedMeta => {
  const cleanParts = titleParts.filter(
    (part): part is string => typeof part === "string" && part.length > 0,
  );
  return {
    title: cleanParts.join(" - "),
    description: "",
    image: configData?.logo_full_url || "",
    robotsMeta: null,
  };
};

export const resolveSectionMeta = async (
  moduleKey: ModuleKey,
  sectionId: string,
  _language: string,
  configData: ConfigDataLike,
): Promise<ResolvedMeta> => {
  const backendKey =
    SECTION_BACKEND_KEY_MAP[sectionId] ?? `${moduleKey}:${sectionId}`;
  const backendMeta = await fetchPageMetadata(backendKey);
  const humanLabel =
    getSectionDefaultLabel(moduleKey, sectionId) || slugToTitleCase(sectionId);
  const fallbackMeta = buildFallbackMeta(
    [humanLabel, configData?.business_name],
    configData,
  );

  if (backendMeta) {
    return processMetadata(backendMeta, fallbackMeta);
  }
  return fallbackMeta;
};

export const findModuleTypeByParam = async (
  param: string,
  language: string,
): Promise<string | null> => {
  if (!param) return null;
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/module`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-software-id": "33571750",
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL || "",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const modules: any[] = Array.isArray(json) ? json : json?.data ?? [];
    const numericParam = Number(param);
    const isNumeric = Number.isFinite(numericParam);
    const match = modules.find((item) => {
      if (!item) return false;
      if (isNumeric && Number(item.id) === numericParam) return true;
      if (item.slug && String(item.slug) === param) return true;
      if (item.module_type && String(item.module_type) === param) return true;
      return false;
    });
    const rawType = match?.module_type ?? null;
    return rawType ? String(rawType).trim().toLowerCase() : null;
  } catch (error) {
    console.error("findModuleTypeByParam failed:", error);
    return null;
  }
};
