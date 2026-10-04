import React from "react";
import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import {
  CustomStackFullWidth,
  CustomTextArea,
} from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";

import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";

import { useFormik } from "formik";
import toast from "react-hot-toast";

import { useSubmitDeliverymanReview } from "../../api-manage/hooks/react-query/review/useSubmitDeliverymanReview";
import CustomRatings from "../search/CustomRatings";
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";

const DeliverymanForm = ({ data, orderId, onReviewComplete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mutate, isLoading } = useSubmitDeliverymanReview();
  const formik = useFormik({
    initialValues: {
      rating: "",
      comment: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        handleFormsubmit(values);
      } catch (err) {}
    },
  });
  const handleChangeRatings = (value) => {
    formik.setFieldValue("rating", value);
  };
  const handleFormsubmit = (values) => {
    const formData = {
      ...values,
      delivery_man_id: data?.id,
      order_id: orderId,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        onReviewComplete?.();
      },
      onError: onErrorResponse,
    });
  };

  return (
    <CustomStackFullWidth>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <CustomImageContainer
                src={data?.image_full_url}
                width="80px"
                height="80px"
                objectFit="cover"
              />
              <Stack>
                <Typography fontSize="16px">
                  {data?.f_name?.concat?.(" ", data?.l_name) ??
                    `${data?.f_name ?? ""} ${data?.l_name ?? ""}`.trim()}
                </Typography>
                {data && (
                  <CustomRatings
                    readOnly={true}
                    handleChangeRatings={handleChangeRatings}
                    ratingValue={data?.avg_rating}
                    fontSize={"1.1rem"}
                    color={theme.palette.primary.main}
                  />
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: (theme) => theme.palette.neutral[300],
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "normal" }}>
                {t("Rate the deliveryman")}
              </Typography>
              <CustomRatings
                handleChangeRatings={handleChangeRatings}
                ratingValue={formik.values.rating}
                fontSize={"1.2rem"}
                color={theme.palette.primary.main}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              spacing={1}
              sx={{
                padding: "15px",
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: "10px",
                backgroundColor: (theme) => theme.palette.neutral[300],
              }}
            >
              <Typography
                sx={{ fontSize: "14px", fontWeight: "normal", mb: 1 }}
              >
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
          <Grid item xs={12} md={12} mt="1rem">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
             
              <LoadingButton
                fullWidth
                variant="contained"
                type="submit"
                loading={isLoading}
                sx={{ width: "100%", backgroundColor: "#008631" }}
              >
                {t("Submit")}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

DeliverymanForm.propTypes = {};

export default DeliverymanForm;
