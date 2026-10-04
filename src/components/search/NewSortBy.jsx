import React from "react";
import { Button, Popover, Stack, styled, Typography } from "@mui/material";
import sort from "../../sort/assets/sort.png";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomImageContainer from "components/CustomImageContainer";

const Wrapper = styled(Button)(({ theme, border }) => ({
  border: border === "true" && `1px solid ${theme.palette.neutral[400]}`,
  borderRadius: "5px",
  padding: "7px 16px",
  textTransform: "capitalize",
}));

const NewSortBy = ({ handleSortBy, newSort }) => {
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

  const demoData = [
    { name: "Default", value: "default" },
    { name: "Fast Delivery", value: "fast_delivery" },
    { name: "Distance", value: "nearby" },
  ];

  const getContent = (label, showArrow) => {
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
          objectFit="contain"
        />
        <Typography
          fontSize="13px"
          sx={{ color: (theme) => theme.palette.neutral[600] }}
        >
          {t(label)}
        </Typography>
        {showArrow === "true" &&
          (open ? (
            <KeyboardArrowUpIcon
              sx={{ color: (theme) => theme.palette.text.secondary }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ color: (theme) => theme.palette.text.secondary }}
            />
          ))}
      </Stack>
    );
  };

  return (
    <div>
      <Wrapper border="true" onClick={handleClick}>
        {getContent(newSort?.replace("_", " ") || "Sort by", "true")}
      </Wrapper>

      <Popover
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
        {demoData?.map((option) => (
          <Wrapper key={option} onClick={() => handleSelect(option?.value)}>
            {getContent(` ${option?.name}`, "false")}
          </Wrapper>
        ))}
      </Popover>
    </div>
  );
};

export default NewSortBy;
