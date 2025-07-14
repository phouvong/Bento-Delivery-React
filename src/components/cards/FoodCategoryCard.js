import { useTheme } from "@emotion/react";
import {
  Grid,
  Skeleton,
  Tooltip,
  Typography, useMediaQuery,
} from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { useRouter } from "next/router";
import { getModuleId } from "helper-functions/getModuleId";
import CustomImageContainer from "../CustomImageContainer";
import NextImage from "components/NextImage";

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
  const theme=useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    router.push({
      pathname: "/home",
      query: {
        search: "category",
        id: id,
        module_id: `${getModuleId()}`,
        name: name && (name),
        data_type: "category",
      },
    });
  };

  return (
    <Grid item sx={{ overflow: "hidden" }} onClick={handleClick}>
      <FeatureImageBox
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Box
          sx={{
            transition: "all ease 0.5s",
            borderRadius: "50%",
            "&:hover": {
              boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
              img: {
                transform: "scale(1.05)",
              },
            },
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              overflow: "hidden",
              aspectRatio: "1",
              img: {
                aspectRatio: "1",
              },
            }}
          >
            {onlyshimmer ? (<Stack sx={{ height: {xs: "56px", sm: "120px"}, width: {xs: "56px", sm: "120px"} }}>
                <Skeleton variant="circular" width="100%" height="100%" />
            </Stack>) : (
                <NextImage
                    src={categoryImageUrl}
                    alt={name}
                    height={isSmall?56:120}
                    width={isSmall?56:120}
                    borderRadius="50%"

                    //loading="loading"
                    bg="#ddd"
                />
            )}
          </Box>
        </Box>
        <Tooltip
          title={name}
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
            sx={{
              color: (theme) => theme.palette.neutral[1000],
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
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
