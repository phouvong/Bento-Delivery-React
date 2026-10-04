import React from "react";
import PropTypes from "prop-types";
import CustomImageContainer from "../../../CustomImageContainer";
import { styled } from "@mui/material";
import { CustomBoxFullWidth } from "../../../../styled-components/CustomStyles.style";
import banner from "./assets/banner.png";
import { getHomePageBannerImageUrl } from "utils/CustomFunctions";
import NextImage from "components/NextImage";
const ImageWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  height: "318px",
  [theme.breakpoints.down("sm")]: {
    height: "110px",
  },
}));
const SinglePoster = ({ bannerData }) => {
  return (
    <>
      {bannerData?.bottom_section_banner && (
        <ImageWrapper sx={{marginTop:"1rem",img:{
        width:'100%',
          height:"100%",
          }
        }}>
          <NextImage
            height={318}
            width={1440}
            src={bannerData?.bottom_section_banner_full_url}
            objectFit="cover"
          />
        </ImageWrapper>
      )}
    </>
  );
};

SinglePoster.propTypes = {};

export default SinglePoster;
