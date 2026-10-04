import AddIcon from "@mui/icons-material/Add";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import ChatListShimmer from "./ChatListShimmer";
import { formatRelativeTime } from "./sampleData";
import type { ChatConversation } from "./types";

interface ChatListViewProps {
  conversations: ChatConversation[];
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onSuggestionSelect?: (text: string) => void;
  onDelete?: (id: string) => Promise<void> | void;
  isLoading?: boolean;
}

const SUGGESTION_KEYS_BY_MODULE: Record<string, readonly string[]> = {
  food: [
    "Show me today's best food deals",
    "Find restaurants near me",
    "What's on discount right now?",
    "Recommend a popular dish",
  ],
  grocery: [
    "Show me today's grocery deals",
    "Find grocery stores near me",
    "What's on discount right now?",
    "Recommend popular grocery items",
  ],
  pharmacy: [
    "Show me available pharmacy offers",
    "Find pharmacies near me",
    "Search medicines by name",
    "Recommend common health essentials",
  ],
  ecommerce: [
    "Show me today's shop deals",
    "Find shops near me",
    "What's trending right now?",
    "Recommend a popular product",
  ],
  parcel: [
    "What is parcel delivery?",
    "How does parcel delivery work?",
    "What items can I send?",
    "What are the parcel size limits?",
  ],
  rental: [
    "What is the rental service?",
    "How does ride booking work?",
    "What vehicle types are available?",
    "What are the payment options?",
  ],
};

const DEFAULT_SUGGESTION_KEYS = [
  "Show me today's best deals",
  "Find stores near me",
  "What's on discount right now?",
  "Recommend something popular",
] as const;

const ChatListView = ({
  conversations,
  onSelect,
  onNewChat,
  onSuggestionSelect,
  onDelete,
  isLoading,
}: ChatListViewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const moduleType = getCurrentModuleType();
  const suggestionKeys =
    (moduleType && SUGGESTION_KEYS_BY_MODULE[moduleType]) ||
    DEFAULT_SUGGESTION_KEYS;

  const handleAskDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmId((curr) => (curr === id ? null : id));
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmId(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    try {
      setDeletingId(id);
      await onDelete(id);
      setConfirmId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {t("Recent chats")}
        </Typography>
      </Box>

      {isLoading && conversations.length === 0 ? (
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <ChatListShimmer rows={6} />
        </Box>
      ) : conversations.length === 0 ? (
        <Stack
          alignItems="center"
          spacing={1.5}
          sx={{
            flex: 1,
            px: 2.5,
            py: 3,
            textAlign: "center",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
            }}
          >
            <SmartToyOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography fontWeight={700} fontSize={15}>
            {t("How can I help today?")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("Try one of these to get started, or write your own.")}
          </Typography>

          {onSuggestionSelect && (
            <Stack
              spacing={1}
              sx={{ width: "100%", mt: 1 }}
              alignItems="stretch"
            >
              {suggestionKeys.map((key) => (
                <Box
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSuggestionSelect(t(key) as string)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSuggestionSelect(t(key) as string);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    textAlign: "left",
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    fontSize: 13,
                    color: theme.palette.text.primary,
                    transition:
                      "border-color 120ms ease, background-color 120ms ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  {t(key)}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      ) : (
        <Fade in timeout={250}>
          <List
            disablePadding
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.text.primary, 0.15),
                borderRadius: 3,
              },
            }}
          >
            {conversations.map((c) => {
              const isConfirming = confirmId === c.id;
              const isDeleting = deletingId === c.id;
              const canDelete =
                Boolean(onDelete) && (/^\d+$/.test(c.id) || Boolean(c.isDraft));

              return (
                <Box
                  key={c.id}
                  sx={{
                    position: "relative",
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.6
                    )}`,
                    overflow: "hidden",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      if (isConfirming) return;
                      onSelect(c.id);
                    }}
                    disabled={isConfirming}
                    sx={{
                      px: 2,
                      py: 1.25,
                      gap: 1.25,
                      alignItems: "flex-start",
                      transition: "filter 180ms ease",
                      "&.Mui-disabled": { opacity: 1 },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.06
                        ),
                      },
                      "&:hover .chat-row-actions": { opacity: 1 },
                    }}
                  >
                    <Badge
                      color="primary"
                      badgeContent={c.unread}
                      invisible={!c.unread}
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          width: 36,
                          height: 36,
                        }}
                      >
                        <SmartToyOutlinedIcon fontSize="small" />
                      </Avatar>
                    </Badge>
                    <Stack flex={1} minWidth={0}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Typography
                          fontWeight={c.unread ? 700 : 600}
                          fontSize={14}
                          noWrap
                        >
                          {c.title}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ flexShrink: 0 }}
                        >
                          <Typography fontSize={11} color="text.secondary">
                            {formatRelativeTime(c.updatedAt)}
                          </Typography>
                          {canDelete && (
                            <Tooltip title={t("Delete chat") as string}>
                              <IconButton
                                className="chat-row-actions"
                                size="small"
                                onClick={(e) => handleAskDelete(e, c.id)}
                                sx={{
                                  width: 26,
                                  height: 26,
                                  opacity: 0.7,
                                  transition:
                                    "opacity 120ms ease, background-color 120ms ease",
                                  color: theme.palette.error.main,
                                  "&:hover": {
                                    color: theme.palette.error.main,
                                    backgroundColor: alpha(
                                      theme.palette.error.main,
                                      0.07
                                    ),
                                  },
                                }}
                              >
                                <Box
                                  component="i"
                                  className="fi fi-rr-trash"
                                  sx={{
                                    fontSize: 16,
                                    lineHeight: 1,
                                    display: "flex",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Stack>
                      <Typography
                        fontSize={12.5}
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {c.preview ??
                          (c.messagesCount
                            ? `${c.messagesCount} ${t(
                                c.messagesCount === 1 ? "message" : "messages"
                              )}`
                            : t("No messages yet"))}
                      </Typography>
                    </Stack>
                  </ListItemButton>

                  {canDelete && (
                    <Box
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1.5,
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${alpha(
                          theme.palette.error.main,
                          0.09
                        )}, ${alpha(theme.palette.error.main, 0.09)})`,
                        borderLeft: `3px solid ${alpha(
                          theme.palette.error.main,
                          0.55
                        )}`,
                        transform: isConfirming
                          ? "translateX(0)"
                          : "translateX(100%)",
                        opacity: isConfirming ? 1 : 0,
                        pointerEvents: isConfirming ? "auto" : "none",
                        transition:
                          "transform 220ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease",
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: alpha(
                            theme.palette.error.main,
                            0.12
                          ),
                          color: theme.palette.error.main,
                          flexShrink: 0,
                        }}
                      >
                        <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Stack flex={1} minWidth={0} sx={{ lineHeight: 1.2 }}>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          noWrap
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {t("Delete this chat?")}
                        </Typography>
                        <Typography
                          fontSize={11}
                          noWrap
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {t("This action cannot be undone.")}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} flexShrink={0}>
                        <Button
                          onClick={handleCancelDelete}
                          size="small"
                          disabled={isDeleting}
                          sx={{
                            minWidth: 0,
                            px: 1.25,
                            fontWeight: 600,
                            textTransform: "none",
                            color: theme.palette.text.secondary,
                            backgroundColor: alpha(
                              theme.palette.text.primary,
                              0.04
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.text.primary,
                                0.08
                              ),
                            },
                          }}
                        >
                          {t("Cancel")}
                        </Button>
                        <Button
                          onClick={(e) => handleConfirmDelete(e, c.id)}
                          size="small"
                          disabled={isDeleting}
                          startIcon={
                            isDeleting ? (
                              <CircularProgress
                                size={14}
                                thickness={5}
                                sx={{ color: theme.palette.error.main }}
                              />
                            ) : (
                              <Box
                                component="i"
                                className="fi fi-rr-trash"
                                sx={{
                                  fontSize: 14,
                                  lineHeight: 1,
                                  display: "flex",
                                }}
                              />
                            )
                          }
                          sx={{
                            minWidth: 0,
                            px: 1.25,
                            fontWeight: 600,
                            textTransform: "none",
                            color: theme.palette.error.main,
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.18
                              ),
                            },
                            "&.Mui-disabled": {
                              color: alpha(theme.palette.error.main, 0.5),
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.06
                              ),
                            },
                          }}
                        >
                          {isDeleting ? t("Deleting…") : t("Delete")}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>
              );
            })}
          </List>
        </Fade>
      )}

      <Box
        sx={{
          p: 1.25,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          onClick={onNewChat}
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            py: 1,
          }}
        >
          {t("New chat")}
        </Button>
      </Box>
    </Stack>
  );
};

export default ChatListView;
