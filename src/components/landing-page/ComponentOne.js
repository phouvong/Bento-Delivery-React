import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import {
  alpha,
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { IsSmallScreen } from "utils/CommonValues";
import CustomContainer from "../container";
import DollarSignHighlighter from "../DollarSignHighlighter";
import DeliveryImage from "./svg-components/deliveryImage";

export const CustomButton = styled(Button)(({ theme, boxshadow }) => ({
  backgroundColor: theme.palette.primary.main,
  //   width: "150px",
  height: "45px",
  borderRadius: "30px",
  boxShadow: "0px 4px 60px rgba(3, 157, 85, 0.2)",
  color: theme.palette.whiteContainer.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: theme.palette.primary.deep,
  },
  [theme.breakpoints.down("sm")]: {
    // width: "130px",
    height: "35px",
    marginTop: "-2px",
  },
}));
const ComponentOne = ({ landingPageData, configData, handleOrderNow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const handleButtonClick = () => {
    router.push(landingPageData?.company_button_url);
  };
  return (
    <>
      <CustomContainer>
        <CustomBoxFullWidth
          sx={{
            position: "relative",
            marginTop: "1rem",
            marginBottom: ".1rem",
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: "column-reverse", md: "row" }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <CustomStackFullWidth
                spacing={isSmall ? 2 : 3}
                paddingBottom={{ xs: "1rem", sm: "2rem", md: "0px" }}
              >
                <CustomStackFullWidth>
                  <Typography
                    variant={isSmall ? "h6" : "h4"}
                    color="primary.main"
                    component="h2"
                  >
                    <DollarSignHighlighter
                      theme={theme}
                      text={landingPageData?.company_title}
                    />
                  </Typography>
                  <Typography
                    variant={isSmall ? "h6" : "h4"}
                    sx={{ opacity: ".9" }}
                    component="h3"
                  >
                    <DollarSignHighlighter
                      theme={theme}
                      text={landingPageData?.company_sub_title}
                    />
                  </Typography>
                </CustomStackFullWidth>
                <Typography
                  fontSize={{ xs: "12px", md: "18px" }}
                  fontWeight="400"
                  sx={{
                    color: (theme) => alpha(theme.palette.neutral[500], 0.8),
                  }}
                >
                  <DollarSignHighlighter
                    theme={theme}
                    text={landingPageData?.company_description}
                  />
                </Typography>
                {landingPageData?.company_button_name && (
                  <CustomStackFullWidth
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <CustomButton onClick={handleButtonClick}>
                      <Typography
                        variant={IsSmallScreen() ? "body2" : "body1"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        {" "}
                        {landingPageData?.company_button_name}
                        {/*<DollarSignHighlighter theme={theme} text={landingPageData?.company_button_name} />*/}
                        <ArrowRightAltIcon />
                      </Typography>
                    </CustomButton>
                  </CustomStackFullWidth>
                )}
              </CustomStackFullWidth>
            </Grid>
            <Grid item xs={12} sm={12} md={6} align="right">
              <DeliveryImage />
            </Grid>
          </Grid>
        </CustomBoxFullWidth>
      </CustomContainer>
    </>
  );
};

ComponentOne.propTypes = {};

export default ComponentOne;
