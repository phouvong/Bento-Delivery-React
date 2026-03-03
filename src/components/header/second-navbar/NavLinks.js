import React, { useMemo, useState } from "react";
import { Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavLinkStyle } from "../NavBar.style";
import { getModuleId } from "../../../helper-functions/getModuleId";

import dynamic from "next/dynamic";

const NavLinks = ({ zoneid, t, moduleType }) => {
  const [openCategoryModal, setCategoryModal] = useState(false);
  const [openRestaurantModal, setRestaurantModal] = useState(false);
  const router = useRouter();
  const NavStore = dynamic(() => import("./NavStore"), {
    ssr: false,
  });
  const NavCategory = dynamic(() => import("./NavCategory"), {
    ssr: false,
  });

  const homeHref = useMemo(() => {
    const queryModule = router?.query?.module || router?.query?.module_id;
    const moduleValue = Array.isArray(queryModule)
      ? queryModule[0]
      : queryModule || getModuleId();

    if (moduleValue) {
      return {
        pathname: "/home",
        query: { module: String(moduleValue) },
      };
    }

    return "/home";
  }, [router?.query?.module, router?.query?.module_id]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ paddingRight: "20px" }}
    >
      
        <>
          <Link href={homeHref}>
            <NavLinkStyle
              underline="none"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {t("Home")}
            </NavLinkStyle>
          </Link>
          {moduleType !== "parcel" ? (
            <>
              <NavCategory
                openModal={openCategoryModal}
                setModal={setCategoryModal}
                setRestaurantModal={setRestaurantModal}
              />
              <NavStore
                openModal={openRestaurantModal}
                setModal={setRestaurantModal}
              />
            </>
          ) : (
            <Link href="/help-and-support">
              <NavLinkStyle
                underline="none"
                // language_direction={language_direction}
                sx={{ cursor: "pointer" }}
              >
                {t("Contact")}
              </NavLinkStyle>
            </Link>
          )}
        </>
      
    </Stack>
  );
};

NavLinks.propTypes = {};

export default React.memo(NavLinks);
