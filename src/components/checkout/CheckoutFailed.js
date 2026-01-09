import React, { useState } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import { useTranslation } from "react-i18next";
import CustomModal from "../modal";
import CheckoutFailedCard from "./CheckoutFailedCard";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

const CheckoutFailed = (props) => {
  const { configData, handleOrderDetailsClose } = props;
  const [openModal, setModalOpen] = useState(false);
  const { t } = useTranslation();
  setTimeout(() => {
    setModalOpen(true);
    //handleOrderDetailsClose();
  }, 500);

  return (
    <CustomStackFullWidth
      padding={{ xs: "40px 15px", md: "45px 45px 40px" }}
      alignItems="center"
    >

      <CheckoutFailedCard
        id={props.id}
        configData={configData}
        handleOrderDetailsClose={handleOrderDetailsClose}
        amount="300"
      />

    </CustomStackFullWidth>
  );
};

CheckoutFailed.propTypes = {};

export default CheckoutFailed;
