import React, { useState } from "react";
import { alpha, Collapse, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { useRouter } from "next/router";
//import { getDataLimit } from "../../utils/customFunctions";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { VIEW_ALL_TEXT } from "../../../../utils/staticTexts";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";

const CollapsableMenu = ({
  value,
  toggleDrawers,
  setOpenDrawer,
  pathName,
  forcategory,
  open,
  onToggle,
  onClose,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : localOpen;
  const handleClick = () => {
    if (isControlled) {
      onToggle?.();
      return;
    }
    setLocalOpen((prevState) => !prevState);
  };
  const closeMenu = () => {
    if (isControlled) {
      onClose?.();
      return;
    }
    setLocalOpen(false);
  };
  const handleRoute = (id, slug) => {
    if (forcategory === "true") {
      if (getCurrentModuleType() === "rental") {
        router.push({
          pathname: "/rental/vehicle-search",
          query: { categoryId: id },
        });
      } else {
        router.push({
          pathname: "/search",
          query: {
            search: "category",
            id: id,
            module: `${getModuleId()}`,
            name: btoa(name),
            data_type: "category",
          },
        });
      }
    } else {
      handleStoreRedirect({
        id: id,
        slug: slug,
      }, router);
    }

    // Ensure these states are updated regardless of the route logic
    closeMenu();
    setOpenDrawer(false);
  };

  const handleView = () => {
    if (pathName === "/categories") {
      if (getCurrentModuleType() === "rental") {
        router.push({ pathname: "/rental/vehicle-search", query: { all_category: 1 } }, undefined, { shallow: false });
      } else {
        router.push(
          {
            pathname: "/search",
            query: {
              search: VIEW_ALL_TEXT.allCategories,
              from: "allCategories",
              data_type: "new",
            },
          },
          undefined,
          { shallow: true }
        );
      }
    } else {
      router.push(pathName, undefined, { shallow: true });
    }

    closeMenu();
    setOpenDrawer(false);
  };
  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          color: (theme) => theme.palette.primary.main,
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        <ListItemText primary={t(value?.text)} />
        {isOpen ? (
          <ExpandLess sx={{ fontSize: "20px" }} />
        ) : (
          <ExpandMore sx={{ fontSize: "20px" }} />
        )}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div">
          {value.items?.slice?.(0, 10)?.map((item, index) => (
            <ListItemButton
              sx={{
                pl: 4,
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                },
              }}
              key={index}
              onClick={() => handleRoute(item.id, item?.slug)}
            >
              <ListItemText primary={item.name}></ListItemText>
            </ListItemButton>
          ))}
          <CustomStackFullWidth alignItems="center" justifyContent="center">
            <Typography
              fontSize=".8rem"
              fontWeight="bold"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={handleView}
            >
              {t("View all")}
            </Typography>
          </CustomStackFullWidth>
        </List>
      </Collapse>
    </>
  );
};

export default CollapsableMenu;
