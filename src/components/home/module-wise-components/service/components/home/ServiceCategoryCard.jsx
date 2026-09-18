import React from "react";
import { Grid, Skeleton, Tooltip, Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { useRouter } from "next/router";
import { getModuleId } from "helper-functions/getModuleId";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

const FeatureImageBox = styled(Stack)(({ theme }) => ({
  width: "100%",
  paddingTop: "10px",
  cursor: "pointer",
  position: "relative",
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const CircleBox = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all ease 0.5s",
  border: `1px solid ${theme.palette.neutral[200]}`,
  backgroundColor: theme.palette.neutral[100],
  position: "relative",
  "&:hover": {
    boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
    img: { transform: "scale(1.05)" },
  },
}));

const ImageClipBox = styled(Box)({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  isolation: "isolate",
  transform: "translateZ(0)",
});

const ServiceCategoryCard = (props) => {
  const {
    categoryImage,
    name,
    id,
    categoryImageUrl,
    height,
    onlyshimmer,
    slug,
    serviceTime,
  } = props;
  
  const router = useRouter();
  const { ref: textRef, isEllipsed } = useTextEllipsis(name);
  const queryModule = router?.query?.module || router?.query?.module_id;
  const moduleValue = Array.isArray(queryModule)
    ? queryModule[0]
    : queryModule || getModuleId();

  const handleClick = () => {
    router.push({
      pathname: `/home/category/${slug || id}`,
      query: {
        id,
        ...(moduleValue ? { module: String(moduleValue) } : {}),
      },
    });
  };

  return (
    <Grid item sx={{ overflow: "visible" }} onClick={handleClick}>
      <FeatureImageBox justifyContent="center" alignItems="center" spacing={1}>
        <ImageWrapper sx={{ width: { xs: 56, md: 88 }, height: { xs: 56, md: 88 } }}>
          <CircleBox
            sx={{
              width: "100%",
              height: "100%",
              "& img": { width: "100%", height: "100%", objectFit: "cover" },
            }}
          >
            <ImageClipBox>
              {onlyshimmer ? (
                <Skeleton variant="circular" width="100%" height="100%" />
              ) : (
                <NextImage
                  src={categoryImageUrl}
                  alt={name}
                  height={88}
                  width={88}
                  borderRadius="50%"
                  objectFit="cover"
                  bg="#ddd"
                />
              )}
              {serviceTime && !onlyshimmer && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#F2F2F2",
                    color: "#02542D",
                    border: "1px solid #FFFFFF",
                    borderRadius: "12px 12px 0 0",
                    padding: "4px 8px 10px",
                    fontSize: "10px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
                    zIndex: 2,
                  }}
                >
                  {serviceTime}
                </Box>
              )}
            </ImageClipBox>
          </CircleBox>
        </ImageWrapper>
        
        <Tooltip
          title={isEllipsed ? name : ""}
          placement="bottom"
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
          <Typography
            ref={textRef}
            sx={{
              color: (theme) => theme.palette.neutral[1000],
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              textAlign: "center",
              transition: "all ease 0.3s",
              "&:hover": {
                color: "primary.main",
              },
            }}
            fontSize={{ xs: "13px", sm: "14px", md: "16px" }}
            fontWeight="500"
            component="h4"
          >
            {onlyshimmer ? <Skeleton variant="text" width="50px" /> : name}
          </Typography>
        </Tooltip>
      </FeatureImageBox>
    </Grid>
  );
};

export default ServiceCategoryCard;
