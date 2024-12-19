import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Adjust the import path as necessary
import { Skeleton, styled, Typography } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/system";
import { Scrollbar } from "components/srollbar";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { setStoreSelectedItems2 } from "redux/slices/categoryIds";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { VIEW_ALL_TEXT } from "utils/staticTexts";
import CustomCheckbox from "../CustomCheckbox";

export const CustomPaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: "paper.default",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
  borderRadius: "10px",
  p: "1rem",
  color: theme.palette.neutral[900],
}));

const BrandSelectBox = (props) => {
  const {
    title,
    data,
    isFetching,
    showAll,
    searchValue,
    id,
    selectedBrandsHandler,
    cId,
    linkRouteTo,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const storeSelectedItems2 = useSelector(
    (state) => state.categoryIds.storeSelectedItems2
  );
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    selectedBrandsHandler?.(storeSelectedItems2);
  }, [storeSelectedItems2]);

  useEffect(() => {
    if (searchValue === VIEW_ALL_TEXT.allCategories && data?.length > 0) {
      let checkData = { checked: true, id: "all" };
      allCheckHandler(checkData);
    } else {
      const initial = {
        checked: true,
        id: parseInt(id),
      };
      checkHandler(initial);
    }
  }, [data, searchValue, id]);

  const checkHandler = (checkedData) => {
    const parent = data?.find((item) => item?.id === checkedData?.id);
    let ids = [];
    if (parent) {
      ids =
        parent?.childes?.length > 0
          ? [parent.id, ...parent.childes?.map((child) => child.id)]
          : [parent.id];
    } else {
      ids.push(checkedData.id);
    }

    let newSelectedItems;
    if (checkedData.checked) {
      newSelectedItems = [
        ...storeSelectedItems2,
        ...ids.filter((id) => !storeSelectedItems2.includes(id)),
      ];
    } else {
      newSelectedItems = storeSelectedItems2.filter(
        (item) => !ids.includes(item)
      );
    }
    if (linkRouteTo === "nav") {
      dispatch(setStoreSelectedItems2([]));
    } else {
      dispatch(setStoreSelectedItems2(newSelectedItems));
    }
  };

  const allCheckHandler = (itemData) => {
    let allIds = data.reduce((acc, item) => {
      acc.push(item.id);
      if (item?.childes && item.childes?.length > 0) {
        item?.childes?.forEach((child) => acc.push(child.id));
      }
      return acc;
    }, []);

    if (itemData.checked) {
      setIsAllSelected(true);
      dispatch(setStoreSelectedItems2(allIds));
    } else {
      setIsAllSelected(false);
      dispatch(setStoreSelectedItems2([]));
    }
  };

  return (
    <CustomStackFullWidth>
      <Typography
        fontWeight="bold"
        sx={{
          color: (theme) => theme.palette.neutral[1000],
          paddingBottom: "1rem",
        }}
      >
        {t(title)}
      </Typography>
      <CustomPaperBox>
        <CustomStackFullWidth p="1rem">
          <Scrollbar style={{ maxHeight: "330px" }} scrollbarMinSize={1}>
            {showAll && (
              <CustomCheckbox
                item={{ name: "All", id: "all" }}
                checkHandler={allCheckHandler}
                isChecked={isAllSelected}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {data?.map((item, index) => (
              <Box key={index}>
                <CustomCheckbox
                  item={item}
                  checkHandler={checkHandler}
                  selectedItems={storeSelectedItems2}
                  isChecked={storeSelectedItems2.includes(item.id)}
                />
              </Box>
            ))}
            {isFetching &&
              [...Array(4)].map((_, index) => (
                <ListItemButton key={index}>
                  <ListItemText>
                    <Skeleton variant="rectangle" height="10px" width="100%" />
                  </ListItemText>
                </ListItemButton>
              ))}
          </Scrollbar>
        </CustomStackFullWidth>
      </CustomPaperBox>
    </CustomStackFullWidth>
  );
};

BrandSelectBox.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  // Include other PropTypes as necessary
};

export default BrandSelectBox;
