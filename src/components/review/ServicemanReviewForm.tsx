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
import CustomImageContainerJs from "../CustomImageContainer";
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";
import { useSubmitServicemanReview } from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/service-reviews/useSubmitServicemanReview";

// WHY: these are untyped JS primitives — CustomTextArea consumes custom
// `touched`/`errors` props absent from MUI's TextareaAutosize type, and
// CustomImageContainer's inferred type marks every styling prop as required.
const CustomTextArea = CustomTextAreaJs as unknown as React.FC<any>;
const CustomImageContainer = CustomImageContainerJs as unknown as React.FC<any>;

interface Serviceman {
  id: number | string;
  name?: string;
  image_full_url?: string | null;
}

interface Props {
  bookingId: number | string;
  serviceman: Serviceman;
  onReviewComplete?: (servicemanId: number | string) => void;
}

const ServicemanReviewForm = ({
  bookingId,
  serviceman,
  onReviewComplete,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mutate, isLoading } = useSubmitServicemanReview();

  const formik = useFormik({
    initialValues: { rating: "", comment: "" },
    onSubmit: (values) => {
      if (!values.rating) {
        toast.error(t("Please give a rating"));
        return;
      }
      mutate(
        {
          booking_id: bookingId,
          serviceman_id: serviceman?.id,
          rating: values.rating,
          comment: values.comment,
        },
        {
          onSuccess: (response: { message?: string }) => {
            toast.success(response?.message ?? t("Review submitted"));
            onReviewComplete?.(serviceman?.id);
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
            <Stack direction="row" spacing={2} alignItems="center">
              <CustomImageContainer
                src={serviceman?.image_full_url}
                width="60px"
                height="60px"
                borderRadius="50%"
                objectFit="cover"
              />
              <Typography fontSize="16px" fontWeight="600">
                {serviceman?.name}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: "neutral.300",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Typography fontSize="14px">
                {t("Rate the serviceman")}
              </Typography>
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

export default ServicemanReviewForm;
