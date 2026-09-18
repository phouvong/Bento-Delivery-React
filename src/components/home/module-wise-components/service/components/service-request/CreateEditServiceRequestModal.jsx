import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import usePostServiceRequest from "../../service-api-manage/hooks/react-query/service-request/usePostServiceRequest";
import usePutServiceRequest from "../../service-api-manage/hooks/react-query/service-request/usePutServiceRequest";
import Image from "next/image";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import CustomModal from "src/components/modal";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import SearchableSelect from "components/common/SearchableSelect";

const CreateEditServiceRequestModal = ({ open, onClose, item }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEdit = Boolean(item);

  const [categoryId, setCategoryId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data ?? [];

  useEffect(() => {
    if (open) {
      setCategoryId(item?.category_id ?? "");
      setServiceName(item?.service_name ?? "");
      setDescription(item?.description ?? "");
    }
  }, [open, item]);

  const {
    mutate: createRequest,
    isLoading: isCreating,
    reset: resetCreate,
  } = usePostServiceRequest();
  const {
    mutate: updateRequest,
    isLoading: isUpdating,
    reset: resetUpdate,
  } = usePutServiceRequest();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      resetCreate();
      resetUpdate();
    }
  }, [open]);

  const handleSubmit = () => {
    const payload = {
      category_id: categoryId,
      service_name: serviceName.trim(),
      ...(description?.trim() ? { description: description.trim() } : {}),
    };

    const onSuccess = async (res) => {
      toast.success(
        res?.message ||
          (isEdit
            ? t("Request updated successfully")
            : t("Request posted successfully"))
      );
      await queryClient.refetchQueries(["my-service-request-list"]);
      onClose();
    };
    const onError = (err) => {
      toast.error(err?.response?.data?.message || t("Something went wrong"));
    };

    if (isEdit) {
      updateRequest({ ...payload, id: item.id }, { onSuccess, onError });
    } else {
      createRequest(payload, { onSuccess, onError });
    }
  };

  const isSubmitDisabled = !categoryId || !serviceName.trim() || isLoading;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: theme.palette.background.paper,
      fontSize: "14px",
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": {
        borderColor: theme.palette.neutral?.[300] || theme.palette.divider,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
    "& .MuiInputBase-input::placeholder, & .MuiInputBase-inputMultiline::placeholder":
      {
        color: theme.palette.neutral?.[450] || theme.palette.text.disabled,
        opacity: 1,
      },
  };

  const labelSx = {
    fontSize: "14px",
    fontWeight: 400,
    color: theme.palette.text.primary,
    mb: "6px",
  };

  return (
    <CustomModal openModal={open} handleClose={onClose} maxWidth="600px">
      <Box
        sx={{ p: "8px", display: "flex", flexDirection: "column", gap: "0px" }}
      >
        <IconButton
          onClick={onClose}
          sx={{ color: "text.secondary", marginLeft: "auto", p: 0 }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography
          align="center"
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: 700,
            color: "text.primary",
            textAlign: "center",
          }}
        >
          {isEdit ? t("Edit Service Request") : t("New Service Request")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pt: "24px",
            px: { xs: "16px", sm: "24px" },
          }}
        >
          <Stack alignItems="center" sx={{ mb: "16px" }}>
            <Image
              src={customServiceEmptyIcon}
              alt="service"
              width={70}
              height={70}
            />
          </Stack>

          <Stack alignItems="center" sx={{ mb: "24px", textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 700,
                color: "text.primary",
                mb: "6px",
              }}
            >
              {t("Tell Us More About Your Desired Service")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: { xs: "100%", sm: "90%" },
              }}
            >
              {t(
                "Can't find the service you need? Submit a request and help us improve our service offerings."
              )}
            </Typography>
          </Stack>

          <Stack spacing="16px" sx={{ pb: "8px" }}>
            {/* Category */}
            <Box>
              <Typography sx={labelSx}>{t("Select Category")}</Typography>
              <SearchableSelect
                value={categoryId}
                onChange={(val) => setCategoryId(val)}
                options={categories}
                placeholder={t("Select Category")}
                searchPlaceholder={t("Search category...")}
                emptyText={t("No category found")}
                popoverZIndex={1600}
              />
            </Box>

            {/* Service Name */}
            <Box>
              <Typography sx={labelSx}>{t("Service Name")}</Typography>
              <TextField
                fullWidth
                placeholder={t("Ex: Car Wash")}
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                sx={inputSx}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography sx={labelSx}>{t("Service Description")}</Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder={t("Enter a service description...")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={inputSx}
              />
            </Box>
          </Stack>
        </Box>

        {/* Fixed footer */}
        <Box
          sx={{
            px: { xs: "16px", sm: "24px" },
            pt: "16px",
            pb: "24px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack direction="row" gap="12px">
            <Button
              fullWidth
              onClick={onClose}
              sx={{
                py: "14px",
                borderRadius: "8px",
                backgroundColor: alpha(theme.palette.text.primary, 0.06),
                color: "text.primary",
                fontSize: "16px",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.text.primary, 0.1),
                },
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              fullWidth
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              sx={{
                py: "14px",
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "whiteContainer.main",
                fontSize: "16px",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { backgroundColor: "primary.dark" },
                "&.Mui-disabled": {
                  opacity: 0.6,
                  backgroundColor: "primary.main",
                  color: "whiteContainer.main",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={22}
                  sx={{ color: "whiteContainer.main" }}
                />
              ) : isEdit ? (
                t("Update Request")
              ) : (
                t("Send Request")
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default CreateEditServiceRequestModal;
