import { Box } from "@mui/material";
import BadgeWithTooltip from "components/common/BadgeWithTooltip";
import StoreVerifiedSVG from "./assets/StoreVerifiedSVG";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const VerifiedStoreBadge = ({
  verified,
  fontSize = "16px",
  sx,
  containerSx,
}) => {
  const { t } = useTranslation();
  if (!verified) return null;

  const size = parseInt(fontSize, 10) || 16;

  const moduleType = getCurrentModuleType();
  const verifiedLabel =
    moduleType === ModuleTypes.FOOD
      ? t("Verified Restaurant")
      : moduleType === ModuleTypes.RENTAL
      ? t("Verified Provider")
      : t("Verified Store");

  return (
    <BadgeWithTooltip
      title={verifiedLabel}
      placement="top"
      containerSx={containerSx}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginInlineStart: "4px",
          lineHeight: 1,
          verticalAlign: "middle",
          cursor: "default",
          ...sx,
        }}
      >
        <StoreVerifiedSVG size={size} />
      </Box>
    </BadgeWithTooltip>
  );
};

export default VerifiedStoreBadge;
