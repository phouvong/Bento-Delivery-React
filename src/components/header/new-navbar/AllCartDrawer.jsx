import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import useClearCart from "api-manage/hooks/react-query/add-cart/useClearCart";
import useDeleteCartItem from "api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import CartStoreCard from "components/cards/newCard/CartStoreCard";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { getGuestId, getToken } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { removeCartGroupByStoreId } from "redux/slices/cart";

// ─── Helpers ───────────────────────────────────────────────────────────────

const groupByStore = (cartData = []) => {
  const map = new Map();
  // cartList shape varies by module: array for food/grocery/etc.,
  // object like { carts: [...] } for rental. Coerce defensively.
  const items = Array.isArray(cartData)
    ? cartData
    : Array.isArray(cartData?.carts)
    ? cartData.carts
    : Array.isArray(cartData?.data)
    ? cartData.data
    : Array.isArray(cartData?.items)
    ? cartData.items
    : [];
  for (const item of items) {
    const storeId = item?.store_id ?? item?.store?.id ?? item?.item?.store?.id;
    if (!storeId) continue;

    if (!map.has(storeId)) {
      // Build a normalized store object from flat fields or nested store object
      const store = item?.store ??
        item?.item?.store ?? {
          id: storeId,
          name: item?.store_name,
          slug: item?.store_slug,
          logo_full_url: item?.store_logo_full_url ?? null,
          delivery_time:
            item?.min_delivery_time != null
              ? `${item.min_delivery_time}-${item.max_delivery_time} min`
              : null,
        };
      map.set(storeId, { store, items: [], rawItems: [] });
    }
    const group = map.get(storeId);
    group.items.push(item);
    group.rawItems.push(item);
  }
  return Array.from(map.values());
};

// Normalize a server-grouped cart payload (from api/v1/customer/cart/get-all)
// into the same { store, items, rawItems } shape consumed by CartStoreCard.
// Accepts groups keyed by either `store` or `restaurant` defensively.
const normalizeServerGroups = (cartGroups = []) => {
  if (!Array.isArray(cartGroups)) return [];
  return cartGroups
    .map((g) => {
      const store = g?.store ?? g?.restaurant;
      if (!store?.id) return null;
      const rawItems = Array.isArray(g?.carts)
        ? g.carts
        : Array.isArray(g?.items)
        ? g.items
        : [];
      return { store, items: rawItems, rawItems };
    })
    .filter(Boolean);
};

const calcStoreTotals = (rawItems = []) => {
  console.log({rawItems});
  let total = 0;
  for (const ci of rawItems) {
    // cartList items already have totalPrice; fallback to price * quantity
    const price =
      ci?.price ??
      (ci?.item?.price ?? ci?.price ?? 0) * (ci?.quantity ?? 1);
    total += price;
  }
  return { totalPrice: total };
};

// ─── Component ─────────────────────────────────────────────────────────────

const AllCartDrawer = ({ open, onClose, cartData = [], refetch }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  const cartGroups = useSelector((state) => state.cart.cartGroups);

  const { mutateAsync: clearCart, isLoading: clearingAll } = useClearCart();
  const { mutateAsync: deleteItem, isLoading: deletingItem } =
    useDeleteCartItem();
  const currentModuleType = getCurrentModuleType();

  // Prefer server-grouped data (cart/get-all) — re-synced after every
  // add/update/delete via react-query invalidation. Fall back to local
  // grouping of cartList if the grouped fetch hasn't returned yet.
  // Filter to only show carts belonging to the current module.
  const storeGroups = useMemo(() => {
    const filterByCurrentModule = (groups) => {
      if (!currentModuleType) return groups;
      return groups.filter((g) => {
        const storeModuleType = g?.store?.module_type;
        if (storeModuleType) return storeModuleType === currentModuleType;
        const carts = g?.items ?? g?.carts ?? [];
        const firstCartItem = Array.isArray(carts) ? carts[0] : null;
        const itemModuleType = firstCartItem?.item?.module_type;
        if (itemModuleType) return itemModuleType === currentModuleType;
        return false;
      });
    };
    const serverGroups = normalizeServerGroups(cartGroups);

    if (serverGroups.length > 0) return filterByCurrentModule(serverGroups);
    return groupByStore(cartData);
  }, [cartGroups, cartData, currentModuleType]);

  const redirectIfCheckoutAffected = (deletedStoreId) => {
    if (router.pathname !== "/checkout") return;
    const checkoutStoreId = String(router.query?.store_id ?? "");
    if (!checkoutStoreId || checkoutStoreId !== String(deletedStoreId ?? ""))
      return;
    onClose();
    router.push("/home");
  };

  const handleClearAll = async () => {
    const wasOnCheckout = router.pathname === "/checkout";
    await clearCart();
    refetch?.();
    if (wasOnCheckout) {
      onClose();
      router.push("/home");
    }
  };

  const handleDeleteStore = async (rawItems, storeId) => {
    // Backend rejects (403) requests that include both Authorization and
    // guest_id — only attach guest_id when there is no auth token.
    redirectIfCheckoutAffected(storeId);
    const token = getToken();
    const guestId = !token ? getGuestId() : null;
    // Optimistic: drop the group locally so the row vanishes immediately;
    // react-query invalidation will reconcile from server on success.
    if (storeId) dispatch(removeCartGroupByStoreId(storeId));
    for (const ci of rawItems) {
      // Local cartList rows: `id` is the product id; the server cart-row id
      // lives on `cartItemId` (set by setItemIntoCart). Server-grouped rows
      // from cart/get-all carry the cart-row id at the root `id` field.
      // Prefer cartItemId first, then fall back to id / cart_id.
      const cartItemId = ci?.cartItemId ?? ci?.id ?? ci?.cart_id;
      if (!cartItemId) continue;
      const itemStoreId =
        ci?.store_id ?? ci?.store?.id ?? ci?.item?.store_id ?? storeId;
      await deleteItem({
        cart_id: cartItemId,
        ...(itemStoreId != null ? { store_id: itemStoreId } : {}),
        ...(guestId ? { guestId } : {}),
      });
    }
    refetch?.();
  };

  const handleViewCart = (store) => {
    onClose();
    handleStoreRedirect(store, router);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      elevation={0}
      disableScrollLock
      sx={{ zIndex: 1400 }}
      slotProps={{
        backdrop: { sx: { backgroundColor: "transparent" } },
      }}
      PaperProps={{
        sx: {
          width: 420,
          maxWidth: "100vw",
          boxShadow: "0px 24px 48px -8px rgba(0,0,0,0.24)",
        },
      }}
    >
      {/* Close tab — fixed vertical pill on left edge of drawer (Figma 2042:54942) */}
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            right: 420,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1401,
            px: "4px",
            py: "24px",
            borderRadius: "12px 0 0 12px",
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.10)",
          }}
        >
          <i
            className="fi fi-rr-angle-double-small-right"
            style={{
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
            }}
          />
        </Box>
      )}

      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: "20px", py: "16px", flexShrink: 0 }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("All Cart")}
        </Typography>

        <Stack direction="row" alignItems="center" gap="8px">
          {storeGroups.length > 0 && (
            <Button
              size="small"
              variant="ghost"
              color="error"
              disabled={clearingAll}
              onClick={handleClearAll}
              sx={{
                height: 32,
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "-0.39px",
                color: "#BF6A02",
              }}
            >
              {t("Clear All")}
            </Button>
          )}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ borderRadius: "8px" }}
          >
            <i
              className="fi fi-rr-cross-small"
              style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
            />
          </IconButton>
        </Stack>
      </Stack>

      <Divider />

      {/* Cart list */}
      <Box
        sx={{
          height: "calc(100vh - 73px)",
          overflowY: "auto",
          px: "20px",
          py: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.divider} transparent`,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: "999px",
          },
        }}
      >
        {storeGroups.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ flex: 1, py: "60px", gap: "12px" }}
          >
            <i
              className="fi fi-rr-shopping-cart-add"
              style={{
                fontSize: "48px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.neutral[400],
              }}
            />
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "neutral.500",
                letterSpacing: "-0.48px",
              }}
            >
              {t("Your cart is empty")}
            </Typography>
          </Stack>
        ) : (
          storeGroups.map(({ store, items, rawItems }) => {
            const { totalPrice } = calcStoreTotals(rawItems);
            return (
              <Box
                key={store?.id}
                sx={{
                  flexShrink: 0,
                  "& > *": { width: "100% !important" },
                }}
              >
                <CartStoreCard
                  variant="running"
                  store={store}
                  items={items}
                  totalPrice={totalPrice}
                  deliveryTime={store?.delivery_time}
                  onDelete={() => handleDeleteStore(rawItems, store?.id)}
                  onAdd={() => handleViewCart(store)}
                  onViewCart={() => handleViewCart(store)}
                  onClick={() => handleViewCart(store)}
                />
              </Box>
            );
          })
        )}
      </Box>
    </Drawer>
  );
};

export default AllCartDrawer;
