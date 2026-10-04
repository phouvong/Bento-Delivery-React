import { Grid, Skeleton, Tooltip, Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";
import NextImage from "components/NextImage";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";

const FeatureImageBox = styled(Stack)(({ theme }) => ({
  width: "100%",
  paddingTop: "10px",
  borderRadius: "50%",
  cursor: "pointer",
}));

const FoodCategoryCard = (props) => {
  const {
    categoryImage,
    name,
    id,
    categoryImageUrl,
    height,
    onlyshimmer,
    slug,
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
    <Grid item sx={{ overflow: "hidden" }} onClick={handleClick}>
      <FeatureImageBox justifyContent="center" alignItems="center" spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "all ease 0.5s",
            "&:hover": {
              boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
              img: { transform: "scale(1.05)" },
            },
          }}
        >
          <Box
            sx={{
              width: { xs: 56, md: 88 },
              height: { xs: 56, md: 88 },
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              "& img": { width: "100%", height: "100%", objectFit: "cover" },
            }}
          >
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
          </Box>
        </Box>
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
              whiteSpace: "nowrap",
              maxWidth: { xs: "56px", md: "88px" },
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

FoodCategoryCard.propTypes = {};

export default FoodCategoryCard;
