import {
  alpha,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import CustomModal from "src/components/modal";
import useGetServiceRequestDetails from "../../service-api-manage/hooks/react-query/service-request/useGetServiceRequestDetails";

const StatusBadge = ({ status }) => {
  const theme = useTheme();
  const configs = {
    pending: {
      label: "Pending",
      bg: theme.palette.customColor.statusPendingBg,
      color: theme.palette.customColor.statusPendingText,
    },
    on_review: {
      label: "On Review",
      bg: theme.palette.customColor.statusReviewBg,
      color: theme.palette.customColor.statusReviewText,
    },
    reviewing: {
      label: "On Review",
      bg: theme.palette.customColor.statusReviewBg,
      color: theme.palette.customColor.statusReviewText,
    },
    rejected: {
      label: "Rejected",
      bg: theme.palette.error.dangerLight,
      color: theme.palette.error.dangerText,
    },
    cancelled: {
      label: "Cancelled",
      bg: theme.palette.customColor.statusCancelledBg,
      color: theme.palette.customColor.statusCancelledText,
    },
  };
  const cfg = configs[status];
  if (!cfg) return null;
  return (
    <Box
      sx={{
        px: "10px",
        py: "3px",
        borderRadius: "20px",
        backgroundColor: cfg.bg,
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 500,
          color: cfg.color,
          lineHeight: 1.5,
        }}
      >
        {cfg.label}
      </Typography>
    </Box>
  );
};

const ViewDetailModal = ({
  item,
  open,
  onClose,
  onDelete,
  isDeleting,
  onCancel,
  isCancelling,
  openMode = "view",
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: detail, isLoading: isDetailLoading } =
    useGetServiceRequestDetails(
      { id: item?.id },
      Boolean(open && item?.id)
    );

  if (!item) return null;

  // Render immediately from the list row, then merge in the details response
  // (which brings `feedback`, updated `status`, `can_edit`, `can_delete`, …)
  // once it lands.
  const view = { ...item, ...(detail || {}) };
  const isPending = view.status === "pending" || !view.status;
  const isReviewing =
    view.status === "reviewing" || view.status === "on_review";
  const hasFeedback = Boolean(view.feedback?.trim());
  const showFeedbackSkeleton = isReviewing && isDetailLoading && !hasFeedback;

  // Opened via the Delete action → always "Delete Request" (delete API),
  // even for an already-cancelled request. Otherwise (opened via View) →
  // "Cancel Request" (cancel API) while still pending, no button once
  // the request is already cancelled/reviewing/rejected.
  const footerAction =
    openMode === "delete" ? "delete" : isPending ? "cancel" : null;

  return (
    <CustomModal openModal={open} handleClose={onClose} maxWidth="444px">
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: "text.secondary",
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <Box sx={{ pt: "24px", pb: "28px", px: { xs: "20px", sm: "32px" } }}>
        <Typography
          align="center"
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: 700,
            color: "text.primary",
            mb: "20px",
            px: "32px",
          }}
        >
          {t("Requested Service")}
        </Typography>

        <Stack
          direction={{ xs: "row", sm: "column" }}
          alignItems="center"
          justifyContent="center"
          gap={{ xs: "12px", sm: "8px" }}
          sx={{ mb: "24px" }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 100 },
              height: { xs: 60, sm: 100 },
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "background.secondary",
              flexShrink: 0,
            }}
          >
            <Image
              src={view.image || customServiceEmptyIcon}
              alt={view.category}
              width={100}
              height={100}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ xs: "flex-start", sm: "center" }}
            gap="8px"
            sx={{ flexWrap: "wrap" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {view.category}
            </Typography>
            {view.status && <StatusBadge status={view.status} />}
          </Stack>
        </Stack>

        <Stack spacing="16px">
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                color: "text.secondary",
                mb: "4px",
              }}
            >
              {t("Requested Service Name")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {view.service_name}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                color: "text.secondary",
                mb: "4px",
              }}
            >
              {t("Description")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                color: "text.primary",
                lineHeight: 1.6,
              }}
            >
              {view.description}
            </Typography>
          </Box>

          {showFeedbackSkeleton ? (
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  color: "text.secondary",
                  mb: "4px",
                }}
              >
                {t("Feedback")}
              </Typography>
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          ) : (
            hasFeedback && (
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    color: "text.secondary",
                    mb: "4px",
                  }}
                >
                  {t("Feedback")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", sm: "16px" },
                    color: "text.primary",
                    lineHeight: 1.6,
                  }}
                >
                  {view.feedback}
                </Typography>
              </Box>
            )
          )}
        </Stack>

        {footerAction && (
          <Button
            fullWidth
            onClick={() =>
              footerAction === "delete" ? onDelete(item.id) : onCancel(item.id)
            }
            disabled={footerAction === "delete" ? isDeleting : isCancelling}
            sx={{
              mt: "28px",
              py: "14px",
              borderRadius: "8px",
              backgroundColor: alpha(theme.palette.error.dangerText, 0.1),
              color: theme.palette.error.dangerText,
              fontSize: "16px",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.dangerText, 0.18),
              },
            }}
          >
            {(footerAction === "delete" ? isDeleting : isCancelling) ? (
              <CircularProgress
                size={22}
                sx={{ color: theme.palette.error.dangerText }}
              />
            ) : footerAction === "delete" ? (
              t("Delete Request")
            ) : (
              t("Cancel Request")
            )}
          </Button>
        )}
      </Box>
    </CustomModal>
  );
};

export default ViewDetailModal;
