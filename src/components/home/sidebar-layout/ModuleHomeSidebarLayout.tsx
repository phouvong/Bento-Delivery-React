import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const HOME_SECTION_QUERY_KEY = "home_section";

export type SidebarSection = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  mobileContent?: React.ReactNode;
  onClick?: () => void;
};

type Props = {
  overviewContent: React.ReactNode;
  sections?: SidebarSection[];
  routeSection?: string;
};

const ModuleHomeSidebarLayout = ({
  overviewContent,
  sections = [],
  routeSection,
}: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const { t } = useTranslation();

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategories();
  const categories = useMemo(
    () => categoriesResponse?.data ?? [],
    [categoriesResponse],
  );

  const activeSection =
    routeSection !== undefined
      ? routeSection
      : typeof router.query[HOME_SECTION_QUERY_KEY] === "string"
      ? router.query[HOME_SECTION_QUERY_KEY]
      : "";

  const activeCategoryId = (() => {
    if (
      router.pathname === "/home/category/[slug]" &&
      typeof router.query.id === "string"
    ) {
      return router.query.id;
    }
    // Legacy /search?data_type=category
    if (
      router.query.data_type === "category" &&
      typeof router.query.id === "string"
    ) {
      return router.query.id;
    }
    return "";
  })();

  const getCategoryParam = (item: any): string =>
    item?.slug || String(item?.id);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const moduleQueryParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  const moduleQuery = moduleQueryParam
    ? { module: moduleQueryParam }
    : undefined;

  const handleCategoryNavigate = (category: any) => {
    router.push({
      pathname: `/home/category/${
        category?.slug || String(category?.id ?? "")
      }`,
      query: {
        id: String(category?.id ?? ""),
        ...(moduleQueryParam ? { module: moduleQueryParam } : {}),
      },
    });
  };

  const handleSectionChange = (section: SidebarSection) => {
    if (section.onClick) {
      section.onClick();
      return;
    }
    router.push({
      pathname: `/home/${section.id}`,
      query: moduleQuery,
    });
  };

  const handleToggle = (categoryId: string | number) => {
    const id = String(categoryId);
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSection_ = sections.find((s) => s.id === activeSection);
  const activeSectionContent =
    activeSection_?.mobileContent ?? activeSection_?.content;
  const content = activeSectionContent ?? overviewContent;

  if (!isDesktop) return <>{content}</>;

  const itemSx = {
    borderRadius: "4px",
    mb: "2px",
    py: "8px",
    px: "16px",
    minHeight: "unset",
    "&.Mui-selected": {
      backgroundColor: (t: any) => t.palette.background.secondary,
    },
    "&.Mui-selected:hover": {
      backgroundColor: (t: any) => t.palette.background.secondary,
    },
    "&:hover": { backgroundColor: (t: any) => t.palette.action.hover },
  };

  const filterDiscountMenuFromSideBar = (item: any) =>
    item?.id !== "discounted";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "246px minmax(0, 1fr)",
        gap: "20px",
        alignItems: "start",
        width: "100%",
        maxWidth: "1320px",
        marginInline: "auto",
        mt: "24px",
        // Only between 1234px–1340px: cap at 1200px so content gets side gutters.
        "@media (min-width:1234px) and (max-width:1340px)": {
          maxWidth: "1200px",
        },
      }}
    >
      {/* ── Sidebar ── */}
      <Box
        sx={{
          position: "sticky",
          top: 85,
          maxHeight: "calc(85vh - 90px)",
          overflowY: "auto",
          overflowX: "hidden",
          borderRadius: "16px",
          // border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 1px 4px 0px #0000000d, 0px 1px 4px 0px #0000001a",

          py: 1.5,
          pl: "4px",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
            borderRadius: "999px",
            transition: "background-color 0.25s ease",
          },
          "&:hover": { scrollbarColor: `${theme.palette.divider} transparent` },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
          },
        }}
      >
        {/* Custom sections */}
        {sections.length > 0 && (
          <>
            <List disablePadding sx={{ pb: 1 }}>
              {sections.filter(filterDiscountMenuFromSideBar).map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <ListItemButton
                    key={section.id}
                    selected={isActive}
                    onClick={() => handleSectionChange(section)}
                    sx={itemSx}
                  >
                    {section.icon && (
                      <Box
                        sx={{
                          mr: 1,
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </Box>
                    )}
                    <ListItemText
                      primary={t(section.label)}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "16px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "primary.main" : "neutral.1050",
                          letterSpacing: "-0.48px",
                          lineHeight: 1.1,
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
            <Divider
              sx={{
                borderColor: (theme: any) => theme.palette.background.secondary,
              }}
            />
          </>
        )}

        {/* Categories */}
        <Box sx={{ pt: 2, pb: 1.5 }}>
          <Typography
            sx={{
              px: 2,
              mb: 1.5,
              fontWeight: 700,
              color: "neutral.500",
              fontSize: "18px",
              letterSpacing: "-0.54px",
              lineHeight: 1.1,
            }}
          >
            {t("Categories")}
          </Typography>

          {categoriesLoading && <CategoriesShimmer />}

          <List disablePadding>
            {categories.map((category: any) => {
              const catId = String(category?.id);
              const catParam = getCategoryParam(category);
              const hasChildren = category?.childes?.length > 0;
              const isExpanded = expandedCategories[catId];
              const hasActiveChild = category?.childes?.some(
                (child: any) =>
                  getCategoryParam(child) === activeCategoryId ||
                  String(child?.id) === activeCategoryId,
              );
              const isParentActive =
                activeCategoryId === catParam ||
                String(category?.id) === activeCategoryId ||
                hasActiveChild;

              return (
                <Box key={category?.id}>
                  <ListItemButton
                    onClick={() => handleCategoryNavigate(category)}
                    sx={{ ...itemSx, pr: "8px" }}
                  >
                    <ListItemText
                      primary={category?.name}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "16px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          // Bold when this category or one of its children is active
                          fontWeight: isParentActive ? 700 : 400,
                          color: "neutral.1050",
                          letterSpacing: "-0.48px",
                          lineHeight: 1.1,
                          textTransform: "capitalize",
                        },
                      }}
                    />
                    {hasChildren &&
                      (isExpanded ? (
                        <KeyboardArrowUpIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", flexShrink: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(category?.id);
                          }}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", flexShrink: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(category?.id);
                          }}
                        />
                      ))}
                  </ListItemButton>

                  {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {category?.childes?.map((child: any) => {
                          const childParam = getCategoryParam(child);
                          const isChildActive =
                            activeCategoryId === childParam ||
                            String(child?.id) === activeCategoryId;
                          return (
                            <ListItemButton
                              key={child?.id}
                              onClick={() => handleCategoryNavigate(child)}
                              sx={{
                                ...itemSx,
                                // Active sub-category gets secondary bg
                                ...(isChildActive && {
                                  backgroundColor: (t: any) =>
                                    t.palette.background.secondary,
                                  "&:hover": {
                                    backgroundColor: (t: any) =>
                                      t.palette.background.secondary,
                                  },
                                }),
                              }}
                            >
                              <Box
                                sx={{
                                  mr: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  flexShrink: 0,
                                  color: "text.secondary",
                                }}
                              >
                                <i
                                  className="fi fi-sr-arrow-turn-down-right"
                                  style={{
                                    fontSize: "16px",
                                    lineHeight: 1,
                                    display: "flex",
                                    fontWeight: 500,
                                  }}
                                ></i>
                              </Box>
                              <ListItemText
                                primary={child?.name}
                                primaryTypographyProps={{
                                  sx: {
                                    fontSize: "16px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontWeight: 400,
                                    color: "neutral.1050",
                                    letterSpacing: "-0.48px",
                                    lineHeight: 1.1,
                                    textTransform: "capitalize",
                                  },
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          paddingInlineStart: { lg: "20px" },
          "& .MuiContainer-root": {
            maxWidth: "none !important",
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
          },
        }}
      >
        {content}
      </Box>
    </Box>
  );
};

export default ModuleHomeSidebarLayout;

const CategoriesShimmer = () => (
  <Stack spacing={0} sx={{ px: "4px" }}>
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "2px",
          px: "16px",
          py: "8px",
        }}
      >
        <Skeleton
          variant="text"
          width={`${50 + (i % 3) * 20}%`}
          height={20}
          sx={{ borderRadius: "4px" }}
        />
        {i % 3 === 1 && <Skeleton variant="circular" width={16} height={16} />}
      </Box>
    ))}
  </Stack>
);
