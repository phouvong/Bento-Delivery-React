import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import useGetServiceRequestList from "../../service-api-manage/hooks/react-query/service-request/useGetServiceRequestList";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CreateEditServiceRequestModal from "./CreateEditServiceRequestModal";
import InitialView from "./InitialView";
import ListView from "./ListView";
import ListViewSkeleton from "./ListViewSkeleton";

const ServiceRequest = ({ configData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: apiData, isLoading } = useGetServiceRequestList({
    offset: 1,
    type: "all",
  });

  const hasData = (apiData?.custom_services?.length ?? 0) > 0;

  return (
    <Box sx={{ p: { xs: "6px", md: "14px" } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
        mb="16px"
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {t("My Requested Services")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCreateModalOpen(true)}
          sx={{
            backgroundColor: "primary.main",
            color: "whiteContainer.main",
            borderRadius: "8px",
            px: { xs: "12px", md: "20px" },
            py: { xs: "6px", md: "10px" },
            fontWeight: 700,
            fontSize: { xs: "12px", md: "16px" },
            textTransform: "none",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {t("Make Request")}
        </Button>
      </Stack>

      {isLoading ? (
        <ListViewSkeleton />
      ) : hasData ? (
        <ListView configData={configData} />
      ) : (
        <InitialView />
      )}

      <CreateEditServiceRequestModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </Box>
  );
};

export default ServiceRequest;
