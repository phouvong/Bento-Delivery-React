import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, Tooltip } from "@mui/material";
import toast from "react-hot-toast";
import CopyCodeIcon from "../referral-code/svg/CopyCodeIcon";

const CustomCopyWithTooltip = (props) => {
  const { t, value, forModal, companyName, referralCode } = props;
  const [copy, setCopy] = useState(false);
  const copyReferCode = async (text) => {
    if (typeof window !== undefined) {
      await window.navigator.clipboard.writeText(text);
    }
  };
  const handleCopy = (coupon_code) => {
    navigator.clipboard
      .writeText(coupon_code)
      .then(() => {
        setCopy(true);
        toast(() => (
          <span>
            {t("Code")}
            <b style={{ marginLeft: "4px", marginRight: "4px" }}>
              {referralCode}
            </b>
            {t("has been copied")}
          </span>
        ));
      })
      .catch((error) => {
        console.error("Failed to copy code:", error);
      });
  };
  return (
    <Tooltip arrow placement="top" title={copy ? t("Copied") : t("Copy")}>
      {forModal ? (
        <Button
          variant="contained"
          onMouseEnter={() => copy && setCopy(false)}
          onClick={() => handleCopy(value)}
        >
          Copy
        </Button>
      ) : (
        <IconButton
          onMouseEnter={() => copy && setCopy(false)}
          onClick={() => handleCopy(value)}
          sx={{ p: { xs: "0px", sm: "5px" }, m: { xs: "0px", sm: "5px" } }}
        >
          <CopyCodeIcon />
        </IconButton>
      )}
    </Tooltip>
  );
};

CustomCopyWithTooltip.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

export default CustomCopyWithTooltip;
