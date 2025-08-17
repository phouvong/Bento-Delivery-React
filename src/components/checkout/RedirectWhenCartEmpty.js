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
    const timer = setTimeout(() => {
      if (cartList && cartList?.length === 0 && page === "cart") {
        router.push("/home");
      } else if (campaignItemList?.length === 0 && page === "campaign") {
        router.push("/home");
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Clear timeout on unmount or dependency change
  }, [cartList, page, router, campaignItemList, buyNowItemList]);

  return null;
};

export default RedirectWhenCartEmpty;
