import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import TabsTypeOne from "../custom-tabs/TabsTypeOne";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/system";
import toast from "react-hot-toast";
import { t as translate } from "i18next";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/no_wish_list.svg";
import { getItemsOrFoods } from "helper-functions/getItemsOrFoods";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import WishListCard from "./WishListCard";
import { CustomOverFlowStack } from "../custom-tabs/tabs.style";
import StoreWishCard from "./StoreWishCard";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import RentalWishListCard from "components/home/module-wise-components/rental/components/global/RentalWishlistCard";
import ProviderWishCard from "components/home/module-wise-components/rental/components/global/ProviderWishCard";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import ModuleModal from "../cards/ModuleModal";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { not_logged_in_message } from "utils/toasterMessages";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";

const WishLists = (props) => {
  const { t, setSideDrawerOpen } = props;
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
  const { configData } = useSelector((state) => state.configData);
  const reduxDispatch = useDispatch();
  const imageBaseUrl = configData?.base_urls?.item_image_url;

  const [activeItem, setActiveItem] = useState(null);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: deleteWishlistMutation } = useWishListDelete();

  const handleCloseItemModal = () => setActiveItem(null);
  const isWishlisted = !!wishLists?.item?.find(
    (wishItem) => wishItem.id === activeItem?.id,
  );

  const addToWishlistHandler = (e) => {
    e?.stopPropagation?.();
    if (!activeItem) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
      toast.error(translate(not_logged_in_message));
      return;
    }
    addFavoriteMutation(activeItem?.id, {
      onSuccess: (response) => {
        if (response) {
          reduxDispatch(addWishList(activeItem));
          toast.success(response?.message);
        }
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const removeFromWishlistHandler = (e) => {
    e?.stopPropagation?.();
    if (!activeItem) return;
    deleteWishlistMutation(activeItem?.id, {
      onSuccess: (res) => {
        reduxDispatch(removeWishListItem(activeItem?.id));
        toast.success(res.message, { id: "wishlist" });
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const empty_items_text = `No favourite ${getItemsOrFoods()} found`;
  const empty_stores_text = `No favourite ${getStoresOrRestaurants()} found`;

  const allItems = [...(wishLists?.item || []), ...(wishLists?.vehicles || [])];
  const allStores = [
    ...(wishLists?.store || []),
    ...(wishLists?.providers || []),
  ];

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
                {allStores?.map((item) => {
                  return (
                    <>
                      {getCurrentModuleType() === "rental" ? (
                        <ProviderWishCard
                          setSideDrawerOpen={setSideDrawerOpen}
                          data={item}
                          key={item?.id}
                        />
                      ) : (
                        <StoreWishCard
                          setSideDrawerOpen={setSideDrawerOpen}
                          data={item}
                          key={item?.id}
                        />
                      )}
                    </>
                  );
                })}
                {allStores?.length === 0 && (
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
                {allItems?.map((item) => {
                  return (
                    <>
                      {getCurrentModuleType() === "rental" ? (
                        <RentalWishListCard key={item?.id} item={item} />
                      ) : (
                        <WishListCard
                          key={item?.id}
                          item={item}
                          onOpenModal={setActiveItem}
                        />
                      )}
                    </>
                  );
                })}
                {allItems?.length === 0 && (
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

      {activeItem &&
        (getCurrentModuleType() === "food" ? (
          <FoodDetailModal
            product={activeItem}
            imageBaseUrl={imageBaseUrl}
            open={!!activeItem}
            handleModalClose={handleCloseItemModal}
            addToWishlistHandler={addToWishlistHandler}
            removeFromWishlistHandler={removeFromWishlistHandler}
            isWishlisted={isWishlisted}
          />
        ) : (
          <ModuleModal
            open={!!activeItem}
            handleModalClose={handleCloseItemModal}
            configData={configData}
            productDetailsData={activeItem}
            addToWishlistHandler={addToWishlistHandler}
            removeFromWishlistHandler={removeFromWishlistHandler}
            isWishlisted={isWishlisted}
          />
        ))}
    </CustomStackFullWidth>
  );
};

WishLists.propTypes = {};

export default WishLists;
