import { useRouter } from "next/router";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../container";
import { StyledFooterBackground } from "./Footer.style";
import FooterBottom from "./FooterBottom";
import FooterMiddle from "./footer-middle/FooterMiddle";
import FooterTop from "./footer-top/FooterTop";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";

const FooterComponent = (props) => {
  const { configData } = props;
  const router = useRouter();
  const { data: landingPageData, refetch } = useGetLandingPage();
  useEffect(() => {
    if (!landingPageData) {
      refetch();
    }
  }, [landingPageData]);
  const isLandingPage = router.pathname === "/" ? "true" : "false";
  return (
    <CustomStackFullWidth
      sx={{
        mt: {
          xs: "6rem",
          sm: "3rem",
          md: router.pathname === "/" ? "2rem" : "4rem",
        },
      }}
    >
      <FooterTop landingPageData={landingPageData} />
      <StyledFooterBackground nobottommargin={isLandingPage}>
        <CustomStackFullWidth
          height="100%"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <CustomContainer>
            <CustomStackFullWidth spacing={3}>
              <FooterMiddle
                configData={configData}
                landingPageData={landingPageData}
              />
            </CustomStackFullWidth>
          </CustomContainer>
          <FooterBottom configData={configData} />
        </CustomStackFullWidth>
      </StyledFooterBackground>
    </CustomStackFullWidth>
  );
};

export default FooterComponent;
