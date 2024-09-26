import React from "react";
import { WrapperForCustomDialogConfirm } from "components/custom-dialog/confirm/CustomDialogConfirm.style";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DialogTitle from "@mui/material/DialogTitle";
import { alpha, Button, Typography, useTheme } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { t } from "i18next";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CssTextField } from "components/chat/ChatMessageAdd";
import { PrimaryButton } from "components/Map/map.style";
import { useRouter } from "next/router";
import CustomMessageReasonBox from "components/my-orders/order-details/other-order/CustomMessageReasonBox";

const ChatWithAdmin = ({ automateMessageData, orderID }) => {
  const theme = useTheme();
  const router = useRouter();
  const [selected, setSelected] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [text, setText] = React.useState("");

  const handleClick = (item) => {
    setSelected(item?.id === selected ? false : item?.id);
    setValue(item?.id === selected ? "" : item?.message);
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "admin",
        id: "admin",
        routeName: "admin_id",
        chatFrom: "true",
        text: `${value}${text}`,
        orderId: orderID,
        // deliveryman_name: storeData?.name,
        // deliveryManData_image: storeData?.logo_full_url,
      },
    });
  };

  return (
    <WrapperForCustomDialogConfirm
      smwidth="20rem"
      width="30rem"
      sx={{ paddingTop: "0px" }}
    >
      <CustomStackFullWidth spacing={1}>
        {automateMessageData?.length > 0 && (
          <DialogTitle
            id="alert-dialog-title"
            sx={{ padding: "0px 24px 10px 24px" }}
          >
            <Typography textAlign="center" fontSize="14px" fontWeight="500">
              {t("Select the Reason for Support")}
            </Typography>
          </DialogTitle>
        )}

        <DialogContent
          sx={{
            padding: {
              xs: "10px 10px",
              md: "10px 24px",
            },
          }}
        >
          <CustomStackFullWidth spacing={2}>
            <CustomMessageReasonBox
              selected={selected}
              handleClick={handleClick}
              automateMessageData={automateMessageData}
            />
            {automateMessageData?.length > 0 ? (
              <Typography textAlign="center" fontSize="14px" fontWeight="500">
                {t("Or Custom Massage")}
              </Typography>
            ) : (
              <Typography textAlign="center" fontSize="14px" fontWeight="500">
                {t("Custom Massage")}
              </Typography>
            )}

            <CssTextField
              border
              // disabled={disabled}
              fullWidth
              onChange={handleChange}
              // onKeyUp={handleKeyUp}
              placeholder={t("Type here to write a custom message")}
              value={text}
              size="small"
              multiline
              height="80px"
            />
            <PrimaryButton
              disabled={value === "" && text === ""}
              onClick={handleSubmit}
            >
              {t("Send Massage")}
            </PrimaryButton>
          </CustomStackFullWidth>
        </DialogContent>
      </CustomStackFullWidth>
    </WrapperForCustomDialogConfirm>
  );
};

export default ChatWithAdmin;
