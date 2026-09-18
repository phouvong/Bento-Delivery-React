import { alpha, Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { getAmountWithSign, getDiscountedAmount } from "helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import IncrementDecrementManager from "./IncrementDecrementManager";
import ServiceInformationBottomSection from "./ServiceInformationBottomSection";
import ServiceVariation from "./ServiceVariation";
import TotalAmount from "./TotalAmount";

const StickyCartBar = ({
  visible,
  modalData,
  variations,
  selectedVariation,
  decrementQuantity,
  incrementQuantity,
  addToCard,
  handleUpdateToCart,
  onSelectVariation,
  productUpdate,
  isLoading,
  updateIsLoading,
  selectedOptions,
  dispatchRedux,
  addToFavorite,
  wishListCount,
  setWishListCount,
  handleModalClose,
  addToCartMutate,
  cartLoading,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isShown = isMobile ? true : visible;

  const variationOrQty =
    variations?.length > 0 ? (
      <ServiceVariation
        variations={variations}
        selectedVariation={selectedVariation?.[0]}
        onSelectVariation={onSelectVariation}
        compact
        cartLoading={cartLoading}
      />
    ) : (
      <IncrementDecrementManager
        decrementQuantity={decrementQuantity}
        incrementQuantity={incrementQuantity}
        modalData={modalData}
        productUpdate={productUpdate}
        counterOnly
      />
    );

  const renderCartButton = (directionSX) => (
    <ServiceInformationBottomSection
      addToCard={addToCard}
      handleUpdateToCart={handleUpdateToCart}
      productDetailsData={modalData}
      selectedOptions={selectedOptions}
      dispatchRedux={dispatchRedux}
      addToFavorite={addToFavorite}
      wishListCount={wishListCount}
      setWishListCount={setWishListCount}
      cartItemQuantity={modalData?.quantity}
      t={t}
      handleModalClose={handleModalClose}
      isLoading={isLoading}
      addToCartMutate={addToCartMutate}
      updateIsLoading={updateIsLoading}
      directionSX={directionSX}
    />
  );

  const cartButton = renderCartButton();

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 -4px 16px ${alpha(theme.palette.text.primary, 0.06)}`,
        py: { xs: 1.25, md: 1 },
        px: { xs: 1.5, md: 2 },
        transform: isShown ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.25s ease",
        pointerEvents: isShown ? "auto" : "none",
        width: "100%",
      }}
    >
      {isMobile ? (
        <Stack spacing={1} sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}>
          {variations?.length > 0 ? (
            <>
              {variationOrQty}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary, fontWeight: 500 }}>
                  {t("Total")}
                </Typography>
                <TotalAmount
                  totalPrice={modalData?.totalPrice}
                  discount={modalData?.discount}
                  discount_type={modalData?.discount_type}
                  store_discount={modalData?.store_discount}
                  quantity={modalData?.quantity}
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {cartButton}
              </Stack>
            </>
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="column" alignItems="start" spacing={1} width="100%">
                <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary, fontWeight: 500 }}>
                  {t("Total")}
                </Typography>
                <TotalAmount
                  totalPrice={modalData?.totalPrice}
                  discount={modalData?.discount}
                  discount_type={modalData?.discount_type}
                  store_discount={modalData?.store_discount}
                  quantity={modalData?.quantity}
                />
                {variationOrQty}
              </Stack>
              {renderCartButton("column")}
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" gap={2} sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}>
          <Stack spacing={0.25} flex={1} minWidth={0}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "15px",
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {modalData?.name}
            </Typography>
          </Stack>
          <Typography sx={{ fontWeight: 700, fontSize: "20px", color: theme.palette.text.primary, flexShrink: 0 }}>
            <TotalAmount
              totalPrice={modalData?.totalPrice}
              discount={modalData?.discount}
              discount_type={modalData?.discount_type}
              store_discount={modalData?.store_discount}
              quantity={modalData?.quantity}
            />
          </Typography>
          <Box sx={{ flexShrink: 0}}>
            {variationOrQty}
          </Box>
          <Box sx={{ flexShrink: 0, width: 260 }}>
            {cartButton}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default StickyCartBar;
