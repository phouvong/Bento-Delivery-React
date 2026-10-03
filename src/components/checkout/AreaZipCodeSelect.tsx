import {
  FormHelperText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  coverageRequiresSelection,
  CoverageListContent,
} from "api-manage/hooks/react-query/checkout/useGetCoverageList";

/**
 * Area / ZIP Code picker for the delivery address section.
 *
 * Only rendered where the zone actually prices by area or zip code — the
 * coverage endpoint's `type` decides, so distance-wise and fixed zones never
 * see the field, and neither does take-away (TC_67).
 *
 * The chosen id feeds `checkout-summary` as `area_id` / `zip_code_id`, which is
 * what moves the quoted delivery fee: on the dev zone the same cart quotes 10
 * with no selection, 40 for zip 1 and 50 for zip 2.
 */

/**
 * Everything comes from the `useAreaZipSelection` instance that also gates the
 * confirm button — the field must never resolve its own coverage list, or the
 * two can end up on different zones and disagree about whether a selection is
 * required.
 */
interface AreaZipCodeSelectProps {
  areaZip: {
    coverage?: CoverageListContent;
    isLoading?: boolean;
    hidden?: boolean;
    value?: number | null;
    setValue: (id: number | null) => void;
    error?: boolean;
  };
}

const AreaZipCodeSelect: React.FC<AreaZipCodeSelectProps> = ({ areaZip }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    coverage,
    isLoading,
    hidden,
    value,
    setValue: onChange,
    error,
  } = areaZip || ({} as AreaZipCodeSelectProps["areaZip"]);

  const options = coverage?.coverage ?? [];

  // TC_93 — self-delivery stores price their own fee, and take-away / dine-in
  // carry no delivery charge, so neither is ever asked for an area or zip.
  if (hidden) return null;
  if (isLoading) {
    return (
      <Stack gap="6px" width="100%">
        <Skeleton variant="text" width={120} height={18} />
        <Skeleton variant="rounded" height={48} />
      </Stack>
    );
  }
  // TC_67 — the field belongs to the area-wise / zip-code-wise rules only. A
  // distance-wise or fixed zone answers `type: null` and is asked nothing.
  if (!coverageRequiresSelection(coverage)) return null;

  const isArea = coverage?.type === "area_wise";
  const label = isArea ? t("Area") : t("Area/ZIP Code");
  const placeholder = isArea
    ? t("Select area")
    : t("Select area/zip code");

  return (
    <Stack gap="8px" width="100%">
      <Typography
        fontSize="14px"
        fontWeight="500"
        color={theme.palette.neutral[1000]}
      >
        {label}
        <Typography component="span" color={theme.palette.error.main} ml="2px">
          *
        </Typography>
      </Typography>
      <Select
        value={value ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "" ? null : Number(next));
        }}
        displayEmpty
        error={error}
        fullWidth
        sx={{
          height: "48px",
          borderRadius: "10px",
          backgroundColor: theme.palette.background.paper,
          "& .MuiSelect-select": { display: "flex", alignItems: "center" },
        }}
        renderValue={(selected) => {
          if (selected === null || selected === undefined || `${selected}` === "") {
            return (
              <Typography color={theme.palette.neutral[400]} fontSize="15px">
                {placeholder}
              </Typography>
            );
          }
          const match = options.find(
            (item) => item?.id === Number(selected)
          );
          return (
            <Typography fontSize="15px" color={theme.palette.neutral[1000]}>
              {match?.name ?? placeholder}
            </Typography>
          );
        }}
      >
        {options.map((item) => (
          <MenuItem key={item?.id} value={item?.id}>
            {item?.name}
          </MenuItem>
        ))}
      </Select>
      {error ? (
        <FormHelperText error sx={{ ml: 0 }}>
          {isArea
            ? t("Please select an area to continue")
            : t("Please select an area/zip code to continue")}
        </FormHelperText>
      ) : null}
    </Stack>
  );
};

export default AreaZipCodeSelect;
