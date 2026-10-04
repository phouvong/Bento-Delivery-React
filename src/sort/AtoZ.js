import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, Popover, Stack, styled, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import CustomImageContainer from "../components/CustomImageContainer";
import sort from "./assets/sort.png";

const Wrapper = styled(Button)(({ theme, border }) => ({
  border: border === "true" && `1px solid ${theme.palette.neutral[400]}`,
  borderRadius: "5px",
  padding: "7px 16px",
  // padding: "15px",
}));

const AtoZ = ({ handleSortBy, sortBy }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    handleSortBy?.(value);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getContent = (type, showArrow) => {
    let text;
    switch (type) {
      case "AtoZ":
        text = t("Sort by : A to Z");
        break;
      case "ZtoA":
        text = t("Sort by : Z to A");
        break;
      default:
        text = t("Sort by : Default");
    }
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <CustomImageContainer
          src={sort.src}
          height="12px"
          width="12px"
          objectfit="contain"
        />
        <Typography
          fontSize="13px"
          sx={{ color: (theme) => theme.palette.neutral[600] }}
        >
          {text}
        </Typography>
        {showArrow === "true" && (
          <>
            {open ? (
              <KeyboardArrowUpIcon
                sx={{ color: (theme) => theme.palette.text.secondary }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ color: (theme) => theme.palette.text.secondary }}
              />
            )}
          </>
        )}
      </Stack>
    );
  };

  return (
    <div>
      <Wrapper border="true" onClick={handleClick}>
        {getContent(sortBy, "true")}
      </Wrapper>
      <Popover
        fullWidth
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            width: anchorEl?.clientWidth || "auto",
          },
        }}
      >
        <Wrapper onClick={() => handleSelect("AtoZ")}>
          {getContent("AtoZ", "false")}
        </Wrapper>
        <Wrapper onClick={() => handleSelect("ZtoA")}>
          {getContent("ZtoA", "false")}
        </Wrapper>
        <Wrapper onClick={() => handleSelect("default")}>
          {getContent("default", "false")}
        </Wrapper>
      </Popover>
    </div>
  );
};

export default AtoZ;
