import { Grid, useMediaQuery, useTheme } from "@mui/material";
//import { Box } from "@mui/system";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
//import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomImageContainer from "../../CustomImageContainer";
import { OfferTypography } from "../../food-details/food-card/FoodCard.style";
import OrganicTag from "../../organic-tag";
import ProductImageView from "./ProductImageView";
import ProductInformation from "./ProductInformation";
import { getImageUrl } from "utils/CustomFunctions";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";

export const handleDiscountChip = (product, t) => {
  if (product?.discount !== 0) {
    if (product?.discount_type === "percent") {
      return (
        <OfferTypography>
          {product?.discount}% {t("OFF")}
        </OfferTypography>
      );
    } else {
      return (
        <OfferTypography>
          {getAmountWithSign(product?.discount)} {t("OFF")}
        </OfferTypography>
      );
    }
  }
};
const ProductDetailsSection = ({
  productDetailsData,
  configData,
  handleModalClose,
  productUpdate,
  modalmanage,
  addToWishlistHandler: addToWishlistHandlerProp,
  removeFromWishlistHandler: removeFromWishlistHandlerProp,
  isWishlisted: isWishlistedProp,
}) => {
  const { t } = useTranslation();
  const reduxDispatch = useDispatch();
  const [isWishlistedInternal, setIsWishlistedInternal] = useState(false);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: deleteFavoriteMutation } = useWishListDelete();

  const isWishlisted = isWishlistedProp ?? isWishlistedInternal;

  const addToWishlistHandler =
    addToWishlistHandlerProp ??
    ((e) => {
      e.stopPropagation();
      let token = undefined;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      if (token) {
        addFavoriteMutation(productDetailsData?.id, {
          onSuccess: (response) => {
            if (response) {
              reduxDispatch(addWishList(productDetailsData));
              setIsWishlistedInternal(true);
              toast.success(response?.message);
            }
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message);
          },
        });
      } else {
        toast.error(t(not_logged_in_message));
      }
    });

  const removeFromWishlistHandler =
    removeFromWishlistHandlerProp ??
    ((e) => {
      e.stopPropagation();
      deleteFavoriteMutation(productDetailsData?.id, {
        onSuccess: (res) => {
          reduxDispatch(removeWishListItem(productDetailsData?.id));
          setIsWishlistedInternal(false);
          toast.success(res?.message, { id: "wishlist" });
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message);
        },
      });
    });
  const productImage = productDetailsData?.image_full_url;
  const productThumbImage = [
    productImage,
    ...(productDetailsData?.images_full_url || []),
  ];
  const videoMeta = productDetailsData?.video_preview_available
    ? {
        previewType: productDetailsData?.video_preview_type,
        thumbnailUrl: productDetailsData?.video_thumbnail_url,
        modalType: productDetailsData?.video_preview_modal_type,
        modalUrl: productDetailsData?.video_preview_modal_url,
        inlineUrl: productDetailsData?.video_preview_url,
      }
    : null;
  const imageBaseUrl = productDetailsData?.isCampaignItem
    ? "campaign_image_url"
    : "item_image_url";
  const imageSrcUrl = productImage;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const handleModal = () => {
    return (
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} sm={5} md={5} textAlign="center">
          <Box sx={{ position: "relative" }}>
            {handleDiscountChip(productDetailsData, t)}
            <OrganicTag
              status={productDetailsData?.organic}
              top={isSmall ? 40 : 50}
              left={0}
            />
          </Box>
          {productDetailsData?.module_type !== "food" && productUpdate ? (
            <CustomImageContainer
              width={isSmall ? "200px" : "100%"}
              height={isSmall ? "200px" : "250px"}
              src={imageSrcUrl}
              objectfit="contained"
              aspectRatio="1/1"
            />
          ) : (
            <ProductImageView
              productImage={imageSrcUrl}
              productThumbImage={productThumbImage}
              imageBaseUrl={imageBaseUrl}
              configData={configData}
              addToWishlistHandler={addToWishlistHandler}
              removeFromWishlistHandler={removeFromWishlistHandler}
              isWishlisted={isWishlisted}
              productDetailsData={productDetailsData}
              videoMeta={videoMeta}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          md={7}
          marginTop={productThumbImage?.length > 0 ? "0px" : "0px"}
        >
          {productDetailsData?.module_type !== "food" && (
            <ProductInformation
              productDetailsData={productDetailsData}
              configData={configData}
              productUpdate={productUpdate}
              handleModalClose={handleModalClose}
              modalmanage={modalmanage}
              isSmall={isSmall}
            />
          )}
        </Grid>
      </Grid>
    );
  };
  return <CustomStackFullWidth>{handleModal()}</CustomStackFullWidth>;
};

export default ProductDetailsSection;
