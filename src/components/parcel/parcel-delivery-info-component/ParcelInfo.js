import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Card, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import CustomImageContainer from "../../CustomImageContainer";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import { CustomButtonStack } from "components/checkout/CheckOut.style";
import { useState, useEffect } from "react";
import { Modal, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useGetParcelCategory from "../../../api-manage/hooks/react-query/percel/usePercelCategory";
import ParcelCategoryCard from "../parcel-category/ParcelCategoryCard";
import ParcelCategoryShimmer from "../parcel-category/ParcelCategoryShimmer";
import { useDispatch, useSelector } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";

const ParcelInfo = ({ parcelCategories, setReceiverLocation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(parcelCategories);
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const { data, refetch, isFetched, isLoading } = useGetParcelCategory();
  console.log("parcelCategories", parcelInfo);
  useEffect(() => {
    if (open) {
      refetch();
      setTempSelected(parcelCategories);
    }
  }, [open]);

  const handleUpdate = () => {
    if (tempSelected) {
      dispatch(setParcelCategories(tempSelected));
      setReceiverLocation(parcelInfo?.receiverLocations);
      setOpen(false);
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: { xs: "20px", md: "50%" },
    left: '50%',
    transform: { xs: "translateX(-50%) translateY(0)", md: "translateX(-50%) translateY(-50%)" },
    width: { xs: "95%", md: "70%" },
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    maxHeight: { xs: "80vh", md: "90vh" },
    overflowY: "auto",
    outline: "none"
  };

  return (
    <CustomStackFullWidth height="100%">
      <Card sx={{ padding: "1.2rem", backgroundColor: theme.palette.background.custom, border: `1px solid rgba(0, 0, 0, 0.05)`, height: "100%" }}>
        <CustomStackFullWidth gap={2} height="100%">
          <Stack align="center">
            <Typography fontWeight={500} fontSize="16px">
              {t("Parcel Info")}
            </Typography>
          </Stack>

          <Stack
            width="100%"
            // justifyContent="center"
            alignItems="center"
            gap={2}
            paddingBlock={{ xs: "20px", sm: "40px", md: "50px" }}
            flexGrow={1}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={.5}
              position="absolute"
              right="10px"
              top="10px"
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                color: theme.palette.info.main,
                fontWeight: "500",
              }}>
              <EditIcon fontSize="12px" />
              {t("Edit")}
            </Stack>
            <CustomImageContainer
              src={parcelCategories?.image_full_url}
              height="100px"
              width="100px"
              objectfit="contain"
            />

            <Stack width="100%" justifyContent="center" alignItems="center">
              <Typography fontSize="16px" fontWeight="700">
                {parcelCategories?.name}
              </Typography>
              <Typography>{parcelCategories?.description}</Typography>
            </Stack>
          </Stack>

          <CustomButtonStack width="100%">
            <CustomButtonPrimary fullwidth="true" type="submit">
              {t("Proceed to Checkout")}
            </CustomButtonPrimary>
          </CustomButtonStack>
        </CustomStackFullWidth>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton onClick={() => setOpen(false)}
            sx={{
              backgroundColor: theme.palette.neutral[300],
              borderRadius: "50%",
              padding: ".315rem",
              position: "absolute",
              top: "10px",
              right: "10px",
              svg: {
                fontSize: "1.2rem !important",
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold" mb={3}>
            {t("Select what you wish to send")}
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {!isLoading ? (
              <>
                {data && data?.map((item) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <ParcelCategoryCard
                        data={item}
                        selected={tempSelected?.id === item.id}
                        onClick={(data) => setTempSelected(data)}
                      />
                    </Grid>
                  );
                })}
              </>
            ) : (
              <CustomStackFullWidth sx={{ marginTop: "24px" }}>
                <ParcelCategoryShimmer />
              </CustomStackFullWidth>
            )}
          </Grid>
          <Stack direction="row" justifyContent="end" gap={2} mt={4}>
            <CustomButtonPrimary
              sx={{ width: "100px", bgcolor: theme.palette.neutral[300], color: theme.palette.text.primary, "&:hover": { bgcolor: theme.palette.neutral[400] } }}
              onClick={() => setOpen(false)}
            >
              {t("Cancel")}
            </CustomButtonPrimary>
            <CustomButtonPrimary
              sx={{ width: "100px" }}
              onClick={handleUpdate}
            >
              {t("Update")}
            </CustomButtonPrimary>
          </Stack>
        </Box>
      </Modal>
    </CustomStackFullWidth>
  );
};

export default ParcelInfo;
