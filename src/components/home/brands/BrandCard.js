/* eslint-disable @next/next/no-img-element */
import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import Link from "next/link";
import { memo } from "react";
import placeholder from "../assets/product.png";

const BrandCard = (props) => {
  const { image, name, stock, id, horizontal, baseUrl, items_count } = props;
  const theme = useTheme();
  const imageUrl = image || placeholder.src;
  const tabScreen = useMediaQuery("(max-width: 991px)");

  return (
    <>
      <Stack
        sx={{
          flexDirection: horizontal ? "column" : "row",
          textAlign: horizontal ? "center" : "",
          alignItems: "center",
          columnGap: "8px",
          position: "relative",
          transition: "all ease .3s",
          padding: "10px",
          borderRadius: "4px",
          ":hover": {
            boxShadow: horizontal ? "" : theme.shadows[14],
          },
          a: {
            position: "absolute",
            inset: "0",
          },
        }}
      >
        <Link href={`/home?brand_id=${id}&data_type=brand`} />
        <Stack
          sx={{
            maxWidth: horizontal
              ? { xs: "200px" }
              : { xs: "45px", md: "60px", lg: "70px" },
            marginBottom: horizontal ? "10px" : "0",
            img: {
              maxWidth: "100%",
              transition: "all ease .3s",
              height: "unset",
              objectFit: "contain",
              aspectRatio: "1",
            },
          }}
          className="brand-card-image"
        >
          <img
            src={imageUrl}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if fallback image also fails
              e.target.src = placeholder.src; // Replace with your fallback image path
            }}
            width={200}
            height={200}
            alt="Brand"
          />
        </Stack>
        <Box width={horizontal ? "100%" : "0"} flexGrow={"1"}>
          {name && (
            <Typography
              variant="h6"
              sx={{
                fontSize: horizontal ? "18px" : { xs: "14px !important" },
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: { xs: "1", sm: "2" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "600",
              }}
            >
              {name}
            </Typography>
          )}
          <Typography variant="body2" sx={{ opacity: "0.8" }} component="span">
            {items_count} {t("Products")}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

BrandCard.propTypes = {};

export default memo(BrandCard);
