import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Presentational module-tab layout shared by Orders & Coupons profile pages.
 *
 * Renders the module tab row (Grocery / Pharmacy / Shop / …) above a content
 * card. Controlled: the parent owns `activeModuleId` and reacts to
 * `onModuleChange` (e.g. to reset paging / refetch with the new module id).
 *
 * Props:
 *  - activeModuleId: number | null     — currently selected module id
 *  - onModuleChange: (module) => void  — fired when a tab is clicked
 *  - children: ReactNode               — content rendered inside the card
 */
const ModuleTabbedLayout = ({
  activeModuleId,
  onModuleChange,
  children,
  mobileBareContent = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const bareContent = isMobile && mobileBareContent;
  const { modules: allModules } = useSelector((state) => state.configData);

  // Hide the rider/rental (ride-share) module from the order/coupon tab bar —
  // it doesn't belong to the order or coupon flows.
  const modules = allModules?.filter((m) => m?.module_type !== "ride-share");
console.log({allModules});

  const activeModule =
    modules?.find((m) => m.id === activeModuleId) ?? modules?.[0];

  const activeIndex =
    modules?.findIndex(
      (m) => m.id === (activeModule?.id ?? modules?.[0]?.id)
    ) ?? 0;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === (modules?.length ?? 1) - 1;
  const contentCardRadius = isFirst
    ? "0 16px 16px 16px"
    : isLast
    ? "16px 0 16px 16px"
    : "16px 16px 16px 16px";

  // Default to first module once the list is available.
  useEffect(() => {
    if (modules?.length && activeModuleId == null) {
      onModuleChange?.(modules[0]);
    }
  }, [modules]);

  if (!modules?.length) return null;

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      {/* ── Module tab row ── */}
      {isMobile ? (
        /* Mobile: Figma pill style */
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            backgroundColor: "background.paper",
            px: "16px",
            pb: "12px",
            pt: "12px",
          }}
        >
          {modules.map((mod) => {
            const isActive = mod.id === (activeModule?.id ?? modules[0]?.id);
            return (
              <Box
                key={mod.id}
                onClick={() => onModuleChange?.(mod)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "36px",
                  px: "12px",
                  py: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  userSelect: "none",
                  flexShrink: 0,
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                    color: isActive ? "#fff" : "neutral.500",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  {mod.module_name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        /* Desktop: card tab style */
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            clipPath: "inset(-20px -20px 0 -20px)",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            backgroundColor: "background.default",
          }}
        >
          {modules.map((mod) => {
            const isActive = mod.id === (activeModule?.id ?? modules[0]?.id);
            return (
              <Box
                key={mod.id}
                onClick={() => onModuleChange?.(mod)}
                sx={{
                  flex: 1,
                  minWidth: "100px",
                  px: "24px",
                  py: "16px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive
                    ? "background.paper"
                    : "background.default",
                  borderRadius: isActive ? "16px 16px 0 0" : 0,
                  boxShadow: isActive ? "0px 0px 6px rgba(0,0,0,0.12)" : "none",
                  transition: "background-color 0.2s ease",
                  position: "relative",
                  zIndex: isActive ? 1 : 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { sm: "14px", md: "18px" },
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1.1,
                    letterSpacing: "-0.54px",
                    color: isActive ? "neutral.1050" : "neutral.500",
                    whiteSpace: "nowrap",
                  }}
                >
                  {mod.module_name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ── Content card ── */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: bareContent ? 0 : contentCardRadius,
          boxShadow: bareContent
            ? "none"
            : "0px 1px 4px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          zIndex: 0,
        }}
      >
        {typeof children === "function" ? children(activeModule) : children}
      </Box>
    </Box>
  );
};

export default ModuleTabbedLayout;
