import { Stack, Typography, useMediaQuery } from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomButtonComponent from "./CustomButtonComponent";

const LargerScreen = (props) => {
  const { landingPageData, goToApp, t } = props;
  const isUpSmall = useMediaQuery(
    "(min-width: 1000px) and (max-width: 1550px)"
  );
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        height={isUpSmall ? "300px" : "500px"}
      >
        <CustomStackFullWidth spacing={4} sx={{ paddingInlineStart: "2rem" }}>
          <CustomStackFullWidth spacing={1}>
            <Typography
              variant="h4"
              color="primary.deep"
              fontWeight={800}
              fontSize={{ xs: "16px", sm: "22px", md: "36px" }}
              component="h2"
            >
              {landingPageData?.business_title}
            </Typography>
            <Typography
              variant="h4"
              color="primary.main"
              fontWeight={700}
              fontSize={{ xs: "14px", sm: "28px", md: "30px" }}
              component="h3"
            >
              {landingPageData?.business_sub_title}
            </Typography>
          </CustomStackFullWidth>

          <CustomStackFullWidth spacing={2}>
            {landingPageData?.download_business_app_links && (
              <CustomStackFullWidth
                gap={4}
                direction="row"
                flexGrow={1}
                flexWrap="wrap"
                alignItems="center"
              >
                {(landingPageData?.download_business_app_links
                  ?.seller_playstore_url_status === "1" ||
                  landingPageData?.download_business_app_links
                    ?.seller_appstore_url_status === "1") && (
                  <CustomButtonComponent
                    t={t}
                    landingPageData={landingPageData}
                    title={t("Seller App")}
                    urls={{
                      playStoreStatus:
                        landingPageData?.download_business_app_links
                          ?.seller_playstore_url_status,
                      playStoreUrl:
                        landingPageData?.download_business_app_links
                          ?.seller_playstore_url,
                      appStoreStatus:
                        landingPageData?.download_business_app_links
                          ?.seller_appstore_url_status,
                      appStoreUrl:
                        landingPageData?.download_business_app_links
                          ?.seller_appstore_url,
                    }}
                  />
                )}
                {(landingPageData?.download_business_app_links
                  ?.dm_playstore_url_status === "1" ||
                  landingPageData?.download_business_app_links
                    ?.dm_appstore_url_status === "1") && (
                  <CustomButtonComponent
                    t={t}
                    landingPageData={landingPageData}
                    title={t("Deliveryman App")}
                    urls={{
                      playStoreStatus:
                        landingPageData?.download_business_app_links
                          ?.dm_playstore_url_status,
                      playStoreUrl:
                        landingPageData?.download_business_app_links
                          ?.dm_playstore_url,
                      appStoreStatus:
                        landingPageData?.download_business_app_links
                          ?.dm_appstore_url_status,
                      appStoreUrl:
                        landingPageData?.download_business_app_links
                          ?.dm_appstore_url,
                    }}
                  />
                )}
              </CustomStackFullWidth>
            )}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          // width:"40%",
          height: "100%",
          top: 0,
          right: 0,
        }}
      >
        <CustomImageContainer
          src={landingPageData?.business_image_full_url}
          objectfit="cover"
          // height="100%"
          // width="100%"
          aspectRatio="500/500"
          maxWidth="500px"
        />
      </Stack>
    </>
  );
};

export default LargerScreen;
