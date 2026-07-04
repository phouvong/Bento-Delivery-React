import React from "react";
import { FoodDetailModalStyle } from "../food-details/foodDetail-modal/foodDetailModal.style";
import {
  Box,
  Drawer,
  Grid,
  Modal,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductDetailsSection from "../product-details/product-details-section/ProductDetailsSection";
import { Scrollbar } from "../srollbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";

const ModuleModalShimmer = () => (
  <Box sx={{ p: { xs: 1.5, md: 2 }, width: "100%" }}>
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12} sm={5} md={5}>
        <Stack spacing={1.25}>
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              borderRadius: "12px",
              aspectRatio: { md: "1 / 1" },
              height: { xs: 290, md: "auto" },
            }}
          />
          <Stack direction="row" spacing={0.75}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                width={48}
                height={48}
                sx={{ borderRadius: "10px", flexShrink: 0 }}
              />
            ))}
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={7} md={7}>
        <Stack spacing={1.25}>
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="text" width="80%" height={28} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={18} height={18} />
            <Skeleton variant="text" width={90} height={20} />
          </Stack>
          <Skeleton variant="text" width="35%" height={18} />
          <Skeleton variant="text" width="55%" height={18} />
          <Stack direction="row" spacing={1.25} alignItems="baseline">
            <Skeleton variant="text" width={90} height={32} />
            <Skeleton variant="text" width={60} height={20} />
          </Stack>
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              borderRadius: "12px",
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Stack spacing={1.25}>
              <Skeleton variant="text" width="25%" height={18} />
              <Stack direction="row" spacing={1}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    width={32}
                    height={32}
                    sx={{ borderRadius: "6px" }}
                  />
                ))}
              </Stack>
              <Skeleton variant="text" width="20%" height={18} />
              <Stack direction="row" spacing={1}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    width={42}
                    height={32}
                    sx={{ borderRadius: "8px" }}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  </Box>
);

const ModuleModal = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    open,
    handleModalClose,
    productDetailsData,
    configData,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    productUpdate,
  } = props;

  const handleSuccess = () => {};
  const params = {
    id: productDetailsData?.id,
  };
  const {
    data,
    isLoading,
    error: itemDetailsError,
    isError: itemDetailsIsError,
  } = useGetItemDetails(params, handleSuccess, productUpdate);
  const { t } = useTranslation();
  // Treat a 404 / 410 from the item-details endpoint as "not found" so the
  // modal can show an empty-state UI instead of a half-broken layout.
  const itemNotFound =
    itemDetailsIsError &&
    (itemDetailsError?.response?.status === 404 ||
      itemDetailsError?.response?.status === 410);

  const closeButton = (
    <IconButton
      onClick={handleModalClose}
      sx={{
        zIndex: 99,
        position: "absolute",
        top: { xs: 10, md: 12 },
        right: { xs: 10, md: 12 },
        width: 32,
        height: 32,
        backgroundColor: theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)",
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
        },
      }}
    >
      <CloseIcon sx={{ fontSize: "18px", fontWeight: 700 }} />
    </IconButton>
  );

  const notFoundContent = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        px: 3,
        py: { xs: 6, md: 8 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.error.main, 0.12),
          color: theme.palette.error.main,
          fontSize: 32,
          lineHeight: 1,
        }}
        aria-hidden
      >
        <i className="fi fi-rr-utensils" style={{ display: "flex" }} />
      </Box>
      <Typography fontSize="18px" fontWeight={700} color="text.primary">
        {t("Item not found")}
      </Typography>
      <Typography fontSize="14px" color="text.secondary" sx={{ maxWidth: 320 }}>
        {t(
          "This item is no longer available. It may have been removed or replaced by the store."
        )}
      </Typography>
    </Stack>
  );

  const body = (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: { xs: "block", md: "flex" },
        flexDirection: { md: "column" },
        overflowY: { xs: "auto", md: "hidden" },
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {isLoading ? (
        <Scrollbar style={{ maxHeight: "100%" }}>
          <ModuleModalShimmer />
        </Scrollbar>
      ) : itemNotFound ? (
        notFoundContent
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
    </Box>
  );

  const stickyTarget = (
    <Box
      id="module-modal-sticky-target"
      sx={{ width: "100%", position: "relative" }}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleModalClose}
        sx={{ zIndex: (t) => t.zIndex.modal + 10 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "85vh",
            maxHeight: "700px",
            minHeight: "60vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Close button hidden on mobile — shown inside the image via ProductImageView */}
        <IconButton
          onClick={handleModalClose}
          sx={{
            display: "none",
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 100,
            width: 32,
            height: 32,
            backgroundColor: theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor:
                theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "18px", fontWeight: 700 }} />
        </IconButton>
        {body}
        {stickyTarget}
      </Drawer>
    );
  }

  return (
    <Modal open={open} onClose={handleModalClose} disableAutoFocus={true}>
      <FoodDetailModalStyle
        sx={{
          bgcolor: "background.paper",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: { md: "600px" },
          boxShadow: "0 24px 56px rgba(17,24,39,0.16)",
        }}
      >
        {closeButton}
        {body}
        {stickyTarget}
      </FoodDetailModalStyle>
    </Modal>
  );
};

ModuleModal.propTypes = {};

export default ModuleModal;
