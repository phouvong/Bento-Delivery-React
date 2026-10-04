import React, { useEffect, useRef, useState } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  Skeleton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { Scrollbar } from "../srollbar";
//import CheckboxWithChild from "../store-details/middle-section/CheckboxWithChild";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
//import CustomCheckbox from "../CustomCheckbox";
import { VIEW_ALL_TEXT } from "../../utils/staticTexts";
import { setStoreSelectedItems } from "redux/slices/categoryIds";
import { useDispatch, useSelector } from "react-redux";
import CustomCheckbox from "../CustomCheckbox";
import CheckboxWithChild from "../store-details/middle-section/CheckboxWithChild";
export const CustomPaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: "paper.default",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
  borderRadius: "10px",
  p: "1rem",
  color: theme.palette.neutral[900],
}));
const MultipleCheckboxWithTitle = (props) => {
  const {
    title,
    data,
    isFetching,
    showAll,
    searchValue,
    id,
    urlCategoryIds,
    urlSelectAll,
    selectedCategoriesHandler,
  } = props;

  const { t } = useTranslation();
  const scrollIdPrefix = "search-filter-category-";
  const lastScrolledIdRef = useRef(null);
  const skipNextSyncToParentRef = useRef(false);
  const lastSyncedSelectionKeyRef = useRef(null);
  const lastAppliedUrlSelectionKeyRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);
  const dispatch = useDispatch();
  const storeSelectedItems = useSelector(
    (state) => state.categoryIds.storeSelectedItems
  );
  

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  

  useEffect(() => {
    setSelectedId(id);
  }, [id]);

  useEffect(() => {
    if (!id || !Array.isArray(data) || data.length === 0) return;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;

    const parent = data.find(
      (category) =>
        category?.id === numericId ||
        category?.childes?.some((child) => child?.id === numericId)
    );
    if (parent?.id) {
      setExpandedCategoryIds((prev) =>
        prev.includes(parent.id) ? prev : [...prev, parent.id]
      );
    }
  }, [id, data]);
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const normalizedUrlIds =
      Array.isArray(urlCategoryIds) && urlCategoryIds.length > 0
        ? urlCategoryIds
            .map((item) => Number(item))
            .filter((item) => Number.isFinite(item))
        : [];
    const uniqueUrlIds = [...new Set(normalizedUrlIds)].sort((a, b) => a - b);
    const urlSelectionKey = urlSelectAll
      ? "all"
      : uniqueUrlIds.length > 0
        ? uniqueUrlIds.join(",")
        : "none";

    if (lastAppliedUrlSelectionKeyRef.current === urlSelectionKey) return;
    lastAppliedUrlSelectionKeyRef.current = urlSelectionKey;
    if (urlSelectionKey === "none") return;

    skipNextSyncToParentRef.current = true;

    if (urlSelectAll) {
      const allIds = data.reduce((acc, item) => {
        acc.push(item.id);
        if (Array.isArray(item.childes) && item.childes.length > 0) {
          item.childes.forEach((child) => acc.push(child.id));
        }
        return acc;
      }, []);
      const uniqueAllIds = [
        ...new Set(
          allIds
            .map((item) => Number(item))
            .filter((item) => Number.isFinite(item))
        ),
      ].sort((a, b) => a - b);

      setIsAllSelected(true);
      setSelectedItems(uniqueAllIds);
      dispatch(setStoreSelectedItems(uniqueAllIds));
      return;
    }

    setIsAllSelected(false);
    setSelectedItems(uniqueUrlIds);
    dispatch(setStoreSelectedItems(uniqueUrlIds));

    const parentIds = uniqueUrlIds
      .map((categoryId) => findParentId(categoryId))
      .filter((parentId) => parentId && Number.isFinite(Number(parentId)));
    if (parentIds.length > 0) {
      setExpandedCategoryIds((prev) => {
        const prevIds = Array.isArray(prev) ? prev : [];
        return [...new Set([...prevIds, ...parentIds])];
      });
    }
  }, [data, urlCategoryIds, urlSelectAll]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!id || !Array.isArray(data) || data.length === 0) return;

    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    if (lastScrolledIdRef.current === numericId) return;

    const raf = requestAnimationFrame(() => {
      const element = document.getElementById(`${scrollIdPrefix}${numericId}`);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      lastScrolledIdRef.current = numericId;
    });

    return () => cancelAnimationFrame(raf);
  }, [id, data, expandedCategoryIds]);
  useEffect(() => {
    const sourceIds = isSmall ? storeSelectedItems : selectedItems;
    const normalizedIds = Array.isArray(sourceIds)
      ? sourceIds
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item))
      : [];
    const uniqueIds = [...new Set(normalizedIds)].sort((a, b) => a - b);
    const selectionKey = `${isAllSelected ? "all" : "ids"}:${uniqueIds.join(",")}`;

    if (skipNextSyncToParentRef.current) {
      skipNextSyncToParentRef.current = false;
      lastSyncedSelectionKeyRef.current = selectionKey;
      return;
    }
    if (lastSyncedSelectionKeyRef.current === selectionKey) return;
    lastSyncedSelectionKeyRef.current = selectionKey;

    selectedCategoriesHandler?.(uniqueIds, isAllSelected);
  }, [
    isAllSelected,
    isSmall,
    selectedCategoriesHandler,
    selectedItems,
    storeSelectedItems,
  ]);
  useEffect(() => {
    if (urlSelectAll || (Array.isArray(urlCategoryIds) && urlCategoryIds.length > 0))
      return;
    if (!Array.isArray(data) || data.length === 0) return;

    if (searchValue === VIEW_ALL_TEXT.allCategories) {
      allCheckHandler({ checked: true, id: "all" });
      return;
    }

    if (searchValue === "category") {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) return;

      const parent = data?.find((item) => item?.id === numericId);
      const ids = parent?.childes?.length
        ? [parent.id, ...parent.childes.map((child) => child.id)]
        : [numericId];

      const uniqueIds = [
        ...new Set(
          ids.map((item) => Number(item)).filter((item) => Number.isFinite(item))
        ),
      ];

      setIsAllSelected(false);
      setSelectedItems(uniqueIds);
      dispatch(setStoreSelectedItems(uniqueIds));
    }
  }, [data, id, searchValue, urlCategoryIds, urlSelectAll]);
  useEffect(() => {
    const totalLength = data.length + data.reduce((acc, item) => acc + (item.childes?.length || 0), 0);
    const checkDuplicate = Array.isArray(storeSelectedItems || storeSelectedItems) ? [...new Set(selectedItems || storeSelectedItems)] : [];
     console.log({totalLength,checkDuplicate});
     
    if (totalLength === (checkDuplicate.length || storeSelectedItems?.length) && !isAllSelected) {
      setIsAllSelected(true); // Only run if not already selected
      allCheckHandler({ checked: true, id: "all" });
    }

    if (totalLength !== (checkDuplicate.length || storeSelectedItems?.length) && isAllSelected) {
      // Optional: reset flag if something is unchecked
      setIsAllSelected(false);
    }
  }, [data, selectedItems,storeSelectedItems]);

  const findParentId = (categoryId) => {
    if (!categoryId || !Array.isArray(data) || data.length === 0) return null;
    const numericId = Number(categoryId);
    if (!Number.isFinite(numericId)) return null;

    const parent = data.find(
      (category) =>
        category?.id === numericId ||
        category?.childes?.some((child) => child?.id === numericId)
    );
    return parent?.id ?? null;
  };

  const checkHandler = (checkedData) => {

    setIsAllSelected(false )
    if (checkedData?.checked) {
      const parentId = findParentId(checkedData?.id);
      if (parentId) {
        setExpandedCategoryIds((prev) =>
          prev.includes(parentId) ? prev : [...prev, parentId]
        );
      }
    }
    if (isSmall) {
      const parent = data?.find((item) => item?.id === checkedData?.id);
      let ids = [];
      if (parent) {
        ids =
          parent?.childes.length > 0
            ? [parent.id, ...parent.childes.map((child) => child.id)]
            : [parent.id];
      } else {
        ids.push(checkedData.id);
      }
      let newSelectedItems;
      if (checkedData.checked) {
        newSelectedItems = [
          ...storeSelectedItems,
          ...ids.filter((id) => !storeSelectedItems.includes(id)),
        ];
      } else {
        newSelectedItems = storeSelectedItems.filter(
          (item) => !ids.includes(item)
        );
      }
      dispatch(setStoreSelectedItems(newSelectedItems));
    } else {
      const parent = data?.find((item) => item?.id === checkedData?.id);
      let ids = [];
      if (parent) {
        if (parent?.childes.length > 0) {
          ids = [parent?.id, ...parent?.childes?.map((childId) => childId?.id)];
        } else {
          ids.push(parent?.id);
        }
      } else {
        ids.push(checkedData?.id);
      }
      if (checkedData?.checked) {
        setSelectedId(parent?.id);
        setSelectedItems((prevState) => [...prevState, ...ids]);
      } else {
        setSelectedItems((prevState) =>
          prevState.filter((item) => ids?.every((id) => id !== item))
        );
      }
    }
  };
  const allCheckHandler = (itemData) => {
    if (isSmall) {
      let allIds = data.reduce((acc, item) => {
        acc.push(item.id);
        if (item.childes && item.childes.length > 0) {
          item.childes.forEach((child) => acc.push(child.id));
        }
        return acc;
      }, []);
      if (itemData.checked) {
        setIsAllSelected(true);
        dispatch(setStoreSelectedItems(allIds));
      } else {
        setIsAllSelected(false);
        dispatch(setStoreSelectedItems([]));
      }
    } else {
      if (itemData?.checked) {
        setIsAllSelected(true);
        let allIds = [];
        if (data?.length > 0) {
          data.forEach((item) => {
            allIds.push(item.id);
            if (item?.childes?.length > 0) {
              item?.childes?.forEach((childItem) => allIds.push(childItem.id));
            }
          });
        }
        setSelectedItems((prevState) => [...prevState, ...allIds]);
      } else {
        setIsAllSelected(false);
        setSelectedItems((prevState) => []);
      }
    }
  };
console.log({isAllSelected,selectedItems,storeSelectedItems});

  return (
    <CustomStackFullWidth
     
    >
      <Typography
        fontWeight="bold"
        sx={{
          color: (theme) => theme.palette.neutral[1000],
          paddingInlineStart: ".5rem",
          paddingTop:"1rem"
        }}
      >
        {t(title)}
      </Typography>
  
        <CustomStackFullWidth p="1rem">
         
            {showAll && (
              <CustomCheckbox
                item={{ name: "All", id: "all" }}
                checkHandler={allCheckHandler}
                isChecked={isAllSelected}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {data?.map((item, index) => {
              return (
                <>
                  {isSmall ? (
                    <CheckboxWithChild
                      key={index}
                      item={item}
                      checkHandler={checkHandler}
                      selectedItems={storeSelectedItems}
                      scrollIdPrefix={scrollIdPrefix}
                      expandedIds={expandedCategoryIds}
                      setExpandedIds={setExpandedCategoryIds}
                    />
                  ) : (
                    <CheckboxWithChild
                      key={index}
                      item={item}
                      checkHandler={checkHandler}
                      selectedItems={selectedItems}
                      scrollIdPrefix={scrollIdPrefix}
                      expandedIds={expandedCategoryIds}
                      setExpandedIds={setExpandedCategoryIds}
                    />
                  )}
                </>
              );
            })}
            {isFetching &&
              [...Array(4)].map((item, index) => {
                return (
                  <ListItemButton key={index}>
                    <ListItemText>
                      <Skeleton
                        variant="rectangle"
                        height="10px"
                        width="100%"
                      />
                    </ListItemText>
                  </ListItemButton>
                );
              })}
         
        </CustomStackFullWidth>
     
    </CustomStackFullWidth>
  );
};

MultipleCheckboxWithTitle.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  // Include other PropTypes as necessary
};

export default MultipleCheckboxWithTitle;
