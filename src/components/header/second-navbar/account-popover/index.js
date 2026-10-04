import React from "react";
import { Fade, Popover } from "@mui/material";
import AccountMenuPanel from "./AccountMenuPanel";
import { getLanguage } from "helper-functions/getLanguage";

const AccountPopover = (props) => {
  const {
    cartListRefetch,
    anchorEl,
    onClose,
    open,
    token,
    onSignInClick,
    bg = "white",
    ...other
  } = props;

  const isRtl = getLanguage() === "rtl";
  const horizontal = isRtl ? "left" : "right";

  return (
    <Popover
      disableScrollLock
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal }}
      transformOrigin={{ vertical: "top", horizontal }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: 320,
          mt: "8px",
          borderRadius: "12px",
          boxShadow: "0px 16px 16px -8px rgba(0,0,0,0.30)",
          backgroundColor: "transparent",
          overflow: "visible",
        },
      }}
      transitionDuration={3}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      {...other}
    >
      <AccountMenuPanel
        bg={bg}
        token={token}
        onClose={onClose}
        onSignInClick={onSignInClick}
        cartListRefetch={cartListRefetch}
      />
    </Popover>
  );
};

export default AccountPopover;
