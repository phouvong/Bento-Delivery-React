import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import CustomImageContainer from "../../../CustomImageContainer";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ViewMore from "../ViewMore";
import { Skeleton } from "@mui/material";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";

const NavFoodCampaigns = ({ campaigns, isLoading }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleClick = (e, item) => {
    e.stopPropagation();
    router.push(
      {
        pathname: "/campaigns/[id]",
        query: {
          id: `${item?.slug ? item?.slug : item?.id}`,
          module_id: `${getModuleId()}`,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <CustomStackFullWidth spacing={4} sx={{ height: "100%" }}>
      <Typography variant="h6" fontWeight="500" textAlign="center">
        {t("Campaigns")}
      </Typography>
      {campaigns?.length > 0 &&
        campaigns?.slice(0, 3).map((item, index) => {
          return (
            <Stack
              key={index}
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ cursor: "pointer" }}
              onClick={(e) => handleClick(e, item)}
            >
              <CustomImageContainer
                src={item?.image_full_url}
                width="70px"
                height="70px"
                borderRadius=".5rem"
              />
              <Stack width="219px">
                <Stack direction="row" alignItems="center" spacing={0.4}>
                  <Typography variant="h6" color={theme.palette.primary.main}>
                    {item?.title}
                  </Typography>
                  <ArrowForwardIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </Stack>
                <Typography
                  fontSize="13px"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item?.description}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      {isLoading && (
        <Stack>
          <Skeleton width="100%" height={30} />
        </Stack>
      )}
      {campaigns?.length > 3 && (
        <Stack height="100%" width="100%" sx={{ marginTop: "auto" }}>
          <ViewMore redirect="/campaigns" />
        </Stack>
      )}
    </CustomStackFullWidth>
  );
};

export default NavFoodCampaigns;
