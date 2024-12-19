import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import TabsTypeOne from "../custom-tabs/TabsTypeOne";
import { Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/system";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/no_wish_list.svg";
import { getItemsOrFoods } from "helper-functions/getItemsOrFoods";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import { useTheme } from "@mui/material/styles";
import WishListCard from "./WishListCard";
import { CustomOverFlowStack } from "../custom-tabs/tabs.style";
import StoreWishCard from "./StoreWishCard";

const WishLists = (props) => {
  const { configData, t, setSideDrawerOpen } = props;
  const tabsData = [
    {
      title: getItemsOrFoods(),
      value: getItemsOrFoods(),
    },
    {
      title: getStoresOrRestaurants(),
      value: getStoresOrRestaurants(),
    },
  ];
  const { currentTab } = useSelector((state) => state.utilsData);
  const { wishLists } = useSelector((state) => state.wishList);
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:1100px)");
  const dispatch = useDispatch();
  const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  const store_image_url = `${configData?.base_urls?.store_image_url}`;

  const empty_items_text = `No favourite ${getItemsOrFoods()} found`;
  const empty_stores_text = `No favourite ${getStoresOrRestaurants()} found`;

  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
      heigth="100vh"
      sx={{ padding: "1.25rem" }}
    >
      <TabsTypeOne tabs={tabsData} currentTab={currentTab} t={t} />
      <Stack width="100%" height="83vh" justifyContent="space-between">
        {wishLists ? (
          <Stack width="100%">
            {currentTab === getStoresOrRestaurants() ? (
              <CustomOverFlowStack height="83vh" width="100%">
                {wishLists?.store?.map((item) => {
                  return (
                    <StoreWishCard
                      setSideDrawerOpen={setSideDrawerOpen}
                      data={item}
                      key={item?.id}
                    />
                  );
                })}
                {wishLists?.store?.length === 0 && (
                  <CustomEmptyResult
                    label={t(empty_stores_text)}
                    image={nodataimage}
                    width="150px"
                    height="noe"
                  />
                )}
              </CustomOverFlowStack>
            ) : (
              <CustomOverFlowStack height="75vh" width="100%">
                {wishLists?.item?.map((item) => {
                  return (
                    <WishListCard
                      key={item?.id}
                      item={item}
                      // deleteWishlistItem={deleteWishlistItem}
                    />
                  );
                })}
                {wishLists?.item?.length === 0 && (
                  <CustomEmptyResult
                    label={t(empty_items_text)}
                    image={nodataimage}
                    width="150px"
                    height="none"
                  />
                )}
              </CustomOverFlowStack>
            )}
          </Stack>
        ) : (
          <Typography>nai</Typography>
        )}
        {/*{currentTab === getItemsOrFoods() && wishLists?.item?.length > 0 && (*/}
        {/*  <WishListSideBarAction />*/}
        {/*)}*/}
      </Stack>
    </CustomStackFullWidth>
  );
};

WishLists.propTypes = {};

export default WishLists;
