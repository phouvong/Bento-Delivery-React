import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import {
  IconButton,
  NoSsr,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { FoodHalalHaram } from "components/cards/SpecialCard";
import CustomModal from "../../modal";
import { useEffect, useRef, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getLanguage } from "../../../helper-functions/getLanguage";
import { SliderCustom } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import { ProductsThumbnailsSettings } from "./ProductsThumbnailsSettings";
import VideoPlayer from "./VideoPlayer";

const ChildrenImageWrapper = styled(Box)(({ theme, index, image_index }) => ({
  cursor: "pointer",
  border: index === image_index && `2px solid ${theme.palette.primary.main}`,
  borderRadius: ".3rem",
  boxSizing: "border-box",
  height: "100%",
  width: "100%",
  //filter: "drop-shadow(0px 3.41085px 8.52713px rgba(0, 0, 0, 0.1))",
  position: "relative",
  minHeight: "60px",
}));

const VIDEO_SENTINEL = "__VIDEO__";

// Append YouTube/Vimeo autoplay-loop params for the inline embed preview.
// Handles watch URLs, youtu.be short links, and existing /embed/ URLs.
const buildEmbedAutoplayUrl = (url) => {
  if (!url) return url;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  let baseUrl = url;
  let videoId = null;
  if (ytMatch) {
    videoId = ytMatch[1];
    baseUrl = `https://www.youtube.com/embed/${videoId}`;
  } else {
    const embedMatch = url.match(/\/embed\/([^?/&]+)/);
    videoId = embedMatch?.[1];
  }
  const params = [
    "autoplay=1",
    "mute=1",
    "loop=1",
    "controls=0",
    "modestbranding=1",
    "playsinline=1",
    "rel=0",
    videoId ? `playlist=${videoId}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}${params}`;
};

const ProductImageView = ({
  productImage,
  productThumbImage,
  imageBaseUrl,
  configData,
  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
  productDetailsData,
  videoMeta,
}) => {
  const hasVideo = !!videoMeta;
  const [preViewImage, setPreViewImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(hasVideo);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const inlineVideoRef = useRef(null);
  const [isInlineVideoPlaying, setIsInlineVideoPlaying] = useState(true);
  const [modalStartTime, setModalStartTime] = useState(0);
  const modalTimeRef = useRef(0);
  const modalPlayingRef = useRef(true);

  const toggleInlineVideo = (e) => {
    e.stopPropagation();
    const video = inlineVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsInlineVideoPlaying(true);
    } else {
      video.pause();
      setIsInlineVideoPlaying(false);
    }
  };

  const openVideoModal = () => {
    const inline = inlineVideoRef.current;
    const t = inline?.currentTime ?? 0;
    if (inline) {
      inline.pause();
      setIsInlineVideoPlaying(false);
    }
    setModalStartTime(t);
    modalTimeRef.current = t;
    modalPlayingRef.current = true;
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    const inline = inlineVideoRef.current;
    if (inline) {
      try {
        inline.currentTime = modalTimeRef.current || 0;
      } catch (_) {
        // ignore
      }
      if (modalPlayingRef.current) {
        inline.play().then(
          () => setIsInlineVideoPlaying(true),
          () => {},
        );
      } else {
        inline.pause();
        setIsInlineVideoPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (!isVideoSelected || !videoMeta?.inlineUrl) return;
    const v = inlineVideoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () =>
      v.play().then(
        () => setIsInlineVideoPlaying(true),
        () => setIsInlineVideoPlaying(false),
      );
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener("loadeddata", tryPlay, { once: true });
      return () => v.removeEventListener("loadeddata", tryPlay);
    }
  }, [isVideoSelected, videoMeta?.inlineUrl]);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const tempProduct = productImage;
  useEffect(() => {
    setPreViewImage(tempProduct);
  }, [productImage]);

  const allThumbs = hasVideo
    ? [VIDEO_SENTINEL, ...(productThumbImage || [])]
    : productThumbImage || [];

  const handleClick = (item, index) => {
    if (item === VIDEO_SENTINEL) {
      setIsVideoSelected(true);
      setImageIndex(index);
    } else {
      setIsVideoSelected(false);
      setPreViewImage(item);
      setImageIndex(index);
    }
  };
  const borderColor = theme.palette.primary.main;
  return (
    <Stack justifyContent="flex-start" spacing={2} width="100%" sx={{}}>
      <NoSsr>
        <Stack sx={{ position: "relative" }}>
          <Stack
            position="absolute"
            right="10px"
            top={{ xs: "48px", sm: "48px", md: "10px" }}
            zIndex="99"
          >
            {isWishlisted ? (
              <IconButton
                sx={{
                  backgroundColor: (theme) => theme.palette.neutral[300],
                }}
                onClick={(e) => removeFromWishlistHandler(e)}
              >
                <FavoriteIcon
                  style={{
                    width: "15px",
                    height: "15px",
                    color: borderColor,
                  }}
                />
              </IconButton>
            ) : (
              <IconButton
                sx={{
                  backgroundColor: (theme) => theme.palette.neutral[300],
                }}
                onClick={(e) => addToWishlistHandler(e)}
              >
                <FavoriteBorderIcon
                  style={{
                    width: "15px",
                    height: "15px",
                    color: borderColor,
                  }}
                />
              </IconButton>
            )}
          </Stack>
          {isVideoSelected && hasVideo ? (
            <Box
              className="magnify-container"
              onClick={
                videoMeta?.previewType === "upload" ? openVideoModal : undefined
              }
              sx={{
                position: "relative",
                cursor:
                  videoMeta?.previewType === "upload" ? "pointer" : "default",
                width: "100%",
                overflow: "hidden",
                display: "flex !important",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {videoMeta.previewType === "upload" && videoMeta.inlineUrl ? (
                <video
                  key={videoMeta.inlineUrl}
                  ref={inlineVideoRef}
                  src={videoMeta.inlineUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onPlay={() => setIsInlineVideoPlaying(true)}
                  onPause={() => setIsInlineVideoPlaying(false)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                />
              ) : videoMeta.previewType === "embed" && videoMeta.inlineUrl ? (
                <iframe
                  key={videoMeta.inlineUrl}
                  src={buildEmbedAutoplayUrl(videoMeta.inlineUrl)}
                  title="Product video preview"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="eager"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    pointerEvents: "none",
                  }}
                />
              ) : (
                // <Box
                //   component="img"
                //   src={videoMeta.thumbnailUrl}
                //   alt="Video preview"
                //   sx={{
                //     position: "absolute",
                //     inset: 0,
                //     width: "100%",
                //     height: "100%",
                //     objectFit: "cover",
                //     pointerEvents: "none",
                //   }}
                // />
                <iframe
                  src={buildEmbedAutoplayUrl(videoMeta.modalUrl)}
                  title={productDetailsData?.name || "Product Video"}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  // allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    pointerEvents: "auto",
                  }}
                />
              )}
              {videoMeta.previewType === "upload" && videoMeta.inlineUrl ? (
                <Box
                  onClick={toggleInlineVideo}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    zIndex: 2,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
                  }}
                >
                  {isInlineVideoPlaying ? (
                    <PauseIcon sx={{ color: "#fff", fontSize: 30 }} />
                  ) : (
                    <PlayArrowIcon
                      sx={{ color: "#fff", fontSize: 30, ml: "2px" }}
                    />
                  )}
                </Box>
              ) : null}
            </Box>
          ) : (
            <>
              <ReactImageMagnify
                className="magnify-container"
                {...{
                  smallImage: {
                    alt: "image",
                    isFluidWidth: true,
                    src: preViewImage,
                    objectFit: "cover",
                  },
                  imageClassName: "magnify-image",
                  largeImage: {
                    src: preViewImage,
                    width: 1200,
                    height: 1800,
                    objectFit: "cover",
                  },
                  enlargedImageContainerStyle: {
                    backgroundColor: theme.palette.neutral[100],
                    zIndex: "1500",
                  },
                  enlargedImageContainerDimensions: {
                    width: "150%",
                    height: "100%",
                  },
                  enlargedImagePosition: isSmall ? "over" : "beside",
                  enlargedImageContainerClassName:
                    getLanguage() === "rtl" && "rtl-large-image",
                }}
              />
              {productDetailsData?.halal_tag_status &&
              productDetailsData?.is_halal ? (
                <FoodHalalHaram width={30} />
              ) : (
                ""
              )}
            </>
          )}
        </Stack>
      </NoSsr>

      {allThumbs?.length > 0 && (
        <SliderCustom
          sx={{
            margin: {
              xs: "58px 0px 0px 0px !important",
              sm: "40px 0px 0px 0px !important",
              md: "10px 0px 0px 0px !important",
            },
            "& .slick-track": { display: "flex", alignItems: "stretch" },
            "& .slick-slide": { height: "auto" },
            "& .slick-slide > div": { height: "100%" },
          }}
        >
          <Slider {...ProductsThumbnailsSettings}>
            {allThumbs.map((item, index) => {
              if (item === VIDEO_SENTINEL) {
                return (
                  <ChildrenImageWrapper
                    key="video-thumb"
                    onClick={() => handleClick(VIDEO_SENTINEL, index)}
                    index={index}
                    image_index={imageIndex}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: ".3rem",
                      }}
                    >
                      {videoMeta?.previewType === "upload" &&
                      videoMeta?.inlineUrl ? (
                        <video
                          src={videoMeta.inlineUrl}
                          muted
                          playsInline
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                          }}
                        />
                      ) : (
                        <Box
                          component="img"
                          src={videoMeta?.thumbnailUrl}
                          alt="Video"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "relative",
                          zIndex: 1,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.88)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PlayArrowIcon
                          sx={{ color: "#1a1a1a", fontSize: 16, ml: "2px" }}
                        />
                      </Box>
                    </Box>
                  </ChildrenImageWrapper>
                );
              }
              return (
                <ChildrenImageWrapper
                  key={index}
                  onClick={() => handleClick(item, index)}
                  index={index}
                  image_index={imageIndex}
                >
                  <CustomImageContainer
                    src={item}
                    width="100%"
                    height="100%"
                    objectfit="cover"
                  />
                </ChildrenImageWrapper>
              );
            })}
          </Slider>
        </SliderCustom>
      )}

      <CustomModal
        openModal={videoModalOpen}
        handleClose={closeVideoModal}
        maxWidth="md"
      >
        <VideoPlayer
          videoMeta={videoMeta}
          productName={productDetailsData?.name}
          onClose={closeVideoModal}
          startTime={modalStartTime}
          onTimeUpdate={(t) => {
            modalTimeRef.current = t;
          }}
        />
      </CustomModal>
    </Stack>
  );
};

export default ProductImageView;
