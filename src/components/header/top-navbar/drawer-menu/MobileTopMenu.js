import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import { t } from "i18next";
import { useRouter } from "next/router";
import CollapsableMenu from "./CollapsableMenu";
import useGetLatestStore from "../../../../api-manage/hooks/react-query/store/useGetLatestStore";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import useGetPopularStore from "../../../../api-manage/hooks/react-query/store/useGetPopularStore";
import { useDispatch, useSelector } from "react-redux";
import { Scrollbar } from "../../../srollbar";
import ButtonsContainer from "./ButtonsContainer";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import { getModuleId } from "helper-functions/getModuleId";
import { setPopularStores } from "redux/slices/storedData";
import ThemeSwitches from "../ThemeSwitches";
import CustomLanguage from "../language/CustomLanguage";
import { getModule } from "helper-functions/getLanguage";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const MobileTopMenu = ({
  handleRoute,
  toggleDrawer,
  setOpenDrawer,
  handleLogout,
  openModal,
  isLogoutLoading,
  setOpenModal,
}) => {
  const { wishLists } = useSelector((state) => state.wishList);
  const router = useRouter();
  let token = undefined;
  let location = undefined;
  if (typeof window !== undefined) {
    location = localStorage.getItem("location");
    token = localStorage.getItem("token");
  }
  const { countryCode, language } = useSelector((state) => state.configData);
  const rentalCategories = useSelector(
    (state) => state?.rentalCategoriesLists?.rentalCategories
  );

  const { data: categoriesData, refetch } = useGetCategories();
  const { data: latestStore, refetch: refetchStore } = useGetLatestStore();
  const type = "all";
  const pageLimit = 12;
  const {
    data,
    refetch: popularRefetch,
    isFetching,
  } = useGetPopularStore({
    type,
    offset: 1,
    limit: pageLimit,
  });
  const { popularStores } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (popularStores.length === 0 && getModuleId()) {
      popularRefetch();
    }
  }, []);
  useEffect(() => {
    if (
      data &&
      data?.pages?.length > 0 &&
      data?.pages?.[0]?.stores?.length > 0
    ) {
      dispatch(setPopularStores(data?.pages?.[0]?.stores));
    }
  }, [data]);
  useEffect(() => {
    if (getModuleId()) {
      refetch();
      refetchStore();
    }
  }, []);
  const popular = t("Popular");
  const latest = t("Latest");


  const collapsableMenu = {
    cat: {
      text: "Categories",
      items:
        getModule()?.module_type !== "rental"
          ? categoriesData?.data?.map((item) => item)
          : rentalCategories?.map((item) => item),
      path: "/category",
    },
    latest: {
      text: `${latest} ${getStoresOrRestaurants()}`,
      items: latestStore?.stores?.slice(0, 12)?.map((i) => i),
      path:  getCurrentModuleType() === "rental" ? "/rental/provider-details" : "/store",
    },
    popularStore: {
      text: `${popular} ${getStoresOrRestaurants()}`,
      items: popularStores?.map((i) => i),
      path: getCurrentModuleType() === "rental" ? "/rental/provider-details" : "/store",
    },
    profile: {
      text: "Profile",
    },
  };
  const getWishlistCount = () => {
    return wishLists?.item?.length + wishLists?.store?.length;
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "auto",
        height: "90%",
        justifyContent: "space-between",
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ paddingX: "20px" }}>
        <Scrollbar style={{ maxHeight: "80vh" }}>
          <List component="nav" aria-labelledby="nested-list-subheader">
            <>
              <ListItemButton
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  marginTop: "30px",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <ListItemText
                  sx={{ fontSize: "12px" }}
                  primary={t("Home")}
                  onClick={() => handleRoute("/home")}
                />
              </ListItemButton>
              {location && (
                <>
                  <CollapsableMenu
                    value={collapsableMenu.cat}
                    setOpenDrawer={setOpenDrawer}
                    toggleDrawers={toggleDrawer}
                    pathName="/categories"
                    forcategory="true"
                  />
                  <CollapsableMenu
                    value={collapsableMenu.latest}
                    setOpenDrawer={setOpenDrawer}
                    toggleDrawers={toggleDrawer}
                    pathName="/store/latest"
                  />
                  <CollapsableMenu
                    value={collapsableMenu.popularStore}
                    setOpenDrawer={setOpenDrawer}
                    toggleDrawers={toggleDrawer}
                    pathName="/store/popular"
                  />
                </>
              )}
              <ListItemButton
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                <ListItemText>{t("Theme Mode")}</ListItemText>
                <ThemeSwitches noText />
              </ListItemButton>
              <ListItemButton
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                <ListItemText>{t("Language")}</ListItemText>
                <CustomLanguage
                  countryCode={countryCode}
                  language={language}
                  noText
                  key={countryCode}
                />
              </ListItemButton>
              {/*{token && (*/}
              {/*  <>*/}
              {/*    {router.pathname === "/" && (*/}
              {/*      <ListItemButton*/}
              {/*        sx={{*/}
              {/*          "&:hover": {*/}
              {/*            backgroundColor: (theme) =>*/}
              {/*              alpha(theme.palette.primary.main, 0.3),*/}
              {/*          },*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        <ListItemText*/}
              {/*          primary={t("Favorites")}*/}
              {/*          onClick={() => handleRoute("wishlist")}*/}
              {/*        />*/}
              {/*        <CustomChip*/}
              {/*          label={getWishlistCount()}*/}
              {/*          color="secondary"*/}
              {/*        />*/}
              {/*      </ListItemButton>*/}
              {/*    )}*/}
              {/*  </>*/}
              {/*)}*/}
            </>
          </List>
        </Scrollbar>
      </Box>
      <ButtonsContainer
        token={token}
        handleRoute={handleRoute}
        handleLogout={handleLogout}
        openModal={openModal}
        isLogoutLoading={isLogoutLoading}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
};

export default MobileTopMenu;
