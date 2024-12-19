import React, { useEffect } from "react";
import { CustomStackFullWidth } from "../src/styled-components/CustomStyles.style";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import maintainance from "../public/static/maintenance.png";
import CustomImageContainer from "../src/components/CustomImageContainer";
import { useGetConfigData } from "../src/api-manage/hooks/useGetConfigData";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData } from "../src/redux/slices/configData";
import { useRouter } from "next/router";
const Maintainance = (props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  const { configData } = useSelector((state) => state.configData);
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

  useEffect(() => {
    if (dataConfig && !dataConfig?.maintenance_mode) {
      router.push("/");
    }
  }, [dataConfig]);
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: "9rem",
        mb: { xs: "72px", md: "0" },
      }}
    >
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Stack maxWidth="600px" width="100%" spacing={2} padding="1rem">
          <CustomImageContainer
            width="100%"
            height="100%"
            objectfit="cover"
            src={maintainance.src}
          />
          <Stack>
            <Typography align="center" variant="h3" color="primary.main">
              {t("We are under maintenance.")}
            </Typography>
            <Typography align="center" variant="h5">
              {t("We will be back very soon.")}
            </Typography>
          </Stack>
        </Stack>
      </CustomStackFullWidth>
    </Container>
  );
};

Maintainance.propTypes = {};

export default Maintainance;
