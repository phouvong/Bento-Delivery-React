import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import CustomImageContainerJs from "../../CustomImageContainer";

const CustomImageContainer = CustomImageContainerJs as React.FC<any>;

const buildEmbedAutoplayUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  let baseUrl = url;
  let videoId: string | null = null;
  if (ytMatch) {
    videoId = ytMatch[1];
    baseUrl = `https://www.youtube.com/embed/${videoId}`;
  } else {
    const embedMatch = url.match(/\/embed\/([^?/&]+)/);
    videoId = embedMatch?.[1] ?? null;
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

interface FoodModalMediaPreviewProps {
  imageUrl?: string | string[];
  product:
    | ({
        video_preview_available?: boolean;
        video_preview_type?: string | null;
        video_preview_url?: string | null;
        video_preview_modal_url?: string | null;
      } & Record<string, any>)
    | null
    | undefined;
  height?: string;
  aspectRatio?: string;
  borderRadius?: string;
  alt?: string;
}

interface ArrowProps {
  direction: "prev" | "next";
  onClick?: () => void;
}

const SliderArrow = ({ direction, onClick }: ArrowProps) => (
  <IconButton
    onClick={onClick}
    size="small"
    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
    sx={{
      position: "absolute",
      top: "50%",
      [direction === "prev" ? "left" : "right"]: 8,
      transform: "translateY(-50%)",
      zIndex: 3,
      width: 28,
      height: 28,
      backgroundColor: "rgba(0,0,0,0.45)",
      color: "#fff",
      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
    }}
  >
    {direction === "prev" ? (
      <ChevronLeftIcon fontSize="small" />
    ) : (
      <ChevronRightIcon fontSize="small" />
    )}
  </IconButton>
);

const FoodModalMediaPreview = ({
  imageUrl,
  product,
  height = "200px",
  aspectRatio = "2/1",
  borderRadius = ".3rem",
  alt = "Product",
}: FoodModalMediaPreviewProps) => {
  const previewType = product?.video_preview_type;
  const inlineUrl = product?.video_preview_url ?? "";
  const modalUrl = product?.video_preview_modal_url ?? "";

  const useVideoTag = previewType === "upload" && !!inlineUrl;
  const useEmbedInline = previewType === "embed" && !!inlineUrl;

  const videoUrl = useVideoTag || useEmbedInline ? inlineUrl : modalUrl;

  const hasVideo = !!product?.video_preview_available && !!videoUrl;

  const images = Array.isArray(imageUrl)
    ? imageUrl.filter(Boolean)
    : imageUrl
    ? [imageUrl]
    : [];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = (hasVideo ? 1 : 0) + images.length;

  useEffect(() => {
    if (!hasVideo || !useVideoTag) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* autoplay blocked, user can swipe */
        });
      }
    };
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener("loadeddata", tryPlay, { once: true });
      return () => v.removeEventListener("loadeddata", tryPlay);
    }
  }, [hasVideo, useVideoTag, videoUrl]);

  if (!hasVideo && images.length <= 1) {
    return (
      <CustomImageContainer
        src={images[0]}
        borderRadius={borderRadius}
        width="100%"
        height={height}
        alt={alt}
        objectfit="cover"
        aspectRatio={aspectRatio}
      />
    );
  }

  const slideShellSx = {
    position: "relative" as const,
    width: "100%",
    height,
    aspectRatio,
    overflow: "hidden",
    borderRadius,
    backgroundColor: "#000",
  };

  const mediaStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    border: 0,
  };

  const videoSlide = (
    <Box sx={slideShellSx}>
      {useVideoTag ? (
        <video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ ...mediaStyle, pointerEvents: "none" }}
        />
      ) : (
        <iframe
          key={videoUrl}
          src={buildEmbedAutoplayUrl(videoUrl)}
          title="Product video preview"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          style={{ ...mediaStyle, pointerEvents: "none" }}
        />
      )}
    </Box>
  );

  const imageSlides = images.map((src, idx) => (
    <Box key={`${src}-${idx}`}>
      <CustomImageContainer
        src={src}
        borderRadius={borderRadius}
        width="100%"
        height={height}
        alt={alt}
        objectfit="cover"
        aspectRatio={aspectRatio}
      />
    </Box>
  ));

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    prevArrow:
      currentSlide > 0 ? <SliderArrow direction="prev" /> : <span />,
    nextArrow:
      currentSlide < totalSlides - 1 ? (
        <SliderArrow direction="next" />
      ) : (
        <span />
      ),
  };

  return (
    <Box
      sx={{
        position: "relative",
        "& .slick-list": { borderRadius },
        "& .slick-slide > div": { lineHeight: 0 },
        "& .slick-arrow.slick-disabled": { display: "none !important" },
        "& .slick-dots": {
          position: "absolute",
          bottom: 8,
          margin: 0,
          zIndex: 2,
          "& li": { margin: "0 2px" },
          "& li button:before": {
            color: "#fff",
            opacity: 0.6,
            fontSize: "8px",
          },
          "& li.slick-active button:before": { opacity: 1 },
        },
      }}
    >
      <Slider {...sliderSettings}>
        {hasVideo && <Box>{videoSlide}</Box>}
        {imageSlides}
      </Slider>
    </Box>
  );
};

export default FoodModalMediaPreview;
