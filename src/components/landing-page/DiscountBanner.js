import { Box } from "@mui/system";
import React from "react";
import CustomImageContainer from "../CustomImageContainer";
import CustomContainer from "../container";

const DiscountBanner = ({ bannerImage, isSmall }) => {
  return (
    <>
      {isSmall ? (
        <CustomContainer>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              // height: "250px",
              borderRadius: "5px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <CustomImageContainer
              src={bannerImage}
              alt="banner"
              height="100%"
              width="100%"
              obejctfit="contained"
              borderRadius="5px"
            />
          </Box>
        </CustomContainer>
      ) : (
        <CustomContainer>
          <Box
            sx={{
              width: "100%",
              height: "150px",
              borderRadius: "5px",
              marginBottom: "40px ",
              marginTop: "45px",
            }}
          >
            <CustomImageContainer
              src={bannerImage}
              alt="banner"
              height="100%"
              width="100%"
              obejctfit="contained"
              borderRadius="15px"
            />
          </Box>
        </CustomContainer>
      )}
    </>
  );
};

export default DiscountBanner;
