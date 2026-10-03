// Text summaries for order/cart line rows (variation labels, add-on names).

export const parseAddOns = (addOnsRaw) => {
  try {
    return Array.isArray(addOnsRaw)
      ? addOnsRaw
      : addOnsRaw
      ? JSON.parse(addOnsRaw)
      : null;
  } catch {
    return null;
  }
};

export const getAddOnsNames = (addOns) => {
  if (!addOns || addOns.length === 0) return "";

  const names = addOns.map(
    (item, index) =>
      `${item.name} (${item.quantity})${index !== addOns.length - 1 ? "," : ""}`
  );

  return names.join(" ");
};

export const parseVariationSummary = (variationRaw) => {
  let parsed = null;
  try {
    parsed = Array.isArray(variationRaw)
      ? variationRaw
      : variationRaw
      ? JSON.parse(variationRaw)
      : null;
  } catch {
    parsed = null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return "";
  return parsed
    .map((group) => {
      const values = group?.values;
      const valueEntries = Array.isArray(values)
        ? values
        : values
        ? [values]
        : [];
      return valueEntries
        .flatMap((v) => (Array.isArray(v?.label) ? v.label : [v?.label]))
        .filter(Boolean)
        .join(", ");
    })
    .filter(Boolean)
    .join(", ");
};
