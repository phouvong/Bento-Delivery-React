import { Box, Grid, Stack } from "@mui/material";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import ModuleSearchBanner from "./ModuleSearchBanner";

/**
 * Common layout wrapper for any module's static sidebar sections.
 * Renders: ModuleSearchBanner → breadcrumb row (+ optional filterComponent) → children.
 * Pass `searchComponent` to replace the default ManageSearch in the banner.
 * Pass `filterComponent` to render a filter button at the end of the breadcrumb row.
 */
const ModuleSectionPageWrapper = ({
  sectionLabel,
  bannerTitle,
  bannerSubtitle,
  searchComponent,
  filterComponent,
  children,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: (
        <i
          className="fi fi-rr-home"
          style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
        />
      ),
      onRedirect: homeHref,
    },
    {
      key: "section",
      label: t(sectionLabel),
    },
  ];

  return (
    <Stack spacing={2}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <ModuleSearchBanner
            zoneid={
              typeof window !== "undefined"
                ? localStorage.getItem("zoneid")
                : undefined
            }
            title={bannerTitle}
            subtitle={bannerSubtitle}
            component={searchComponent}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            px: { xs: 2, sm: 3, lg: 0 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </Box>
          {filterComponent && <Box sx={{ flexShrink: 0 }}>{filterComponent}</Box>}
        </Grid>
      </Grid>

      {children}
    </Stack>
  );
};

export default ModuleSectionPageWrapper;
