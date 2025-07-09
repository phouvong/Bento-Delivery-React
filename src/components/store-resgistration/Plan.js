import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  alpha,
  Button,
  List,
  ListItem,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { Box } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const PlanItemContainer = styled(Box)(({ theme, isActive, activeItem }) => ({
  "--border-clr": isActive
    ? theme.palette.neutral[400]
    : theme.palette.neutral[300],
  "--success": isActive ? "#ffffff" : "#039d55",
  "--primary-clr": isActive ? "#f99c4d" : "#00868f",
  backgroundColor: isActive
    ? theme.palette.primary.main
    : theme.palette.neutral[100],
  border: "0.72px solid #f4f4f4",
  boxShadow: activeItem && "0px 20px 40px 0px #0000001A",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.9),
    "--border-clr": theme.palette.neutral[300],
    "--success": "#ffffff",
  },
  height: "423px",
}));

const InnerDiv = styled(Box)(({ theme, isActive }) => ({
  padding: "39px 16px 30px",
  borderRadius: "inherit",
  position: "relative",
  color: isActive ? theme.palette.neutral[100] : "#00868f",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-100px",
    right: "-100px",
    background: "rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    width: isActive ? "260px" : "214px",
    height: isActive ? "260px" : "214px",
    borderRadius: "50%",
  },
}));

const PlanItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: "00px",
  color: theme.palette.neutral[1000],
}));

const PlanItemPrice = styled(Typography)(({ theme }) => ({
  fontSize: "40px",
  fontWeight: 600,
  marginBottom: "5px",
  color: theme.palette.neutral[1000],
}));

const PlanItemDayCount = styled(Box)(({ theme }) => ({
  display: "inline-block",
  paddingInline: "24px",
  borderBottom: `1px solid var(--border-clr)`,
  fontSize: "14px",
  paddingBottom: "6px",
  color: theme.palette.neutral[1000],
}));

const PlanItemInfoList = styled(List)(({ theme }) => ({
  padding: 0,
  marginTop: "16px",
  height: "160px",
  overflowY: "auto",
  marginBottom: "30px",
  "&::-webkit-scrollbar": {
    width: "0", // Adjust the width here
    display: "none",
  },
}));

const PlanItemInfoListItem = styled(ListItem)(({ theme }) => ({
  padding: "6px 10px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderBottom: `1px solid var(--border-clr)`,
  "&:last-child": {
    borderBottom: "none",
  },
  color: theme.palette.neutral[1000],
  fontSize: "12px",
}));

const Plan = ({ setSelectedPackage, selectedPackage, item }) => {
  const theme = useTheme();
  return (
    <PlanItemContainer
      sx={{
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => setSelectedPackage(item.id)}
      className="plan-item"
      activeItem={selectedPackage === item.id}
    >
      {selectedPackage === item?.id && (
        <CheckCircleIcon
          sx={{
            color: theme.palette.primary.main,
            fontSize: "34px",
            position: "absolute",
            top: "6px",
            right: "8px",
          }}
        />
      )}
      <InnerDiv>
        <Box textAlign="center">
          <PlanItemTitle>{item?.package_name}</PlanItemTitle>
          <PlanItemPrice>{getAmountWithSign(item?.price)}</PlanItemPrice>
          <PlanItemDayCount>{item?.validity} Days</PlanItemDayCount>
        </Box>
        <PlanItemInfoList>
          <PlanItemInfoListItem>
            <CheckCircleIcon
              sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
            />
            <span>
              {t("Max order")} ({item?.max_order})
            </span>
          </PlanItemInfoListItem>
          <PlanItemInfoListItem>
            <CheckCircleIcon
              sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
            />
            <span>
              {" "}
              {t("Max product")} ({item?.max_product})
            </span>
          </PlanItemInfoListItem>
          {item?.pos === 1 && (
            <PlanItemInfoListItem>
              <CheckCircleIcon
                sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
              />
              <span>{t("Pos")}</span>
            </PlanItemInfoListItem>
          )}
          {item?.mobile_app === 1 && (
            <PlanItemInfoListItem>
              <CheckCircleIcon
                sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
              />
              <span>{t("Mobile app")}</span>
            </PlanItemInfoListItem>
          )}
          {item?.chat === 1 && (
            <PlanItemInfoListItem>
              <CheckCircleIcon
                sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
              />
              <span>{t("Chat")}</span>
            </PlanItemInfoListItem>
          )}
          {item?.review === 1 && (
            <PlanItemInfoListItem>
              <CheckCircleIcon
                sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
              />
              <span>{t("Review")}</span>
            </PlanItemInfoListItem>
          )}
          {item?.self_delivery === 1 && (
            <PlanItemInfoListItem>
              <CheckCircleIcon
                sx={{ color: theme.palette.neutral[100], fontSize: "20px" }}
              />
              <span>{t("Self delivery")}</span>
            </PlanItemInfoListItem>
          )}
        </PlanItemInfoList>
      </InnerDiv>
    </PlanItemContainer>
  );
};

export default Plan;
