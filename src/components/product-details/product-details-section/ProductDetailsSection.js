import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomImageContainer from "../../CustomImageContainer";
import OrganicTag from "../../organic-tag";
import ProductImageView from "./ProductImageView";
import ProductInformation from "./ProductInformation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";

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
      backgroundColor: "#E53935",
      color: "#fff",
      fontWeight: 700,
      fontSize: { xs: "12px", md: "13px" },
      lineHeight: 1.1,
      letterSpacing: "-0.2px",
      boxShadow: "0 2px 6px rgba(229, 57, 53, 0.25)",
    }}
  >
    {children}
  </Box>
);

export const handleDiscountChip = (product) => {
  if (!product?.discount) return null;
  const label =
    product?.discount_type === "percent"
      ? `-${product?.discount}%`
      : `-${getAmountWithSign(product?.discount)}`;
  return <DiscountBadge>{label}</DiscountBadge>;
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
  const isInModal = modalmanage === "true" || modalmanage === true;
  const handleModal = () => {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: isInModal ? { xs: 0, sm: "12px", md: "16px" } : { xs: "12px", md: "16px" },
          p: isInModal ? { xs: 0, sm: 1, md: 1.5 } : { xs: 0.5, sm: 1, md: 1.5 },
          ...(isInModal && {
            flex: { md: 1 },
            minHeight: 0,
            display: { xs: "block", md: "flex" },
            flexDirection: { md: "column" },
            overflow: { md: "hidden" },
          }),
        }}
      >
        <Grid
          container
          spacing={isInModal ? { xs: 0, sm: 2, md: 4 } : { xs: 2, md: 4 }}
          sx={
            isInModal
              ? {
                  flex: { md: 1 },
                  minHeight: 0,
                  overflow: { md: "hidden" },
                  flexWrap: { md: "nowrap" },
                }
              : undefined
          }
        >
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            textAlign="center"
            sx={
              isInModal
                ? {
                    display: { md: "flex" },
                    flexDirection: { md: "column" },
                    overflow: { md: "hidden" },
                  }
                : undefined
            }
          >
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
                containerRadius={isInModal ? { xs: "0px", md: "12px" } : "12px"}
                onClose={isInModal ? handleModalClose : undefined}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            md={7}
            sx={
              isInModal
                ? {
                    minHeight: 0,
                    maxHeight: { md: "400px" },
                    overflowY: { xs: "visible", md: "auto" },
                    overflowX: "hidden",
                    px: { xs: 1.5, sm: 0 },
                    pt: { xs: 2, sm: 0 },
                    pr: { md: 1 },
                  }
                : undefined
            }
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
      </Box>
    );
  };
  return (
    <CustomStackFullWidth
      sx={
        isInModal
          ? {
              flex: { md: 1 },
              minHeight: 0,
              overflow: { md: "hidden" },
            }
          : undefined
      }
    >
      {handleModal()}
    </CustomStackFullWidth>
  );
};

export default ProductDetailsSection;
