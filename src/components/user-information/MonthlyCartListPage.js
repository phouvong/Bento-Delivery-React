import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NextImage from "components/NextImage";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomEmptyResult from "components/custom-empty-result";
import CustomPagination from "components/custom-pagination";
import nodata from "components/loyalty-points/assets/Search.svg";
import { data_limit } from "api-manage/ApiRoutes";
import useGetMonthlyOrderList from "api-manage/hooks/react-query/order/useGetMonthlyOrderList";
import useDeleteMonthlyOrder from "api-manage/hooks/react-query/order/useDeleteMonthlyOrder";
import usePostReorder, {
  reOrderToastMessageHandler,
} from "api-manage/hooks/react-query/order/usePostReorder";
import CustomModal from "components/modal";
import { toast } from "react-hot-toast";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const ALLOWED_MODULE_TYPES = ["grocery", "pharmacy"];

// ── Shimmer ───────────────────────────────────────────────────────────────────
const ShimmerRow = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  if (isMobile) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="12px"
        sx={{ py: 1.5, px: 2 }}
      >
        <Stack spacing="8px" sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="text" width={130} height={22} />
          <Stack direction="row" alignItems="center" gap="8px">
            <Stack direction="row" alignItems="center">
              {[0, 1, 2].map((j) => (
                <Skeleton
                  key={j}
                  variant="circular"
                  width={28}
                  height={28}
                  sx={{ ml: j === 0 ? 0 : "-4px", flexShrink: 0 }}
                />
              ))}
            </Stack>
            <Skeleton variant="text" width={120} height={16} sx={{ flex: 1 }} />
          </Stack>
        </Stack>
        <Stack direction="row" gap="8px" sx={{ flexShrink: 0 }}>
          <Skeleton
            variant="rectangular"
            width={28}
            height={28}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            width={28}
            height={28}
            sx={{ borderRadius: "4px" }}
          />
        </Stack>
      </Stack>
    );
  }
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr auto",
        gap: "16px",
        alignItems: "center",
        py: 2,
        px: 3,
      }}
    >
      <Skeleton variant="text" width={130} height={22} />
      <Stack direction="row" alignItems="center" gap="16px">
        <Stack direction="row" alignItems="center">
          {[0, 1, 2].map((j) => (
            <Skeleton
              key={j}
              variant="circular"
              width={36}
              height={36}
              sx={{ ml: j === 0 ? 0 : "-8px", flexShrink: 0 }}
            />
          ))}
        </Stack>
        <Skeleton variant="text" width={160} height={18} sx={{ flex: 1 }} />
      </Stack>
      <Stack direction="row" gap="8px">
        <Skeleton
          variant="rectangular"
          width={36}
          height={36}
          sx={{ borderRadius: "8px" }}
        />
        <Skeleton
          variant="rectangular"
          width={36}
          height={36}
          sx={{ borderRadius: "8px" }}
        />
      </Stack>
    </Box>
  );
};

const Shimmer = () => (
  <Stack
    divider={
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          mx: { xs: 2, md: 3 },
        }}
      />
    }
  >
    {[...Array(4)].map((_, i) => (
      <ShimmerRow key={i} />
    ))}
  </Stack>
);

// ── Item thumbnails (reused from NewOrderCard pattern) ────────────────────────
const ItemThumbnails = ({ items = [], size = 36 }) => {
  const theme = useTheme();
  const visible = items.slice(0, 2);
  const overflow = items.length - visible.length;
  return (
    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
      {visible.map((item, i) => (
        <Box
          key={item?.id ?? i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${theme.palette.background.paper}`,
            overflow: "hidden",
            ml: i === 0 ? 0 : `-${size * 0.22}px`,
            flexShrink: 0,
            backgroundColor: "background.secondary",
          }}
        >
          {(item?.image_full_url || item?.image) && (
            <NextImage
              src={item?.image_full_url || item?.image}
              alt={item?.name ?? ""}
              width={String(size)}
              height={String(size)}
              objectFit="cover"
            />
          )}
        </Box>
      ))}
      {overflow > 0 && (
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "background.secondary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: `-${size * 0.22}px`,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}
          >
            +{overflow}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

// ── Single monthly-order card row ─────────────────────────────────────────────
const MonthlyCartRow = ({
  order,
  onAddToCart,
  onDelete,
  onOpenDetails,
  showAddToCart,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const items = order?.items_preview ?? [];
  const itemNames = items
    .slice(0, 3)
    .map((i) => i?.name)
    .filter(Boolean)
    .join(", ");
  const thumbnailSize = isMobile ? 28 : 36;

  const ActionButtons = ({ size, iconSize, radius }) => (
    <Stack direction="row" alignItems="center" gap="8px" sx={{ flexShrink: 0 }}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetails?.(order);
        }}
        sx={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: "background.default",
          color: "neutral.1050",
          "&:hover": { backgroundColor: "background.secondary" },
        }}
      >
        <i
          className="fi fi-rr-eye"
          style={{ fontSize: iconSize, lineHeight: 1, display: "flex" }}
        />
      </IconButton>
      {showAddToCart && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(order);
          }}
          sx={{
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: "primary.main",
            color: "#fff",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <i
            className="fi fi-rr-shopping-cart-add"
            style={{ fontSize: iconSize, lineHeight: 1, display: "flex" }}
          />
        </IconButton>
      )}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(order);
        }}
        sx={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: "#FEE9E7",
          color: "error.main",
          "&:hover": { backgroundColor: "#FECACA" },
        }}
      >
        <i
          className="fi fi-rr-trash"
          style={{ fontSize: iconSize, lineHeight: 1, display: "flex" }}
        />
      </IconButton>
    </Stack>
  );

  if (isMobile) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="12px"
        onClick={() => onOpenDetails?.(order)}
        sx={{
          width: "100%",
          py: 1.5,
          px: 2,
          cursor: "pointer",
          "&:hover": { backgroundColor: "background.default" },
        }}
      >
        <Stack spacing="8px" sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {order?.store?.name ?? t("Store")}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap="8px"
            sx={{ minWidth: 0 }}
          >
            <ItemThumbnails items={items} size={thumbnailSize} />
            {itemNames && (
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.2,
                  letterSpacing: "-0.36px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {itemNames}
              </Typography>
            )}
          </Stack>
        </Stack>
        <ActionButtons size={28} iconSize={13} radius="4px" />
      </Stack>
    );
  }

  return (
    <Box
      onClick={() => onOpenDetails?.(order)}
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr auto",
        gap: "16px",
        alignItems: "center",
        width: "100%",
        py: 2,
        px: 3,
        cursor: "pointer",
        "&:hover": { backgroundColor: "background.default" },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {order?.store?.name ?? t("Store")}
        </Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        gap="16px"
        sx={{ minWidth: 0 }}
      >
        <ItemThumbnails items={items} size={thumbnailSize} />
        {itemNames && (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
              minWidth: 0,
            }}
          >
            {itemNames}
          </Typography>
        )}
      </Stack>
      <ActionButtons size={36} iconSize={15} radius="8px" />
    </Box>
  );
};

// ── Date group ────────────────────────────────────────────────────────────────
const DateGroup = ({
  label,
  orders,
  onDelete,
  onAddToCart,
  onOpenDetails,
  showAddToCart,
}) => {
  const theme = useTheme();
  return (
    <Stack>
      {/* Date divider */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: { xs: 2, md: 3 }, py: 1 }}
      >
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: theme.palette.divider,
          }}
        />
        <Typography
          sx={{
            fontSize: "12px",
            color: theme.palette.neutral?.[500] || "#6B7280",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: theme.palette.divider,
          }}
        />
      </Stack>

      <Stack
        divider={
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              mx: { xs: 2, md: 3 },
            }}
          />
        }
      >
        {orders.map((order, idx) => (
          <MonthlyCartRow
            key={order?.id ?? idx}
            order={order}
            onDelete={onDelete}
            onAddToCart={onAddToCart}
            onOpenDetails={onOpenDetails}
            showAddToCart={showAddToCart}
          />
        ))}
      </Stack>
    </Stack>
  );
};

// ── Date grouping helpers ─────────────────────────────────────────────────────
const groupByDay = (orders) => {
  const groups = [];
  const map = new Map();
  (orders ?? []).forEach((order) => {
    const day = order?.remind_at
      ? new Date(order.remind_at).toDateString()
      : "Unknown";
    if (!map.has(day)) {
      map.set(day, []);
      groups.push({ day, orders: map.get(day) });
    }
    map.get(day).push(order);
  });
  return groups;
};

const formatDayLabel = (dayString, t) => {
  if (!dayString || dayString === "Unknown") return dayString;
  const date = new Date(dayString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return t("Today");
  if (date.toDateString() === yesterday.toDateString()) return t("Yesterday");
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ── Main component ────────────────────────────────────────────────────────────
const MonthlyCartListPage = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { modules } = useSelector((state) => state.configData);

  const allowedModules = (modules || []).filter((m) =>
    ALLOWED_MODULE_TYPES.includes(m?.module_type)
  );

  const [activeModuleId, setActiveModuleId] = useState(
    () => allowedModules?.[0]?.id ?? null
  );
  const [offset, setOffset] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reorderTarget, setReorderTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);

  const activeModule =
    allowedModules.find((m) => m.id === activeModuleId) ?? allowedModules[0];

  const {
    data: monthlyOrderData,
    isFetching,
    isLoading,
    refetch,
  } = useGetMonthlyOrderList(
    { offset, moduleType: activeModule?.module_type },
    !!activeModule?.module_type
  );

  const { mutate: reorderMutate, isLoading: isReordering } = usePostReorder();

  const { mutate: deleteOrder, isLoading: isDeleting } = useDeleteMonthlyOrder({
    onSuccess: () => {
      toast.success(t("Monthly order removed"));
      setDeleteTarget(null);
      refetch();
    },
    onError: () => {
      toast.error(t("Failed to remove monthly order"));
    },
  });

  const onModuleChange = (mod) => {
    setActiveModuleId(mod.id);
    setOffset(1);
  };
  const groupedOrders = groupByDay(monthlyOrderData?.items ?? []);
  // Reorder/add-to-cart action is gated by the same flag as Last Orders.
  const showAddToCart = Boolean(configData?.repeat_order_option);
  if (!allowedModules.length) return null;

  const activeIndex = allowedModules.findIndex(
    (m) => m.id === activeModule?.id
  );
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === allowedModules.length - 1;
  const contentCardRadius = isFirst
    ? "0 16px 16px 16px"
    : isLast
    ? "16px 0 16px 16px"
    : "16px 16px 16px 16px";

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      {/* ── Module tabs — content-width only, not stretched ── */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: "16px",
            pb: "12px",
            pt: "0px",
            mt: "5px",
          }}
        >
          {allowedModules.map((mod) => {
            const isActive = mod.id === activeModule?.id;
            return (
              <Box
                key={mod.id}
                onClick={() => onModuleChange(mod)}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: "12px",
                  py: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  userSelect: "none",
                  flexShrink: 0,
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                    color: isActive ? "#fff" : "neutral.500",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  {mod.module_name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        /* Desktop: content-width tabs aligned to left, NOT flex:1 */
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            backgroundColor: "background.default",
          }}
        >
          {allowedModules.map((mod) => {
            const isActive = mod.id === activeModule?.id;
            return (
              <Box
                key={mod.id}
                onClick={() => onModuleChange(mod)}
                sx={{
                  px: "24px",
                  py: "16px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive
                    ? "background.paper"
                    : "background.default",
                  borderRadius: isActive ? "16px 16px 0 0" : 0,
                  boxShadow: isActive
                    ? "0px 1px 4px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.05)"
                    : "none",
                  clipPath: isActive ? "inset(-10px -10px 0px -10px)" : "none",
                  transition: "background-color 0.2s ease",
                  position: "relative",
                  zIndex: isActive ? 1 : 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { sm: "14px", md: "18px" },
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1.1,
                    letterSpacing: "-0.54px",
                    color: isActive ? "neutral.1050" : "neutral.500",
                    whiteSpace: "nowrap",
                  }}
                >
                  {mod.module_name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ── Content card ── */}
      <Box
        sx={{
          borderRadius: contentCardRadius,
          boxShadow:
            "0px 1px 4px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          zIndex: 0,
          backgroundColor: "background.paper",
        }}
      >
        {isLoading || isFetching ? (
          <Shimmer />
        ) : groupedOrders.length === 0 ? (
          <Box sx={{ p: { xs: 2, md: 6 } }}>
            <CustomEmptyResult
              image={nodata}
              label={t("No monthly cart items found")}
              width={150}
              height={150}
            />
          </Box>
        ) : (
          <Stack>
            {groupedOrders.map((group, idx) => (
              <DateGroup
                key={idx}
                label={formatDayLabel(group.day, t)}
                orders={group.orders}
                onDelete={(order) => setDeleteTarget(order)}
                onAddToCart={(order) => setReorderTarget(order)}
                onOpenDetails={(order) => setDetailsTarget(order)}
                showAddToCart={showAddToCart}
              />
            ))}
            {monthlyOrderData?.total_size > data_limit && (
              <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
                <CustomPagination
                  total_size={monthlyOrderData?.total_size}
                  page_limit={data_limit}
                  offset={offset}
                  setOffset={setOffset}
                />
              </Box>
            )}
          </Stack>
        )}
      </Box>
      <CustomModal
        openModal={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        maxWidth="400px"
      >
        <Stack
          alignItems="center"
          spacing="16px"
          sx={{
            p: { xs: "28px 24px 32px", md: "36px 32px 40px" },
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              backgroundColor: "#FEE9E7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rr-trash"
              style={{
                fontSize: 28,
                lineHeight: 1,
                display: "flex",
                color: "#E53935",
              }}
            />
          </Box>

          {/* Text */}
          <Stack spacing="8px" alignItems="center">
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.6px",
              }}
            >
              {t("Remove Monthly Order")}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.5,
                maxWidth: "320px",
              }}
            >
              {t("Are you sure you want to remove")}{" "}
              <Box
                component="span"
                sx={{ fontWeight: 600, color: "neutral.1050" }}
              >
                {deleteTarget?.store?.name}
              </Box>
              {t(" from your monthly orders? This action cannot be undone.")}
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" gap="12px" sx={{ width: "100%", pt: "8px" }}>
            <Box
              onClick={() => setDeleteTarget(null)}
              sx={{
                flex: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                border: "1.5px solid",
                borderColor: "divider",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { backgroundColor: "background.default" },
              }}
            >
              <Typography
                sx={{ fontSize: "15px", fontWeight: 600, color: "neutral.500" }}
              >
                {t("Cancel")}
              </Typography>
            </Box>
            <Box
              onClick={() => deleteOrder(deleteTarget?.id)}
              sx={{
                flex: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                backgroundColor: "error.main",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { opacity: 0.9 },
              }}
            >
              <Typography
                sx={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}
              >
                {isDeleting ? t("Removing...") : t("Yes, Remove")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CustomModal>
      <CustomModal
        openModal={!!reorderTarget}
        handleClose={() => setReorderTarget(null)}
        maxWidth="400px"
      >
        <Stack
          alignItems="center"
          spacing="16px"
          sx={{
            p: { xs: "28px 24px 32px", md: "36px 32px 40px" },
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rr-shopping-cart-add"
              style={{
                fontSize: 28,
                lineHeight: 1,
                display: "flex",
                color: "#fff",
              }}
            />
          </Box>

          {/* Text */}
          <Stack spacing="8px" alignItems="center">
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.6px",
              }}
            >
              {t("Add to Cart")}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.5,
                maxWidth: "320px",
              }}
            >
              {t("All items from")}{" "}
              <Box
                component="span"
                sx={{ fontWeight: 600, color: "neutral.1050" }}
              >
                {reorderTarget?.store?.name}
              </Box>{" "}
              {t(
                "will be added to your cart. Your existing cart may be replaced."
              )}
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" gap="12px" sx={{ width: "100%", pt: "8px" }}>
            <Box
              onClick={() => setReorderTarget(null)}
              sx={{
                flex: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                border: "1.5px solid",
                borderColor: "divider",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { backgroundColor: "background.default" },
              }}
            >
              <Typography
                sx={{ fontSize: "15px", fontWeight: 600, color: "neutral.500" }}
              >
                {t("Cancel")}
              </Typography>
            </Box>
            <Box
              onClick={() => {
                const UNAVAILABLE_ITEM_MESSAGES = {
                  item_unavailable: "is unavailable",
                  out_of_stock: "is out of stock",
                  vehicle_not_found: "is not available",
                };
                reorderMutate(
                  {
                    order_id: reorderTarget?.order_id,
                    noRentalModule: true,
                  },
                  {
                    onSuccess: (res) => {
                      setReorderTarget(null);
                      reOrderToastMessageHandler(res);
                    },
                    onError: (err) => {
                      setReorderTarget(null);
                      reOrderToastMessageHandler(err, false);
                    },
                  }
                );
              }}
              sx={{
                flex: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                backgroundColor: "primary.main",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { opacity: 0.9 },
              }}
            >
              <Typography
                sx={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}
              >
                {isReordering ? t("Adding...") : t("Add to Cart")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CustomModal>
      <OrderDetailsModal
        order={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />
    </Box>
  );
};

// ── Order items details modal ─────────────────────────────────────────────────
const formatVariation = (item) => {
  const v = item?.variation ?? item?.variations ?? item?.selected_variation;
  if (!v) return null;
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    return v
      .map((entry) => {
        if (!entry) return null;
        if (typeof entry === "string") return entry;
        const values = Array.isArray(entry?.values)
          ? entry.values
              .map((val) => val?.value ?? val?.label ?? val)
              .filter(Boolean)
              .join(", ")
          : entry?.value ?? entry?.name ?? entry?.type;
        return entry?.name && values ? `${entry.name}: ${values}` : values;
      })
      .filter(Boolean)
      .join(" · ");
  }
  if (typeof v === "object") {
    return Object.entries(v)
      .map(([k, val]) => `${k}: ${val}`)
      .join(" · ");
  }
  return null;
};

const OrderDetailsModal = ({ order, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const items = order?.items_preview ?? [];

  return (
    <CustomModal openModal={!!order} handleClose={onClose} maxWidth="480px">
      <Stack sx={{ p: { xs: "20px", md: "24px" }, minWidth: 0 }} spacing="16px">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="12px"
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="12px"
            sx={{ minWidth: 0 }}
          >
            {order?.store?.logo && (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <NextImage
                  src={order.store.logo}
                  alt={order?.store?.name ?? ""}
                  width="44"
                  height="44"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
            <Stack sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {order?.store?.name ?? t("Store")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "neutral.500",
                  lineHeight: 1.2,
                }}
              >
                {items.length} {items.length === 1 ? t("item") : t("items")}
              </Typography>
            </Stack>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              backgroundColor: "background.default",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rr-cross-small"
              style={{ fontSize: 16, lineHeight: 1, display: "flex" }}
            />
          </IconButton>
        </Stack>

        <Box
          sx={{
            maxHeight: { xs: "60vh", md: "70vh" },
            overflowY: "auto",
            mx: "-4px",
            px: "4px",
          }}
        >
          <Stack
            divider={
              <Box
                sx={{ borderBottom: "1px dashed", borderColor: "divider" }}
              />
            }
            spacing={0}
          >
            {items.map((item, idx) => {
              const price = Number(item?.price ?? 0);
              const oldPrice =
                item?.old_price != null ? Number(item.old_price) : null;
              const hasDiscount = oldPrice != null && oldPrice > price;
              const qty = item?.quantity ?? 1;
              const variationText = formatVariation(item);
              return (
                <Stack
                  key={item?.id ?? idx}
                  direction="row"
                  gap="12px"
                  alignItems="flex-start"
                  sx={{ py: "12px" }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      backgroundColor: "background.default",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {(item?.image_full_url || item?.image) && (
                      <NextImage
                        src={item?.image_full_url || item?.image}
                        alt={item?.name ?? ""}
                        width="52"
                        height="52"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing="4px">
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      gap="8px"
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "neutral.1050",
                          lineHeight: 1.3,
                        }}
                      >
                        {item?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "neutral.1050",
                          whiteSpace: "nowrap",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {getAmountWithSign(price * qty)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="8px"
                      flexWrap="wrap"
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "neutral.500",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {getAmountWithSign(price)}
                        {qty > 1 ? ` × ${qty}` : ""}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "neutral.500",
                            textDecoration: "line-through",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {getAmountWithSign(oldPrice)}
                        </Typography>
                      )}
                      {item?.is_available === false && (
                        <Box
                          sx={{
                            px: "6px",
                            py: "2px",
                            borderRadius: "4px",
                            backgroundColor: "#FEE9E7",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "error.main",
                              textTransform: "uppercase",
                            }}
                          >
                            {t("Unavailable")}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    {variationText && (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "neutral.500",
                          lineHeight: 1.3,
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {t("Variation")}:
                        </Box>{" "}
                        {variationText}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </CustomModal>
  );
};

export default MonthlyCartListPage;
