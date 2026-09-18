import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../../src/components/layout/MainLayout";
import SEO from "../../../../src/components/seo";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, NoSsr } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useGetConfigData } from "../../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../../src/redux/slices/configData";
import { getToken } from "../../../../src/helper-functions/getToken";
import CreateCustomService from "components/home/module-wise-components/service/components/custom-service/create";
import useGetCustomServiceRequestDetails from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/custom-service/useGetCustomServiceRequestDetails";

// Convert API 24-hour ("14:30" / "14:30:00") back to the "h:mm A" the
// Shedule picker renders — inverse of the to24Hour helper in
// CustomServiceForm.jsx.
const to12Hour = (raw) => {
  if (!raw) return null;
  const parsed = dayjs(`2000-01-01 ${raw}`);
  return parsed.isValid() ? parsed.format("h:mm A") : String(raw);
};

const mapDetailToEditData = (detail) => {
  if (!detail) return null;
  const customer = detail?.customer_information ?? {};
  return {
    id: detail?.id,
    category_id: detail?.category?.id ?? detail?.category_id ?? "",
    sub_category_id: detail?.sub_category?.id ?? detail?.sub_category_id ?? "",
    description: detail?.description ?? "",
    service_date: detail?.booking_date ?? null,
    service_time: to12Hour(detail?.booking_time),
    address: customer?.address ?? "",
    address_type: customer?.address_type ?? "",
    contact_person_name: customer?.name ?? "",
    contact_person_number: customer?.phone ?? "",
    lat: customer?.latitude ?? null,
    lng: customer?.longitude ?? null,
    created_at: detail?.created_at ?? null,
  };
};

const EditCustomServicePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/auth/sign-in");
    }
  }, []);

  useEffect(() => {
    if (!configData) {
      configRefetch();
    }
  }, [configData]);

  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig]);

  const { data: detailsResponse, isLoading } =
    useGetCustomServiceRequestDetails({ id }, !!id);
  const editData = useMemo(
    () => mapDetailToEditData(detailsResponse?.data),
    [detailsResponse]
  );

  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? "Edit Custom Service" : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          {isLoading || !editData ? (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          ) : (
            <CreateCustomService configData={configData} editData={editData} />
          )}
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default EditCustomServicePage;
