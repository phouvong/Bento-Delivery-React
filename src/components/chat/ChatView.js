import React, { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import ChatMessages from "./ChatMessages";
import ChatMessageAdd from "./ChatMessageAdd";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      outline: `1px solid slategrey`,
    },
  },
}));
const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  // overflow: 'hidden',
  minHeight: "70vh",
  height: "100%",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.custom6,
}));
export const ScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() =>
    elementRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    })
  );
  return <div ref={elementRef} />;
};

const ChatView = ({
  conversationData,
  handleChatMessageSend,
  messageIsLoading,
  handleScroll,
  scrollBottom,
  receiverType,
  isLoadingMessageSend,
  userType,
  channelId,
  orderId,
}) => {
  const classes = useStyles();
  return (
    <StyledBox>
      <Box
        sx={{
          overflowY: "scroll",
          height: "60vh",
          backgroundColor: (theme) => theme.palette.background.custom6,
        }}
        onScroll={handleScroll}
        className={classes.root}
      >
        {conversationData && (
          <ChatMessages
            conversationData={conversationData}
            scrollBottom={scrollBottom}
            receiverType={receiverType}
          />
        )}
      </Box>

      <ChatMessageAdd
        onSend={handleChatMessageSend}
        isLoadingMessageSend={isLoadingMessageSend}
        userType={userType}
        channelId={channelId}
        orderId={orderId}
      />
    </StyledBox>
  );
};
export default ChatView;
