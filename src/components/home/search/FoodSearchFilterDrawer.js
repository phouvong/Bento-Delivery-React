import {
  Box,
  Checkbox,
  Drawer,
  Popover,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const SORT_OPTIONS = [
  { value: "price_low", label: "Price Low To High" },
  { value: "price_high", label: "Price High To Low" },
];

const QUICK_ACTION_OPTIONS = [
  { value: "offers", label: "Offers", icon: "fi fi-rr-badge-percent" },
  {
    value: "free_delivery",
    label: "Free Delivery",
    icon: "fi fi-rs-biking-mountain",
  },
  { value: "top_rated", label: "Top Rated", icon: "fi fi-rr-star" },
  { value: "nearby", label: "Nearby", icon: "fi fi-rs-marker" },
];

// Values map 1:1 to the legacy `filter` API param values from
// `src/components/search/filterTypes.js`. Sent as a JSON array on
// `useGetSearchPageData` → `&filter=[...]`.
const FILTER_BY_OPTIONS = [
  { value: "top_rated", label: "Top Rated" },
  { value: "available_now", label: "Available for Now" },
  { value: "discounted", label: "Discounted" },
  { value: "popular", label: "Popular" },
];

const TYPE_OPTIONS = [
  { value: "halal", label: "Halal" },
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non - Veg" },
];

const RATING_OPTIONS = [
  { value: "5_plus", label: "Only Rate 5" },
  { value: "4_plus", label: "4+ Rating" },
  { value: "3_plus", label: "3+ Rating" },
  { value: "2_plus", label: "2+ Rating" },
];

const SORT_VALUE_MAP = {
  price_low: "price_low_high",
  price_high: "price_high_low",
};

const INITIAL_STATE = {
  sortBy: "",
  quickAction: "",
  priceMin: "",
  priceMax: "",
  selectedTypes: [],
  selectedCategoryIds: [],
  rating: "",
};

const stateFromFilter = (f = {}) => ({
  sortBy: f.sort_by
    ? Object.keys(SORT_VALUE_MAP).find(
        (k) => SORT_VALUE_MAP[k] === f.sort_by
      ) ?? ""
    : "",
  quickAction: f.quick_action ?? "",
  priceMin: f.price_min ?? "",
  priceMax: f.price_max ?? "",
  selectedTypes: f.type ? f.type.split(",").filter(Boolean) : [],
  selectedCategoryIds: f.category_ids
    ? f.category_ids.split(",").filter(Boolean).map(Number)
    : [],
  rating: f.rating ?? "",
});

const buildOutput = ({
  sortBy,
  quickAction,
  priceMin,
  priceMax,
  selectedTypes,
  selectedCategoryIds,
  rating,
}) => {
  const out = {};
  if (sortBy && SORT_VALUE_MAP[sortBy]) out.sort_by = SORT_VALUE_MAP[sortBy];
  if (quickAction) out.quick_action = quickAction;
  if (priceMin !== "" && priceMin !== undefined)
    out.price_min = Number(priceMin);
  if (priceMax !== "" && priceMax !== undefined)
    out.price_max = Number(priceMax);
  if (selectedTypes.length) out.type = selectedTypes.join(",");
  if (selectedCategoryIds.length)
    out.category_ids = selectedCategoryIds.join(",");
  if (rating) out.rating = rating;
  return out;
};

const countSelected = ({
  sortBy,
  quickAction,
  priceMin,
  priceMax,
  selectedTypes,
  selectedCategoryIds,
  rating,
}) =>
  [
    sortBy,
    quickAction,
    priceMin || priceMax,
    selectedTypes.length ? 1 : 0,
    selectedCategoryIds.length ? 1 : 0,
    rating,
  ].filter(Boolean).length;

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: "16px",
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-0.32px",
      lineHeight: 1.2,
      mb: "12px",
    }}
  >
    {children}
  </Typography>
);

const RowDivider = () => (
  <Box sx={{ height: "1px", backgroundColor: "divider" }} />
);

const PrefixInput = ({ prefix, value, onChange, theme }) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      flex: 1,
      height: "38px",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "background.paper",
      "&:focus-within": { borderColor: theme.palette.neutral?.[400] },
    }}
  >
    <Typography
      sx={{
        fontSize: "13px",
        color: "neutral.450",
        fontWeight: 400,
        whiteSpace: "nowrap",
        lineHeight: 1,
        px: "10px",
        flexShrink: 0,
      }}
    >
      {prefix}
    </Typography>
    <Box
      sx={{
        width: "1px",
        height: "18px",
        backgroundColor: "divider",
        flexShrink: 0,
      }}
    />
    <Box
      component="input"
      type="number"
      value={value}
      onChange={onChange}
      sx={{
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        fontWeight: 500,
        color: "neutral.1050",
        fontFamily: "inherit",
        minWidth: 0,
        backgroundColor: "transparent",
        px: "10px",
        "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
          display: "none",
        },
      }}
    />
  </Stack>
);

const CATEGORIES_INITIAL_SHOW = 5;
const PRICE_RANGE_MAX = 10000;

const CategoriesSection = ({
  categories,
  selectedCategoryIds,
  toggleCategory,
  t,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  if (!categories || categories.length === 0) return null;

  const visible = expanded
    ? categories
    : categories.slice(0, CATEGORIES_INITIAL_SHOW);
  const hasMore = categories.length > CATEGORIES_INITIAL_SHOW;

  return (
    <>
      <Box sx={{ px: "20px", py: "20px" }}>
        <SectionLabel>{t("Categories")}</SectionLabel>
        {visible.map((cat) => (
          <Stack
            key={cat.id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: "8px", cursor: "pointer" }}
            onClick={() => toggleCategory(cat.id)}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.1050",
                letterSpacing: "-0.42px",
                textTransform: "capitalize",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cat.name}
            </Typography>
            <Checkbox
              checked={selectedCategoryIds.includes(cat.id)}
              size="small"
              sx={{
                p: 0,
                color: theme.palette.neutral[400],
                "&.Mui-checked": { color: "primary.main" },
              }}
            />
          </Stack>
        ))}
        {hasMore && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap="6px"
            onClick={() => setExpanded((e) => !e)}
            sx={{
              mt: "4px",
              py: "8px",
              cursor: "pointer",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: theme.palette.background.secondary,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "info.main",
                letterSpacing: "-0.42px",
                lineHeight: 1.2,
              }}
            >
              {expanded ? t("See Less") : t("See More")}
            </Typography>
            <i
              className={
                expanded
                  ? "fi fi-rr-angle-small-up"
                  : "fi fi-rr-angle-small-down"
              }
              style={{
                fontSize: "16px",
                lineHeight: 1,
                display: "flex",
                color: "#3979e0",
              }}
            />
          </Stack>
        )}
      </Box>
      <RowDivider />
    </>
  );
};

const FilterContent = ({
  sortBy,
  setSortBy,
  quickAction,
  setQuickAction,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  selectedTypes,
  toggleType,
  selectedCategoryIds,
  toggleCategory,
  rating,
  setRating,
  showFilterBy,
  showSortBy,
  showQuickAction,
  showCategories,
  showType,
  showPriceRange,
  currencySymbol,
  categories,
  selectedCount,
  handleReset,
  handleApply,
  onClose,
  t,
  scrollable,
  typeOptions,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "382px" },
        display: "flex",
        flexDirection: "column",
        ...(scrollable && { height: "560px" }),
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: "20px", pt: "20px", pb: "16px" }}
      >
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.44px",
          }}
        >
          {t("Filter")}
        </Typography>
        <Box
          onClick={onClose}
          sx={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            "&:hover": { backgroundColor: theme.palette.background.secondary },
          }}
        >
          <i
            className="fi fi-rr-cross"
            style={{
              fontSize: "13px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
            }}
          />
        </Box>
      </Stack>

      <RowDivider />

      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          ...(scrollable && {
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
            },
          }),
        }}
      >
        {/* 1. Sort By */}
        {showSortBy && (
          <>
            <Box sx={{ px: "20px", py: "20px" }}>
              <SectionLabel>{t("Sort By")}</SectionLabel>
              <RadioGroup
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <Stack
                    key={opt.value}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: "6px", cursor: "pointer" }}
                    onClick={() => setSortBy(opt.value)}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "neutral.1050",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {t(opt.label)}
                    </Typography>
                    <Radio
                      value={opt.value}
                      checked={sortBy === opt.value}
                      size="small"
                      sx={{
                        p: 0,
                        color: theme.palette.neutral[400],
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  </Stack>
                ))}
              </RadioGroup>
            </Box>
            <RowDivider />
          </>
        )}

        {/* 2. Quick Action */}
        {showQuickAction && (
          <Box sx={{ px: "20px", py: "20px" }}>
            <SectionLabel>{t("Quick Action")}</SectionLabel>
            <RadioGroup
              value={quickAction}
              onChange={(e) => setQuickAction(e.target.value)}
            >
              {QUICK_ACTION_OPTIONS.map((opt) => (
                <Stack
                  key={opt.value}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ py: "6px", cursor: "pointer" }}
                  onClick={() =>
                    setQuickAction(quickAction === opt.value ? "" : opt.value)
                  }
                >
                  <Stack direction="row" alignItems="center" gap="8px">
                    <i
                      className={opt.icon}
                      style={{
                        fontSize: "16px",
                        lineHeight: 1,
                        display: "flex",
                        color: theme.palette.neutral[450],
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "neutral.1050",
                        letterSpacing: "-0.3px",
                        textTransform: "capitalize",
                      }}
                    >
                      {t(opt.label)}
                    </Typography>
                  </Stack>
                  <Radio
                    value={opt.value}
                    checked={quickAction === opt.value}
                    size="small"
                    sx={{
                      p: 0,
                      color: theme.palette.neutral[400],
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                </Stack>
              ))}
            </RadioGroup>
          </Box>
        )}

        {showQuickAction && <RowDivider />}

        {/* 3. Price Range */}
        {showPriceRange && (
          <Box sx={{ px: "20px", py: "20px" }}>
            <SectionLabel>
              {t("Price Range")} ({currencySymbol})
            </SectionLabel>
            <Stack direction="row" gap="10px" alignItems="center">
              <PrefixInput
                prefix={t("Min")}
                value={priceMin}
                onChange={(e) => {
                  const val = e.target.value;
                  setPriceMin(val);
                  // keep min < max; if max is empty treat as no upper bound
                  const num = Number(val);
                  const maxNum =
                    priceMax !== "" ? Number(priceMax) : PRICE_RANGE_MAX;
                  if (!isNaN(num) && num > maxNum) setPriceMax(String(num));
                }}
                theme={theme}
              />
              <Typography
                sx={{
                  color: theme.palette.neutral[400],
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                -
              </Typography>
              <PrefixInput
                prefix={t("Max")}
                value={priceMax}
                onChange={(e) => {
                  const val = e.target.value;
                  setPriceMax(val);
                  const num = Number(val);
                  const minNum = priceMin !== "" ? Number(priceMin) : 0;
                  if (!isNaN(num) && num < minNum) setPriceMin(String(num));
                }}
                theme={theme}
              />
            </Stack>

            {/* Range slider */}
            <Box sx={{ px: "6px", mt: "20px" }}>
              <Slider
                value={[
                  priceMin !== ""
                    ? Math.min(Number(priceMin), PRICE_RANGE_MAX)
                    : 0,
                  priceMax !== ""
                    ? Math.min(Number(priceMax), PRICE_RANGE_MAX)
                    : PRICE_RANGE_MAX,
                ]}
                min={0}
                max={PRICE_RANGE_MAX}
                onChange={(_, newVal) => {
                  setPriceMin(String(newVal[0]));
                  setPriceMax(String(newVal[1]));
                }}
                disableSwap
                sx={{
                  color: "neutral.1050",
                  height: 4,
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "background.paper",
                    border: "2px solid",
                    borderColor: "neutral.1050",
                    boxShadow: "0px 1px 4px rgba(0,0,0,0.15)",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                    },
                  },
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-rail": {
                    backgroundColor: theme.palette.neutral?.[200] ?? "#e0e0e0",
                    opacity: 1,
                  },
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: "2px" }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "neutral.450",
                    lineHeight: 1.3,
                  }}
                >
                  {currencySymbol}0
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "neutral.450",
                    lineHeight: 1.3,
                  }}
                >
                  {currencySymbol}
                  {PRICE_RANGE_MAX.toLocaleString()}
                </Typography>
              </Stack>
            </Box>
          </Box>
        )}

        {showPriceRange && <RowDivider />}

        {/* 4. Type */}
        {showType && typeOptions?.length > 0 && (
          <>
            <Box sx={{ px: "20px", py: "20px" }}>
              <SectionLabel>{t("Type")}</SectionLabel>
              {typeOptions.map((opt) => (
                <Stack
                  key={opt.value}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ py: "6px", cursor: "pointer" }}
                  onClick={() => toggleType(opt.value)}
                >
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "neutral.1050",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {t(opt.label)}
                  </Typography>
                  <Checkbox
                    checked={selectedTypes.includes(opt.value)}
                    size="small"
                    sx={{
                      p: 0,
                      color: theme.palette.neutral[400],
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                </Stack>
              ))}
            </Box>

            <RowDivider />
          </>
        )}

        {/* 5. Categories */}
        {showCategories && categories?.length > 0 && (
          <CategoriesSection
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            toggleCategory={toggleCategory}
            t={t}
          />
        )}

        {/* 6. Ratings */}
        <Box sx={{ px: "20px", py: "20px" }}>
          <SectionLabel>{t("Ratings")}</SectionLabel>
          <RadioGroup
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {RATING_OPTIONS.map((opt) => (
              <Stack
                key={opt.value}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: "6px", cursor: "pointer" }}
                onClick={() => setRating(rating === opt.value ? "" : opt.value)}
              >
                <Stack direction="row" alignItems="center" gap="8px">
                  <i
                    className="fi fi-rr-star"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[450],
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "neutral.1050",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {t(opt.label)}
                  </Typography>
                </Stack>
                <Radio
                  value={opt.value}
                  checked={rating === opt.value}
                  size="small"
                  sx={{
                    p: 0,
                    color: theme.palette.neutral[400],
                    "&.Mui-checked": { color: "primary.main" },
                  }}
                />
              </Stack>
            ))}
          </RadioGroup>
        </Box>
      </Box>
      {/* end scrollable */}

      <RowDivider />

      {/* Bottom buttons */}
      <Stack direction="row" gap="12px" sx={{ px: "20px", py: "16px" }}>
        <Box
          onClick={handleReset}
          sx={{
            flex: 1,
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: theme.palette.background.secondary,
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: theme.palette.neutral[1050],
              letterSpacing: "-0.3px",
            }}
          >
            {t("Reset")}
          </Typography>
        </Box>
        <Box
          onClick={handleApply}
          sx={{
            flex: 1,
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: "primary.main",
            cursor: "pointer",
            "&:hover": { opacity: 0.9 },
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "common.white",
              letterSpacing: "-0.3px",
            }}
          >
            {t("Apply")}
            {selectedCount > 0 ? ` (${selectedCount})` : ""}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * filterValue — previously applied filter object (for persistence).
 *   Pass the object returned from onApply so the drawer re-opens
 *   with the same selections.
 */
const FoodSearchFilterDrawer = ({
  anchorEl,
  onClose,
  onApply,
  showFilterBy = false,
  showSortBy = true,
  showQuickAction = true,
  showCategories = true,
  showType = true,
  showPriceRange = true,
  categories = [],
  filterValue = {},
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { configData } = useSelector((state) => state.configData);
  const currencySymbol = configData?.currency_symbol || "$";

  const currentModule = getCurrentModuleType();
  // Type filter is only meaningful for the food module — Halal / Veg /
  // Non-Veg don't apply to grocery/pharmacy/shop catalogs. Other modules
  // get an empty list so the section is hidden entirely (the render
  // guard `typeOptions?.length > 0` below drops the block).
  const visibleTypeOptions =
    currentModule === ModuleTypes.FOOD ? TYPE_OPTIONS : [];

  const open = Boolean(anchorEl);

  const [sortBy, setSortBy] = useState("");
  const [quickAction, setQuickAction] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [rating, setRating] = useState("");

  // Sync state from filterValue when drawer opens
  useEffect(() => {
    if (!open) return;
    const s = stateFromFilter(filterValue);
    setSortBy(s.sortBy);
    setQuickAction(s.quickAction);
    setPriceMin(s.priceMin);
    setPriceMax(s.priceMax);
    setSelectedTypes(s.selectedTypes);
    setSelectedCategoryIds(s.selectedCategoryIds);
    setRating(s.rating);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentState = {
    sortBy,
    quickAction,
    priceMin,
    priceMax,
    selectedTypes,
    selectedCategoryIds,
    rating,
  };

  // halal toggles independently; veg/non_veg are mutually exclusive
  const toggleType = (val) => {
    setSelectedTypes((prev) => {
      if (val === "halal") {
        return prev.includes("halal")
          ? prev.filter((v) => v !== "halal")
          : [...prev, "halal"];
      }
      // veg / non_veg — mutually exclusive
      const withoutMeat = prev.filter((v) => v !== "veg" && v !== "non_veg");
      return prev.includes(val) ? withoutMeat : [...withoutMeat, val];
    });
  };

  const toggleCategory = (id) =>
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  const handleReset = () => {
    setSortBy("");
    setQuickAction("");
    setPriceMin("");
    setPriceMax("");
    setSelectedTypes([]);
    setSelectedCategoryIds([]);
    setRating("");
    onApply?.({});
    onClose();
  };

  const handleApply = () => {
    onApply?.(buildOutput(currentState));
    onClose();
  };

  const selectedCount = countSelected(currentState);

  const contentProps = {
    sortBy,
    setSortBy,
    quickAction,
    setQuickAction,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    selectedTypes,
    toggleType,
    selectedCategoryIds,
    toggleCategory,
    rating,
    setRating,
    showFilterBy,
    showSortBy,
    showQuickAction,
    showCategories,
    showType,
    showPriceRange,
    currencySymbol,
    categories,
    selectedCount,
    handleReset,
    handleApply,
    onClose,
    t,
    scrollable: true,
    typeOptions: visibleTypeOptions,
  };

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 10 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            overflow: "hidden",
            maxHeight: "95vh",
          },
        }}
      >
        <FilterContent {...contentProps} />
      </Drawer>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
            mt: "8px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <FilterContent {...contentProps} />
    </Popover>
  );
};

export default FoodSearchFilterDrawer;
