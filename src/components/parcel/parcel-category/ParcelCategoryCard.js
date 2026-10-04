import { useTheme } from "@emotion/react";
import { Card, Box, Tooltip, Typography, alpha } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { PrimaryToolTip } from "components/cards/QuickView";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import CustomImageContainer from "../../CustomImageContainer";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

const ParcelCard = styled(Card)(({ theme }) => ({
  padding: "20px",
  cursor: "pointer",
  borderRadius: "16px",
  transition: "all ease 0.5s",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    padding: "14px",
  },
  "&:hover": {
    boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
    img: {
      transform: "scale(1.1)",
    },
    ".MuiTypography-body1:first-child": {
      color: theme.palette.primary.main,
      letterSpacing: "0.02em",
    },
  },
  ".MuiTypography-body1:first-child": {
    transition: "all ease 0.5s",
  },
}));

const ParcelCategoryCard = (props) => {
  const theme = useTheme();
  const { data } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(data);
    } else {
      dispatch(setParcelCategories(data));
      router.push("/parcel-delivery-info", undefined, { shallow: true });
    }
  };
  const classes = textWithEllipsis();
  const { ref: textRef, isEllipsed } = useTextEllipsis(data?.name);
  return (
    <CustomStackFullWidth sx={{ height: "100%" }}>
      <ParcelCard
        {...props}
        onClick={handleClick}
        sx={{
          border: props?.selected
            ? `1.5px solid ${theme.palette.primary.main}`
            : undefined,
          backgroundColor: props?.selected
            ? alpha(theme.palette.primary.main, 0.08)
            : undefined,
          boxShadow: props?.selected
            ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`
            : undefined,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={{ xs: 1, sm: 3 }}
        >
          <Box
            sx={{
              img: {
                width: { xs: "44px", sm: "72px" },
                height: { xs: "44px", sm: "72px" },
              },
            }}
          >
            <NextImage
              width={72}
              height={72}
              src={data?.image_full_url}
              objectFit="contain"
            />
          </Box>
          <Stack width="100%" spacing={{ xs: 0.5, sm: 0 }}>
            <Tooltip
              title={data?.name || ""}
              placement="bottom"
              arrow
              disableHoverListener={!isEllipsed}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: (theme) => theme.palette.toolTipColor,
                    "& .MuiTooltip-arrow": {
                      color: (theme) => theme.palette.toolTipColor,
                    },
                  },
                },
              }}
            >
              <Typography
                ref={textRef}
                fontSize={{ xs: "15px", sm: "18px", md: "18px" }}
                fontWeight={{ xs: 700 }}
                component="h3"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  lineHeight: 1.2,
                }}
              >
                {data?.name}
              </Typography>
            </Tooltip>
            <Typography
              fontSize={{ xs: "12px", sm: "14px", md: "14px" }}
              color={theme.palette.neutral[400]}
              className={classes.multiLineEllipsis}
              sx={{
                lineHeight: 1.35,
                display: "-webkit-box !important",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: { xs: "2 !important", sm: "1 !important" },
              }}
            >
              {data?.description}
            </Typography>
          </Stack>
        </Stack>
      </ParcelCard>
    </CustomStackFullWidth>
  );
};

export default ParcelCategoryCard;
