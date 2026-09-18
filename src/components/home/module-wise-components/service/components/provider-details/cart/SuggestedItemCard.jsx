import React, { useState } from "react";
import { Box, IconButton, Stack, Typography, alpha, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomImageContainer from "components/CustomImageContainer";

const SuggestedItemCard = ({ item }) => {
  const theme = useTheme();
  const [wishlisted, setWishlisted] = useState(false);
  const relPrice = Number(item?.discounted_price ?? item?.price ?? 0);
  const relOriginal = Number(item?.price ?? 0);
  const hasOff = relOriginal > 0 && relOriginal > relPrice;
  const discountPct = hasOff
    ? Math.round(((relOriginal - relPrice) / relOriginal) * 100)
    : 0;

  return (
    <Stack spacing={0.5} sx={{ width: "100%" }}>
      <Box sx={{ position: "relative" }}>
        <CustomImageContainer
          src={item?.image_full_url}
          width="100%"
          height="100px"
          borderRadius="12px"
          objectfit="cover"
        />
        <IconButton
          size="small"
          onClick={() => setWishlisted((v) => !v)}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 26,
            height: 26,
            p: 0,
            borderRadius: "50%",
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 2px 6px ${alpha(theme.palette.text.primary, 0.15)}`,
            "&:hover": { backgroundColor: theme.palette.background.paper },
          }}
        >
          {wishlisted ? (
            <FavoriteIcon sx={{ fontSize: 14, color: theme.palette.error.red }} />
          ) : (
            <FavoriteBorderIcon
              sx={{ fontSize: 14, color: theme.palette.error.red }}
            />
          )}
        </IconButton>
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 26,
            height: 26,
            p: 0,
            borderRadius: "6px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 2px 6px ${alpha(theme.palette.text.primary, 0.15)}`,
            "&:hover": { backgroundColor: theme.palette.background.paper },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: theme.palette.text.primary,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: 1.25,
          minHeight: 30,
        }}
      >
        {item?.name}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 700, color: theme.palette.text.primary }}
        >
          {getAmountWithSign(relPrice)}
        </Typography>
        {hasOff && (
          <Typography
            sx={{
              fontSize: 11,
              color: theme.palette.text.secondary,
              textDecoration: "line-through",
            }}
          >
            {getAmountWithSign(relOriginal)}
          </Typography>
        )}
      </Stack>
      {hasOff && (
        <Box
          sx={{
            alignSelf: "flex-start",
            px: 0.75,
            py: 0.125,
            borderRadius: "6px",
            backgroundColor: theme.palette.error.main,
            color: theme.palette.whiteContainer.main,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          -{discountPct}%
        </Box>
      )}
    </Stack>
  );
};

export default SuggestedItemCard;
