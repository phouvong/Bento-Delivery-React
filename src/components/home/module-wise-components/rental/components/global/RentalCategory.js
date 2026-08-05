import { CustomCarCard } from "components/home/module-wise-components/rental/components/Rental.style";
import { Box, Stack } from "@mui/system";
import { Tooltip, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import CustomImageContainer from "components/CustomImageContainer";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

const RentalCategory = ({ data }) => {
  const router = useRouter();

  const rentalCategoryImage = data?.image_full_url;
  const rentalCategoryName = data?.name;
  const rentalCategoryId = data?.id;
  const { textRef, isEllipsed } = useTextEllipsis(rentalCategoryName);

  const handleCategoryClick = () => {
    router.push({
      pathname: "/rental/vehicle-search",
      query: { categoryId: rentalCategoryId, ...(router.query.module ? { module: router.query.module } : {}) },
    });
  };

  const labelStyles = {
    textAlign: "center",
    color: (theme) => theme.palette.text.primary,
    fontWeight: 500,
    fontSize: { xs: "14px", md: "15px" },
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <Stack
      alignItems="center"
      spacing={1.5}
      onClick={handleCategoryClick}
      sx={{ cursor: "pointer" }}
    >
      <CustomCarCard sx={{ width: "100%" }}>
        <Box
          sx={{
            padding: { xs: "20px 16px", md: "24px 20px" },
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              height: "90px",
              "& > span": {
                width: "140px !important",
                height: "90px !important",
                display: "flex !important",
                alignItems: "center",
                justifyContent: "center",
              },
              "& img": {
                width: "100% !important",
                height: "100% !important",
                maxWidth: "140px",
                maxHeight: "90px",
                objectFit: "contain",
              },
            }}
          >
            <NextImage
              width={140}
              height={90}
              src={rentalCategoryImage}
              objectFit="contain"
            />
          </Stack>
        </Box>
      </CustomCarCard>
      {isEllipsed ? (
        <Tooltip
          title={rentalCategoryName}
          placement="top"
          arrow
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
          <Typography ref={textRef} sx={labelStyles}>
            {rentalCategoryName}
          </Typography>
        </Tooltip>
      ) : (
        <Typography ref={textRef} sx={labelStyles}>
          {rentalCategoryName}
        </Typography>
      )}
    </Stack>
  );
};

export default RentalCategory;
