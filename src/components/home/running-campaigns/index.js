import { t } from "i18next";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handleProductRedirect } from "helper-functions/handleProductRedirect";

import { useDispatch, useSelector } from "react-redux";
import useGetItemCampaigns from "../../../api-manage/hooks/react-query/useGetItemCampaigns";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModuleId } from "helper-functions/getModuleId";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setCampaignItem } from "redux/slices/cart";
import { setRunningCampaigns } from "redux/slices/storedData";
import FoodDetailModal from "../../food-details/foodDetail-modal/FoodDetailModal";
import H2 from "../../typographies/H2";
import { HomeComponentsWrapper } from "../HomePageComponents";
import SliderShimmer from "../SliderShimmer";
import Grocery from "./Grocery";
import Pharmacy from "./pharmacy";

const RunningCampaigns = () => {
  const { configData } = useSelector((state) => state.configData);
  const [openModal, setOpenModal] = useState(false);
  const [campaignsData, setCampaignsData] = useState({});
  const imageBaseUrl = configData?.base_urls?.campaign_image_url;
  const { data, refetch, isFetching, isLoading } = useGetItemCampaigns();
  const router = useRouter();
  const { runningCampaigns } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  console.log({data});
  

  useEffect(() => {
    dispatch(setRunningCampaigns(data));
  }, [data]);
  const handleClick = (product) => {
    console.log({campaignsData});
    
    if (getCurrentModuleType() === "ecommerce") {
      dispatch(setCampaignItem(product));
      handleProductRedirect(product, router, "campaign");
    } else {
      setCampaignsData(product);
      setOpenModal(true);
    }
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const getModuleWiseView = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return (
          <Grocery
            runningCampaigns={data}
            handleClick={handleClick}
            configData={configData}
            isFetching={isFetching}
          />
        );
      case ModuleTypes.PHARMACY:
        return (
          <Pharmacy
            runningCampaigns={data}
            handleClick={handleClick}
            configData={configData}
            isFetching={isFetching}
          />
        );
      case ModuleTypes.ECOMMERCE:
        return (
          <Grocery
            runningCampaigns={data}
            handleClick={handleClick}
            configData={configData}
            isFetching={isFetching}
          />
        );
      case ModuleTypes.FOOD:
        return (
          <Grocery
            runningCampaigns={data}
            handleClick={handleClick}
            configData={configData}
            isFetching={isFetching}
          />
        );
    }
  };
  return (
    <>
      {isFetching ? (
        <SliderShimmer />
      ) : (
        <>
          {data?.length > 0 ? (
            <HomeComponentsWrapper alignItems="flex-start">
              {data?.length > 0 && (
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                  component="h2"
                >
                  {t("Just For You")}
                </Typography>
              )}
              <Box sx={{ width: "100%", mt: "1rem" }}>
                {getModuleWiseView()}
              </Box>
            </HomeComponentsWrapper>
          ) : (
            ""
          )}
        </>
      )}
      {openModal && (
        <FoodDetailModal
          product={campaignsData}
          imageBaseUrl={imageBaseUrl}
          open={openModal}
          handleModalClose={handleClose}
          productUpdate
        />
      )}
    </>
  );
};

export default RunningCampaigns;
