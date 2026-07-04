import React, { useEffect, useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Skeleton from "@mui/material/Skeleton";
import useGetSuggestedProducts from "../../api-manage/hooks/react-query/search/useGetSuggestedProducts";
import SuggestedSearches from "./recent-search/SuggestedSearches";
import SearchDropdownEmpty from "./recent-search/SearchDropdownEmpty";
import { useDispatch } from "react-redux";
import {
  handleSuggestionItemClick,
  handleSuggestionStoreClick,
} from "helper-functions/handleSuggestionClick";
import {
  getRecentSearches,
  deleteRecentSearch,
  clearRecentSearches,
} from "utils/recentSearchStorage";

const DropdownPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: 48,
  left: 0,
  width: "100%",
  zIndex: 999,
  borderRadius: "16px",
  boxShadow: "0px 8px 32px 0px rgba(0,0,0,0.12)",
  overflow: "hidden",
}));

const ScrollableContent = styled("div")({
  maxHeight: "400px",
  overflowY: "auto",
  "&::-webkit-scrollbar": { width: "4px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "neutral.300", borderRadius: "4px" },
});

const SearchSuggestionsBottom = (props) => {
  const {
    searchValue,
    setOpenSearchSuggestions,
    setOnSearchdiv,
    setSelectedValue,
    isEmpty,
    handleKeyPress,
    itemOrStoreSuggestionData,
    isRefetchingItemOrStoreSuggestion,
    searchFromNav = false,
  } = props;

  const [list, setList] = useState([]);
  const { t } = useTranslation();
  const router = useRouter();
  const reduxDispatch = useDispatch();

  const closeSuggestion = () => setOpenSearchSuggestions(false);

  const onSuggestionItemClick = (item) =>
    handleSuggestionItemClick(item, router, reduxDispatch, closeSuggestion);

  const onSuggestionStoreClick = (store) =>
    handleSuggestionStoreClick(store, router, closeSuggestion);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const handleSearchSuccess = (res) => {};
  const { refetch, isRefetching } =
    useGetSuggestedProducts(handleSearchSuccess);

  useEffect(() => {
    setList(getRecentSearches());
    if (token) {
      refetch();
    }
  }, []);

  const getModuleValue = () => {
    const queryModule = router?.query?.module || router?.query?.module_id;
    return Array.isArray(queryModule) ? queryModule[0] : queryModule;
  };

  const handleItemClick = (value) => {
    setSelectedValue(value);
    setOpenSearchSuggestions(false);
    router.push(
      {
        pathname: "/search",
        query: {
          search: value,
          data_type: "searched",
          module: getModuleValue(),
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleDelete = (value) => {
    deleteRecentSearch(value);
    setList((prev) => prev.filter((item) => item !== value));
  };

  const clearAll = () => {
    clearRecentSearches();
    setList([]);
  };

  // hide dropdown when nothing to show
  const hasTypingResults =
    !isEmpty &&
    (itemOrStoreSuggestionData?.items?.length > 0 ||
      itemOrStoreSuggestionData?.stores?.length > 0 ||
      isRefetchingItemOrStoreSuggestion);

  if (!isEmpty && !hasTypingResults && !searchValue) return null;

  return (
    <DropdownPaper
      elevation={0}
      onMouseEnter={() => setOnSearchdiv(true)}
      onMouseLeave={() => setOnSearchdiv(false)}
    >
      <ScrollableContent>
        {isEmpty ? (
          // ── Empty state: 4 sections ──────────────────────────────────
          <SearchDropdownEmpty
            list={list}
            onItemClick={handleItemClick}
            onDelete={handleDelete}
            onClearAll={clearAll}
            t={t}
            searchFromNav={searchFromNav}
          />
        ) : (
          // ── Typing state: items + stores suggestions ─────────────────
          <Box sx={{ p: "20px" }}>
            {isRefetchingItemOrStoreSuggestion ? (
              <Stack spacing={1}>
                <Skeleton variant="text" width="120px" />
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <Skeleton variant="text" width="120px" height="40px" />
                  <Skeleton variant="text" width="120px" height="40px" />
                  <Skeleton variant="text" width="120px" height="40px" />
                </Stack>
              </Stack>
            ) : (
              (itemOrStoreSuggestionData?.items?.length > 0 ||
                itemOrStoreSuggestionData?.stores?.length > 0 ||
                searchValue) && (
                <SuggestedSearches
                  t={t}
                  data={itemOrStoreSuggestionData}
                  handleKeyPress={handleKeyPress}
                  isRefetching={isRefetchingItemOrStoreSuggestion}
                  searchValue={searchValue}
                  onItemClick={onSuggestionItemClick}
                  onStoreClick={onSuggestionStoreClick}
                />
              )
            )}
          </Box>
        )}
      </ScrollableContent>
    </DropdownPaper>
  );
};

SearchSuggestionsBottom.propTypes = {};

export default SearchSuggestionsBottom;
