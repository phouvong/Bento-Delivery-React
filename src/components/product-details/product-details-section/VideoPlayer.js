import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useRef } from "react";

const VideoPlayer = ({
  videoMeta,
  productName,
  onClose,
  startTime = 0,
  onTimeUpdate,
  onPlayStateChange,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (startTime > 0) {
      try {
        video.currentTime = startTime;
      } catch (_) {
        // ignore (some browsers throw if video isn't ready)
      }
    }
  }, [startTime, videoMeta?.modalUrl]);

  if (!videoMeta?.modalUrl) return null;

  const isEmbed = videoMeta.modalType === "embed";

  return (
    <Box
      sx={{
        width: { xs: "90vw", sm: "80vw", md: "70vw" },
        maxWidth: "900px",
        backgroundColor: "#1a1a1a",
        lineHeight: 0,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, lineHeight: 1.4 }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="#fff"
          noWrap
          sx={{ flex: 1, mr: 1 }}
        >
          {productName || "Product Video"}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      <Box sx={{ px: 1, pb: 1 }}>
        {isEmbed ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={videoMeta.modalUrl}
              title={productName || "Product Video"}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        ) : (
          <video
            ref={videoRef}
            src={videoMeta.modalUrl}
            controls
            autoPlay
            onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
            onPlay={() => onPlayStateChange?.(true)}
            onPause={() => onPlayStateChange?.(false)}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "75vh",
              display: "block",
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default VideoPlayer;
