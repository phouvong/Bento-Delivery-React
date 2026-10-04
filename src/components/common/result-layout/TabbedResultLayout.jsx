import { Box, Stack, Typography } from "@mui/material";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Reusable tabbed result page shell — used by category page and (in future) search page.
 *
 * This is a CONTROLLED PRESENTATION component:
 *   - It does NOT fetch any data.
 *   - It does NOT own tab/filter state.
 *   - The parent passes everything in and decides what each tab renders.
 *
 * Layout:
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ {headerLeft}     [tabs]              [filter button + badge]  │   ← sticky
 *   ├───────────────────────────────────────────────────────────────┤
 *   │ {children}                                                    │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * @param {ReactNode} headerLeft         Left-side of sticky bar — breadcrumb / result count text / etc.
 * @param {{value:string,label:string}[]} tabs
 * @param {string} activeTab             Currently active tab value
 * @param {(tab:string)=>void} onTabChange
 * @param {number} appliedFilterCount    Badge count on the filter button
 * @param {(filters:object)=>void} onFilterApply  Called when user applies/resets filters
 * @param {ReactNode} children           Active tab's content (rendered by parent)
 */
const TabbedResultLayout = ({
  headerLeft,
  tabs = [],
  activeTab,
  onTabChange,
  appliedFilterCount = 0,
  onFilterApply,
  children,
}) => {
  const { t } = useTranslation();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  return (
    <Stack spacing={3} sx={{ pt: 1 }}>
      {/* ── Sticky filter bar ── */}
      <Stack
        direction="row"
        alignItems="center"
        gap="16px"
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          py: "12px",
          position: "sticky",
          top: { xs: "55px", md: "63px" },
          zIndex: 10,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>{headerLeft}</Box>

        <Stack direction="row" alignItems="center" gap="12px">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <Box
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                sx={{
                  height: "36px",
                  px: "16px",
                  py: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? "primary.main" : "#f2f2f2",
                  transition: "background-color 0.15s",
                  userSelect: "none",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: active ? "#fff" : "#1e1e1e",
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(tab.label)}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        <Box
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{
            position: "relative",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { opacity: 0.7 },
          }}
        >
          <i
            className="fi fi-ss-sliders-v"
            style={{
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              color: "#1e1e1e",
            }}
          />
          {appliedFilterCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                minWidth: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#1e1e1e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {appliedFilterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {children}

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={onFilterApply}
      />
    </Stack>
  );
};

export default TabbedResultLayout;
