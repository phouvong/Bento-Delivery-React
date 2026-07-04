import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useGetAiChatMessages from "api-manage/hooks/react-query/ai-chat/useGetAiChatMessages";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ChatCartChips from "./ChatCartChips";
import ChatCategoryChips from "./ChatCategoryChips";
import ChatDetailShimmer from "./ChatDetailShimmer";
import ChatProductChips from "./ChatProductChips";
import ChatStoreChips from "./ChatStoreChips";
import { formatClockTime, formatDayLabel, isSameDay } from "./sampleData";
import {
  mapApiMessage,
  type AiChatMessagesResponse,
  type ChatCategory,
  type ChatMessage,
  type ChatProduct,
  type ChatStore,
} from "./types";

interface ChatDetailViewProps {
  conversationId: string | null;
  pendingMessages?: ChatMessage[];
  messagesCount?: number;
  onSend: (text: string) => void;
  onAddToCart?: (product: ChatProduct) => void;
  onStoreSelect?: (store: ChatStore) => void;
  onCategorySelect?: (category: ChatCategory) => void;
  addingProductId?: number | null;
  isTyping?: boolean;
}

const isServerId = (id: string | null): id is string =>
  !!id && /^\d+$/.test(id);

const ChatDetailView = ({
  conversationId,
  pendingMessages = [],
  messagesCount = 0,
  onSend,
  onAddToCart,
  onStoreSelect,
  onCategorySelect,
  addingProductId,
  isTyping,
}: ChatDetailViewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { configData } = useSelector((state: any) => state.configData) ?? {};
  const productImageUrl: string | undefined =
    configData?.base_urls?.product_image_url;

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef<boolean>(false);
  const isNearBottomRef = useRef<boolean>(true);
  const seenPagesCountRef = useRef<number>(0);
  const prevScrollHeightRef = useRef<number>(0);

  const enabled = isServerId(conversationId);
  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoading,
  } = useGetAiChatMessages({
    conversationId: enabled ? conversationId : null,
    enabled,
    messagesCount,
  });

  const fetchedMessages = useMemo<ChatMessage[]>(() => {
    if (!data?.pages) return [];
    const all: ChatMessage[] = [];
    (data.pages as AiChatMessagesResponse[]).forEach((p) => {
      (p?.data ?? []).forEach((m) => all.push(mapApiMessage(m)));
    });
    return all;
  }, [data]);

  const messages = useMemo<ChatMessage[]>(() => {
    const byId = new Map<string, ChatMessage>();
    fetchedMessages.forEach((m) => byId.set(m.id, m));
    pendingMessages.forEach((pending) => {
      const duplicate = fetchedMessages.some(
        (fetched) =>
          fetched.role === pending.role &&
          fetched.text === pending.text &&
          Math.abs(fetched.createdAt - pending.createdAt) < 60_000
      );
      if (!duplicate) byId.set(pending.id, pending);
    });
    return Array.from(byId.values()).sort((a, b) => a.createdAt - b.createdAt);
  }, [fetchedMessages, pendingMessages]);

  const decorations = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1];
      const next = messages[i + 1];
      const isFirstInBurst = !prev || prev.role !== m.role;
      const isLastInBurst = !next || next.role !== m.role;
      const isFirstOfDay = !prev || !isSameDay(prev.createdAt, m.createdAt);
      const hasMedia =
        Boolean(m.metadata?.products?.length) ||
        Boolean(m.metadata?.stores?.length) ||
        Boolean(m.metadata?.cart_items?.length);
      return { isFirstInBurst, isLastInBurst, isFirstOfDay, hasMedia };
    });
  }, [messages]);

  useEffect(() => {
    didInitialScrollRef.current = false;
    isNearBottomRef.current = true;
    seenPagesCountRef.current = 0;
    prevScrollHeightRef.current = 0;
  }, [conversationId]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const handleScroll = () => {
      const distanceFromBottom =
        root.scrollHeight - root.scrollTop - root.clientHeight;
      isNearBottomRef.current = distanceFromBottom < 120;
    };
    root.addEventListener("scroll", handleScroll, { passive: true });
    return () => root.removeEventListener("scroll", handleScroll);
  }, [conversationId]);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root || !hasPreviousPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasPreviousPage &&
          !isFetchingPreviousPage &&
          didInitialScrollRef.current
        ) {
          prevScrollHeightRef.current = root.scrollHeight;
          fetchPreviousPage();
        }
      },
      { root, rootMargin: "100px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
    conversationId,
  ]);

  useLayoutEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const pagesCount = data?.pages?.length ?? 0;
    const newPageLoaded = pagesCount > seenPagesCountRef.current;
    seenPagesCountRef.current = pagesCount;

    if (!didInitialScrollRef.current && messages.length > 0) {
      root.scrollTop = root.scrollHeight;
      didInitialScrollRef.current = true;
      isNearBottomRef.current = true;
      return;
    }

    if (newPageLoaded) {
      const heightDiff = root.scrollHeight - prevScrollHeightRef.current;
      if (heightDiff > 0) {
        root.scrollTop += heightDiff;
      }
      prevScrollHeightRef.current = 0;
      return;
    }

    if (isNearBottomRef.current) {
      root.scrollTop = root.scrollHeight;
    }
  }, [messages, isTyping, data]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    isNearBottomRef.current = true;
    onSend(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showInitialLoader = enabled && isLoading && messages.length === 0;

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowAnchor: "none",
          px: 2,
          py: 1.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.text.primary, 0.15),
            borderRadius: 3,
          },
        }}
      >
        <div ref={topSentinelRef} />

        {isFetchingPreviousPage && !showInitialLoader && (
          <Stack alignItems="center" sx={{ py: 1 }}>
            <CircularProgress size={18} />
          </Stack>
        )}

        {showInitialLoader && <ChatDetailShimmer rows={5} />}

        {!showInitialLoader && messages.length === 0 && enabled && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              flex: 1,
              minHeight: 240,
              textAlign: "center",
              px: 3,
              opacity: 0.85,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography fontWeight={700} fontSize={14}>
              {t("Start the conversation")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("Ask anything — orders, deals, restaurants, recommendations.")}
            </Typography>
          </Stack>
        )}

        <Stack
          spacing={0.25}
          sx={{
            "& .chat-bubble-row": {
              animation: "chatBubbleEnter 220ms ease-out both",
            },
            "@keyframes chatBubbleEnter": {
              "0%": { opacity: 0, transform: "translateY(6px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const products = m.metadata?.products ?? [];
            const stores = m.metadata?.stores ?? [];
            const cartItems = m.metadata?.cart_items ?? [];
            const categories = m.metadata?.categories ?? [];
            const d = decorations[i] ?? {
              isFirstInBurst: true,
              isLastInBurst: true,
              isFirstOfDay: i === 0,
              hasMedia: false,
            };

            const tailTop = d.isFirstInBurst ? 16 : 6;
            const tailBottom = d.isLastInBurst ? 16 : 6;

            return (
              <Box key={m.id} data-msg-id={m.id}>
                {d.isFirstOfDay && (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    sx={{ my: 1.25 }}
                  >
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.25,
                        borderRadius: 999,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        backgroundColor: alpha(
                          theme.palette.text.primary,
                          0.06
                        ),
                      }}
                    >
                      {formatDayLabel(m.createdAt)}
                    </Box>
                  </Stack>
                )}
                <Stack
                  className="chat-bubble-row"
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  justifyContent={isUser ? "flex-end" : "flex-start"}
                  sx={{
                    mt: d.isFirstInBurst ? 1 : 0.25,
                  }}
                >
                  {!isUser &&
                    (d.isLastInBurst ? (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    ) : (
                      <Box sx={{ width: 28, flexShrink: 0 }} />
                    ))}
                  <Stack
                    alignItems={isUser ? "flex-end" : "flex-start"}
                    sx={{ maxWidth: "85%" }}
                    spacing={0.5}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.875,
                        borderRadius: 2,
                        borderTopRightRadius: isUser ? tailTop : 16,
                        borderBottomRightRadius: isUser ? tailBottom : 16,
                        borderTopLeftRadius: isUser ? 16 : tailTop,
                        borderBottomLeftRadius: isUser ? 16 : tailBottom,
                        backgroundColor: isUser
                          ? theme.palette.primary.main
                          : theme.palette.background.paper,
                        color: isUser
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                        boxShadow: isUser
                          ? `0 1px 2px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`
                          : `0 1px 2px ${alpha(
                              theme.palette.text.primary,
                              0.06
                            )}`,
                        border: isUser
                          ? "none"
                          : `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        fontSize={13.5}
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}
                      >
                        {m.text}
                      </Typography>
                    </Box>
                    {products.length > 0 && (
                      <ChatProductChips
                        products={products}
                        productImageUrl={productImageUrl}
                        onAddToCart={onAddToCart}
                        addingProductId={addingProductId}
                      />
                    )}
                    {stores.length > 0 && (
                      <ChatStoreChips
                        stores={stores}
                        onSelect={onStoreSelect}
                      />
                    )}
                    {cartItems.length > 0 && (
                      <ChatCartChips
                        items={cartItems}
                        productImageUrl={productImageUrl}
                      />
                    )}
                    {categories.length > 0 && (
                      <ChatCategoryChips
                        categories={categories}
                        categoryImageUrl={
                          configData?.base_urls?.category_image_url
                        }
                        onSelect={onCategorySelect}
                      />
                    )}
                    {(d.isLastInBurst || d.hasMedia) && (
                      <Typography
                        fontSize={10.5}
                        color="text.secondary"
                        sx={{ mt: 0.125, px: 0.5 }}
                      >
                        {formatClockTime(m.createdAt)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}

          {isTyping && (
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                }}
              >
                <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  borderTopLeftRadius: 4,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" spacing={0.5}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: alpha(theme.palette.text.primary, 0.4),
                        animation: "chatbotDot 1.2s infinite",
                        animationDelay: `${i * 0.15}s`,
                        "@keyframes chatbotDot": {
                          "0%, 60%, 100%": { opacity: 0.25 },
                          "30%": { opacity: 1 },
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          px: 1.25,
          py: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            px: 1.5,
            py: 0.5,
            minHeight: 44,
            backgroundColor: alpha(theme.palette.text.primary, 0.02),
            transition:
              "border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease",
            "&:focus-within": {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          }}
        >
          <InputBase
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("Type a message...") as string}
            multiline
            maxRows={5}
            sx={{
              flex: 1,
              fontSize: 14,
              lineHeight: 1.45,
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              "& textarea": {
                resize: "none",
                py: 0,
                lineHeight: 1.45,
              },
              "& .MuiInputBase-input": {
                py: 0,
                lineHeight: 1.45,
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label={t("Send") as string}
            sx={{
              flexShrink: 0,
              width: 36,
              height: 36,
              backgroundColor: draft.trim()
                ? theme.palette.primary.main
                : alpha(theme.palette.primary.main, 0.15),
              color: draft.trim()
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main,
              boxShadow: draft.trim()
                ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.35)}`
                : "none",
              transition:
                "transform 140ms ease, background-color 140ms ease, box-shadow 140ms ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&.Mui-disabled": {
                color: alpha(theme.palette.primary.main, 0.5),
              },
            }}
          >
            <SendRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ChatDetailView;
