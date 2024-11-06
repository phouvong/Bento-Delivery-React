import FavoriteIcon from "@mui/icons-material/Favorite";
import { alpha, Grid, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import { not_logged_in_message } from "utils/toasterMessages";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import CustomRatingBox from "../CustomRatingBox";
import Body2 from "../typographies/Body2";
import { CustomOverLay } from "./Card.style";
import QuickView, { PrimaryToolTip } from "./QuickView";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ClosedNow from "components/closed-now";
const ContentSection = styled(Box)(({ theme }) => ({
  background: "",
  marginTop: "10px",
}));

const FavoriteWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: "24px",
  height: "24px",
  backgroundColor: theme.palette.neutral[100],
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const Wrapper = styled(CustomStackFullWidth)(({ theme }) => ({
  backgroundColor: theme.palette.background.custom6,
  padding: "10px",
  border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all ease 0.5s",
  ".MuiTypography-subtitle2": {
    transition: "all ease 0.5s",
  },
  "&:hover": {
    transform: "scale(1.03)",
    img: { transform: "scale(1.05)" },
    ".MuiTypography-subtitle2": {
      color: theme.palette.primary.main,
      // letterSpacing: "0.02em",
    },
  },
}));

const ImageWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  height: "130px",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    height: "140px",
  },
}));

const timeAndDeliveryTypeHandler = (item) => {
  const time = item?.delivery_time !== null ? item?.delivery_time : "";
  const free_delivery =
    item?.free_delivery === true ? `. ${t("Free Delivery")}` : "";
  return time + free_delivery;
};
const StoreCard = (props) => {
  const classes = textWithEllipsis();
  const { item, imageUrl, topoffer } = props;
  const [isHover, setIsHover] = useState(false);
  const { wishLists } = useSelector((state) => state.wishList);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const { mutate } = useWishListStoreDelete();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);
  const wishlistItemExistHandler = () => {
    if (wishLists?.store?.find((wishItem) => wishItem.id === item?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };
  const quickViewHandleClick = (e) => {
    // e.stopPropagation();
    // dispatch({ type: ACTION.setOpenModal, payload: true });
  };
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishListStore(item));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      dispatch(removeWishListStore(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  const handleClick = () => {
    router.push({
      pathname: `/store/[id]`,
      query: {
        id: `${item?.slug ? item?.slug : item?.id}`,
        module_id: `${item?.module_id}`,
        module_type: getCurrentModuleType(),
        store_zone_id: `${item?.zone_id}`,
        distance: item?.distance,
      },
    });
  };
  return (
    <Wrapper
      spacing={2}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => handleClick()}
    >
      <ImageWrapper>
        <CustomImageContainer
          src={imageUrl}
          // alt={t("Background")}
          height="100%"
          width="100%"
          borderRadius="10px"
          objectFit="cover"
        />
        {isWishlisted && (
          <Box sx={{ position: "absolute", top: 10, right: 10 }}>
            <FavoriteWrapper>
              <FavoriteIcon fontSize="small" />
            </FavoriteWrapper>
          </Box>
        )}
        <ClosedNow
          active={item?.active}
          open={item?.open}
          borderRadius="10px"
        />
        <CustomOverLay hover={isHover}>
          <QuickView
            quickViewHandleClick={quickViewHandleClick}
            isTransformed={isHover}
            isWishlisted={isWishlisted}
            addToWishlistHandler={addToWishlistHandler}
            removeFromWishlistHandler={removeFromWishlistHandler}
            noQuickview
          />
        </CustomOverLay>
      </ImageWrapper>
      {topoffer ? (
        <ContentSection>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
              <Typography
                sx={{
                  fontWeight: "600",

                  color: (theme) => theme.palette.text.custom,
                  fontSize: { xs: "13px", sm: "16px" },
                }}
                component="h3"
              >
                {item?.name}
              </Typography>
            </PrimaryToolTip>

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "400",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "3px",
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <GradeRoundedIcon
                sx={{
                  fontSize: "15px",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
              {item?.avg_rating}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Typography
                color="text.secondary"
                sx={{ fontSize: "12px", fontWeight: "400" }}
              >
                {item?.delivery_time}
              </Typography>
              {item?.free_delivery && (
                <>
                  <FiberManualRecordIcon
                    color="text.secondary"
                    sx={{
                      fontSize: "5px",
                      mt: 0.2,
                      color: "text.secondary",
                    }}
                  />
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                    }}
                  >
                    {t("Free Delivery")}
                  </Typography>
                </>
              )}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: (theme) => theme.palette.background.default,
                  background: (theme) => theme.palette.primary.main,
                  px: "5px",
                  py: "3px",
                  borderRadius: "10px",
                }}
              >
                {item?.discount?.discount}
                {item?.discount?.discount_type && "%"} {t("off")}
              </Typography>
            </Box>
          </Box>
        </ContentSection>
      ) : (
        <CustomBoxFullWidth>
          <Grid container>
            <Grid item xs={9.5}>
              <PrimaryToolTip
                text={item?.name}
                placement="bottom"
                arrow="false"
              >
                <Typography
                  className={classes.singleLineEllipsis}
                  fontSize={{ xs: "12px", md: "14px" }}
                  fontWeight="500"
                  component="h3"
                >
                  {item?.name}
                </Typography>
              </PrimaryToolTip>
              {/*<H4 text={item?.name} />*/}
            </Grid>
            <Grid item xs={2.5}>
              {item?.avg_rating > 0 && (
                <CustomRatingBox rating={item?.avg_rating} />
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: "10px" }}>
              <Body2 text={item?.address} />
            </Grid>
            <Grid item xs={12} sx={{ mt: "7px" }}>
              <Body2 text={timeAndDeliveryTypeHandler(item)} />
            </Grid>
          </Grid>
        </CustomBoxFullWidth>
      )}
    </Wrapper>
  );
};

StoreCard.propTypes = {};

export default StoreCard;
