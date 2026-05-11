import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TrendingIcon from "./TrendingIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha, Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import H2 from "../../typographies/H2";
import { HomeComponentsWrapper } from "../HomePageComponents";
import ReelsModal from "./ReelsModal";
import type { TrendingBiteItem } from "./ReelsModal";
import React from "react";
import useGetReelsList from "api-manage/hooks/react-query/reels/useGetReelsList";
import { getGuestId } from "helper-functions/getToken";
import MainApi from "api-manage/MainApi";
import { reels_list_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import { theme } from "theme/base-theme-options";

const GAP = 12; // px gap between cards
const PAGE_LIMIT = 10;

const MODULE_TITLES: Record<string, string> = {
  food: "Trending Bites",
  grocery: "Fresh Finds",
  ecommerce: "Trending Now",
  pharmacy: "Health Highlights",
  rental: "Quick Picks",
};

const getModuleWiseTitle = (): string => {
  const moduleType = getCurrentModuleType();
  return MODULE_TITLES[moduleType as string] ?? "Trending Bites";
};

const formatViewCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
};

interface TrendingBiteCardProps {
  item: TrendingBiteItem;
  onClick: () => void;
}

const TrendingBiteCard = ({ item, onClick }: TrendingBiteCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => undefined);
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        // Responsive card width: show N.x cards so the next card peeks
        flex: {
          xs: "0 0 calc(78% - 6px)",        // ~1.3 cards — big on mobile
          sm: "0 0 calc(45% - 6px)",         // ~2.2 cards
          md: "0 0 calc(28.57% - 9px)",      // 3.5 cards
          lg: "0 0 calc(22.22% - 10px)",     // 4.5 cards
        },
        minWidth: 0,
        height: { xs: "300px", sm: "320px", md: "400px" },
        cursor: "pointer",
        backgroundColor: "#000",
        flexShrink: 0,

      }}
    >
      {item.videoUrl ? (
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.foodImage}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box
          component="img"
          src={item.foodImage}
          alt={item.dishName}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "/static/no-image-found.png";
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.04)" },
          }}
        />
      )}

      {/* View count badge */}
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: alpha("#000000", 0.5),
          borderRadius: "20px",
          px: 1,
          py: 0.3,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: "13px", color: "white" }} />
        <Typography sx={{ color: "white", fontSize: "11px", fontWeight: 500, lineHeight: 1 }}>
          {item.viewCount}
        </Typography>
      </Box>

      {/* Store info overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
          px: 1.5,
          pt: 4,
          pb: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.8} mb={0.4}>
          <Avatar
            src={item.storeLogo}
            alt={item.storeName}
            sx={{ width: 22, height: 22, border: "1.5px solid white" }}
          />
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: "13px", lineHeight: 1.2 }}>
            {item.storeName}
          </Typography>
          <VerifiedStoreBadge
            verified={item.storeVerified}
            fontSize="14px"
            sx={{
              marginInlineStart: "0px",
            }}
            color="#1c6641"
          />
        </Stack>
        <Typography
          sx={{
            color: alpha("#ffffff", 0.8),
            fontSize: "11px",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.dishName}
        </Typography>
      </Box>
    </Box>
  );
};

interface TrendingBitesProps {
  title?: string;
}

const TrendingBites = ({ title }: TrendingBitesProps) => {
  const { t } = useTranslation();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [items, setItems] = useState<TrendingBiteItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [nextOffset, setNextOffset] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const mapReel = (reel: any): TrendingBiteItem => ({
    id: reel.reel_id,
    foodImage: reel.thumbnail_full_url || "/static/no-image-found.png",
    storeLogo: reel.store_logo_full_url || "/static/no-image-found.png",
    storeName: reel.store_name || "",
    storeId: reel.store_id,
    storeSlug: reel.store_slug,
    storeVerified:
      reel.store_verified ??
      reel.verified_seller ??
      reel.store?.verified_seller ??
      reel.store_details?.verified_seller,
    dishName: reel.description || "",
    viewCount: formatViewCount(reel.stats?.total_views ?? 0),
  });

  const handleSuccess = (data: any) => {
    if (data?.reels) {
      setItems(data.reels.map(mapReel));
      setTotalSize(Number(data?.total_size ?? 0));
      setNextOffset(2);
    }
  };

  const { refetch } = useGetReelsList(handleSuccess, { limit: PAGE_LIMIT, offset: 1, guest_id: getGuestId() });

  const showViewAll = totalSize > PAGE_LIMIT;
  const hasMoreReels = items.length < totalSize;

  const loadMoreReels = useCallback(async () => {
    if (isLoadingMore || items.length >= totalSize) return;
    setIsLoadingMore(true);
    try {
      const guestId = getGuestId();
      const url = `${reels_list_api}?limit=${PAGE_LIMIT}&offset=${nextOffset}${
        guestId ? `&guest_id=${guestId}` : ""
      }`;
      const { data } = await MainApi.get(url);
      const newReels: any[] = data?.reels ?? [];
      if (newReels.length) {
        setItems((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const fresh = newReels.map(mapReel).filter((r) => !existingIds.has(r.id));
          return [...prev, ...fresh];
        });
        setNextOffset((prev) => prev + 1);
      }
      if (data?.total_size != null) setTotalSize(Number(data.total_size));
    } catch (_) {
      // silent — user can retry by clicking next again
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextOffset, isLoadingMore, items.length, totalSize]);

  useEffect(() => {
    refetch();
  }, []);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [items, updateArrows]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card ? card.offsetWidth + GAP : 220) * 2;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  const openReel = useCallback((index: number) => {
    setActiveReelIndex(index);
    setReelsOpen(true);
  }, []);

  const closeReel = useCallback(() => setReelsOpen(false), []);

  const goNext = useCallback(() => {
    setActiveReelIndex((prev) => {
      const next = Math.min(prev + 1, items.length - 1);
      // Prefetch the next page when within 2 reels of the end
      if (hasMoreReels && items.length - next <= 2) {
        loadMoreReels();
      }
      return next;
    });
  }, [items.length, hasMoreReels, loadMoreReels]);

  const goPrev = useCallback(() => {
    setActiveReelIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleViewAll = () => {
    openReel(0);
    if (hasMoreReels) loadMoreReels();
  };

  if (items.length === 0) return null;
console.log({showViewAll,totalSize});

  return (
    <>
      <HomeComponentsWrapper
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        sx={{ px: { xs: 0 } }}
      >
        <CustomStackFullWidth alignItems="center" mb="10px" spacing={1}>
          {/* Header */}
          <CustomStackFullWidth alignItems="center" justifyContent="space-between" direction="row">
            <Stack direction="row" alignItems="center" gap={0.8}>
              <TrendingIcon size={24} />
              <H2 text={t(getModuleWiseTitle())} textAlign="start" component="h2" />
            </Stack>
          </CustomStackFullWidth>

          {/* Slider */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
             
            }}
          >
            {/* Left arrow */}
            <IconButton
              onClick={() => scroll("left")}
              size="small"
              sx={{
                position: "absolute",
                left: { xs: 4, md: 8 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "background.paper",
                boxShadow: 2,
                opacity: isHover && showLeft ? 1 : 0,
                pointerEvents: isHover && showLeft ? "auto" : "none",
                transition: "opacity 0.2s",
                "&:hover": { backgroundColor: "background.paper" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* Scrollable track */}
            <Box
              ref={trackRef}
              sx={{
                display: "flex",
                gap: `${GAP}px`,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                // Hide scrollbar cross-browser
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                py: "10px",
              }}
            >
              {items.map((item, index) => (
                <Box
                  key={item.id}
                  data-card
                  sx={{ scrollSnapAlign: "start", flexShrink: 0,
                    flex: {
                      xs: "0 0 calc(50% - 6px)",
                      sm: "0 0 calc(33.33% - 8px)",
                      md: "0 0 calc(28.57% - 9px)",
                      lg: "0 0 calc(22.22% - 10px)",
                    },
                    minWidth: 0,
                  }}
                >
                  <TrendingBiteCard item={item} onClick={() => openReel(index)} />
                </Box>
              ))}

              {showViewAll && (
                <Box
                  data-card
                  onClick={handleViewAll}
                  sx={{
                    scrollSnapAlign: "start",
                    flexShrink: 0,
                    flex: {
                      xs: "0 0 calc(50% - 6px)",
                      sm: "0 0 calc(33.33% - 8px)",
                      md: "0 0 calc(28.57% - 9px)",
                      lg: "0 0 calc(22.22% - 10px)",
                    },
                    minWidth: 0,
                    height: { xs: "300px", sm: "320px", md: "400px" },
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                    }}
                  >
                    <ArrowForwardIcon />
                  </Box>
                  <Typography fontWeight={600} fontSize="14px" color="primary.main">
                    {t("View All")}
                  </Typography>
                  <Typography fontSize="12px" color="text.secondary">
                    {`${totalSize} ${t("bites")}`}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Right arrow */}
            <IconButton
              onClick={() => scroll("right")}
              size="small"
              sx={{
                position: "absolute",
                right: { xs: 4, md: 8 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "background.paper",
                boxShadow: 2,
                opacity: isHover && showRight ? 1 : 0,
                pointerEvents: isHover && showRight ? "auto" : "none",
                transition: "opacity 0.2s",
                "&:hover": { backgroundColor: "background.paper" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </CustomStackFullWidth>
      </HomeComponentsWrapper>

      <ReelsModal
        open={reelsOpen}
        onClose={closeReel}
        items={items}
        activeIndex={activeReelIndex}
        onNext={goNext}
        onPrev={goPrev}
        onViewCountUpdate={(reelId, count) => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === reelId
                ? { ...item, viewCount: formatViewCount(count) }
                : item
            )
          );
        }}
      />
    </>
  );
};

export default TrendingBites;
