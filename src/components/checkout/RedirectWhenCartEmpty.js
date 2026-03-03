import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectWhenCartEmpty = ({
  page,
  cartList,
  campaignItemList,
  buyNowItemList,
}) => {
  const router = useRouter();
  useEffect(() => {
    const hasLocation =
      typeof window !== "undefined" && localStorage.getItem("location");
    const targetPath = hasLocation ? "/" : "/";
    if (page === "parcel" && !hasLocation) {
      router.replace("/home");
      return;
    }
    const timer = setTimeout(() => {
      if (cartList && cartList?.length === 0 && page === "cart") {
        router.push(targetPath);
      } else if (campaignItemList?.length === 0 && page === "campaign") {
        router.push(targetPath);
      }
    }, 3000); // 5 seconds

    return () => clearTimeout(timer); // Clear timeout on unmount or dependency change
  }, [cartList, page, router, campaignItemList, buyNowItemList]);

  return null;
};

export default RedirectWhenCartEmpty;
