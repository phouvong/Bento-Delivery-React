import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import CustomSearch from "../custom-search/CustomSearch";

import Router, { useRouter } from "next/router";
import SearchSuggestionsBottom from "../search/SearchSuggestionsBottom";
import { saveRecentSearch } from "utils/recentSearchStorage";

const HomeSearch = () => {
  const [openSearchSuggestions, setOpenSearchSuggestions] = useState(false);
  const [onSearchdiv, setOnSearchdiv] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const router = useRouter();
  const [zoneid, setZoneid] = React.useState(null);
  useEffect(() => {
    setZoneid(localStorage.getItem("direction"));
  }, []);

  const searchRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenSearchSuggestions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  useEffect(() => {
    const handleRouteChange = () => setOpenSearchSuggestions(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);
  const handleSearchResult = (value) => {
    localStorage.setItem("searchValue", value);
    router.push(
      {
        pathname: "/search",
        query: {
          searchValue: value,
        },
      },
      "/search"
    );
  };
  const handleOnFocus = () => {
    setOpenSearchSuggestions(true);
    localStorage.setItem("bg", true);
  };
  const handleSearchPopoverOnClose = () => {
    if (onSearchdiv) {
      setOpenSearchSuggestions(true);
    } else {
      setOpenSearchSuggestions(false);
    }
  };
  const handleKeyPress = (value) => {
    // if (e.key === 'Enter') {
    setOpenSearchSuggestions(false);
    if (value !== "") {
      saveRecentSearch(value);
    }
    if (value !== "") {
      router.push(
        {
          pathname: "/search",
          query: {
            searchValue: value,
          },
        },
        "/search"
      );
    }

    // else {
    //     toast.error(t('Please search some keywords.'))
    // }
    // }
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        mb: "1rem",
      }}
      onFocus={() => handleOnFocus()}
      ref={searchRef}
    >
      {zoneid && router.pathname !== "/" && (
        <>
          <CustomSearch
            label="Search..."
            handleSearchResult={handleKeyPress}
            selectedValue={selectedValue}
          />
          {openSearchSuggestions && (
            <SearchSuggestionsBottom
              setOnSearchdiv={setOnSearchdiv}
              setOpenSearchSuggestions={setOpenSearchSuggestions}
              setSelectedValue={setSelectedValue}
            />
          )}
        </>
      )}
    </Box>
  );
};
export default HomeSearch;
