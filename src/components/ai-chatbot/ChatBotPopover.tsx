import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useDeleteAiChatConversation from "api-manage/hooks/react-query/ai-chat/useDeleteAiChatConversation";
import useGetAiChatConversations from "api-manage/hooks/react-query/ai-chat/useGetAiChatConversations";
import useSendAiChatMessage from "api-manage/hooks/react-query/ai-chat/useSendAiChatMessage";
import { getGuestId } from "helper-functions/getToken";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import ChatDetailView from "./ChatDetailView";
import ChatListView from "./ChatListView";
import {
  mapApiConversation,
  type AiChatConversationApi,
  type AiChatConversationsResponse,
  type ChatConversation,
  type ChatMessage,
  type ChatProduct,
  type ChatStore,
} from "./types";

interface ChatBotPopoverProps {
  open: boolean;
  onClose: () => void;
}

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const ChatBotPopover = ({ open, onClose }: ChatBotPopoverProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const queryClient = useQueryClient();
  const router = useRouter();
  const { profileInfo } = useSelector((state: any) => state.profileInfo) ?? {};
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const {
    data: conversationsData,
    refetch: refetchConversations,
    isFetching: isFetchingConversations,
  } = useGetAiChatConversations({ enabled: false });

  const { mutateAsync: sendMessageAsync } = useSendAiChatMessage();
  const { mutateAsync: deleteConversationAsync } =
    useDeleteAiChatConversation();

  const identityKey = profileInfo?.id
    ? `user:${profileInfo.id}`
    : `guest:${(typeof window !== "undefined" && getGuestId()) || ""}`;

  useEffect(() => {
    setConversations([]);
    setActiveId(null);
    queryClient.removeQueries(["ai-chat-conversations"]);
    queryClient.removeQueries(["ai-chat-messages"]);
  }, [identityKey, queryClient]);

  useEffect(() => {
    if (open) refetchConversations();
  }, [open, identityKey, refetchConversations]);

  useEffect(() => {
    const apiData = (
      conversationsData as AiChatConversationsResponse | undefined
    )?.data;
    if (!Array.isArray(apiData)) return;
    setConversations((prev) => {
      const localOnly = prev.filter(
        (p) =>
          !apiData.some((api: AiChatConversationApi) => String(api.id) === p.id)
      );
      const mapped = apiData.map(mapApiConversation).map((api) => {
        const existing = prev.find((p) => p.id === api.id);
        return existing
          ? { ...api, messages: existing.messages, unread: existing.unread }
          : api;
      });
      return [...localOnly, ...mapped].sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
    });
  }, [conversationsData]);

  const activeChat = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const handleNewChat = useCallback(() => {
    const id = makeId();
    const greeting: ChatMessage = {
      id: makeId(),
      role: "bot",
      text: t(
        "Hi! I'm your assistant. Ask me about orders, restaurants, or promos."
      ) as string,
      createdAt: Date.now(),
    };
    const fresh: ChatConversation = {
      id,
      title: t("New chat") as string,
      preview: greeting.text,
      updatedAt: Date.now(),
      unread: 0,
      messages: [greeting],
      isDraft: true,
    };
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(id);
  }, [t]);

  const handleBack = useCallback(() => setActiveId(null), []);

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      const isLocalDraft = !/^\d+$/.test(id);
      if (isLocalDraft) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setActiveId((curr) => (curr === id ? null : curr));
        return;
      }
      try {
        await deleteConversationAsync(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setActiveId((curr) => (curr === id ? null : curr));
        queryClient.removeQueries(["ai-chat-messages", id]);
        await queryClient.refetchQueries(["ai-chat-conversations"]);
        toast.success(t("Chat deleted") as string);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          (t("Failed to delete chat") as string);
        toast.error(message);
        throw err;
      }
    },
    [deleteConversationAsync, queryClient, t]
  );

  const handleSend = useCallback(
    async (text: string, opts?: { conversationIdOverride?: string }) => {
      const sendingFromId = opts?.conversationIdOverride ?? activeId;
      if (!sendingFromId) return;
      const isLocalOnly = !/^\d+$/.test(sendingFromId);
      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        text,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === sendingFromId
            ? {
                ...c,
                preview: text,
                updatedAt: Date.now(),
                messages: [...(c.messages ?? []), userMsg],
                isDraft: false,
              }
            : c
        )
      );
      setIsTyping(true);

      try {
        const resp = await sendMessageAsync({
          conversationId: isLocalOnly ? undefined : Number(sendingFromId),
          message: text,
        });

        const serverId =
          resp?.conversation_id != null ? String(resp.conversation_id) : null;
        const targetId = serverId ?? sendingFromId;

        if (serverId && serverId !== sendingFromId) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === sendingFromId ? { ...c, id: serverId } : c
            )
          );
          setActiveId((curr) => (curr === sendingFromId ? serverId : curr));
        }

        const botReply: ChatMessage = {
          id: makeId(),
          role: "bot",
          text: resp?.content ?? "",
          createdAt: Date.now(),
          metadata: resp?.metadata ?? null,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  preview: resp?.content ?? c.preview,
                  updatedAt: Date.now(),
                  messages: [...(c.messages ?? []), botReply],
                }
              : c
          )
        );
        setIsTyping(false);

        queryClient.refetchQueries(["ai-chat-conversations"]);

        if (resp?.metadata?.cart_updated) {
          queryClient.invalidateQueries("cart-itemss");
          queryClient.invalidateQueries("cart-groups");
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          (t("Failed to send message") as string);
        toast.error(message);
        setIsTyping(false);
      }
    },
    [activeId, sendMessageAsync, queryClient, t]
  );

  const handleAddToCart = useCallback(
    async (product: ChatProduct) => {
      if (!activeId || addingProductId === product.id) return;
      setAddingProductId(product.id);
      try {
        await handleSend(
          t("Add {{name}} to cart", { name: product.name }) as string
        );
      } finally {
        setAddingProductId(null);
      }
    },
    [activeId, addingProductId, handleSend, t]
  );

  const handleStoreSelect = useCallback(
    (store: ChatStore) => {
      handleStoreRedirect(store, router);
      onClose();
    },
    [router, onClose]
  );

  const handleQuickStart = useCallback(
    async (text: string) => {
      const id = makeId();
      const fresh: ChatConversation = {
        id,
        title: text.slice(0, 60),
        preview: text,
        updatedAt: Date.now(),
        unread: 0,
        messages: [],
      };
      setConversations((prev) => [fresh, ...prev]);
      setActiveId(id);
      await handleSend(text, { conversationIdOverride: id });
    },
    [handleSend]
  );

  return (
    <Fade in={open} unmountOnExit>
      <Box
        role="dialog"
        aria-label={t("AI Assistant") as string}
        sx={{
          position: "fixed",
          zIndex: (th) => th.zIndex.appBar + 50,
          ...(isMobile
            ? { inset: 0 }
            : { right: 24, bottom: 96, width: 380, height: 560 }),
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.paper,
          boxShadow: isMobile
            ? "none"
            : `0 18px 40px ${alpha(theme.palette.text.primary, 0.18)}`,
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.25,
            background: `linear-gradient(135deg, ${
              theme.palette.primary.main
            } 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`,
            color: "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {activeChat ? (
              <IconButton
                onClick={handleBack}
                size="small"
                sx={{ color: "inherit" }}
                aria-label={t("Back to chat list") as string}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            ) : (
              <Avatar
                sx={{
                  bgcolor: alpha("#fff", 0.18),
                  color: "#fff",
                  width: 36,
                  height: 36,
                }}
              >
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
            )}
            <Stack flex={1} minWidth={0}>
              <Typography fontWeight={700} fontSize={15} noWrap>
                {activeChat ? activeChat.title : t("AI Assistant")}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#4ade80",
                    boxShadow: "0 0 0 2px rgba(74, 222, 128, 0.25)",
                  }}
                />
                <Typography fontSize={11.5} sx={{ opacity: 0.85 }}>
                  {isTyping ? t("Typing…") : t("Online · replies instantly")}
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: "inherit" }}
              aria-label={t("Close") as string}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Fade in={!activeChat} timeout={220} unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ChatListView
                conversations={conversations}
                onSelect={handleSelect}
                onNewChat={handleNewChat}
                onSuggestionSelect={handleQuickStart}
                onDelete={handleDeleteConversation}
                isLoading={isFetchingConversations}
              />
            </Box>
          </Fade>
          <Fade in={Boolean(activeChat)} timeout={220} unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeChat && (
                <ChatDetailView
                  conversationId={activeChat.id}
                  pendingMessages={activeChat.messages ?? []}
                  messagesCount={activeChat.messagesCount ?? 0}
                  onSend={handleSend}
                  onAddToCart={handleAddToCart}
                  onStoreSelect={handleStoreSelect}
                  addingProductId={addingProductId}
                  isTyping={isTyping}
                />
              )}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Fade>
  );
};

export default ChatBotPopover;
