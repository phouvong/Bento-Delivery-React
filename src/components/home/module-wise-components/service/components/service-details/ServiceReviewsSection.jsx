import { alpha, Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import DotSpin from "components/DotSpin";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getDateFormat
} from "utils/CustomFunctions";
import CloseIcon from "@mui/icons-material/Close";
import CustomModal from "components/modal";
import { data_limit } from "../../service-api-manage/ApiRoutes";
import useGetServiceReviews from "../../service-api-manage/hooks/react-query/service-reviews/useGetServiceReviews";

const COMMENT_PREVIEW = 220;

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const parseAttachments = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Thumbs = ({ items, onImageClick }) => {
  if (!items?.length) return null;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.slice(0, 4).map((src, idx) => (
        <Box
          key={idx}
          onClick={() => onImageClick?.(src)}
          sx={{
            width: 44,
            height: 44,
            borderRadius: "6px",
            overflow: "hidden",
            cursor: "pointer",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          }}
        >
          <Box
            component="img"
            src={src}
            alt={`attachment-${idx}`}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ))}
    </Stack>
  );
};

const ReviewItem = ({ review, storename, onImageClick }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showFull, setShowFull] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const customerName =
    review?.customer_name ||
    [review?.customer?.f_name, review?.customer?.l_name]
      .filter(Boolean)
      .join(" ")
      .trim();

  const comment = review?.comment ?? "";
  const isLong = comment.length > COMMENT_PREVIEW;
  const displayed =
    showFull || !isLong ? comment : comment.slice(0, COMMENT_PREVIEW).trimEnd();

  const attachments = parseAttachments(review?.attachment);
  const replyAttachments = parseAttachments(review?.reply_attachment);

  return (
    <Stack spacing={1.25}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
          <Avatar
            src={review?.customer_image}
            sx={{ width: 36, height: 36 }}
            alt={customerName}
          />
          <Stack spacing={0.25} minWidth={0}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "13px", md: "14px" },
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {customerName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <i
                className="fi fi-sr-star"
                style={{
                  color: theme.palette.warning.main,
                  fontSize: "12px",
                  display: "flex",
                  lineHeight: 1,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {Number(review?.rating)?.toFixed?.(1) ?? review?.rating}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Typography
          sx={{
            fontSize: { xs: "11px", md: "12px" },
            color: theme.palette.text.secondary,
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {getDateFormat(review?.created_at || review?.updated_at)}
        </Typography>
      </Stack>

      {comment && (
        <Typography
          sx={{
            fontSize: { xs: "13px", md: "14px" },
            color: theme.palette.text.secondary,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
          }}
        >
          {displayed}
          {isLong && (
            <>
              {!showFull && "… "}
              <Box
                component="span"
                role="button"
                tabIndex={0}
                onClick={() => setShowFull((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowFull((v) => !v);
                  }
                }}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  cursor: "pointer",
                  ml: 0.5,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {showFull ? t("See Less") : t("See More")}
              </Box>
            </>
          )}
        </Typography>
      )}

      <Thumbs items={attachments} onImageClick={onImageClick} />

      {review?.reply && (
        <Box>
          {showReply && (
            <Box
              sx={{
                backgroundColor: alpha(
                  theme.palette.neutral?.[400] || theme.palette.text.secondary,
                  0.1
                ),
                borderRadius: "10px",
                p: 1.5,
                ml: { xs: 0, md: 4.5 },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <i
                    className="fi fi-rr-comment-alt-middle"
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      lineHeight: 1,
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "12px", md: "13px" },
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("Reply By")} {storename}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: { xs: "11px", md: "12px" },
                    color: theme.palette.text.secondary,
                  }}
                >
                  {getDateFormat(review?.updated_at)}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: { xs: "12px", md: "13px" },
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                {review?.reply}
              </Typography>
              {replyAttachments.length > 0 && (
                <Box mt={1}>
                  <Thumbs items={replyAttachments} onImageClick={onImageClick} />
                </Box>
              )}
            </Box>
          )}
          <Stack alignItems="center" mt={1}>
            <Box
              role="button"
              tabIndex={0}
              onClick={() => setShowReply((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowReply((v) => !v);
                }
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: { xs: "12px", md: "13px" },
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {showReply ? t("Hide Reply") : t("Show Reply")}
              <i
                className={
                  showReply
                    ? "fi fi-rs-angle-small-up"
                    : "fi fi-rs-angle-small-down"
                }
                style={{
                  fontSize: "14px",
                  display: "flex",
                  lineHeight: 1,
                }}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

const ServiceReviewsSection = ({ serviceId, storename }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [offset, setOffset] = useState(1);
  const [items, setItems] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setOffset(1);
    setItems([]);
  }, [serviceId]);

  const { data, isLoading, isFetching } = useGetServiceReviews(
    { serviceId, limit: data_limit, offset },
    !!serviceId
  );

  useEffect(() => {
    if (!data?.reviews) return;
    setItems((prev) => (offset === 1 ? data.reviews : [...prev, ...data.reviews]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading && !items.length) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          border: `1px solid ${theme.palette.divider}`,
          p: { xs: 1.5, md: 2.5 },
        }}
      >
        <DotSpin />
      </Box>
    );
  }

  if (!items?.length) return null;

  const totalSize = Number(data?.total_size) || items.length;
  const hasMore = items.length < totalSize;

  return (
    <Box
      id="service-reviews-section"
      sx={{
        width: "100%",
        scrollMarginTop: { xs: "70px", md: "100px" },
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        p: { xs: 1.5, md: 2.5 },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "18px", md: "24px" },
          color: theme.palette.text.primary,
          mb: { xs: 1.25, md: 1.75 },
        }}
      >
        {t("Reviews")}
      </Typography>

      <Stack
        divider={
          <Box
            sx={{
              height: "1px",
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
              my: { xs: 1.5, md: 2 },
            }}
          />
        }
      >
        {items.map((review) => (
          <ReviewItem
            key={review?.id}
            review={review}
            storename={storename}
            onImageClick={setPreviewImage}
          />
        ))}
      </Stack>

      {hasMore && (
        <Stack alignItems="center" mt={2}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => !isFetching && setOffset((prev) => prev + 1)}
            onKeyDown={(e) => {
              if (!isFetching && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setOffset((prev) => prev + 1);
              }
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: "13px",
              cursor: isFetching ? "default" : "pointer",
              opacity: isFetching ? 0.6 : 1,
              "&:hover": { textDecoration: isFetching ? "none" : "underline" },
            }}
          >
            {isFetching ? t("Loading") : t("See More")}
          </Box>
        </Stack>
      )}

      <CustomModal
        openModal={!!previewImage}
        handleClose={() => setPreviewImage(null)}
      >
        <Box sx={{ position: "relative", width: "100%" }}>
          <Box
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: alpha(theme.palette.common.black, 0.5),
              color: theme.palette.common.white,
            }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </Box>
          <Box
            component="img"
            src={previewImage}
            alt="review-attachment-preview"
            sx={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ServiceReviewsSection;