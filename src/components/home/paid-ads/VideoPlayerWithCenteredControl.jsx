import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Stack, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";

const VideoPlayerWithCenteredControl = ({
  video,
  playing,
  setPlaying,
  ended,
  setEnded,
  height,
  isMargin,
}) => {
  const playerRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (ended) {
      playerRef.current.seekTo(0); // Reset video to start
      setEnded(false);
    }
    setPlaying(!playing);
  };
  const handleEnded = () => {
    setPlaying(false);
    setEnded(true);
  };
  const handlePauseVideo = () => {
    setPlaying(false);
  };
  const handlePlayVideo = () => {
    setPlaying(true);
  };
  return (
    <Stack
      sx={{
        position: "relative",
        margin: isMargin && "0px 25px -110px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0px 15px 30px rgba(0, 0, 0, 0.8)"
            : "0px 15px 30px rgba(150, 150, 154, 0.40)",
        borderRadius: "10px",
        overflow: "hidden",
        height: height ?? "200px",
        backgroundColor: (theme) => theme.palette.neutral[400],
        zIndex: 1,
      }}
    >
      <ReactPlayer
        ref={playerRef}
        url={video}
        width="100%"
        height="100%"
        playing={playing}
        onEnded={handleEnded}
        controls={true}
        muted={true}
        onPause={handlePauseVideo}
        onPlay={handlePlayVideo}
      />
      {playing ? null : (
        <IconButton
          onClick={(e) => handlePlayPause(e)}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: (theme) => theme.palette.neutral[100],
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            color: (theme) => theme.palette.neutral[500],
          }}
        >
          {ended ? (
            <ReplayIcon sx={{ fontSize: "2rem" }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: "2rem" }} />
          )}
        </IconButton>
      )}
    </Stack>
  );
};

export default VideoPlayerWithCenteredControl;
