import React, { useEffect, useState } from "react";
import {
  alpha,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import { Box, Stack } from "@mui/system";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
// import {theme} from "../../../theme";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import CustomImageContainer from "components/CustomImageContainer";
import VideoPlayerWithCenteredControl from "components/home/paid-ads/VideoPlayerWithCenteredControl";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import { t } from "i18next";

const AdsCard = (props) => {
  const {
    item,
    itemLength,
    activeSlideData,

    index,
    sliderRef,
    data,
  } = props;
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const { wishLists } = useSelector((state) => state.wishList);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const { mutate } = useWishListStoreDelete();

  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);
  const wishlistItemExistHandler = () => {
    if (wishLists?.store?.find((wishItem) => wishItem.id === item?.store?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.store?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishListStore(item?.store));
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
      dispatch(removeWishListStore(item?.store?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.store?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const slideHandler = () => {
    if (!activeSlideData) return;

    // Handle the case when there are more than 3 slides
    if (itemLength > 3 || isSmall) {
      if (
        !ended &&
        item?.id === activeSlideData?.id &&
        activeSlideData?.add_type === "video_promotion"
      ) {
        setPlaying(true);
      }
      return;
    }

    // Handle the case when there are 3 or fewer slides
    if (index === 0 && item.add_type === "video_promotion") {
      setPlaying(true);
      return;
    }

    if (index === 1 && item.add_type === "video_promotion") {
      if (ended || data[0]?.add_type !== "video_promotion") {
        setPlaying(true);
      }
      return;
    }

    if (index === 2 && item.add_type === "video_promotion") {
      if (
        ended ||
        (data[1]?.add_type !== "video_promotion" &&
          data[0]?.add_type !== "video_promotion")
      ) {
        setPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (data) {
      slideHandler();
    }
  }, [itemLength, activeSlideData, index]);

  useEffect(() => {
    // Handle autoplay state based on video end
    if (ended && sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  }, [ended]);

  useEffect(() => {
    if (ended && data?.length > 0) {
      const nextSlide = sliderRef.current?.innerSlider?.state?.currentSlide + 1;
      if (nextSlide < itemLength) {
        const nextSlideChildren = sliderRef?.current?.props?.children;
        if (nextSlideChildren && nextSlideChildren[nextSlide]) {
          const nextItem =
            nextSlideChildren[nextSlide]?.props?.children?.props?.item;
          if (nextItem?.add_type === "video_promotion") {
            sliderRef?.current?.slickNext();
          } else {
            setPlaying(false);
          }
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
      setEnded(false);
    }
  }, [ended, index, itemLength, sliderRef]);
  const handleClick = (e) => {
    e.stopPropagation();
    router.push({
      pathname: `/store/[id]`,
      query: {
        id: `${item?.store?.slug ? item?.store?.slug : item?.store?.id}`,
        module_id: `${item?.store?.module_id}`,
        module_type: getCurrentModuleType(),
        store_zone_id: `${item?.store?.zone_id}`,
        distance: item?.store?.distance,
      },
    });
  };

  return (
    <Box sx={{ maxWidth: "450px", cursor: "pointer" }}>
      {item?.add_type === "store_promotion" ? (
        <Stack
          onClick={(e) => handleClick(e)}
          sx={{
            position: "relative",
            margin: "0px 20px -110px",
            //boxShadow: "0px 15px 30px rgba(150, 150, 154, 0.40)",
            borderRadius: "10px",
          }}
        >
          <Stack position="relative">
            {(item?.is_rating_active === 1 || item.is_review_active === 1) && (
              <Stack
                maxWidth="90px"
                width="100%"
                position="absolute"
                bottom="10px"
                right="10px"
                alignItems="center"
                zIndex="1"
                flexDirection="row"
                backgroundColor={theme.palette.primary.main}
                borderRadius="6px"
                padding="5px"
                gap="5px"
              >
                {item.is_review_active === 1 && (
                  <>
                    <StarIcon
                      sx={{
                        fontSize: "18px",
                        color: (theme) => theme.palette.neutral[100],
                      }}
                    />
                    <Typography
                      color={theme.palette.neutral[100]}
                      fontSize="14px"
                      fontWeight="600"
                    >
                      {item?.average_rating.toFixed(1)}
                    </Typography>
                  </>
                )}
                {item.is_review_active === 1 && (
                  <Typography
                    color={theme.palette.neutral[100]}
                    fontSize="14px"
                  >
                    ({item?.reviews_comments_count})
                  </Typography>
                )}
              </Stack>
            )}

            <CustomImageContainer
              boxShadow={
                theme.palette.mode === "dark"
                  ? "0px 15px 30px rgba(0, 0, 0, 0.8)"
                  : "0px 15px 30px rgba(150, 150, 154, 0.40)"
              }
              src={item?.cover_image_full_url}
              width="100%"
              height="200px"
              objectFit="cover"
              borderRadius="10px"
            />
          </Stack>
        </Stack>
      ) : (
        <VideoPlayerWithCenteredControl
          ended={ended}
          setEnded={setEnded}
          playing={playing}
          setPlaying={setPlaying}
          video={item?.video_attachment_full_url}
          isMargin={true}
        />
      )}

      <Stack
        onClick={(e) => handleClick(e)}
        paddingTop="130px"
        paddingBottom="20px"
        paddingInline="25px"
        sx={{
          // transform: "perspective(500px) rotateX(5deg)",
          boxShadow: "0px -4.412px 29.412px rgba(150, 150, 154, 0.20)",
          width: "100%",
          height: "100%",
          borderRadius: "15px",
          backgroundColor: (theme) => theme.palette.neutral[100],
        }}
      >
        {item?.add_type === "store_promotion" ? (
          <Stack flexDirection="row" gap="1rem" width="100%">
            <Stack
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                borderRadius: "50%",
              }}
            >
              <CustomImageContainer
                src={item?.profile_image_full_url}
                width="70px"
                height="70px"
                objectFit="cover"
                borderRadius="50%"
              />
            </Stack>
            <Stack width={0} flexGrow={1}>
              <Stack
                flexDirection="row"
                gap=".6rem"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",

                    whiteSpace: "wrap",
                    wordWrap: "break-word",
                  }}
                  color={theme.palette.neutral[1000]}
                  fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
                  fontWeight="600"
                >
                  {item?.title}
                </Typography>
                {!isWishlisted ? (
                  <FavoriteBorderOutlinedIcon
                    onClick={(e) => addToWishlistHandler(e)}
                    sx={{ cursor: "pointer", flexShrink: 0 }}
                    color="primary"
                  />
                ) : (
                  <FavoriteIcon
                    onClick={(e) => removeFromWishlistHandler(e)}
                    color="primary"
                    sx={{
                      fontSize: {
                        xs: "16px",
                        sm: "18px",
                        md: "20px",
                      },
                    }}
                  />
                )}
              </Stack>
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  wordWrap: "break-word",
                  color: theme.palette.neutral[1000],
                }}
                color={theme.palette.neutral[500]}
                fontSize={{ xs: "13px", sm: "14px", md: "14px" }}
              >
                {item?.description}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                color: (theme) => theme.palette.neutral[1000],
              }}
              fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
              fontWeight="600"
            >
              {item?.title}
            </Typography>
            <Stack
              flexDirection="row"
              gap="20px"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
                fontSize={{ xs: "13px", sm: "14px", md: "14px" }}
                color={theme.palette.neutral[500]}
              >
                {item?.description}
              </Typography>
              <IconButton
                onClick={(e) => handleClick(e)}
                padding="10px"
                sx={{
                  borderRadius: "10px",
                  border: `1.5px solid ${theme.palette.primary.main}`,
                }}
              >
                <ArrowForwardSharpIcon color="primary" />
              </IconButton>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default AdsCard;
