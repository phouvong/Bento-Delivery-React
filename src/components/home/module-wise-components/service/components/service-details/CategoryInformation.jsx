import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { getModuleId } from "helper-functions/getModuleId";

const CategoryInformation = ({ categories, isSmall }) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!categories?.length) return null;

  const queryModule = router?.query?.module || router?.query?.module_id;
  const moduleValue = Array.isArray(queryModule)
    ? queryModule[0]
    : queryModule || getModuleId();

  const handleCategoryClick = (item) => {
    if (!item?.id && !item?.slug) return;
    router.push({
      pathname: `/home/category/${item?.slug || item?.id}`,
      query: {
        id: item?.id,
        ...(moduleValue ? { module: String(moduleValue) } : {}),
      },
    });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
      <Typography
        sx={{
          fontSize: { xs: "14px", md: "16px" },
          color: "customColor.textGray",
        }}
      >
        {t("Category")} :
      </Typography>
      {categories?.map((item, index) => {
        // First entry is always the top-level category (always clickable).
        // Subsequent entries are sub-categories — clickable on desktop only.
        const isSubCategory = index > 0;
        const isClickable = !isSubCategory || !isSmall;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <Typography
                sx={{ fontSize: { xs: "14px", md: "16px" }, color: "text.primary" }}
              >
                {">"}
              </Typography>
            )}
            <Typography
              onClick={isClickable ? () => handleCategoryClick(item) : undefined}
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                color: "text.primary",
                ...(isClickable && {
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }),
              }}
            >
              {item?.name}
            </Typography>
          </React.Fragment>
        );
      })}
    </Stack>
  );
};

export default CategoryInformation;
