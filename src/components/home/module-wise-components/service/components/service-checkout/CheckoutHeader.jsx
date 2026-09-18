import { Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { useMemo } from "react";

const CheckoutHeader = ({ isCustomService, reqServiceDetails, providerData }) => {
  const router = useRouter();
  const storeId = router.query?.store_id;
  const storeSlug = router.query?.store_slug;

  const { cartList } = useSelector((state) => state.cart);
  const moduleCartList = useMemo(() => getCartListModuleWise(cartList), [cartList]);
  const sourceItem = useMemo(
    () =>
      storeId
        ? moduleCartList.find((i) => String(i?.store_id) === String(storeId))
        : moduleCartList?.[0],
    [moduleCartList, storeId],
  );

  const customProvider = reqServiceDetails?.data?.selected_offer?.provider;

  // providerData comes from the dedicated store-details API call — more
  // reliable than the cart snapshot, which doesn't always carry store_name.
  const storeName = isCustomService
    ? (customProvider?.name ?? "")
    : (providerData?.name || sourceItem?.store_name || sourceItem?.store?.name);

  const providerHref = isCustomService
    ? (customProvider?.id ? `/service/provider/${customProvider.id}` : "/service/all-providers")
    : storeSlug
    ? `/service/provider/${storeSlug}`
    : storeId
    ? `/service/provider/${storeId}`
    : "/service/all-providers";

  return (
    <Stack
      spacing={0.5}
      sx={{ display: { xs: "none", md: "flex" }, width: "100%" }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: { md: "2rem" },
          color: "text.primary",
        }}
      >
        {t("Checkout")}
      </Typography>

      <CustomPageBreadCrumb
        items={[
          {
            key: "home",
            label: t("Service"),
            icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
            onRedirect: "/home",
          },
          {
            key: "provider-list",
            label: t("Provider List"),
            onRedirect: "/service/all-providers",
          },
          {
            key: "provider",
            label: storeName,
            onRedirect: providerHref,
          },
          { key: "checkout", label: t("Checkout") },
        ]}
      />
    </Stack>
  );
};

export default CheckoutHeader;
