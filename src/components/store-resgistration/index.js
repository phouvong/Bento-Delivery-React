import React, { useEffect, useState } from "react";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { NoSsr, Typography } from "@mui/material";
import { t } from "i18next";
import StoreStepper from "components/store-resgistration/StoreStepper";
import StoreRegistrationForm from "components/store-resgistration/StoreRegistrationForm";
import BusinessPlan from "components/store-resgistration/BusinessPlan";
import FormSubmitButton from "components/profile/FormSubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { usePostStoreRegistration } from "api-manage/hooks/react-query/store-registration/usePostStoreRegistration";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import PaymentSelect from "components/store-resgistration/PaymentSelect";
import { usePostBusiness } from "api-manage/hooks/react-query/store-registration/usePostBusiness";
import { useRouter } from "next/router";
import SuccessStoreRegistration from "components/store-resgistration/SuccessStoreRegistration";
import { setActiveStep, setAllData } from "redux/slices/storeRegistrationData";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";

const StoreRegistration = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const [resData, setResData] = useState({});
  // const [activeStep, setActiveStep] = useState(0);
  const { flag, active } = router.query;
  const { allData, activeStep } = useSelector((state) => state.storeRegData);
  const [formValues, setFormValues] = useState({});
  const { mutate, isLoading: regIsloading } = usePostStoreRegistration();
  const { mutate: businessMutate, isLoading } = usePostBusiness();

  const formSubmit = (value) => {
    const tempData = { ...formValues, value };
    mutate(tempData, {
      onSuccess: (res) => {
        dispatch(setAllData({ ...allData, res }));
        setResData(res);
        if (res?.type === "commission") {
          const currentQuery = router.query;
          const updatedQuery = { ...currentQuery, flag: "success", active: "" };

          router.replace(
            {
              pathname: router.pathname,
              query: updatedQuery,
            },
            undefined,
            { shallow: true }
          );
          dispatch(setAllData(null));
        } else {
          dispatch(setActiveStep(2));
        }
      },
      onError: onErrorResponse,
    });
  };

  const submitBusiness = (values) => {
    dispatch(setAllData({ ...allData, values }));
    businessMutate(values, {
      onSuccess: (res) => {
        if (res) {
          if (res?.redirect_link && res?.payment !== "free_trial") {
            const redirect_url = `${res?.redirect_link}`;
            dispatch(setActiveStep(3));
            dispatch(setAllData(null));
            router.push(redirect_url);
          } else {
            const currentQuery = router.query;
            const updatedQuery = {
              ...currentQuery,
              flag: "success",
              active: "",
            };
            router.replace(
              {
                pathname: router.pathname,
                query: updatedQuery,
              },
              undefined,
              { shallow: true }
            );
            dispatch(setActiveStep(3));
            dispatch(setAllData(null));
          }
        }
      },
      onError: onErrorResponse,
    });
  };
  useEffect(() => {
    if (flag === "success") {
      dispatch(setActiveStep(3));
    }
  }, [flag]);
  useEffect(() => {
    if (active === "active") {
      dispatch(setActiveStep(0));
    }
  }, [active]);

  const handleActiveStep = () => {
    if (activeStep === 0) {
      return (
        <StoreRegistrationForm
          setActiveStep={setActiveStep}
          setFormValues={setFormValues}
        />
      );
    } else if (activeStep === 1) {
      return (
        <BusinessPlan
          setActiveStep={setActiveStep}
          formSubmit={formSubmit}
          isLoading={regIsloading}
        />
      );
    } else if (
      (activeStep === 3 && flag === "success") ||
      (activeStep === 3 && flag === "fail")
    ) {
      return <SuccessStoreRegistration flag={flag} />;
    } else if (activeStep === 2) {
      return (
        <PaymentSelect
          isLoading={isLoading}
          resData={resData}
          submitBusiness={submitBusiness}
        />
      );
    }
  };
  return (
    <NoSsr>
      <CustomContainer>
        <CustomStackFullWidth justify="center" mt={{ xs: "1rem", md: "1rem" }}>
          <Typography fontSize="36px" fontWeight="700" textAlign="center">
            {t("Store Application")}
          </Typography>
          <StoreStepper flag={flag} activeStep={activeStep} />
          {handleActiveStep()}
        </CustomStackFullWidth>
      </CustomContainer>
    </NoSsr>
  );
};

export default StoreRegistration;
