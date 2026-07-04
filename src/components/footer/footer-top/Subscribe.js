import { Button, CircularProgress, InputBase } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { usePostNewsletterEmail } from "../../../api-manage/hooks/react-query/newsletter/usePostNewsletterEmail";

const Subscribe = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const { t } = useTranslation();
  const { mutate, isLoading } = usePostNewsletterEmail();

  const handleSuccess = () => {
    toast.success(t("Subscribed Successfully"), { id: "subscribed-toaster" });
    setEmailAddress("");
  };

  const handleSubmit = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (regex.test(emailAddress)) {
      mutate(
        { email: emailAddress },
        { onSuccess: handleSuccess, onError: onErrorResponse }
      );
    } else {
      toast.error(t("Please insert a valid email."), {
        id: "subscribed-email-error",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        backgroundColor: "background.paper",
        borderRadius: "12px",
        pl: "24px",
        pr: "8px",
        py: "8px",
        width: "100%",
      }}
    >
      <InputBase
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.3,
          "& input::placeholder": { color: "#757575", opacity: 1 },
        }}
        value={emailAddress}
        type="email"
        name="email"
        placeholder={t("Enter your email address")}
        onChange={(e) => setEmailAddress(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{
          height: "36px",
          px: "16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.42px",
          lineHeight: 1.2,
          textTransform: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
      >
        {t("Subscribe Now")}
      </Button>
    </Box>
  );
};

export default Subscribe;
