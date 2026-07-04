import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import MainLayout from "../../src/components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { setConfigData } from "redux/slices/configData";

const ProductDetails = dynamic(
  () => import("../../src/components/product-details/ProductDetails"),
  { ssr: false },
);

const Index = ({ configData, productDetailsData }) => {
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
    } else {
      //productDetailsData only be null if this page is for campaign
      setProductDetails([{ ...campaignItem, isCampaignItem: true }]);
    }
  }, [productDetailsData?.id, cartList]);

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    console.time("Fetch Config + Product Details");
    const [configRes, productDetailsRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/config`, {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          origin,
          "X-localization": language,
        },
        signal: controller.signal,
      }),
      fetch(
        `${baseUrl}/api/v1/items/details/${productId}${
          isCampaign ? "?campaign=1" : ""
        }`,
        {
          method: "GET",
          headers: {
            moduleId: moduleId,
            "X-localization": language,
          },
          signal: controller.signal,
        },
      ),
    ]);

    const [configData, productDetailsData] = await Promise.all([
      configRes.json(),
      productDetailsRes.json(),
    ]);
    console.timeEnd("Fetch Config + Product Details");

    clearTimeout(timeout);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );

    return {
      props: {
        configData,
        productDetailsData,
      },
    };
  } catch (error) {
    clearTimeout(timeout);
    console.error("SSR fetch failed:", error.message);
    return {
      props: {
        configData: null,
        productDetailsData: null,
      },
    };
  }
};
