import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
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
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import CustomImageContainer from "../../CustomImageContainer";
import useGetParcelCategory from "../../../api-manage/hooks/react-query/percel/usePercelCategory";
import ParcelCategoryCard from "../parcel-category/ParcelCategoryCard";
import ParcelCategoryShimmer from "../parcel-category/ParcelCategoryShimmer";
import { getParcelInformationSummary } from "helper-functions/parcelInformationLabel";

const ParcelInfo = ({
  parcelCategories,
  showProSavingsBanner,
  proSavingsAmount,
  proSavingsMessage,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const { data, refetch, isLoading } = useGetParcelCategory();
  // Chosen in the parcel information modal before this screen. Summarised under
  // the type so the customer can see what they picked without reopening it.
  const { parcelWeight, parcelDimension } = useSelector(
    (state) => state.parcelCategories
  );
  const informationSummary = getParcelInformationSummary(
    parcelWeight,
    parcelDimension
  );

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleSelect = (selected) => {
    dispatch(setParcelCategories(selected));
    toast.success(
      `${t("Parcel type set to")} ${selected?.name ?? ""}`.trim(),
    );
    setOpen(false);
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
                  selected={parcelCategories?.id === item.id}
                  onClick={handleSelect}
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
    </>
  );

  return (
    <>
      <Card
        sx={{
          padding: { xs: "16px", md: "16px 24px" },
          backgroundColor: theme.palette.background.paper,
          borderRadius: "16px",
          boxShadow: "none",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 1.5, md: 2.5 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: 1.5, md: 2.5 }}
            minWidth={0}
          >
            <Box
              sx={{
                width: 43,
                height: 43,
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
                fontSize={{ xs: "18px", md: "24px" }}
                letterSpacing="-0.6px"
                color="neutral.1050"
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
                fontSize="14px"
                letterSpacing="-0.42px"
                color={theme.palette.neutral?.[500] || "text.secondary"}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {informationSummary ||
                  t("Choose which type of item you want to send")}
              </Typography>
            </Stack>
          </Stack>

          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: theme.palette.background.secondary,
              borderRadius: "12px",
              width: 40,
              height: 40,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: theme.palette.background.secondary,
              },
            }}
          >
            <i
              className="fi fi-rr-pencil"
              style={{
                fontSize: "16px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.info?.main || theme.palette.primary.main,
              }}
            />
          </IconButton>
        </Stack>

        {showProSavingsBanner && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <ProSavingsBanner
              amount={proSavingsAmount}
              message={proSavingsMessage}
            />
          </Box>
        )}
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
