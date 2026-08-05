import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import MainLayout from "../../src/components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { setConfigData } from "redux/slices/configData";
import fetchWithTimeoutRetry from "../../src/utils/fetchWithTimeoutRetry";
import ProductDetailsSkeleton from "../../src/components/common/skeletons/ProductDetailsSkeleton";
const ProductDetails = dynamic(
  () => import("../../src/components/product-details/ProductDetails"),
  { ssr: false, loading: () => <ProductDetailsSkeleton /> },
);

const Index = ({ configData, productDetailsData, isCampaign }) => {
  const dispatch = useDispatch();
  const { cartList, campaignItem } = useSelector((state) => state.cart);
  const [productDetails, setProductDetails] = useState([]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  useEffect(() => {
    if (productDetailsData) {
      const isExist = cartList?.find(
        (item) => item?.id === productDetailsData?.id,
      );
      if (isExist) {
        setProductDetails([
          { ...isExist, store_details: productDetailsData?.store_details },
        ]);
      } else {
        setProductDetails([productDetailsData]);
      }
    } else if (isCampaign) {
      setProductDetails([{ ...campaignItem, isCampaignItem: true }]);
    } else {
      // productDetailsData is null due to a fetch failure (not the campaign flow) — show nothing rather than a bogus item.
      setProductDetails([]);
    }
  }, [productDetailsData?.id, cartList, isCampaign]);

  return (
    <>
      <CssBaseline />
      <SEO
        title={productDetailsData?.meta_title}
        image={productDetailsData?.meta_image}
        businessName={configData?.business_name}
        description={productDetailsData?.meta_description}
        configData={configData}
        robotsMeta={productDetailsData?.meta_data}
      />
      <MainLayout configData={configData}>
        <CustomContainer sx={{ mt: { xs: "0", md: "20px" } }}>
          {productDetails.length > 0 && (
            <ProductDetails
              productDetailsData={productDetails[0]}
              configData={configData}
            />
          )}
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const { req, res, query } = context;
  const language = req.cookies.languageSetting || "en";
  const productId = query.id;
  const moduleId = query.module || query.module_id;
  const isCampaign = query?.campaign === "1";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;

  console.time("Fetch Config + Product Details");
  const [configSettled, productDetailsSettled] = await Promise.allSettled([
    fetchWithTimeoutRetry(`${baseUrl}/api/v1/config`, {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin,
        "X-localization": language,
      },
    }),
    fetchWithTimeoutRetry(
      `${baseUrl}/api/v1/items/details/${productId}${
        isCampaign ? "?campaign=1" : ""
      }`,
      {
        method: "GET",
        headers: {
          moduleId: moduleId,
          "X-localization": language,
        },
      },
    ),
  ]);
  console.timeEnd("Fetch Config + Product Details");

  // configData powers the header/layout/business info — it must always load, no graceful degrade.
  if (configSettled.status === "rejected") {
    console.error("config network error:", configSettled.reason?.message);
    return { notFound: true };
  }
  const configRes = configSettled.value;
  if (!configRes.ok) {
    return { notFound: true };
  }

  let configData;
  try {
    configData = await configRes.json();
  } catch (error) {
    console.error("config parse error:", error.message);
    return { notFound: true };
  }

  // productDetailsData can gracefully degrade to null on a pure network/timeout failure.
  let productDetailsData = null;
  if (productDetailsSettled.status === "rejected") {
    console.error(
      "product_details network error:",
      productDetailsSettled.reason?.message,
    );
  } else {
    const productDetailsRes = productDetailsSettled.value;
    if (!productDetailsRes.ok) {
      return { notFound: true };
    }
    try {
      productDetailsData = await productDetailsRes.json();
    } catch (error) {
      console.error("product_details parse error:", error.message);
      return { notFound: true };
    }
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );

  return {
    props: {
      configData,
      productDetailsData,
      isCampaign,
    },
  };
};
