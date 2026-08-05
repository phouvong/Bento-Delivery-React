import {
  alpha,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import Image from "next/image";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import CustomPagination from "components/custom-pagination";
import StatusBadge from "components/common/StatusBadge";
import useDeleteCustomService from "../../service-api-manage/hooks/react-query/custom-service/useDeleteCustomService";
import CustomDialogConfirmStyle from "components/custom-dialog/confirm/CustomDialogConfirm";
import { groupByDay, formatDayLabel } from "utils/dayGroupUtils";
import { data_limit } from "../../service-api-manage/ApiRoutes";
import useGetMyCustomServiceList from "../../service-api-manage/hooks/react-query/custom-service/useGetMyCustomServiceList";
import useServiceBusinessConfig from "../../service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import { t } from "i18next";

// ── Column widths (shared between header and every row) ───────────────────────
const COL_SERVICE = { width: 220, flexShrink: 0 };
const COL_DESC = { flex: 1 };
const COL_BIDDING = { width: 130, flexShrink: 0 };
const COL_ACTIONS = { width: 136, flexShrink: 0 }; // 3×40px + 2×8px gaps

// ── Sub-components ────────────────────────────────────────────────────────────
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

const ServiceRow = ({ item, onDelete, isExpired }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isCancelled = ["cancelled", "canceled"].includes(
    (item?.status ?? "").toLowerCase(),
  );
  const isBooked = (item?.status ?? "").toLowerCase() === "booked";
  const canEdit = item.bid_count === 0 && !isCancelled && !isBooked;

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleEdit = () => {
    closeMenu();
    router.push(`/service/custom-service/edit/${item.id}`);
  };

  const handleView = () => {
    closeMenu();
    router.push(`/service/custom-service/details/${item.id}`);
  };

  const handleDeleteClick = () => {
    closeMenu();
    onDelete(item.id);
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
          <i
            className="fi fi-rr-eye"
            style={{ fontSize: 15, lineHeight: 1, display: "flex" }}
          />
        </ListItemIcon>
        <Typography sx={{ fontSize: "14px" }}>View</Typography>
      </MenuItem>
      {canEdit && (
        <MenuItem onClick={handleEdit} sx={{ gap: "8px" }}>
          <ListItemIcon
            sx={{ minWidth: "auto", color: theme.palette.info.blue }}
          >
            <i
              className="fi fi-rr-pencil"
              style={{ fontSize: 15, lineHeight: 1, display: "flex" }}
            />
          </ListItemIcon>
          <Typography sx={{ fontSize: "14px" }}>Edit</Typography>
        </MenuItem>
      )}
      {item.bid_count == 0 && (
        <MenuItem onClick={handleDeleteClick} sx={{ gap: "8px" }}>
          <ListItemIcon
            sx={{ minWidth: "auto", color: theme.palette.error.red }}
          >
            <i
              className="fi fi-rr-trash"
              style={{ fontSize: 15, lineHeight: 1, display: "flex" }}
            />
          </ListItemIcon>
          <Typography sx={{ fontSize: "14px", color: theme.palette.error.red }}>
            {t("Delete")}
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );

  if (isMobile) {
    return (
      <Box sx={{ py: "12px" }}>
        {/* Header row: image + name/subcategory + three-dot */}
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

          <Stack spacing="2px" sx={{ flex: 1 }}>
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
            <Stack direction="row" alignItems="center" flexWrap="wrap" gap="6px">
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "text.secondary",
                  lineHeight: 1.3,
                }}
              >
                {item.sub_category}
              </Typography>
              {isCancelled && !isExpired && (
                <StatusBadge status="cancelled" label={t("Cancelled")} />
              )}
            </Stack>
          </Stack>

          {isBooked ? (
            <StatusBadge status="booked" label={t("Booked")} />
          ) : isExpired ? (
            <StatusBadge status="expired" label={t("Expired")} />
          ) : (
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
              <i
                className="fi fi-rr-menu-dots-vertical"
                style={{ fontSize: 16, lineHeight: 1, display: "flex" }}
              />
            </IconButton>
          )}
        </Stack>

        {/* Description */}
        <Typography
          sx={{
            mt: "10px",
            fontSize: "14px",
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

        {/* Bidding count */}
        <Typography
          sx={{
            mt: "10px",
            fontSize: "18px",
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {`${t("Bidding")} : ${item.bid_count}`}
        </Typography>

        {dropdownMenu}
      </Box>
    );
  }

  // ── Desktop row ──────────────────────────────────────────────────────────────
  return (
    <Stack direction="row" alignItems="center" gap="20px" sx={{ py: "16px" }}>
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
        <Stack spacing="2px">
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
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="6px">
            <Typography
              sx={{ fontSize: "14px", color: "text.secondary", lineHeight: 1.3 }}
            >
              {item.sub_category}
            </Typography>
            {isCancelled && !isExpired && (
              <StatusBadge status="cancelled" label={t("Cancelled")} />
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Description */}
      <Typography
        sx={{
          ...COL_DESC,
          fontSize: "14px",
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

      {/* Bidding count */}
      <Typography
        sx={{
          ...COL_BIDDING,
          fontSize: "16px",
          fontWeight: 700,
          color: "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        {`${t("Bidding")} : ${item.bid_count}`}
      </Typography>

      <Stack
        direction="row"
        gap="8px"
        alignItems="center"
        justifyContent="flex-end"
        sx={COL_ACTIONS}
      >
        {isBooked ? (
          <StatusBadge status="booked" label={t("Booked")} />
        ) : isExpired ? (
          <StatusBadge status="expired" label={t("Expired")} />
        ) : (
          <>
            <ActionButton
              iconColor={theme.palette.neutral[500]}
              onClick={handleView}
            >
              <i
                className="fi fi-rr-eye"
                style={{ fontSize: 16, lineHeight: 1, display: "flex" }}
              />
            </ActionButton>

            {canEdit && (
              <ActionButton
                iconColor={theme.palette.info.blue}
                onClick={handleEdit}
              >
                <i
                  className="fi fi-rr-pencil"
                  style={{ fontSize: 16, lineHeight: 1, display: "flex" }}
                />
              </ActionButton>
            )}

            {item.bid_count === 0 && (
              <ActionButton
                iconColor={theme.palette.error.red}
                onClick={handleDeleteClick}
              >
                <i
                  className="fi fi-rr-trash"
                  style={{ fontSize: 16, lineHeight: 1, display: "flex" }}
                />
              </ActionButton>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

// ── Shimmer row (mirrors the ServiceRow layout in both mobile and desktop) ──
const ShimmerRow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Box sx={{ py: "12px" }}>
        <Stack direction="row" alignItems="flex-start" gap="12px">
          <Skeleton variant="rounded" width={44} height={44} />
          <Stack spacing="4px" sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="40%" height={14} />
          </Stack>
          <Skeleton variant="rounded" width={36} height={36} />
        </Stack>
        <Skeleton variant="text" width="95%" height={16} sx={{ mt: "10px" }} />
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="text" width={110} height={22} sx={{ mt: "6px" }} />
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems="center" gap="20px" sx={{ py: "16px" }}>
      <Stack direction="row" alignItems="center" gap="12px" sx={COL_SERVICE}>
        <Skeleton variant="rounded" width={44} height={44} />
        <Stack spacing="4px" sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
        </Stack>
      </Stack>
      <Box sx={COL_DESC}>
        <Skeleton variant="text" width="95%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
      </Box>
      <Box sx={COL_BIDDING}>
        <Skeleton variant="text" width={90} height={22} />
      </Box>
      <Stack
        direction="row"
        gap="8px"
        alignItems="center"
        justifyContent="flex-end"
        sx={COL_ACTIONS}
      >
        <Skeleton variant="rounded" width={40} height={40} />
        <Skeleton variant="rounded" width={40} height={40} />
        <Skeleton variant="rounded" width={40} height={40} />
      </Stack>
    </Stack>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ListView = ({ configData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [offset, setOffset] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const { isPostExpired } = useServiceBusinessConfig(configData);

  const queryClient = useQueryClient();
  const { mutate: deleteService, isLoading: isDeleting } =
    useDeleteCustomService({
      onSuccess: () => {
        queryClient.invalidateQueries("my-custom-service-list");
        setDeleteTargetId(null);
      },
    });

  const { data: apiData, isLoading } = useGetMyCustomServiceList({
    offset,
    type: activeTab,
  });

  const services = apiData?.custom_services ?? [];
  const totalSize = apiData?.total_size ?? 0;
  const dayGroups = groupByDay(services);

  return (
    <Box>
      <Stack spacing={{ xs: "16px", md: "24px" }} sx={{ mt: { md: "4px" } }}>
        {isLoading ? (
          <Stack spacing={0}>
            <Stack
              direction="row"
              alignItems="center"
              gap="16px"
              sx={{ mb: "8px" }}
            >
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "divider" }}
              />
              <Skeleton variant="text" width={120} height={22} />
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "divider" }}
              />
            </Stack>
            <Stack
              divider={<Divider sx={{ borderColor: "divider" }} />}
              spacing={0}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <ShimmerRow key={i} />
              ))}
            </Stack>
          </Stack>
        ) : (
          dayGroups.map(({ day, items: dayItems }) => (
            <Stack key={day} spacing={0}>
              {/* Day divider */}
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

              {/* Rows for this day */}
              <Stack
                divider={<Divider sx={{ borderColor: "divider" }} />}
                spacing={0}
              >
                {dayItems.map((item) => (
                  <ServiceRow
                    key={item.id}
                    item={item}
                    onDelete={setDeleteTargetId}
                    isExpired={isPostExpired(item.created_at)}
                  />
                ))}
              </Stack>
            </Stack>
          ))
        )}
      </Stack>

      {totalSize > data_limit && (
        <CustomPagination
          total_size={totalSize}
          page_limit={data_limit}
          offset={offset}
          setOffset={setOffset}
        />
      )}

      <CustomDialogConfirmStyle
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onSuccess={() => deleteService(deleteTargetId)}
        dialogTexts="Are you sure you want to delete this service?"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default ListView;
