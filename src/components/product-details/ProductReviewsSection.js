import { alpha, Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateFormat } from "utils/CustomFunctions";
import useGetProductReviews from "../../api-manage/hooks/react-query/product-details/useProductReviews";

const COMMENT_PREVIEW = 220;

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

const Thumbs = ({ items }) => {
  if (!items?.length) return null;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.slice(0, 4).map((src, idx) => (
        <Box
          key={idx}
          sx={{
            width: 44,
            height: 44,
            borderRadius: "6px",
            overflow: "hidden",
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

const ReviewItem = ({ review, storename }) => {
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

      <Thumbs items={attachments} />

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
                  <Thumbs items={replyAttachments} />
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

const ProductReviewsSection = ({ productId, storename }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [offSet] = useState(1);
  const [page_limits] = useState(10);

  const { data, refetch } = useGetProductReviews({
    productId,
    offSet,
    page_limits,
  });

  useEffect(() => {
    if (productId) {
      refetch();
    }
  }, [productId]);

  const reviews = useMemo(() => data?.reviews ?? [], [data]);

  if (!reviews?.length) return null;

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
      <Typography
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "16px", md: "18px" },
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
        {reviews.map((review) => (
          <ReviewItem key={review?.id} review={review} storename={storename} />
        ))}
      </Stack>
    </Box>
  );
};

export default ProductReviewsSection;
