import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  alpha,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import React from "react";
import { useRouter } from "next/router";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import VerifiedStoreBadgeJs from "components/cards/VerifiedStoreBadge";

const VerifiedStoreBadge = VerifiedStoreBadgeJs as React.FC<{
  verified?: boolean | number;
  fontSize?: string;
  sx?: any;
  color?: string;
}>;
import { getToken, getGuestId } from "helper-functions/getToken";
import useGetReelsDetails from "api-manage/hooks/react-query/reels/useGetReelsDetails";
import useGetReelsStats from "api-manage/hooks/react-query/reels/useGetReelsStats";
import usePostReelLike from "api-manage/hooks/react-query/reels/usePostReelLike";
import usePostReelVisit from "api-manage/hooks/react-query/reels/usePostReelVisit";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";

const formatViewCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
};

// Module-level blob cache — mirrors Flutter's CacheManager.
// Survives component remounts; blob URLs are never revoked once cached so
// repeated opens of the same reel are instant (no network round-trip).
const reelVideoCache = new Map<number, string>();

// Tracks in-flight preload downloads so we never start two for the same reel.
const reelPreloadInFlight = new Map<number, Promise<string | null>>();

// Build proxy URL with auth query params (runs in browser — reads localStorage).
const buildProxyUrl = (reelId: number): string => {
  const token    = localStorage.getItem("token");
  const zoneid   = localStorage.getItem("zoneid");
  const moduleId = JSON.parse(localStorage.getItem("module") || "null")?.id;
  const lang     = JSON.parse(localStorage.getItem("language-setting") || "null");
  const loc      = JSON.parse(localStorage.getItem("currentLatLng") || "null");
  const guestId  = !token ? localStorage.getItem("guest_id") : null;

  const params = new URLSearchParams({ reel_id: String(reelId) });
  if (token)    params.set("t",        token);
  if (moduleId) params.set("mid",      String(moduleId));
  if (zoneid)   params.set("zid",      zoneid);
  if (lang)     params.set("lang",     lang);
  if (loc?.lat) params.set("lat",      String(loc.lat));
  if (loc?.lng) params.set("lng",      String(loc.lng));
  if (guestId)  params.set("guest_id", guestId);
  return `/api/reels/stream?${params.toString()}`;
};

// Size of each Range chunk (2 MB).
const CHUNK_SIZE = 2 * 1024 * 1024;

type ProgressListener = (loaded: number, total: number) => void;

// Per-reel download progress state + listeners.
// Lets callers subscribe to a reel's download without starting a new fetch.
const reelProgress = new Map<number, { loaded: number; total: number }>();
const reelProgressListeners = new Map<number, Set<ProgressListener>>();

const notifyProgress = (reelId: number, loaded: number, total: number) => {
  reelProgress.set(reelId, { loaded, total });
  reelProgressListeners.get(reelId)?.forEach((cb) => cb(loaded, total));
};

// Subscribe to download progress for a reel. Returns unsubscribe function.
// If a download already has progress, the callback is invoked synchronously
// with the latest value.
export const subscribeToReelProgress = (
  reelId: number,
  cb: ProgressListener
): (() => void) => {
  let set = reelProgressListeners.get(reelId);
  if (!set) {
    set = new Set();
    reelProgressListeners.set(reelId, set);
  }
  set.add(cb);
  const current = reelProgress.get(reelId);
  if (current) cb(current.loaded, current.total);
  return () => {
    set!.delete(cb);
  };
};

// Download reel via proxy in sequential 2 MB Range chunks, assemble into a
// single Blob, and cache as a blob URL. Each chunk is a separate 206 response.
// Progress is reported via subscribeToReelProgress.
// Returns cached URL on hit, null on failure.
export const preloadReel = (reelId: number): Promise<string | null> => {
  const cached = reelVideoCache.get(reelId);
  if (cached) return Promise.resolve(cached);

  const inFlight = reelPreloadInFlight.get(reelId);
  if (inFlight) return inFlight;

  const promise = (async () => {
    try {
      const url = buildProxyUrl(reelId);
      const chunks: Uint8Array[] = [];
      let offset = 0;
      let total = Infinity; // filled in from Content-Range on the first chunk

      while (offset < total) {
        const end = offset + CHUNK_SIZE - 1;
        const res = await fetch(url, {
          headers: { Range: `bytes=${offset}-${end}` },
        });
        if (!res.ok && res.status !== 206) return null;

        // "bytes 0-2097151/21281243" → total = 21281243
        if (total === Infinity) {
          const cr = res.headers.get("content-range");
          const m = cr && cr.match(/\/(\d+)$/);
          if (m) total = parseInt(m[1], 10);
        }

        const buf = await res.arrayBuffer();
        if (buf.byteLength === 0) break;
        chunks.push(new Uint8Array(buf));
        offset += buf.byteLength;

        notifyProgress(reelId, offset, total);
      }

      const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      reelVideoCache.set(reelId, blobUrl);
      notifyProgress(reelId, total, total);
      return blobUrl;
    } catch {
      return null;
    } finally {
      reelPreloadInFlight.delete(reelId);
    }
  })();

  reelPreloadInFlight.set(reelId, promise);
  return promise;
};

export interface TrendingBiteItem {
  id: number;
  foodImage: string;
  storeLogo: string;
  storeName: string;
  storeId?: number | string;
  storeSlug?: string;
  storeVerified?: boolean | number;
  dishName: string;
  viewCount: string;
  videoUrl?: string;
}

interface ReelsModalProps {
  open: boolean;
  onClose: () => void;
  items: TrendingBiteItem[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onViewCountUpdate?: (reelId: number, count: number) => void;
}

const ReelsModal = ({
  open,
  onClose,
  items,
  activeIndex,
  onNext,
  onPrev,
  onViewCountUpdate,
}: ReelsModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const item = items[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === items.length - 1;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastClickRef = useRef<number>(0);

  // Callback ref: sets videoRef AND triggers a re-render so the streaming
  // effect re-runs once the video element is actually in the DOM.
  const [videoMounted, setVideoMounted] = useState(false);
  const videoCallbackRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    setVideoMounted(!!el);
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likeBurst, setLikeBurst] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const isLoggedIn = !!getToken();
  const guestId = isLoggedIn ? undefined : getGuestId();

  const { data: reelDetails } = useGetReelsDetails(item?.id ?? null, {}, guestId);
  const { data: reelStats } = useGetReelsStats(item?.id ?? null, {}, guestId);
  const { mutate: postLike } = usePostReelLike();
  const { mutate: postVisit } = usePostReelVisit();

  // Derive a primitive so the effect below never re-runs due to object reference churn
  const serverLiked: boolean =
    reelStats?.is_liked ?? reelStats?.liked ?? reelStats?.stats?.is_liked ?? false;

  // Seed liked state from API so previously liked reels show correctly on open
  useEffect(() => {
    if (!item || reelStats == null) return;
    setLikedMap((prev) => {
      if (prev[item.id] === serverLiked) return prev;
      return { ...prev, [item.id]: serverLiked };
    });
  }, [item?.id, serverLiked]); // primitive dep — stable across re-renders

  useEffect(() => {
    // Reset state whenever the active reel changes, even before the video
    // element is mounted (so the spinner shows immediately).
    if (!open || !item) return;
    setIsPlaying(false);
    setProgress(0);
    setBuffered(0);
    setIsBuffering(true);
    setHasVideo(false);

    // videoMounted ensures this effect re-runs once the Dialog has rendered
    // the <video> element and videoCallbackRef has set videoRef.current.
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const abort = new AbortController();

    const tryPlay = () => {
      video.muted = isMuted;
      video.play().catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted so playback
        // still starts; user can tap the speaker icon to unmute.
        if (!video.muted) {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => undefined);
        }
      });
    };

    const onCanPlay    = () => { setIsBuffering(false); tryPlay(); };
    const onPlaying    = () => { setIsBuffering(false); setIsPlaying(true); };
    const onPause      = () => setIsPlaying(false);
    const onWaiting    = () => setIsBuffering(true);
    const onTimeUpdate = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
    };
    // Fires as the browser downloads data (streams via Range requests).
    // Keeps the buffered bar in sync with what's actually on disk.
    const onBufferProgress = () => {
      if (!video.duration || video.buffered.length === 0) return;
      setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
    };

    video.addEventListener("canplay",    onCanPlay);
    video.addEventListener("playing",    onPlaying);
    video.addEventListener("pause",      onPause);
    video.addEventListener("waiting",    onWaiting);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress",   onBufferProgress);

    const removeListeners = () => {
      video.removeEventListener("canplay",    onCanPlay);
      video.removeEventListener("playing",    onPlaying);
      video.removeEventListener("pause",      onPause);
      video.removeEventListener("waiting",    onWaiting);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress",   onBufferProgress);
    };

    // ── Cache hit — instant play ──
    const cached = reelVideoCache.get(item.id);
    if (cached) {
      video.muted = isMuted;
      video.src   = cached;
      setHasVideo(true);
      if (video.readyState >= 3) tryPlay();
      return () => {
        removeListeners();
        video.pause();
        video.src = "";
        video.load();
      };
    }

    // ── No cache — stream via proxy URL ──
    //   Browser makes its own Range requests and plays as soon as it has
    //   enough data (moov atom + a few frames). If the MP4 is faststart-
    //   encoded, playback starts after the first ~2 MB chunk.
    const proxyUrl = buildProxyUrl(item.id);
    video.muted = isMuted;
    video.src   = proxyUrl;
    setHasVideo(true);

    // Also kick off a background chunked download so the blob is cached for
    // the next time the user opens this reel (instant replay).
    preloadReel(item.id).catch(() => undefined);

    return () => {
      cancelled = true;
      abort.abort();
      removeListeners();
      video.pause();
      video.src = "";
      video.load();
    };
  }, [open, item?.id, videoMounted]);


  // Sync muted state to video element
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") onNext();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onNext, onPrev, onClose]);

  const isLiked = !!likedMap[item?.id];
  const baseLikeCount =
    reelStats?.total_likes ?? reelStats?.stats?.total_likes ??
    reelDetails?.stats?.total_likes ?? reelDetails?.like_count ?? 0;
  const likeCount = baseLikeCount + (isLiked ? 1 : 0);
  const liveViewCount =
    reelStats?.total_views ?? reelStats?.stats?.total_views ?? null;

  useEffect(() => {
    if (item && liveViewCount != null) {
      onViewCountUpdate?.(item.id, liveViewCount);
    }
  }, [item?.id, liveViewCount]);

  const triggerLike = (forceLike = false) => {
    if (!item) return;
    if (!isLoggedIn) {
      toast.error(t(not_logged_in_message));
      return;
    }
    const current = !!likedMap[item.id];
    const next = forceLike ? true : !current;
    setLikedMap((prev) => ({ ...prev, [item.id]: next }));
    if (next) {
      setLikeBurst(true);
      window.setTimeout(() => setLikeBurst(false), 700);
    }
    postLike({ reelId: item.id, guestId });
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const bar = e.currentTarget as HTMLDivElement;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = ratio * video.duration;
  };

  const handleVideoClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 280) {
      triggerLike(true);
      lastClickRef.current = 0;
      return;
    }
    lastClickRef.current = now;
    window.setTimeout(() => {
      if (lastClickRef.current && now === lastClickRef.current) {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
        lastClickRef.current = 0;
      }
    }, 290);
  };

  if (!item) return null;
  console.log({item});
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={false}
      PaperProps={{
        sx: {
          backgroundColor: "#1c1c1c",
          boxShadow: "none",
          borderRadius: { xs: 0, md: "16px" },
          overflow: "hidden",
          width: { xs: "100%", md: "880px" },
          height: { xs: "100%", md: "auto" },
          maxWidth: { xs: "100%", md: "calc(100% - 32px)" },
          maxHeight: { xs: "100%", md: "calc(100% - 32px)" },
          m: { xs: 0, md: 2 },
          userSelect: "none",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: alpha("#000000", 0.88),
        },
      }}
    >
      {/* ── Header bar ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.2, backgroundColor: "#1c1c1c", flexShrink: 0 }}
      >
        <Typography sx={{ color: "white", fontSize: "13px", fontWeight: 600 }}>
          {t("Reels")}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "white", p: 0.4 }}
        >
          <CloseIcon sx={{ fontSize: "17px" }} />
        </IconButton>
      </Stack>

      {/* ── Body ── */}
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="center"
        sx={{
          position: "relative",
          px: { xs: 0, md: 2 },
          pb: { xs: 0, md: 2 },
          gap: { xs: 0, md: 1 },
          flex: { xs: 1, md: "initial" },
          minHeight: 0,
        }}
      >
        {/* Video card */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "450px" },
            height: { xs: "100%", md: "630px" },
            flex: { xs: 1, md: "initial" },
            maxWidth: "100%",
            backgroundColor: "#000",
            borderRadius: { xs: 0, md: "10px" },
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Thumbnail — visible until video starts */}
          <Box
            component="img"
            src={item.foodImage}
            alt={item.dishName}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/static/no-image-found.png";
            }}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Native <video> with HLS.js attached */}
          <Box
            onClick={handleVideoClick}
            sx={{
              position: "absolute",
              inset: 0,
              cursor: "pointer",
            }}
          >
            <video
              ref={videoCallbackRef}
              loop
              playsInline
              
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          {/* Buffering indicator */}
          {isBuffering && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4,
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: alpha("#000000", 0.5),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                <CircularProgress
                  size={32}
                  thickness={3}
                  sx={{
                    color: "white",
                    "@keyframes spinFade": {
                      "0%":   { opacity: 1 },
                      "50%":  { opacity: 0.6 },
                      "100%": { opacity: 1 },
                    },
                    animation: "spinFade 1.2s ease-in-out infinite, MuiCircularProgress-keyframes-circular-rotate 0.9s linear infinite",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Mute toggle */}
          {hasVideo && (
            <IconButton
              onClick={() => setIsMuted((m) => !m)}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 5,
                color: "white",
                backgroundColor: alpha("#000000", 0.45),
                "&:hover": { backgroundColor: alpha("#000000", 0.6) },
              }}
            >
              {isMuted ? (
                <VolumeOffIcon sx={{ fontSize: "18px" }} />
              ) : (
                <VolumeUpIcon sx={{ fontSize: "18px" }} />
              )}
            </IconButton>
          )}

          {/* Center play indicator */}
          {hasVideo && !isPlaying && !isBuffering && (
            <Box
              onClick={() =>
                videoRef.current?.play().catch(() => undefined)
              }
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: alpha("#000000", 0.55),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayArrowIcon sx={{ color: "white", fontSize: "44px" }} />
              </Box>
            </Box>
          )}

          {/* Heart burst on double-click */}
          {likeBurst && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 6,
                "@keyframes heartBurst": {
                  "0%": { transform: "scale(0.4)", opacity: 0 },
                  "30%": { transform: "scale(1.2)", opacity: 1 },
                  "70%": { transform: "scale(1)", opacity: 1 },
                  "100%": { transform: "scale(1.4)", opacity: 0 },
                },
              }}
            >
              <FavoriteIcon
                sx={{
                  color: "#ff3b5c",
                  fontSize: "120px",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))",
                  animation: "heartBurst 0.7s ease-out forwards",
                }}
              />
            </Box>
          )}

          {/* Stream progress bar */}
          {hasVideo && (
            <Box
              onClick={seekTo}
              onTouchStart={seekTo}
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 12,
                display: "flex",
                alignItems: "flex-end",
                cursor: "pointer",
                zIndex: 10,
                "& > .bar-track": {
                  width: "100%",
                  height: 3,
                  backgroundColor: alpha("#ffffff", 0.2),
                  transition: "height 0.15s ease",
                },
                "&:hover > .bar-track": { height: 5 },
              }}
            >
            <Box className="bar-track" sx={{ position: "relative" }}>
              {/* Buffered layer */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: `${buffered}%`,
                  height: "100%",
                  backgroundColor: alpha("#ffffff", 0.4),
                  transition: "width 0.3s ease",
                }}
              />
              {/* Played layer */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "primary.main",
                  transition: "width 0.1s linear",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    right: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                  },
                }}
              />
            </Box>
            </Box>
          )}

          {/* Bottom store info overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
              px: 1.5,
              pt: 5,
              pb: 1.5,
              zIndex: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              mb={0.5}
              onClick={() => {
                postVisit({ reelId: item.id, guestId });
                handleStoreRedirect(
                  { id: item.storeId, slug: item.storeSlug },
                  router
                );
              }}
              sx={{ cursor: "pointer" }}
            >
              <Avatar
                src={item.storeLogo}
                alt={item.storeName}
                sx={{ width: 24, height: 24, border: "1.5px solid white" }}
              />
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "13px" }}
              >
                {item.storeName}
              </Typography>
              <VerifiedStoreBadge
                verified={item.storeVerified}
                fontSize="13px"
                color="#1c6641"
                sx={{ marginInlineStart: "0px" }}
              />
            </Stack>
            <Typography
              sx={{
                color: alpha("#ffffff", 0.8),
                fontSize: "11px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.dishName}
            </Typography>
          </Box>
        </Box>

        {/* Right-side action column */}
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: { xs: "44px", md: "44px" },
            py: { xs: 1.5, md: 1 },
            flexShrink: 0,
            position: { xs: "absolute", md: "static" },
            top: { xs: 0, md: "auto" },
            bottom: { xs: 60, md: "auto" },
            right: { xs: 8, md: "auto" },
            zIndex: 5,
            pointerEvents: "auto",
            "& .MuiIconButton-root": {
              filter: {
                xs: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
                md: "none",
              },
            },
            "& .MuiTypography-root": {
              textShadow: {
                xs: "0 1px 4px rgba(0,0,0,0.7)",
                md: "none",
              },
            },
          }}
        >
          <Box />

          {/* Prev / Next */}
          <Stack alignItems="center" gap={0.6}>
            <IconButton
              size="small"
              onClick={onPrev}
              disabled={isFirst}
              sx={{
                color: "white",
                backgroundColor: alpha("#ffffff", 0.18),
                p: 0.4,
                "&:hover": { backgroundColor: alpha("#ffffff", 0.32) },
                "&.Mui-disabled": { opacity: 0.3, color: "white" },
              }}
            >
              <KeyboardArrowUpIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onNext}
              disabled={isLast}
              sx={{
                color: "white",
                backgroundColor: alpha("#ffffff", 0.18),
                p: 0.4,
                "&:hover": { backgroundColor: alpha("#ffffff", 0.32) },
                "&.Mui-disabled": { opacity: 0.3, color: "white" },
              }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Stack>

          {/* Like + Views */}
          <Stack alignItems="center" gap={1.2}>
            <Stack alignItems="center" gap={0.2}>
              <IconButton
                size="small"
                onClick={() => triggerLike(false)}
                sx={{
                  color: isLiked ? "#ff3b5c" : "white",
                  p: 0.3,
                  "&:hover": { color: isLoggedIn ? "#ff3b5c" : "white" },
                  "&.Mui-disabled": { color: alpha("#ffffff", 0.35) },
                }}
              >
                {isLiked ? (
                  <FavoriteIcon sx={{ fontSize: "22px" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: "22px" }} />
                )}
              </IconButton>
              <Typography
                sx={{ color: "white", fontSize: "11px", fontWeight: 500 }}
              >
                {likeCount}
              </Typography>
            </Stack>

            <Stack alignItems="center" gap={0.2}>
              <VisibilityOutlinedIcon
                sx={{ fontSize: "22px", color: "white" }}
              />
              <Typography
                sx={{ color: "white", fontSize: "11px", fontWeight: 500 }}
              >
                {liveViewCount != null ? formatViewCount(liveViewCount) : item.viewCount}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ReelsModal;
