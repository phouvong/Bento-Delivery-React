import { alpha, Grid, useMediaQuery, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useState } from "react";
import CustomImageContainer from "components/CustomImageContainer";
import ServiceImageView from "./ServiceImageView";
import ServiceInformation from "./ServiceInformation";
import { getLowestVariation } from "./helperFunction";

const DiscountBadge = ({ children }) => (
  <Box
    sx={{
      position: "absolute",
      top: 12,
      left: 12,
      zIndex: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      px: 1.25,
      py: 0.5,
      borderRadius: "999px",
      backgroundColor: (theme) => theme.palette.error.main,
      color: (theme) => theme.palette.whiteContainer.main,
      fontWeight: 700,
      fontSize: { xs: "12px", md: "13px" },
      lineHeight: 1.1,
      letterSpacing: "-0.2px",
      boxShadow: (theme) => `0 2px 6px ${alpha(theme.palette.error.main, 0.25)}`,
    }}
  >
    {children}
  </Box>
);

export const handleDiscountChip = (product) => {
  // With variations, the badge reflects the cheapest variation's own
  // discount, not the base service discount.
  const lowestVariation = getLowestVariation(product);
  const discount = lowestVariation ? lowestVariation.discount : product?.discount;
  const discountType = lowestVariation
    ? lowestVariation.discount_type
    : product?.discount_type;
  if (!discount) return null;
  const label =
    discountType === "percent"
      ? `-${discount}%`
      : `-${getAmountWithSign(discount)}`;
  return <DiscountBadge>{label}</DiscountBadge>;
};
const ServiceDetailsSection = ({
  serviceDetailsData,
  configData,
  handleModalClose,
  serviceUpdate,
  addToWishlistHandler: addToWishlistHandlerProp,
  removeFromWishlistHandler: removeFromWishlistHandlerProp,
  isWishlisted: isWishlistedProp,
}) => {
  const [isWishlistedInternal, setIsWishlistedInternal] = useState(false);

  const isWishlisted = isWishlistedProp ?? isWishlistedInternal;

  const addToWishlistHandler =
    addToWishlistHandlerProp ??
    ((e) => {
      e.stopPropagation();
      setIsWishlistedInternal(true);
    });

  const removeFromWishlistHandler =
    removeFromWishlistHandlerProp ??
    ((e) => {
      e.stopPropagation();
      setIsWishlistedInternal(false);
    });
  const serviceImage = serviceDetailsData?.thumbnail_full_url;
  const serviceThumbImage = [
    serviceImage,
    ...(serviceDetailsData?.additional_images_full_url || []),
  ];
  const videoMeta = serviceDetailsData?.video_preview_available
    ? {
        previewType: serviceDetailsData?.video_preview_type,
        thumbnailUrl: serviceDetailsData?.video_thumbnail_url,
        modalType: serviceDetailsData?.video_preview_modal_type,
        modalUrl: serviceDetailsData?.video_preview_modal_url,
        inlineUrl: serviceDetailsData?.video_preview_url,
      }
    : null;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const handleModal = () => {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: { xs: "12px", md: "16px" },
          p: { xs: 0.5, sm: 1, md: 1.5 },
        }}
      >
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} sm={5} md={5} textAlign="center">
            <Box sx={{ position: "relative" }}>
              {handleDiscountChip(serviceDetailsData)}
              {serviceUpdate ? (
                <CustomImageContainer
                  width={isSmall ? "200px" : "100%"}
                  height={isSmall ? "200px" : "250px"}
                  src={serviceImage}
                  objectfit="contained"
                  aspectRatio="1/1"
                />
              ) : (
                <ServiceImageView
                  productImage={serviceImage}
                  productThumbImage={serviceThumbImage}
                  addToWishlistHandler={addToWishlistHandler}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  isWishlisted={isWishlisted}
                  productDetailsData={serviceDetailsData}
                  videoMeta={videoMeta}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={7} md={7}>
            <ServiceInformation
              productDetailsData={serviceDetailsData}
              configData={configData}
              productUpdate={serviceUpdate}
              handleModalClose={handleModalClose}
              isSmall={isSmall}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };
  return (
    <CustomStackFullWidth>
      {handleModal()}
    </CustomStackFullWidth>
  );
};

export default ServiceDetailsSection;
