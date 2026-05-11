import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack } from "@mui/system";
import { createEnhancedArrows } from "components/common/EnhancedSliderArrows";
import { useState } from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomModal from "../../modal";

const SingleOrderAttachment = (props) => {
  const { title, trackOrderData, configData } = props;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const images = trackOrderData?.order_attachment_full_url ?? [];

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: false,
      variant: "white",
    }),
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2.5 },
      },
    ],
  };

  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      spacing={2}
      pl={{ xs: "0px", sm: "0px", md: "28px" }}
      pb="20px"
    >
      <SliderCustom
        nopadding="true"
        padding="0"
        sx={{
          "& .slick-slide > div": {
            padding: "0 6px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& div:has(> .client-nav)": { display: "flex !important" },
        }}
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        <Slider {...sliderSettings}>
          {images.map((url, index) => (
            <Box
              key={index}
              onClick={() => setSelectedImage(url)}
              sx={{
                width: "100px",
                height: "100px",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <CustomImageContainer
                src={url}
                width="100%"
                height="100%"
                objectfit="cover"
                alt="prescription"
                borderRadius="4px"
              />
            </Box>
          ))}
        </Slider>
      </SliderCustom>

      <CustomModal
        openModal={!!selectedImage}
        handleClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <Stack position="relative">
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                zIndex: "999",
                position: "absolute",
                right: 0,
                cursor: "pointer",
                border: "none",
                borderRadius: "50%",
                width: " 2rem",
                height: "2rem",
              }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </button>
            <CustomImageContainer
              src={selectedImage}
              width="600px"
              smWidth="300px"
              objectfit="contain"
              alt="prescription"
            />
          </Stack>
        )}
      </CustomModal>
    </CustomStackFullWidth>
  );
};

SingleOrderAttachment.propTypes = {};

export default SingleOrderAttachment;
