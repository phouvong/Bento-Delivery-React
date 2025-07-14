import { useRouter } from "next/router";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../container";
import { StyledFooterBackground } from "./Footer.style";
import FooterBottom from "./FooterBottom";
import FooterMiddle from "./footer-middle/FooterMiddle";
import FooterTop from "./footer-top/FooterTop";

const FooterComponent = (props) => {
  const { configData, landingPageData } = props;
  const router = useRouter();
  const isLandingPage = router.pathname === "/" ? "true" : "false";
  return (
    <CustomStackFullWidth
      sx={{
        mt: {
          xs: "6rem",
          sm: "3rem",
          md: router.pathname === "/" ? "2rem" : "9rem",
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
