import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Button,
  Menu,
  MenuItem,
  styled,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import React from "react";

const CustomButtonWrapper = styled(Button)(({ theme }) => ({
  height: "30px",
  minWidth: "0px",
  width: "30px",
  border: `1px solid ${theme.palette.primary.main}`,
}));
const Menus = (props) => {
  const { selectedMenuIndex, setSelectedMenuIndex, menus, setFilteredData } =
    props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (index, itemValue) => {
    setAnchorEl(null);
    if (itemValue?.value) {
      setFilteredData(itemValue?.value);
    }
    if (typeof index === "number") {
      setSelectedMenuIndex(index);
    }
  };
  const handleTabChange = (index, value) => {
    if (value?.value) {
      setFilteredData(value?.value);
    }
    setSelectedMenuIndex(index);
  };
  const SmallScreen = () => (
    <Stack>
      <CustomButtonWrapper onClick={handleClick} variant="outlined">
        <FilterListIcon fontSize="small" />
      </CustomButtonWrapper>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menus.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() =>
                handleClose(index, item?.value ? item?.value : item)
              }
              selected={index === selectedMenuIndex}
            >
              {t(item?.label ? item?.label : item)}
            </MenuItem>
          );
        })}
      </Menu>
    </Stack>
  );
  const LargeScreen = () => (
    <Tabs variant="scrollable" scrollButtons="auto">
      {menus.map((item, index) => {
        return (
          <Tab
            sx={{
              cursor: "pointer",
              ml: index == 0 ? 0 : 3,
              color: selectedMenuIndex === index ? "primary.main" : "inherit",
              fontWeight: selectedMenuIndex === index ? "700" : "inherit",
              transition: "all ease 0.5s",
              "&:hover": {
                color: "primary.main",
              },
            }}
            key={index}
            onClick={() => handleTabChange(index, item)}
            label={item?.label ? item?.label : item}
            value={t(item?.value ? item?.value : item)}
          />
        );
      })}
    </Tabs>
  );
  return <div>{isSmall ? SmallScreen() : LargeScreen()}</div>;
};

Menus.propTypes = {};

export default Menus;
