import CheckIcon from "@mui/icons-material/Check";
import { alpha, Stack, Typography } from "@mui/material";
import React from "react";
import {
  BodyWrapper,
  CardWrapper,
  ChatMessageWrapper,
  CustomAvatar,
  TimeWrapper,
} from "./Message.style";

// import { FormatedDateWithTime } from "../../utils/customFunctions";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { Box } from "@mui/system";
import {
  capitalizeText,
  FormatedDateWithTime,
  formatPhoneNumber,
  getImageUrl,
} from "utils/CustomFunctions";
import CustomImageContainer from "../CustomImageContainer";
import { t } from "i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import moment from "moment";

const ChatMessage = (props) => {
  const theme = useTheme();
  const {
    body,
    createdAt,
    messgageData,
    authorAvatar,
    conversationData,
    image,
    handleImageOnClick,
    receiverType,
  } = props;
  const { configData } = useSelector((state) => state.configData);
  const language_direction = localStorage.getItem("direction");
  const receiverImageUrl = () => {
    if (conversationData?.conversation?.receiver_type === "vendor") {
      return conversationData.conversation?.receiver?.image_full_url;
    } else if (
      conversationData?.conversation?.receiver_type === "delivery_man"
    ) {
      return conversationData.conversation?.sender?.image_full_url;
    } else return configData?.logo_full_url;
  };

  const customerImageUrl = configData?.base_urls?.customer_image_url;
  const authorType = messgageData.sender_id; //sender
  let userType;
  let userImage;
  let senderImage;
  const chatImageUrl = configData?.base_urls?.chat_image_url;
  if (conversationData?.conversation?.sender_type === "customer") {
    userType = conversationData?.conversation.sender_id;
    userImage =
      receiverType === "admin"
        ? configData?.fav_icon
        : conversationData?.conversation?.receiver?.image;
    senderImage = conversationData?.conversation?.sender?.image;
  } else {
    userType = conversationData?.conversation?.receiver?.id;
  }
  const nameHandler = () => {
    if (conversationData?.conversation?.sender_type === "customer") {
      if (authorType === userType) {
        return conversationData?.conversation?.sender?.f_name.concat(
          " ",
          conversationData?.conversation?.sender?.l_name
        );
      } else {
        if (conversationData?.conversation?.receiver?.f_name) {
          return conversationData?.conversation?.receiver?.f_name.concat(
            " ",
            conversationData?.conversation?.receiver?.l_name
          );
        } else {
          return configData?.business_name;
        }
      }
    } else {
      if (authorType === userType) {
        return (
          conversationData?.conversation?.receiver?.f_name.concat(
            " ",
            conversationData?.conversation?.receiver?.l_name
          ) || " "
        );
      } else {
        return (
          conversationData?.conversation?.sender?.f_name.concat(
            " ",
            conversationData?.conversation?.sender?.l_name
          ) || " "
        );
      }
    }
  };

  return (
    <ChatMessageWrapper
      authortype={authorType}
      usertype={userType}
      language_direction={language_direction}
    >
      {authorType !== userType && (
        <CustomAvatar
          src={authorType === userType ? customerImageUrl : receiverImageUrl()}
          authortype={authorType}
          usertype={userType}
        />
      )}

      <BodyWrapper authortype={authorType} usertype={userType}>
        <Stack
          direction="row"
          spacing={3}
          justifyContent={authorType === userType ? "flex-end" : "flex-start"}

          // overflow-x="scroll"
        >
          {image?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{ cursor: "pointer" }}
                onClick={() => handleImageOnClick(item)}
              >
                <CustomImageContainer
                  src={item}
                  width="60px"
                  height="60px"
                  objectFit="cover"
                  borderRadius="4px"
                />
              </Box>
            );
          })}
        </Stack>
        {body && (
          <>
            {messgageData?.order && (
              <Stack
                border="1px solid"
                borderColor={alpha(theme.palette.neutral[400], 0.5)}
                marginBottom="10px"
                borderRadius="10px"
                width="100%"
                maxWidth="290px"
              >
                <Stack
                  sx={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  padding="10px"
                  backgroundColor={alpha(theme.palette.neutral[400], 0.1)}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      component="span"
                      fontSize="14px"
                      fontWeight="400"
                    >
                      {t("Order ID")}
                      <Typography
                        component="span"
                        fontSize="14px"
                        fontWeight="500"
                        px="5px"
                      >
                        #{messgageData?.order?.id}
                      </Typography>
                      <Typography
                        fontSize="10px"
                        p="3px"
                        fontWeight="500"
                        component="span"
                        backgroundColor={alpha(theme.palette.info.main, 0.2)}
                        borderRadius="4px"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {t(capitalizeText(messgageData?.order?.order_status))}
                      </Typography>
                    </Typography>
                    <Typography
                      fontSize="12px"
                      color={alpha(theme.palette.neutral[400], 9)}
                    >
                      {t("Order Placed")}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      component="span"
                      fontSize="14px"
                      fontWeight="400"
                      color={theme.palette.primary.main}
                    >
                      {t("Total")}:
                      <Typography component="span">
                        {" "}
                        {getAmountWithSign(messgageData?.order?.order_amount)}
                      </Typography>
                    </Typography>

                    <Typography fontSize="12px">
                      {moment(messgageData?.order?.created_at).format(
                        "DD MMM, YYYY"
                      )}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  padding="10px"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Stack>
                    <Typography
                      fontSize="12px"
                      color={alpha(theme.palette.neutral[400], 9)}
                      marginBottom="10px"
                    >
                      {t("Delivery Address")}
                    </Typography>
                    <Typography fontSize="12px">
                      {formatPhoneNumber(
                        messgageData?.order?.delivery_address
                          ?.contact_person_number
                      )}
                    </Typography>
                    <Typography Typography fontSize="12px">
                      {messgageData?.order?.delivery_address?.address}
                    </Typography>
                  </Stack>
                  {messgageData?.order?.details_count > 0 && (
                    <Stack
                      paddingY="5px"
                      paddingX="16px"
                      backgroundColor={alpha(theme.palette.neutral[400], 0.1)}
                      justifyContent="center"
                      alignItems="center"
                      borderRadius="5px"
                    >
                      <Typography
                        fontSize="12px"
                        color={alpha(theme.palette.neutral[400], 9)}
                      >
                        {t("Items")}
                      </Typography>
                      <Typography fontSize="1rem" fontWeight="500">
                        {messgageData?.order?.details_count}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            )}

            <CardWrapper authortype={authorType} usertype={userType}>
              {/*<Stack mb={1}>*/}
              {/*  <Typography*/}
              {/*    pt="3px"*/}
              {/*    color={*/}
              {/*      authorType === userType*/}
              {/*        ? theme.palette.footer.appDownloadButtonBg*/}
              {/*        : theme.palette.neutral[100]*/}
              {/*    }*/}
              {/*    variant="subtitle2"*/}
              {/*    align={authorType === userType ? "right" : "left"}*/}

              {/*  >*/}
              {/*    {nameHandler()}*/}
              {/*  </Typography>*/}
              {/*</Stack>*/}
              <Typography
                fontSize={{ xs: "12px", md: "14px" }}
                color={
                  authorType === userType
                    ? theme.palette.neutral[100]
                    : theme.palette.text.primary
                }
                sx={{ wordBreak: "break-word" }}
                align={authorType === userType ? "left" : "right"}
              >
                {body ? body : ""}
              </Typography>
            </CardWrapper>
          </>
        )}

        <TimeWrapper authortype={authorType} usertype={userType}>
          {authorType === userType ? (
            <CheckIcon
              fontSize="14px"
              style={{
                color:
                  messgageData.is_seen === 0
                    ? theme.palette.primary.main
                    : theme.palette.neutral[1000],
              }}
            />
          ) : (
            ""
          )}
          <Typography
            color="textSecondary"
            noWrap
            variant="caption"
            fontSize={{ xs: "10px", md: "12px" }}
          >
            {FormatedDateWithTime(createdAt)}
          </Typography>
        </TimeWrapper>
      </BodyWrapper>
    </ChatMessageWrapper>
  );
};

ChatMessage.propTypes = {};

export default ChatMessage;
