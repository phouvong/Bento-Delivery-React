import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CustomSearch from "../../custom-search/CustomSearch";
import { useRouter } from "next/navigation";
import SearchSuggestionsBottom from "../../search/SearchSuggestionsBottom";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { alpha } from "@mui/material";
import useGetItemOrStore from "../../../api-manage/hooks/react-query/search/useGetItemOrStore";
import { removeSpecialCharacters } from "utils/CustomFunctions";

const ManageSearch = ({
  zoneid,
  fullWidth,
  searchQuery,
  name,
  query,
  currentTab,
}) => {
  const router = useRouter();

  const [openSearchSuggestions, setOpenSearchSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [onSearchdiv, setOnSearchdiv] = useState(false);
  const [d_type, setD_type] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (searchQuery === undefined) {
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
      let getItem = JSON.parse(localStorage.getItem("searchedValues")) || [];

      if (value && !getItem.includes(value)) {
        getItem.push(value);
        localStorage.setItem("searchedValues", JSON.stringify(getItem));
      }

      const newQuery = {
        ...query, // Retain existing query parameters
        search: value,
        data_type: "searched",
      };

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    } else {
      if (remove === "true" && searchQuery) {
        const newQuery = {
          ...query, // Retain existing query parameters
          search: value,
          data_type: d_type,
        };

        router.replace(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
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
  }, [searchValue]);

  useEffect(() => {
    if (itemOrStoreSuggestionData) {
      if (
        itemOrStoreSuggestionData?.items?.length === 0 &&
        itemOrStoreSuggestionData?.stores?.length === 0
      ) {
        setOpenSearchSuggestions(false);
      } else {
        setOpenSearchSuggestions(true);
      }
    }
  }, [itemOrStoreSuggestionData?.items, itemOrStoreSuggestionData?.stores]);
  const handleOnFocus = () => {
    if (searchValue === "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    setOpenSearchSuggestions(true);
    localStorage.setItem("bg", true);
  };
  const searchRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
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

  const dynamicLabel = () => {
    if (getCurrentModuleType() === ModuleTypes.GROCERY) {
      return `Search for grocery or store...`;
    }
    if (getCurrentModuleType() === ModuleTypes.PHARMACY) {
      return `Search for medicine or store...`;
    }
    if (getCurrentModuleType() === ModuleTypes.ECOMMERCE) {
      return `Search for products or store...`;
    }
  };

  const getModuleWiseSearch = () => {
    if (getCurrentModuleType() === ModuleTypes.FOOD) {
      return (
        <Box
          sx={{
            backgroundColor: (theme) =>
              alpha(theme.palette.moduleTheme.food, 0.4),
            padding: { xs: "8px", md: "16px" },
            borderRadius: "2px",
          }}
        >
          <CustomSearch
            label={t("Search foods and restaurants...")}
            handleSearchResult={handleKeyPress}
            selectedValue={searchQuery}
            setIsEmpty={setIsEmpty}
            handleOnFocus={handleOnFocus}
            setSearchValue={setSearchValue}
          />
        </Box>
      );
    } else {
      return (
        <CustomSearch
          label={t(dynamicLabel())}
          handleSearchResult={handleKeyPress}
          selectedValue={searchQuery}
          setIsEmpty={setIsEmpty}
          handleOnFocus={handleOnFocus}
          setSearchValue={setSearchValue}
        />
      );
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: {
          xs: fullWidth ? "100%" : "300px",
          sm: "440px",
          md: "600px",
        },
      }}
      onFocus={() => handleOnFocus()}
      ref={searchRef}
    >
      {zoneid && router.pathname !== "/" && (
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
            />
          )}
        </>
      )}
    </Box>
  );
};

ManageSearch.propTypes = {};

export default ManageSearch;
