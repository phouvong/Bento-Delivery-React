import React from "react";
import {
  CustomStackFullWidth,
  StoreImageBox,
} from "styled-components/CustomStyles.style";
import { useDispatch } from "react-redux";
import { Stack } from "@mui/system";
import { alpha, IconButton, Typography } from "@mui/material";
import deleteIcon from "assets/delete.png";
import { useTheme } from "@emotion/react";
import { removeWishListProvider } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useRemoveRentalWishList } from "api-manage/hooks/react-query/rental-wishlist/useRemoveWishlist";
import CustomImageContainer from "components/CustomImageContainer";
import CustomRatings from "components/search/CustomRatings";
import CustomDivider from "components/CustomDivider";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";

const ProviderWishCard = ({ data, setSideDrawerOpen }) => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  console.log({data});
  

  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();
  const removeFromRentalWishlistProviderHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      dispatch(removeWishListProvider(data?.id));
      toast.success(res.message, {
        id: "rental-wishlist",
      });
    };
    removeFavoriteMutation(
      { key: "provider_id", id: data?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  const handleCLick = (e) => {
    router.push(
      {
        pathname: `/rental/provider/${data?.id}`,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <CustomStackFullWidth
        direction="row"
        sx={{ marginTop: "1rem", cursor: "pointer" }}
        gap="10px"
        onClick={(e) => handleCLick(e)}
      >
        <StoreImageBox
          border={`.5px solid ${alpha(theme.palette.neutral[400], 0.5)}`}
        >
          <CustomImageContainer
            src={data?.logo_full_url}
            width="64px"
            height="64px"
            borderRadius="5px"
            objectfit="contain"
          />
        </StoreImageBox>

        <Stack width="0px" flexGrow="1" justifyContent="center" spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography fontWeight="500" fontSize="14px">
              {data?.name}
            </Typography>
            <VerifiedStoreBadge verified={data?.verified_seller} fontSize="14px" />
          </Stack>

          <CustomRatings
            ratingValue={data?.avg_rating}
            readOnly="true"
            fontSize="16px"
          />
          <Typography
            fontWeight="400"
            fontSize="12px"
            color={theme.palette.neutral[400]}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2, // Limits to 2 lines
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.address}
          </Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
          <IconButton
            onClick={(e) => removeFromRentalWishlistProviderHandler(e)}
          >
            <CustomImageContainer
              src={deleteIcon?.src}
              width="18px"
              height="18px"
            />
          </IconButton>
        </Stack>
      </CustomStackFullWidth>
      <CustomDivider paddingTop="1rem" width="100%" />
    </>
  );
};

export default ProviderWishCard;
