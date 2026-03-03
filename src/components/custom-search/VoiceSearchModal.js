import React from "react";
import {
    Box,
    IconButton,
    Typography,
    styled,
    keyframes,
    alpha,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import CustomModal from "../custom-component/CustomModal";
import { t } from "i18next";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha("#00B562", 0.4)};
  }
  70% {
    box-shadow: 0 0 0 20px ${alpha("#00B562", 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha("#00B562", 0)};
  }
`;

const ModalContent = styled(Box)(({ theme }) => ({
    position: "relative",
    padding: "40px 60px",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
    minHeight: "300px",
    minWidth: "300px",
    
  [theme.breakpoints.down("sm")]: {
    padding: "20px 25px",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: theme.palette.neutral[200],
    padding: "5px",
    "&:hover": {
        backgroundColor: theme.palette.neutral[300],
    },
}));

const MicButtonWrapper = styled(Box)(({ theme }) => ({
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: `${pulse} 2s infinite`,
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const VoiceSearchModal = ({ open, handleClose, onResult }) => {
    const theme = useTheme();
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const [permissionDenied, setPermissionDenied] = React.useState(false);
    const recognitionRef = React.useRef(null);

    React.useEffect(() => {
        if (typeof window !== "undefined" && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-US"; // Default to English

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setTranscript("");
                setPermissionDenied(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                const currentTranscript = Array.from(event.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");

                setTranscript(currentTranscript);

                if (event.results[0].isFinal) {
                    onResult(currentTranscript);
                    handleClose();
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                if (event.error === "not-allowed") {
                    setPermissionDenied(true);
                }
            };
        }
    }, [onResult, handleClose]);

    React.useEffect(() => {
        if (open) {
            setPermissionDenied(false);
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        } else if (!open && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, [open]);

    const renderNormalContent = () => (
        <>
            <Typography fontSize="16px" sx={{ fontWeight: "400", color: theme.palette.neutral[600] }}>
                {transcript || t("Tell me what you're looking for......")}
            </Typography>
            <MicButtonWrapper onClick={() => open && recognitionRef.current && recognitionRef.current.start()}>
                <MicIcon sx={{ fontSize: "30px", color: theme.palette.common.white }} />
            </MicButtonWrapper>
        </>
    );

    const renderErrorContent = () => (
        <Box sx={{ textAlign: "left", width: "100%" }}>
            <Typography variant="h6" fontWeight="600" color="error.main" gutterBottom>
                {t("Microphone Access Required")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("Microphone access has been denied. To use voice search, please enable microphone permissions in your browser settings.")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                {t("How to enable:")}
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1 } }}>
                <Typography component="li" variant="body2" color="text.secondary">
                    {t("Click the microphone icon in your browser's address bar")}
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                    {t("Select \"Allow\" when prompted for microphone access")}
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                    {t("Refresh the page if needed")}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <CustomModal openModal={open} setModalOpen={handleClose}>
            <ModalContent>
                <CloseButton onClick={handleClose}>
                    <CloseIcon sx={{ fontSize: "16px", color: theme.palette.neutral[600] }} />
                </CloseButton>
                {permissionDenied ? renderErrorContent() : renderNormalContent()}
            </ModalContent>
        </CustomModal>
    );
};

export default VoiceSearchModal;
