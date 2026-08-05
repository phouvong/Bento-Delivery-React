import { Box, Stack, TextField, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchableSelect from "components/common/SearchableSelect";

/**
 * @param {{ id: number|string, name: string }[]} categories
 * @param {{ id: number|string, name: string }[]} subCategories  — already filtered by parent
 * @param {{ category: any, subCategory: any, description: string }} values
 * @param {(field: string, value: any) => void} onChange
 * @param {{ category?: string, subCategory?: string, description?: string }} errors
 */
export default function ServiceDetailsCard({
  categories = [],
  subCategories = [],
  values = {},
  onChange,
  errors = {},
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { category = "", subCategory = "", description = "" } = values;

  const labelSx = {
    fontSize: { xs: "13px", md: "14px" },
    fontWeight: 500,
    color: theme.palette.text.primary,
    mb: 0.75,
  };

  const errorTextSx = {
    fontSize: "12px",
    color: "error.main",
    mt: 0.5,
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "16px", md: "18px" },
          color: theme.palette.text.primary,
          mb: { xs: 1.5, md: 2 },
        }}
      >
        {t("Service Details")}
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 1.5, md: 2 }}
        mb={{ xs: 1.5, md: 2 }}
      >
        {/* Category */}
        <Box flex={1} minWidth={0}>
          <Typography sx={labelSx}>
            {t("Select Category")}
            <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
              *
            </Box>
          </Typography>
          <SearchableSelect
            value={category}
            onChange={(val) => onChange("category", val)}
            options={categories}
            placeholder={t("Select Category")}
            searchPlaceholder={t("Search category...")}
            emptyText={t("No category found")}
            hasError={Boolean(errors.category)}
          />
          {errors.category && (
            <Typography sx={errorTextSx}>{errors.category}</Typography>
          )}
        </Box>

        {/* Sub Category */}
        <Box flex={1} minWidth={0}>
          <Typography sx={labelSx}>{t("Select Sub Category")}</Typography>
          <SearchableSelect
            value={subCategory}
            onChange={(val) => onChange("subCategory", val)}
            options={subCategories}
            placeholder={t("Select Sub Category")}
            searchPlaceholder={t("Search sub category...")}
            emptyText={t("No sub category found")}
            disabled={!category}
            hasError={Boolean(errors.subCategory)}
          />
          {errors.subCategory && (
            <Typography sx={errorTextSx}>{errors.subCategory}</Typography>
          )}
        </Box>
      </Stack>

      {/* Description */}
      <Box>
        <Typography sx={labelSx}>
          {t("Description")}
          <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
            *
          </Box>
        </Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder={t("Enter a description...")}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          error={Boolean(errors.description)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: theme.palette.background.paper,
              fontSize: { xs: "13px", md: "14px" },
              "& fieldset": {
                borderColor: errors.description
                  ? theme.palette.error.main
                  : theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: errors.description
                  ? theme.palette.error.main
                  : theme.palette.neutral?.[300] || theme.palette.divider,
              },
              "&.Mui-focused fieldset": {
                borderColor: errors.description
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                borderWidth: "1px",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color:
                theme.palette.neutral?.[450] || theme.palette.text.disabled,
              opacity: 1,
            },
          }}
        />
        {errors.description && (
          <Typography sx={errorTextSx}>{errors.description}</Typography>
        )}
      </Box>
    </Box>
  );
}
