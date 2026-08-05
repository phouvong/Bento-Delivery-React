import {
  IconButton,
  NoSsr,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomModal from "../../modal";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { SliderCustom } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import ImageMagnifier from "./ImageMagnifier";
import { ProductsThumbnailsSettings } from "./ProductsThumbnailsSettings";
import VideoPlayer from "./VideoPlayer";

const ChildrenImageWrapper = styled(Box)(({ theme, index, image_index }) => ({
  cursor: "pointer",
  border:
    index === image_index
      ? `1px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "52px",
  aspectRatio: "1 / 1",
  height: "auto",
  maxHeight: "48px",
  margin: "0 auto",
  [theme.breakpoints.up("md")]: {
    maxWidth: "56px",
    maxHeight: "52px",
  },
  position: "relative",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  transition: "border-color 0.15s ease, transform 0.15s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const VIDEO_SENTINEL = "__VIDEO__";

// Append YouTube/Vimeo autoplay-loop params for the inline embed preview.
// Handles watch URLs, youtu.be short links, and existing /embed/ URLs.
const buildEmbedAutoplayUrl = (url) => {
  if (!url) return url;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
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
  containerRadius = "12px",
  onClose,
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
          () => {}
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
        () => setIsInlineVideoPlaying(false)
      );
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener("loadeddata", tryPlay, { once: true });
      return () => v.removeEventListener("loadeddata", tryPlay);
    }
  }, [isVideoSelected, videoMeta?.inlineUrl]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    } else {
      setIsVideoSelected(false);
      setPreViewImage(item);
    }
    setImageIndex(index);
  };

  const goToSlide = (next) => {
    if (next < 0 || next >= allThumbs.length) return;
    handleClick(allThumbs[next], next);
  };

  const goPrev = () => goToSlide(imageIndex - 1);
  const goNext = () => goToSlide(imageIndex + 1);

  const borderColor = theme.palette.primary.main;
  return (
    <Stack justifyContent="flex-start" spacing={2} width="100%" sx={{}}>
      <NoSsr>
        <Stack sx={{ position: "relative" }}>
          <Stack
            position="absolute"
            right={{ xs: "12px", md: "10px" }}
            top={{ xs: "12px", md: "10px" }}
            zIndex="99"
          >
            <IconButton
              onClick={(e) =>
                isWishlisted
                  ? removeFromWishlistHandler(e)
                  : addToWishlistHandler(e)
              }
              sx={{
                width: 36,
                height: 36,
                borderRadius: { xs: "50%", md: "8px" },
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                "&:hover": {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.16)",
                },
              }}
            >
              <i
                className={isWishlisted ? "fi fi-sr-heart" : "fi fi-rr-heart"}
                style={{
                  fontSize: "16px",
                  display: "flex",
                  lineHeight: 1,
                  color: borderColor,
                }}
              />
            </IconButton>
          </Stack>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "282px", md: "282px" },
              aspectRatio: { xs: "auto", md: "1 / 1" },
              borderRadius: containerRadius,
              overflow: "hidden",
            }}
          >
            {/* Close button — mobile only, scrolls with content */}
            {onClose && isMobile && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 5,
                  width: 28,
                  height: 28,
                  padding: 0,
                  backgroundColor: "rgba(0,0,0,0.35)",
                  borderRadius: "50%",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.55)" },
                }}
              >
                <i
                  className="fi fi-rr-cross-small"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    lineHeight: 1,
                    color: "#fff",
                  }}
                />
              </IconButton>
            )}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "282px", md: "282px" },
                aspectRatio: { xs: "auto", md: "1 / 1" },
                overflow: "hidden",
              }}
            >
              {isVideoSelected && hasVideo ? (
                <Box
                  onClick={
                    videoMeta?.previewType === "upload"
                      ? openVideoModal
                      : undefined
                  }
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "282px", md: "282px" },
                    aspectRatio: { xs: "auto", md: "1 / 1" },
                    cursor:
                      videoMeta?.previewType === "upload"
                        ? "pointer"
                        : "default",
                    overflow: "hidden",
                    borderRadius: "12px",
                    backgroundColor: theme.palette.neutral?.[100] || "#f5f5f5",
                  }}
                >
                  {videoMeta?.previewType === "upload" &&
                  videoMeta?.inlineUrl ? (
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
                  ) : videoMeta?.previewType === "embed" &&
                    videoMeta?.inlineUrl ? (
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
                    <iframe
                      src={buildEmbedAutoplayUrl(videoMeta?.modalUrl)}
                      title={productDetailsData?.name || "Product Video"}
                      allow="autoplay; encrypted-media; picture-in-picture"
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
                  {videoMeta?.previewType === "upload" &&
                  videoMeta?.inlineUrl ? (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInlineVideo(e);
                      }}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        margin: "auto",
                        zIndex: 2,
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.92)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <i
                        className={
                          isInlineVideoPlaying
                            ? "fi fi-sr-pause"
                            : "fi fi-sr-play"
                        }
                        style={{
                          color: "#1a1a1a",
                          fontSize: 24,
                          display: "flex",
                          lineHeight: 1,
                          marginLeft: isInlineVideoPlaying ? 0 : 3,
                        }}
                      />
                    </Box>
                  ) : null}
                </Box>
              ) : (
                <ImageMagnifier
                  src={preViewImage}
                  alt={productDetailsData?.name || "image"}
                  radius={containerRadius}
                />
              )}

              {/* prev/next arrows pinned to bottom-left */}
              {allThumbs.length > 1 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    zIndex: 3,
                  }}
                >
                  <IconButton
                    onClick={goPrev}
                    disabled={imageIndex <= 0}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      "&.Mui-disabled": {
                        opacity: 0.5,
                        backgroundColor: theme.palette.background.paper,
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <i
                      className="fi fi-rs-angle-small-left"
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        lineHeight: 1,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goNext}
                    disabled={imageIndex >= allThumbs.length - 1}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      "&.Mui-disabled": {
                        opacity: 0.5,
                        backgroundColor: theme.palette.background.paper,
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <i
                      className="fi fi-rs-angle-small-right"
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        lineHeight: 1,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>
      </NoSsr>

      {allThumbs?.length > 0 && (
        <SliderCustom
          sx={{
            margin: "12px 0px 0px 0px !important",
            "& .slick-list": { padding: "2px 0" },
            "& .slick-track": { display: "flex", alignItems: "stretch" },
            "& .slick-slide": { height: "auto", padding: "0 4px" },
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
                        backgroundColor: "#2a2a2a",
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
                            opacity: 0.55,
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
                            opacity: 0.55,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.92)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <i
                          className="fi fi-sr-play"
                          style={{
                            color: "#1a1a1a",
                            fontSize: 9,
                            display: "flex",
                            lineHeight: 1,
                            marginLeft: "1.5px",
                          }}
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
