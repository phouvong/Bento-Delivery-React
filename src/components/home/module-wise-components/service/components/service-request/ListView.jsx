import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  alpha,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { data_limit } from "api-manage/ApiRoutes";
import useCancelServiceRequest from "../../service-api-manage/hooks/react-query/service-request/useCancelServiceRequest";
import useDeleteServiceRequest from "../../service-api-manage/hooks/react-query/service-request/useDeleteServiceRequest";
import useGetMyRequestedServiceList from "../../service-api-manage/hooks/react-query/service-request/useGetServiceRequestList";
import CustomPagination from "components/custom-pagination";
import Image from "next/image";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { formatDayLabel, groupByDay } from "utils/dayGroupUtils";
import CreateEditServiceRequestModal from "./CreateEditServiceRequestModal";
import ViewDetailModal from "./ViewDetailModal";

// ── Status badge ──────────────────────────────────────────────────────────────
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
        px: "8px",
        py: "3px",
        borderRadius: "20px",
        backgroundColor: cfg.bg,
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: "12px", fontWeight: 400, color: cfg.color }}>
        {cfg.label}
      </Typography>
    </Box>
  );
};

// ── Column widths ─────────────────────────────────────────────────────────────
const COL_SERVICE = { flexShrink: 0 };
const COL_DESC = { flex: 1 };
const COL_ACTIONS = { width: 136, flexShrink: 0 };

// ── Action icon button ────────────────────────────────────────────────────────
const ActionButton = ({ children, iconColor, onClick }) => {
  const theme = useTheme();
  return (
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: alpha(iconColor, 0.25),
        backgroundColor: theme.palette.background.default,
        color: iconColor,
        "&:hover": { backgroundColor: alpha(iconColor, 0.15) },
      }}
    >
      {children}
    </IconButton>
  );
};

// ── Service row ───────────────────────────────────────────────────────────────
const ServiceRow = ({ item, onOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isPending = item.status === "pending" || !item.status;
  const isCancelled = item.status === "cancelled";

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleEdit = () => {
    closeMenu();
    onOpen(item, "edit");
  };

  const handleView = () => {
    closeMenu();
    onOpen(item, "view");
  };

  const handleDelete = () => {
    closeMenu();
    onOpen(item, "delete");
  };

  const dropdownMenu = (
    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={closeMenu}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: `0 4px 16px ${alpha(theme.palette.text.primary, 0.12)}`,
          minWidth: 160,
        },
      }}
    >
      <MenuItem onClick={handleView} sx={{ gap: "8px" }}>
        <ListItemIcon
          sx={{ minWidth: "auto", color: theme.palette.neutral[500] }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography sx={{ fontSize: "14px" }}>View</Typography>
      </MenuItem>
      {isPending && (
        <MenuItem onClick={handleEdit} sx={{ gap: "8px" }}>
          <ListItemIcon
            sx={{ minWidth: "auto", color: theme.palette.info.blue }}
          >
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: "14px" }}>Edit</Typography>
        </MenuItem>
      )}
      {(isPending || isCancelled) && (
        <MenuItem onClick={handleDelete} sx={{ gap: "8px" }}>
          <ListItemIcon
            sx={{ minWidth: "auto", color: theme.palette.error.red }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: "14px", color: theme.palette.error.red }}>
            Delete
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );

  // ── Mobile ─────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Box sx={{ py: "12px" }}>
        <Stack direction="row" alignItems="flex-start" gap="12px">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "background.secondary",
            }}
          >
            <Image
              src={item.image || customServiceEmptyIcon}
              alt={item.category}
              width={44}
              height={44}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>

          <Stack spacing="4px" sx={{ flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              gap="8px"
              flexWrap="wrap"
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                {item.category}
              </Typography>
              {item.status && <StatusBadge status={item.status} />}
            </Stack>
            <Typography
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
            >
              Requested Service:{" "}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {item.service_name}
              </Box>
            </Typography>
          </Stack>

          <IconButton
            size="small"
            onClick={openMenu}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              color: "text.primary",
              flexShrink: 0,
            }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        {dropdownMenu}
      </Box>
    );
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap="20px"
      sx={{ py: "16px" }}
    >
      <Stack direction="row" alignItems="center" gap="12px" sx={COL_SERVICE}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "background.secondary",
          }}
        >
          <Image
            src={item.image || customServiceEmptyIcon}
            alt={item.category}
            width={44}
            height={44}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </Box>

        <Stack spacing="4px">
          <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {item.category}
            </Typography>
            {item.status && <StatusBadge status={item.status} />}
          </Stack>
          <Typography
            sx={{ fontSize: "13px", color: "text.secondary", lineHeight: 1.3 }}
          >
            Requested Service:{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {item.service_name}
            </Box>
          </Typography>
        </Stack>
      </Stack>

      <Typography
        sx={{
          ...COL_DESC,
          maxWidth: "400px",
          fontSize: "13px",
          color: "text.secondary",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: 1.5,
        }}
      >
        {item.description}
      </Typography>

      <Stack
        direction="row"
        gap="8px"
        alignItems="center"
        justifyContent="flex-end"
        sx={COL_ACTIONS}
      >
        <ActionButton
          iconColor={theme.palette.neutral[500]}
          onClick={handleView}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
        </ActionButton>
        {isPending && (
          <ActionButton
            iconColor={theme.palette.info.blue}
            onClick={handleEdit}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </ActionButton>
        )}
        {(isPending || isCancelled) && (
          <ActionButton
            iconColor={theme.palette.error.red}
            onClick={handleDelete}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </ActionButton>
        )}
      </Stack>
    </Stack>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ListView = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [offset, setOffset] = useState(1);
  const [activeTab] = useState("all");
  const [modal, setModal] = useState({ item: null, mode: "view" });
  const [editModal, setEditModal] = useState({ open: false, item: null });

  const queryClient = useQueryClient();

  const { mutate: deleteService, isLoading: isDeleting } =
    useDeleteServiceRequest({
      onSuccess: async (res) => {
        toast.success(res?.message || t("Request deleted successfully"));
        setModal({ item: null, mode: "view" });
        await queryClient.refetchQueries(["my-service-request-list"]);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || t("Something went wrong"));
      },
    });

  const { mutate: cancelService, isLoading: isCancelling } =
    useCancelServiceRequest({
      onSuccess: async (res) => {
        toast.success(res?.message || t("Request cancelled successfully"));
        setModal({ item: null, mode: "view" });
        await queryClient.refetchQueries(["my-service-request-list"]);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || t("Something went wrong"));
      },
    });

  const { data: apiData } = useGetMyRequestedServiceList({
    offset,
    type: activeTab,
  });

  const services = apiData?.custom_services ?? [];
  const totalSize = apiData?.total_size ?? 0;
  const dayGroups = groupByDay(services);

  return (
    <Box>
      <Stack spacing={{ xs: "16px", md: "24px" }} sx={{ mt: { md: "4px" } }}>
        {dayGroups.map(({ day, items: dayItems }) => (
          <Stack key={day} spacing={0}>
            <Stack
              direction="row"
              alignItems="center"
              gap="16px"
              sx={{ mb: "8px" }}
            >
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "divider" }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  fontWeight: 700,
                  color: "neutral.500",
                  lineHeight: 1.1,
                  letterSpacing: "-0.54px",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDayLabel(day, t)}
              </Typography>
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "divider" }}
              />
            </Stack>

            <Stack
              divider={<Divider sx={{ borderColor: "divider" }} />}
              spacing={0}
            >
              {dayItems.map((item) => (
                <ServiceRow
                  key={item.id}
                  item={item}
                  onOpen={(i, mode) => {
                    if (mode === "edit") {
                      setEditModal({ open: true, item: i });
                    } else {
                      setModal({ item: i, mode });
                    }
                  }}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {totalSize > data_limit && (
        <CustomPagination
          total_size={totalSize}
          page_limit={data_limit}
          offset={offset}
          setOffset={setOffset}
        />
      )}

      <ViewDetailModal
        item={modal.item}
        open={Boolean(modal.item)}
        openMode={modal.mode}
        onClose={() => setModal((prev) => ({ ...prev, item: null }))}
        onDelete={(id) => deleteService(id)}
        isDeleting={isDeleting}
        onCancel={(id) => cancelService(id)}
        isCancelling={isCancelling}
      />

      <CreateEditServiceRequestModal
        open={editModal.open}
        item={editModal.item}
        onClose={() => setEditModal({ open: false, item: null })}
      />
    </Box>
  );
};

export default ListView;
