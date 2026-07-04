import CloseIcon from "@mui/icons-material/Close";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Badge, Box, Fab, Tooltip, Zoom, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getToken } from "../../helper-functions/getToken";
import ChatBotPopover from "./ChatBotPopover";

interface AiChatBotLauncherProps {
  unreadCount?: number;
}

const AiChatBotLauncher = ({ unreadCount = 0 }: AiChatBotLauncherProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profileInfo } = useSelector((state: any) => state.profileInfo);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
    const handleStorage = () => setIsLoggedIn(Boolean(getToken()));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [profileInfo]);

 // if (!isLoggedIn) return null;

  return (
    <>
      <Tooltip
        title={open ? (t("Close") as string) : (t("Ask AI Assistant") as string)}
        placement="left"
      >
        <Box
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: { xs: 80, sm: "10%" },
            zIndex: (th) => th.zIndex.appBar - 10,
          }}
        >
          <Badge
            badgeContent={open ? 0 : unreadCount}
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Fab
              color="primary"
              aria-label={t("AI Assistant") as string}
              onClick={() => setOpen((v) => !v)}
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${
                  theme.palette.primary.main
                } 0%, ${alpha(theme.palette.primary.main, 0.78)} 100%)`,
                boxShadow: `0 10px 24px ${alpha(
                  theme.palette.primary.main,
                  0.45,
                )}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${
                    theme.palette.primary.dark
                  } 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 12px 28px ${alpha(
                    theme.palette.primary.main,
                    0.55,
                  )}`,
                },
                "&::after": open
                  ? {}
                  : {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: `2px solid ${theme.palette.primary.main}`,
                      animation: "chatbotPulse 2s ease-out infinite",
                      "@keyframes chatbotPulse": {
                        "0%": { transform: "scale(1)", opacity: 0.6 },
                        "100%": { transform: "scale(1.5)", opacity: 0 },
                      },
                    },
              }}
            >
              <Zoom in={!open} unmountOnExit>
                <SmartToyOutlinedIcon sx={{ fontSize: 26, color: "#fff" }} />
              </Zoom>
              <Zoom in={open} unmountOnExit>
                <CloseIcon
                  sx={{ fontSize: 26, color: "#fff", position: "absolute" }}
                />
              </Zoom>
            </Fab>
          </Badge>
        </Box>
      </Tooltip>

      <ChatBotPopover open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AiChatBotLauncher;
