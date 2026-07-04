import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import CustomImageContainer from "../../CustomImageContainer";
import useGetParcelCategory from "../../../api-manage/hooks/react-query/percel/usePercelCategory";
import ParcelCategoryCard from "../parcel-category/ParcelCategoryCard";
import ParcelCategoryShimmer from "../parcel-category/ParcelCategoryShimmer";

const ParcelInfo = ({ parcelCategories }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(parcelCategories);
  const { data, refetch, isLoading } = useGetParcelCategory();

  useEffect(() => {
    if (open) {
      refetch();
      setTempSelected(parcelCategories);
    }
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleUpdate = () => {
    if (tempSelected) {
      dispatch(setParcelCategories(tempSelected));
      setOpen(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { md: "70%", lg: "60%" },
    maxWidth: "880px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "16px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    outline: "none",
    overflow: "hidden",
  };

  const renderContent = () => (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          borderBottom: `1px solid ${
            theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
          }`,
        }}
      >
        <Stack>
          <Typography
            fontWeight={700}
            fontSize={{ xs: "16px", md: "18px" }}
            color="text.primary"
          >
            {t("Select what you wish to send")}
          </Typography>
          <Typography
            fontSize={{ xs: "12px", md: "13px" }}
            color={theme.palette.neutral?.[500] || "text.secondary"}
          >
            {t("Pick the parcel type that best fits your item")}
          </Typography>
        </Stack>
        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)",
            borderRadius: "50%",
            padding: "6px",
            "&:hover": {
              backgroundColor:
                theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Stack>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {!isLoading ? (
            data?.map((item) => (
              <Grid item xs={6} sm={6} md={4} key={item.id}>
                <ParcelCategoryCard
                  data={item}
                  selected={tempSelected?.id === item.id}
                  onClick={(d) => setTempSelected(d)}
                />
              </Grid>
            ))
          ) : (
            <CustomStackFullWidth sx={{ marginTop: "24px" }}>
              <ParcelCategoryShimmer />
            </CustomStackFullWidth>
          )}
        </Grid>
      </Box>

      <Divider />
      <Stack
        direction="row"
        justifyContent={{ xs: "stretch", md: "flex-end" }}
        gap={1.5}
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CustomButtonPrimary
          sx={{
            flex: { xs: 1, md: "0 0 auto" },
            maxWidth: { xs: "100%", md: "140px" },
            minWidth: { md: "120px" },
            height: "44px",
            borderRadius: "10px",
            bgcolor: theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)",
            color: theme.palette.text.primary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
              boxShadow: "none",
            },
          }}
          onClick={handleClose}
        >
          {t("Cancel")}
        </CustomButtonPrimary>
        <CustomButtonPrimary
          sx={{
            flex: { xs: 1, md: "0 0 auto" },
            maxWidth: { xs: "100%", md: "140px" },
            minWidth: { md: "120px" },
            height: "44px",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
          onClick={handleUpdate}
        >
          {t("Update")}
        </CustomButtonPrimary>
      </Stack>
    </>
  );

  return (
    <>
      <Card
        sx={{
          padding: { xs: "12px 14px", md: "14px 20px" },
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${
            theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
          }`,
          borderRadius: "12px",
          boxShadow: "none",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
            <Box
              sx={{
                width: { xs: 36, md: 44 },
                height: { xs: 36, md: 44 },
                flexShrink: 0,
              }}
            >
              <CustomImageContainer
                src={parcelCategories?.image_full_url}
                height="100%"
                width="100%"
                objectfit="contain"
              />
            </Box>
            <Stack minWidth={0}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "15px", md: "16px" }}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t("Parcel Type")}
                {parcelCategories?.name ? ` - ${parcelCategories.name}` : ""}
              </Typography>
              <Typography
                fontSize={{ xs: "11px", md: "13px" }}
                color={theme.palette.neutral?.[400] || "text.secondary"}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t("Choose which type of item you want to send")}
              </Typography>
            </Stack>
          </Stack>

          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              color: theme.palette.info?.main || theme.palette.primary.main,
              border: `1px solid ${
                theme.palette.neutral?.[200] || "rgba(0,0,0,0.1)"
              }`,
              borderRadius: "10px",
              width: 36,
              height: 36,
              flexShrink: 0,
            }}
          >
            <EditIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Stack>
      </Card>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: "999px",
              backgroundColor:
                theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
              mx: "auto",
              mt: 1,
              mb: 0.5,
              flexShrink: 0,
            }}
          />
          {renderContent()}
        </Drawer>
      ) : (
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>{renderContent()}</Box>
        </Modal>
      )}
    </>
  );
};

export default ParcelInfo;
