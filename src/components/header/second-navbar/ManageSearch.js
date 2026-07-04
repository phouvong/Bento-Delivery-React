import React, { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CustomSearch from "../../custom-search/CustomSearch";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchSuggestionsBottom from "../../search/SearchSuggestionsBottom";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { saveRecentSearch } from "utils/recentSearchStorage";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useTheme } from "@mui/material";
import useGetItemOrStore from "../../../api-manage/hooks/react-query/search/useGetItemOrStore";
import { removeSpecialCharacters } from "utils/CustomFunctions";

const ManageSearch = ({
  zoneid,
  fullWidth,
  searchQuery,
  name,
  query,
  currentTab,
  searchFromNav = false,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openSearchSuggestions, setOpenSearchSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [onSearchdiv, setOnSearchdiv] = useState(false);
  const [d_type, setD_type] = useState(null);
  const [isEmpty, setIsEmpty] = useState(!searchQuery);
  const isFocused = useRef(false);
  const isClearing = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearchValue(searchQuery);
    } else {
      setSearchValue("");
    }
  }, [searchQuery]);
  useEffect(() => {
    if (currentTab === 0) {
      setD_type("category");
    } else {
      setD_type("all");
    }
  }, [currentTab]);

  const handleKeyPress = (value, remove) => {
    if (value !== "") {
      setOpenSearchSuggestions(false);
      saveRecentSearch(value);

      const currentModule =
        searchParams?.get("module") || query?.module || getCurrentModuleType();
      // Searching always switches to data_type=searched, but keep brand_id from
      // the live URL so the search stays scoped to the brand (brand_ids -> API).
      const brandId = searchParams?.get("brand_id") || query?.brand_id;
      const newQuery = {
        ...query, // Retain existing query parameters
        ...(currentModule ? { module: currentModule } : {}),
        ...(brandId ? { brand_id: brandId } : {}),
        search: value,
        data_type: "searched",
      };

      router.push({
        pathname: "/search",
        query: newQuery,
      });
    } else {
      setOpenSearchSuggestions(false);
      if (remove === "true" && searchQuery) {
        isClearing.current = true;
        const currentModule =
          searchParams?.get("module") ||
          query?.module ||
          getCurrentModuleType();
        const brandId = searchParams?.get("brand_id") || query?.brand_id;
        if (brandId) {
          // On a brand's page, clearing the search keeps the user scoped to
          // that brand's products instead of leaving the page.
          router.push(
            {
              pathname: "/search",
              query: {
                ...(currentModule ? { module: currentModule } : {}),
                brand_id: brandId,
                data_type: "brand",
              },
            },
            undefined,
            { shallow: true },
          );
        } else {
          router.push({
            pathname: "/home",
            query: currentModule ? { module: currentModule } : {},
          });
        }
      } else {
        setSearchValue("");
      }
    }
  };

  //KEYPRESS WISE SEARCH

  const {
    data: itemOrStoreSuggestionData,
    refetch: refetchItemOrStoreSuggestion,
    isRefetching: isRefetchingItemOrStoreSuggestion,
  } = useGetItemOrStore(removeSpecialCharacters(searchValue));

  let searchTimeout;

  const getSearchSuggestions = async () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout); // Clear the previous timeout
    }

    searchTimeout = setTimeout(async () => {
      await refetchItemOrStoreSuggestion(); // Execute the function after 500ms
    }, 500);
  };

  useEffect(() => {
    getSearchSuggestions();
    if (isFocused.current && searchValue === "" && !isClearing.current) {
      setIsEmpty(true);
      setOpenSearchSuggestions(true);
    }
    if (isClearing.current) {
      isClearing.current = false;
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isFocused.current) return;
    if (itemOrStoreSuggestionData) {
      if (
        itemOrStoreSuggestionData?.items?.length === 0 &&
        itemOrStoreSuggestionData?.stores?.length === 0
      ) {
        if (!searchValue) setOpenSearchSuggestions(false);
      } else {
        setOpenSearchSuggestions(true);
      }
    }
  }, [itemOrStoreSuggestionData?.items, itemOrStoreSuggestionData?.stores]);

  useEffect(() => {
    setOpenSearchSuggestions(false);
  }, [pathname, searchParams?.toString()]);
  const handleOnFocus = () => {
    isFocused.current = true;
    setIsEmpty(searchValue === "");
    setOpenSearchSuggestions(true);
    localStorage.setItem("bg", true);
  };
  const searchRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        isFocused.current = false;
        setOpenSearchSuggestions(false);
        setIsEmpty(true);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const MODULE_NOUN = {
    [ModuleTypes.FOOD]: t("Food"),
    [ModuleTypes.GROCERY]: t("Grocery"),
    [ModuleTypes.PHARMACY]: t("Medicine"),
    [ModuleTypes.ECOMMERCE]: t("Products"),
    [ModuleTypes.PARCEL]: t("Parcel"),
  };

  const moduleType = getCurrentModuleType();
  const moduleNoun = MODULE_NOUN[moduleType] ?? t("Items");

  // Animated placeholder — cycles through [moduleNoun, ...category names].
  // Starts on the module noun and switches to category names once they load.
  const { data: categoriesResponse } = useGetCategories();
  const animatedItems = useMemo(() => {
    const base = [moduleNoun];
    const cats = categoriesResponse?.data ?? [];
    cats.slice(0, 15).forEach((c) => {
      if (c?.name) base.push(c.name);
    });
    return base;
  }, [categoriesResponse, moduleNoun]);

  const [phIndex, setPhIndex] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  // Ref so the interval always reads the latest items without restarting
  const animatedItemsRef = useRef(animatedItems);
  animatedItemsRef.current = animatedItems;

  useEffect(() => {
    const id = setInterval(() => {
      const items = animatedItemsRef.current;
      if (!items || items.length <= 1) return;
      setPhVisible(false);
      setTimeout(() => {
        setPhIndex((prev) => (prev + 1) % items.length);
        setPhVisible(true);
      }, 280);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const rawNoun = animatedItems[phIndex] ?? moduleNoun;
  // Keep long category names from breaking the placeholder UI
  const currentNoun =
    rawNoun.length > 22 ? `${rawNoun.slice(0, 22).trimEnd()}…` : rawNoun;

  const richPlaceholder = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {t("Search for")}&nbsp;
      <span
        style={{
          fontWeight: 700,
          color: theme.palette.neutral[1050],
          display: "inline-block",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: phVisible ? 1 : 0,
          transform: phVisible ? "translateY(0)" : "translateY(-5px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        &ldquo;{currentNoun}&rdquo;
      </span>
    </span>
  );

  const getModuleWiseSearch = () => {
    return (
      <CustomSearch
        richPlaceholder={richPlaceholder}
        label=""
        handleSearchResult={handleKeyPress}
        selectedValue={searchQuery}
        setIsEmpty={setIsEmpty}
        handleOnFocus={handleOnFocus}
        setSearchValue={setSearchValue}
      />
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: fullWidth
          ? "100%"
          : {
              xs: "300px",
              sm: "440px",
              md: "600px",
            },
      }}
      onFocus={() => handleOnFocus()}
      ref={searchRef}
    >
      {router.pathname !== "/" && (
        <>
          {getModuleWiseSearch()}
          {openSearchSuggestions && (
            <SearchSuggestionsBottom
              searchValue={searchValue}
              setOnSearchdiv={setOnSearchdiv}
              setOpenSearchSuggestions={setOpenSearchSuggestions}
              setSelectedValue={setSelectedValue}
              isEmpty={isEmpty}
              handleKeyPress={handleKeyPress}
              itemOrStoreSuggestionData={itemOrStoreSuggestionData}
              isRefetchingItemOrStoreSuggestion={
                isRefetchingItemOrStoreSuggestion
              }
              searchFromNav={searchFromNav}
            />
          )}
        </>
      )}
    </Box>
  );
};

ManageSearch.propTypes = {};

export default ManageSearch;
