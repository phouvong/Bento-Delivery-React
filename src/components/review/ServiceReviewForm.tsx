import React from "react";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  CustomStackFullWidth,
  CustomTextArea as CustomTextAreaJs,
} from "../../styled-components/CustomStyles.style";
import CustomRatings from "../search/CustomRatings";

// WHY: CustomTextArea is an untyped JS styled primitive that consumes custom
// `touched`/`errors` props not present on MUI's TextareaAutosize type.
const CustomTextArea = CustomTextAreaJs as unknown as React.FC<any>;
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";
import { useSubmitServiceReview } from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/service-reviews/useSubmitServiceReview";

interface ServiceDetail {
  id?: number | string;
  service_id: number | string;
  service_name?: string;
}

interface Props {
  bookingId: number | string;
  service: ServiceDetail;
  onReviewComplete?: (serviceId: number | string) => void;
}

const ServiceReviewForm = ({ bookingId, service, onReviewComplete }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mutate, isLoading } = useSubmitServiceReview();
  console.log({service});
  

  const formik = useFormik({
    initialValues: { rating: 0, comment: "" },
    onSubmit: (values) => {
      if (!values.rating) {
        toast.error(t("Please give a rating"));
        return;
      }
      mutate(
        {
          booking_id: bookingId,
          service_id: service?.service_id ||service?.id,
          rating: values.rating,
          comment: values.comment,
        },
        {
          onSuccess: (response: { message?: string }) => {
            toast.success(response?.message ?? t("Review submitted"));
            onReviewComplete?.(service?.service_id);
          },
          onError: onErrorResponse,
        }
      );
    },
  });

  const handleChangeRatings = (value: number) => {
    formik.setFieldValue("rating", value);
  };

  return (
    <CustomStackFullWidth>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{
                backgroundColor: "neutral.300",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Stack sx={{ minWidth: 0 }}>
                <Typography fontSize="14px" fontWeight="600" noWrap>
                  {service?.service_name ?? t("Service")}
                </Typography>
                <Typography fontSize="12px" color="text.secondary">
                  {t("Rate this service")}
                </Typography>
              </Stack>
              <CustomRatings
                handleChangeRatings={handleChangeRatings}
                ratingValue={formik.values.rating}
                readOnly={false}
                fontSize={"1.2rem"}
                color={theme.palette.primary.main}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack
              spacing={1}
              sx={{
                padding: "15px",
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: "10px",
                backgroundColor: "neutral.300",
              }}
            >
              <Typography fontSize="14px" mb={1}>
                {t("Share your opinion")}
              </Typography>
              <CustomTextArea
                sx={{
                  width: "100%",
                  minHeight: "100px",
                  fontSize: "12px",
                  border: "none",
                }}
                placeholder={t("Type your opinion")}
                touched={formik.touched.comment}
                errors={formik.errors.comment}
                multiline
                rows={4}
                value={formik.values.comment}
                onChange={formik.handleChange}
                name="comment"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} mt="1rem">
            <LoadingButton
              fullWidth
              variant="contained"
              type="submit"
              loading={isLoading}
            >
              {t("Submit")}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

export default ServiceReviewForm;
