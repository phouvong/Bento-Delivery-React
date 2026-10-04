export const groupByDay = (items, dateField = "created_at") => {
  const groups = [];
  const map = new Map();
  (items ?? []).forEach((item) => {
    const day = item?.[dateField]
      ? new Date(item[dateField]).toDateString()
      : "Unknown";
    if (!map.has(day)) {
      map.set(day, []);
      groups.push({ day, items: map.get(day) });
    }
    map.get(day).push(item);
  });
  return groups;
};

export const formatDayLabel = (dayString, t) => {
  if (!dayString || dayString === "Unknown") return dayString;
  const date = new Date(dayString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return t("Today");
  if (date.toDateString() === yesterday.toDateString()) return t("Yesterday");
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
