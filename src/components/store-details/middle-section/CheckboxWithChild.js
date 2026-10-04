import React, { useState } from "react";
import { Stack } from "@mui/system";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomCheckbox from "../../CustomCheckbox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const CheckboxWithChild = (props) => {
  const {
    item,
    checkHandler,
    selectedItems,
    scrollIdPrefix,
    expandedIds,
    setExpandedIds,
    expandedId,
    setExpandedId,
  } = props;
  const [open, setOpen] = useState(true);
  const isMultiControlled =
    Array.isArray(expandedIds) && typeof setExpandedIds === "function";
  const isSingleControlled =
    expandedId !== undefined && typeof setExpandedId === "function";
  const isOpen = isMultiControlled
    ? expandedIds.includes(item?.id)
    : isSingleControlled
      ? expandedId === item?.id
      : open;
  const clickHandler = () => {
    if (!item?.childes?.length) return;
    if (isMultiControlled) {
      setExpandedIds((prev) => {
        const prevIds = Array.isArray(prev) ? prev : [];
        return prevIds.includes(item?.id)
          ? prevIds.filter((id) => id !== item?.id)
          : [...prevIds, item?.id];
      });
      return;
    }
    if (isSingleControlled) {
      setExpandedId((prev) => (prev === item?.id ? null : item?.id));
      return;
    }
    setOpen((prev) => !prev);
  };
  const isCheckedHandler = (id) => {
    const isExist = selectedItems?.find((item) => item === id);
    return !!isExist;
  };
  return (
    <CustomBoxFullWidth
      id={scrollIdPrefix ? `${scrollIdPrefix}${item?.id}` : undefined}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomCheckbox
          item={item}
          checkHandler={checkHandler}
          isChecked={() => isCheckedHandler(item?.id)}
        />
        {item?.childes?.length > 0 && (
          <>
            {isOpen ? (
              <KeyboardArrowUpIcon
                onClick={clickHandler}
                color="primary"
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                color="primary"
                onClick={clickHandler}
                sx={{ cursor: "pointer" }}
              />
            )}
          </>
        )}
      </Stack>
      {isOpen && (
        <>
          {item?.childes?.map((childItem, childIndex) => (
            <CustomStackFullWidth
              key={childIndex}
              id={scrollIdPrefix ? `${scrollIdPrefix}${childItem?.id}` : undefined}
              sx={{ padding: "0px 16px" }}
            >
              <CustomCheckbox
                item={childItem}
                checkHandler={checkHandler}
                isChecked={() => isCheckedHandler(childItem?.id)}
              />
            </CustomStackFullWidth>
          ))}
        </>
      )}
    </CustomBoxFullWidth>
  );
};

CheckboxWithChild.propTypes = {};

export default CheckboxWithChild;
