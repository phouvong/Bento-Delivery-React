import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import InitialView from "./InitialView";
import ListView from "./ListView";
import useGetMyCustomServiceList from "../../service-api-manage/hooks/react-query/custom-service/useGetMyCustomServiceList";
import { useTranslation } from "react-i18next";

const CustomService = ({ configData }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const { data: apiData, isLoading } = useGetMyCustomServiceList({
    offset: 1,
    type: "all",
  });

  const hasData = (apiData?.custom_services?.length ?? 0) > 0;
  // Render ListView (which shows its own shimmer) while the initial fetch is
  // in flight so InitialView doesn't flash first for users who actually have
  // requests.
  const showList = isLoading || hasData;

  return (
    <Box sx={{ p: { xs: "6px", md: "14px" } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb="16px"
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {t("Custom Service List")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/service/custom-service/create")}
          sx={{
            backgroundColor: "primary.main",
            color: "whiteContainer.main",
            borderRadius: "8px",
            px: "20px",
            py: "10px",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {t("Create New")}
        </Button>
      </Stack>

      {showList ? <ListView configData={configData} /> : <InitialView />}
    </Box>
  );
};

export default CustomService;
