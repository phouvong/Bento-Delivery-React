// `zone_id` arrives as "[3,1]", [3,1] or a single id depending on the source.
export const parseZoneIds = (raw: unknown): number[] => {
  if (raw == null || raw === "") return [];
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      value = raw.replace(/^\[|\]$/g, "").split(",");
    }
  }
  const list = Array.isArray(value) ? value : [value];
  return list.map(Number).filter((id) => Number.isFinite(id));
};

/** First zone (in `zone_id` order) whose modules include `moduleType`. */
export const getZoneIdWithModule = (
  rawZoneIds: unknown,
  zonesById: Record<string, { modules?: { module_type?: string }[] }>,
  moduleType: string
): number | undefined =>
  parseZoneIds(rawZoneIds).find((id) =>
    zonesById?.[id]?.modules?.some((m) => m?.module_type === moduleType)
  );
