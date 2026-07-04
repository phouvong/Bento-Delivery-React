import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const RedirectWhenCartEmpty = ({
  page,
  cartList,
  campaignItemList,
  buyNowItemList,
}) => {
  const router = useRouter();
  // Wait for redux-persist to finish rehydrating from localStorage before
  // running any redirect logic. Without this guard, the component sees
  // cartList = [] (initial state) on every page load / reload and can
  // incorrectly redirect the user away from checkout before the persisted
  // cart data is restored.
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);

  useEffect(() => {
    if (!isRehydrated) return; // cart data not ready yet — do nothing

    const hasLocation =
      typeof window !== "undefined" && localStorage.getItem("location");
    const targetPath = hasLocation ? "/home" : "/";

    if (page === "parcel" && !hasLocation) {
      router.replace("/home");
      return;
    }

    // Read the `cart-list` cookie written by the cart fetch on success.
    //  - "1"   → server says cart HAS items; never redirect even if the
    //            local redux state is momentarily empty (slow API path).
    //  - "0"   → server says cart is empty; safe to redirect.
    //  - none  → fetch hasn't completed yet; skip this tick so we don't
    //            redirect before we actually know the state.
    const cartListCookie =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("cart-list="))
            ?.split("=")[1]
        : undefined;
    if (cartListCookie === "1") return;
    if (page === "cart" && cartListCookie == null) return;

    const timer = setTimeout(() => {
      if (cartList && cartList?.length === 0 && page === "cart") {
        router.push(targetPath);
      } else if (campaignItemList?.length === 0 && page === "campaign") {
        router.push(targetPath);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [cartList, page, router, campaignItemList, buyNowItemList, isRehydrated]);

  return null;
};

export default RedirectWhenCartEmpty;
