import { useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import AllCartDrawer from "./AllCartDrawer";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useGetGroupedCart from "api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import { store } from "redux/store";

// Modules where the floating button is visible
const ALLOWED_MODULES = new Set(["food", "grocery", "pharmacy", "shop"]);

// Next.js route patterns where the button is visible
const ALLOWED_PATHNAMES = new Set([
  "/home",
  "/search",
  "/home/wishlist",
  "/home/[...slug]", // covers /home/offers, /home/free-delivery, /home/top-rated, /home/nearby
  "/home/category/[slug]", // /home/category/...
]);

/** Abbreviate a number with currency symbol — e.g. 1200 → "$ 1.2k" */
const abbreviateAmount = (amount) => {
  const { configData } = store?.getState()?.configData || {};
  const symbol = configData?.currency_symbol || "$";
  const direction = configData?.currency_symbol_direction || "left";

  let formatted;
  if (amount >= 1_000_000_000) {
    formatted = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (amount >= 1_000_000) {
    formatted = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (amount >= 1_000) {
    formatted = (amount / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    const decimals = configData?.digit_after_decimal_point ?? 2;
    formatted = Number(amount).toFixed(decimals);
  }

  return direction === "left"
    ? `${symbol} ${formatted}`
    : `${formatted} ${symbol}`;
};

const FloatingCartButton = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selectedModule = useSelector(
    (state) => state.utilsData?.selectedModule
  );
  const { cartList, cartGroups } = useSelector((state) => state.cart);

  // Module + page visibility guards
  const moduleType = selectedModule?.module_type ?? getCurrentModuleType();
  const isAllowedModule = ALLOWED_MODULES.has(moduleType);
  const isAllowedPage = ALLOWED_PATHNAMES.has(router.pathname);
  const { refetch } = useGetGroupedCart();

  // Badge count — current module items only
  const cartItems = getCartListModuleWise(cartList) ?? [];
  const itemCount = cartItems.length;
  console.log({ cartItems, cartGroups });

  // Grand total = sum of every cart line's (price × quantity).
  // `price` on the cart line already includes variation/addon pricing — prefer
  // it over `item.price`, which is only the base item price.
  const lineTotal = (ci) =>
    (ci?.price ?? ci?.item?.price ?? 0) * (ci?.quantity ?? 1);

  const grandTotal = useMemo(() => {
    if (Array.isArray(cartGroups) && cartGroups.length > 0) {
      return cartGroups.reduce((storeSum, group) => {
        const carts = Array.isArray(group?.carts)
          ? group.carts
          : Array.isArray(group?.items)
          ? group.items
          : [];
        return storeSum + carts.reduce((s, ci) => s + lineTotal(ci), 0);
      }, 0);
    }
    return cartItems.reduce((s, ci) => s + lineTotal(ci), 0);
  }, [cartGroups, cartItems]);

  if (!itemCount || !isAllowedModule || !isAllowedPage) return null;

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        role="button"
        aria-label={t("Cart")}
        sx={{
          position: "fixed",
          top: "215px",
          insetInlineEnd: 0,
          zIndex: (th) => th.zIndex.appBar - 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "stretch",
          width: "80px",
          height: "80px",
          borderRadius: "10px 0 0 10px",
          overflow: "hidden",
          boxShadow: "-9px 0px 20px 0px rgba(0,0,0,0.14)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* ── Top section: cart icon + badge ── */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            p: "8px",
            position: "relative",
          }}
        >
          {/* Icon + badge wrapper */}
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <i
              className="fi fi-rr-shopping-cart"
              style={{
                fontSize: "20px",
                display: "flex",
                lineHeight: 1,
                color: theme.palette.text.primary,
              }}
            />
            {/* Badge — top-right of the icon */}
            <Box
              sx={{
                position: "absolute",
                top: "-8px",
                insetInlineEnd: "-8px",
                borderRadius: "9999px",
                backgroundColor: "#039d55",
                border: `2px solid ${theme.palette.background.paper}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
              }}
            ></Box>
          </Box>
        </Box>

        {/* ── Bottom section: amount ── */}
        <Box
          sx={{
            backgroundColor: "#f1f6fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: "10px",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.3,
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {itemCount > 99 ? "99+" : itemCount}{" "}
            {itemCount > 1 ? t("items") : t("item")}
          </Typography>
        </Box>
      </Box>

      <AllCartDrawer
        open={open}
        onClose={() => setOpen(false)}
        cartData={cartList}
        refetch={refetch}
      />
    </>
  );
};

export default FloatingCartButton;
