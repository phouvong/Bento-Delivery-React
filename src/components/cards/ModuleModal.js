import React from "react";
import { FoodDetailModalStyle } from "../food-details/foodDetail-modal/foodDetailModal.style";
import { Grid, Modal, Skeleton } from "@mui/material";
import ProductDetailsSection from "../product-details/product-details-section/ProductDetailsSection";
import { Scrollbar } from "../srollbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";

const ModuleModalShimmer = () => (
  <Grid container spacing={2} sx={{ p: "1.5rem" }}>
    <Grid item xs={12} sm={5}>
      <Skeleton variant="rectangular" width="100%" height={340} sx={{ borderRadius: "10px" }} />
    </Grid>
    <Grid item xs={12} sm={7}>
      <Stack spacing={1.5}>
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="40%" height={22} />
        <Skeleton variant="text" width="55%" height={22} />
        <Skeleton variant="rectangular" width="35%" height={36} sx={{ borderRadius: "6px", mt: 1 }} />
        <Skeleton variant="text" width="30%" height={22} sx={{ mt: 1 }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: "8px" }} />
          <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: "8px" }} />
        </Stack>
        
      </Stack>
    </Grid>
  </Grid>
);

const ModuleModal = (props) => {
  const theme = useTheme();
  const {
    open,
    handleModalClose,
    productDetailsData,
    configData,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    productUpdate
  } = props;

  const handleSuccess = (resData) => {
  }
  const params = {
    id: productDetailsData?.id
  }
  const { data, isLoading } = useGetItemDetails(params, handleSuccess, productUpdate)

  return (

    <>
      <Modal open={open} onClose={handleModalClose} disableAutoFocus={true}>
        <FoodDetailModalStyle sx={{ bgcolor: "background.paper" }}>
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "relative" }}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{
                zIndex: "99",
                position: "absolute",
                top: -20,
                right: "-2.5%",
                backgroundColor: (theme) => theme.palette.neutral[100],
                borderRadius: "50%",
                [theme.breakpoints.down("md")]: {
                  top: 10,
                  right: 5,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "16px", fontWeight: "700" }} />
            </IconButton>
          </CustomStackFullWidth>
          <Scrollbar style={{ maxHeight: "calc(100vh - 160px)" }}>
            {isLoading ? (
              <ModuleModalShimmer />
            ) : (
              <ProductDetailsSection
                productDetailsData={productUpdate ? productDetailsData : data}
                configData={configData}
                modalmanage="true"
                handleModalClose={handleModalClose}
                addToWishlistHandler={addToWishlistHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
                isWishlisted={isWishlisted}
              />
            )}
          </Scrollbar>
        </FoodDetailModalStyle>
      </Modal>
    </>
  );
};

ModuleModal.propTypes = {};

export default ModuleModal;
