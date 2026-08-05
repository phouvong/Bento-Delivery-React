import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, CircularProgress, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import CustomContainer from "components/container";
import CustomModal from "components/modal";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomerDetailsCard from "./CustomerDetailsCard";
import ServiceDetailsCard from "./ServiceDetailsCard";
import Shedule from "./Shedule";
import CustomServiceSuccessModal from "./CustomServiceSuccessModal";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import MainApi from "api-manage/MainApi";
import { subCategories_api } from "api-manage/ApiRoutes";
import usePostCustomService from "../../../service-api-manage/hooks/react-query/custom-service/usePostCustomService";
import usePutCustomService from "../../../service-api-manage/hooks/react-query/custom-service/usePutCustomService";
import useServiceBusinessConfig from "../../../service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import StatusBadge from "components/common/StatusBadge";

/**
 * @param {object|null} editData  - null for create mode, service object for edit mode
 *
 * API payload shape (for when backend is ready):
 * {
 *   category_id, sub_category_id, description,
 *   service_date (YYYY-MM-DD), service_time,
 *   lat, lng, address, address_type,
 *   contact_person_name, contact_person_number
 * }
 */
export default function CustomServiceForm({ editData = null }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(editData?.id);

  // Real category list (module-aware — /api/v1/categories).
  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data ?? [];

  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { configData } = useSelector((state) => state.configData);
  const { isPostExpired } = useServiceBusinessConfig(configData);
  const isExpired = isEdit && isPostExpired(editData?.created_at);
  const profileFullName = [profileInfo?.f_name, profileInfo?.l_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const { mutate: createMutate, isLoading: isCreating } =
    usePostCustomService();
  const { mutate: updateMutate, isLoading: isUpdating } = usePutCustomService();
  const isSubmittingApi = isCreating || isUpdating;

  const [createdServiceId, setCreatedServiceId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const initialAddress = editData
    ? {
        lat: editData.lat ?? null,
        lng: editData.lng ?? null,
        address: editData.address ?? "",
        address_type: editData.address_type ?? "",
        contact_person_name: editData.contact_person_name ?? "",
        contact_person_number: editData.contact_person_number ?? "",
      }
    : null;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category_id: editData?.category_id ?? "",
      sub_category_id: editData?.sub_category_id ?? "",
      description: editData?.description ?? "",
      service_date: editData?.service_date
        ? new Date(editData.service_date)
        : null,
      service_time: editData?.service_time ?? null,
      address: initialAddress,
    },
    validationSchema: Yup.object({
      category_id: Yup.mixed().required(t("Category is required")),
      sub_category_id: Yup.mixed().notRequired(),
      description: Yup.string()
        .trim()
        .required(t("Description is required")),
      service_date: Yup.date().nullable().required(t("Please select a date")),
      service_time: Yup.string().nullable().required(t("Please select a time")),
      address: Yup.object()
        .nullable()
        .required(t("Please select a service address")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // API expects H:i (24-hour). Time picker returns "10:00 AM" / "2:30 PM"
      // style, so convert manually — dayjs isn't extended with
      // customParseFormat in this project.
      const to24Hour = (raw) => {
        if (!raw) return "";
        const match = String(raw)
          .trim()
          .match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
        if (!match) return String(raw);
        let hour = Number(match[1]);
        const minute = match[2];
        const meridiem = match[3]?.toUpperCase();
        if (meridiem === "PM" && hour !== 12) hour += 12;
        if (meridiem === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, "0")}:${minute}`;
      };
      const bookingTime = to24Hour(values.service_time);
      const payload = {
        category_id: values.category_id,
        ...(values.sub_category_id
          ? { sub_category_id: values.sub_category_id }
          : {}),
        description: values.description,
        booking_date: dayjs(values.service_date).format("YYYY-MM-DD"),
        booking_time: bookingTime,
        customer_information: {
          name: values.address?.contact_person_name || profileFullName || "",
          phone: values.address?.contact_person_number || profileInfo?.phone || "",
          address: values.address?.address ?? "",
        },
      };

      const onSuccess = async (res) => {
        await queryClient.refetchQueries("my-custom-service-list");
        if (isEdit) {
          toast.success(res?.message || t("Service updated!"));
          router.back();
        } else {
          setCreatedServiceId(res?.data?.id ?? res?.id ?? null);
          setOpenSuccessModal(true);
        }
      };

      const onError = (err) => {
        toast.error(err?.response?.data?.message || t("Something went wrong"));
      };

      const onSettled = () => setSubmitting(false);

      if (isEdit) {
        updateMutate(
          { id: editData.id, ...payload },
          { onSuccess, onError, onSettled }
        );
      } else {
        createMutate(payload, { onSuccess, onError, onSettled });
      }
    },
  });

  // Real sub-category list — /api/v1/categories/childes/{category_id}.
  const { data: subCategoriesResponse } = useQuery(
    ["custom-service-sub-categories", formik.values.category_id],
    async () => {
      const { data } = await MainApi.get(
        `${subCategories_api}/${formik.values.category_id}`
      );
      return data;
    },
    {
      enabled: !!formik.values.category_id,
      staleTime: 1000 * 60 * 5,
    }
  );
  const activeSubCategories = subCategoriesResponse ?? [];

  const handleServiceChange = (field, value) => {
    if (field === "category") {
      formik.setFieldValue("category_id", value);
      formik.setFieldValue("sub_category_id", "");
    } else if (field === "subCategory") {
      formik.setFieldValue("sub_category_id", value);
    } else if (field === "description") {
      formik.setFieldValue("description", value);
    }
  };

  const handleCloseSuccessModal = () => setOpenSuccessModal(false);

  const handleViewPost = () => {
    setOpenSuccessModal(false);
    if (createdServiceId) {
      router.push(`/service/custom-service/details/${createdServiceId}`);
    } else {
      router.push("/profile?page=custom-service");
    }
  };

  // Show field errors only after a submit attempt
  const showErrors = formik.submitCount > 0;

  const submitButton = isExpired ? (
    <StatusBadge status="expired" label={t("Expired")} />
  ) : (
    <Button
      fullWidth
      variant="contained"
      onClick={formik.handleSubmit}
      disabled={formik.isSubmitting || isSubmittingApi}
      sx={{
        py: 1.5,
        borderRadius: "10px",
        fontWeight: 700,
        fontSize: "15px",
        backgroundColor: "primary.main",
        color: "whiteContainer.main",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "primary.dark",
          boxShadow: "none",
        },
        "&:disabled": {
          opacity: 0.7,
        },
      }}
    >
      {formik.isSubmitting || isSubmittingApi ? (
        <CircularProgress size={20} sx={{ color: "whiteContainer.main" }} />
      ) : isEdit ? (
        t("Update Custom Service")
      ) : (
        t("Submit Custom Service")
      )}
    </Button>
  );

  return (
    <CustomStackFullWidth sx={{ minHeight: "100vh" }} spacing={3}>
      <CustomContainer>
        <Box
          sx={{
            mt: { md: "45px" },
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
          {/* Left column */}
          <Box sx={{ flex: { xs: "1 1 auto", md: 8.5 }, minWidth: 0 }}>
            <CustomerDetailsCard
              initialAddress={initialAddress}
              onAddressChange={(addr) => formik.setFieldValue("address", addr)}
            />
            {showErrors && formik.errors.address && (
              <Box
                sx={{
                  mt: -1.5,
                  mb: 2,
                  px: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{ fontSize: "12px", color: "error.main" }}
                >
                  {formik.errors.address}
                </Box>
              </Box>
            )}

            <ServiceDetailsCard
              values={{
                category: formik.values.category_id,
                subCategory: formik.values.sub_category_id,
                description: formik.values.description,
              }}
              onChange={handleServiceChange}
              categories={categories}
              subCategories={activeSubCategories}
              errors={
                showErrors
                  ? {
                      category: formik.errors.category_id,
                      subCategory: formik.errors.sub_category_id,
                      description: formik.errors.description,
                    }
                  : {}
              }
            />
          </Box>

          {/* Right column — Shedule, Submit button */}
          <Box
            sx={{
              flex: { md: 3.5 },
              minWidth: 0,
              alignSelf: "flex-start",
              position: { xs: "static", md: "sticky" },
              width: { xs: "100%", md: "auto" },
              top: "70px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                borderRadius: { xs: "10px", md: "14px" },
                boxShadow: `0 1px 4px ${alpha(
                  theme.palette.text.primary,
                  0.06
                )}`,
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 2.5 },
                mb: 2,
              }}
            >
              <Shedule
                date={formik.values.service_date}
                time={formik.values.service_time}
                onDateChange={(date) =>
                  formik.setFieldValue("service_date", date)
                }
                onTimeChange={(time) =>
                  formik.setFieldValue("service_time", time)
                }
                errors={
                  showErrors
                    ? {
                        date: formik.errors.service_date,
                        time: formik.errors.service_time,
                      }
                    : {}
                }
              />
              {/* Submit button — desktop only (inside card) */}
              <Box sx={{ display: { xs: "none", md: "block" }, mt: 2.5 }}>
                {submitButton}
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomContainer>

      {/* Submit button — mobile only (fixed bottom) */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          backgroundColor: "background.paper",
          px: 2,
          py: 1.5,
          boxShadow: `0 -1px 16px 0 ${alpha(
            theme.palette.text.primary,
            0.04
          )}, 0 -1px 16px 0 ${alpha(theme.palette.text.primary, 0.08)}`,
        }}
      >
        {submitButton}
      </Box>

      <CustomModal
        openModal={openSuccessModal}
        handleClose={handleCloseSuccessModal}
        closeButton
      >
        <CustomServiceSuccessModal onViewPost={handleViewPost} />
      </CustomModal>
    </CustomStackFullWidth>
  );
}
