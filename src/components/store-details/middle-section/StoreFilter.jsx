import React, { useMemo, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useTranslation } from "react-i18next";
import FoodSearchFilterDrawer from "../../home/search/FoodSearchFilterDrawer";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

// FoodSearchFilterDrawer speaks search-page param names; map them to the
// shape the store-items API hook (`useGetStoreCategoriesItems`) expects.

// Sort: "price_low_high" / "price_high_low"  <->  "low" / "high" / "Default"
const sortFromStoreToDrawer = (storeSort) => {
  if (storeSort === "low") return "price_low_high";
  if (storeSort === "high") return "price_high_low";
  return "";
};
const sortFromDrawerToStore = (drawerSort) => {
  if (drawerSort === "price_low_high") return "low";
  if (drawerSort === "price_high_low") return "high";
  return "Default";
};

// Rating drawer values are "5_plus" / "4_plus" / etc.  <->  store ratingCount: 5 / 4 / ...
const ratingFromStoreToDrawer = (n) => {
  const v = Number(n);
  if (v >= 5) return "5_plus";
  if (v >= 4) return "4_plus";
  if (v >= 3) return "3_plus";
  if (v >= 2) return "2_plus";
  return "";
};
const ratingFromDrawerToStore = (drawerRating) => {
  if (!drawerRating) return 0;
  const match = String(drawerRating).match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
};

const StoreFilter = ({
  setFilterData,
  setRatingCount,
  ratingCount,
  minMax,
  setMinMax,
  sortBy,
  setSortBy,
  type,
  setType,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const filterValue = useMemo(() => {
    const out = {};
    const drawerSort = sortFromStoreToDrawer(sortBy);
    if (drawerSort) out.sort_by = drawerSort;
    if (Array.isArray(minMax) && (minMax[0] !== 0 || minMax[1] !== 1)) {
      out.price_min = minMax[0];
      out.price_max = minMax[1];
    }
    const drawerRating = ratingFromStoreToDrawer(ratingCount);
    if (drawerRating) out.rating = drawerRating;
    // Mirror the current store-items `type` into the drawer so reopening
    // it shows the active selection (e.g. "halal", "veg", "non_veg").
    if (type && type !== "all") out.type = type;
    return out;
  }, [sortBy, minMax, ratingCount, type]);

  const hasActiveFilter =
    (sortBy && sortBy !== "Default") ||
    (Array.isArray(minMax) && (minMax[0] !== 0 || minMax[1] !== 1)) ||
    Number(ratingCount) > 0 ||
    (type && type !== "all");

  const handleApply = (next) => {
    const safe = next || {};

    if (typeof setSortBy === "function") {
      setSortBy(sortFromDrawerToStore(safe.sort_by));
    }

    if (typeof setMinMax === "function") {
      const hasMin = safe.price_min != null && safe.price_min !== "";
      const hasMax = safe.price_max != null && safe.price_max !== "";
      if (hasMin || hasMax) {
        setMinMax([
          hasMin ? Number(safe.price_min) : 0,
          hasMax ? Number(safe.price_max) : 0,
        ]);
      } else {
        setMinMax([0, 1]);
      }
    }

    if (typeof setRatingCount === "function") {
      setRatingCount(ratingFromDrawerToStore(safe.rating));
    }

    // Forward the type selection from the drawer (halal / veg / non_veg /
    // comma-separated) to the store-items state.type. Empty selection
    // resets to "all" so the URL param stays consistent.
    if (typeof setType === "function") {
      setType(safe.type ? String(safe.type) : "all");
    }

    // `filterData` was the legacy module-wise checkbox payload. The new
    // popover doesn't expose those checkboxes — keep the prop wiring
    // intact by clearing it when the user applies via this drawer.
    if (typeof setFilterData === "function") {
      setFilterData([]);
    }
  };

  return (
    <>
      <Tooltip title={t("Filter")} arrow>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label={t("Filter")}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "8px",
            backgroundColor: "background.paper",
            border: (theme) =>
              `1px solid ${
                hasActiveFilter
                  ? theme.palette.primary.main
                  : theme.palette.divider
              }`,
            color: (theme) =>
              hasActiveFilter
                ? theme.palette.primary.main
                : theme.palette.neutral?.[700] || theme.palette.text.primary,
            transition: "all 120ms ease",
            "&:hover": {
              backgroundColor: "background.paper",
              borderColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <TuneIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <FoodSearchFilterDrawer
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onApply={handleApply}
        filterValue={filterValue}
        showFilterBy={false}
        showQuickAction={false}
        showCategories={false}
        showType={getCurrentModuleType() === ModuleTypes.FOOD}
        categories={[]}
      />
    </>
  );
};

export default StoreFilter;
