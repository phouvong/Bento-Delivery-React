import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ProductDetails from "../../src/components/product-details/ProductDetails";
import { useSelector } from "react-redux";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { NoSsr } from "@mui/material";

const Index = ({ configData, productDetailsData,  }) => {
  const { cartList, campaignItem } = useSelector((state) => state.cart);
  const [productDetails, setProductDetails] = useState([]);
  


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    handleProductDetails();
  }, [productDetailsData, cartList]);

  const handleProductDetails = () => {
    if (productDetailsData) {
      if (cartList?.length > 0) {
        const isExist = cartList?.find(
          (item) => item?.id === productDetailsData?.id
        );

        if (isExist) {
          let tempData = {
            ...isExist,
            store_details: productDetailsData?.store_details,
          };
          setProductDetails([tempData]);
        } else {
          setProductDetails([productDetailsData]);
        }
      } else {
        setProductDetails([productDetailsData]);
      }
    } else {
      //productDetailsData only be null if this page is for campaign
      setProductDetails([{ ...campaignItem, isCampaignItem: true }]);
    }
  };

  
  return (
    <>
      <CssBaseline />
      <SEO
        title={
         productDetailsData?.meta_title
        }
        image={productDetailsData?.meta_image}
        businessName={configData?.business_name}
        description={productDetailsData?.meta_description}
        configData={configData}
        robotsMeta={productDetailsData?.meta_data}
      />
      <MainLayout configData={configData}>
        <CustomContainer>
          {productDetails.length > 0 && (
            <NoSsr>
              <ProductDetails
                productDetailsData={productDetails[0]}
                configData={configData}
              />
            </NoSsr>
          )}
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  const { req } = context;
  const language = req.cookies.languageSetting;
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
        "X-localization": language,
      },
    }
  );
  const config = await configRes.json();
  const productId = context.query.id;
  const moduleId = context.query.module || context.query.module_id;
  const productTypeRaw = context.query?.product_type;
  const campaign = context.query?.campaign;
  const isCampaign = campaign === "1";
  const productDetailsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/items/details/${productId}${
      isCampaign ? "?campaign=1" : ""
    }`,
    {
      method: "GET",
      headers: {
        moduleId: moduleId,
        "X-localization": language,
      },
    }
  );
  const productDetailsData = await productDetailsRes.json();
 

  return {
    props: {
      configData: config,
      productDetailsData: productDetailsData,
      
    },
  };
};
