import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "../src/styled-components/CustomStyles.style";
import CustomImageContainer from "../src/components/CustomImageContainer";
import CustomDivider from "../src/components/CustomDivider";
import MaintenanceImage from "../public/static/maintenance.png";
import {
  checkMaintenanceMode,
  getCommonServerSideProps,
} from "../src/utils/serverSidePropsHelper";

const Maintainance = ({ configData }) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!checkMaintenanceMode(configData)) {
      router.push("/");
    }
  }, [configData]);

  const messageSetup =
    configData?.maintenance_mode_data?.maintenance_message_setup;

  const showBusinessEmail = messageSetup?.business_email === 1;
  const showBusinessNumber = messageSetup?.business_number === 1;

  const handleEmailClick = () => {
    if (configData?.email) {
      window.location.href = `mailto:${configData.email}`;
    }
  };

  return (
    <>
      <Head>
        <title>{t("Maintenance mode")}</title>
      </Head>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      >
      <Container
        maxWidth="lg"
        sx={{
          pt: "9rem",
          pb: { xs: "72px", md: "4rem" },
          color: theme.palette.text.primary,
        }}
      >
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Stack
            maxWidth="600px"
            width="100%"
            spacing={2}
            padding="1rem"
            justifyContent="center"
            alignItems="center"
          >
            <CustomImageContainer
              width="325px"
              height="100%"
              objectfit="cover"
              src={MaintenanceImage.src}
              loading="auto"
            />
            <Stack spacing={2}>
              <Typography align="center" variant="h3" color="text.primary">
                {messageSetup?.maintenance_message ||
                  t("We are Cooking Up Something Special!")}
              </Typography>
              <Typography align="center" color="text.secondary" fontSize="14px">
                {messageSetup?.message_body ||
                  t(
                    "Our system is currently undergoing maintenance to bring you an even tastier experience. Hang tight while we make the dishes."
                  )}
              </Typography>
            </Stack>

            {(showBusinessEmail || showBusinessNumber) && (
              <>
                <CustomDivider divider="3px" type="dashed" />
                <Typography
                  textAlign="center"
                  fontSize="14px"
                  color="text.primary"
                >
                  {t("Any query? Feel free to contact us")}
                </Typography>
                <Stack justifyContent="center" width="100%" alignItems="center">
                  {showBusinessNumber && configData?.phone && (
                    <Typography
                      component="a"
                      href={`tel:${configData.phone}`}
                      fontSize="14px"
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {configData.phone}
                    </Typography>
                  )}
                  {showBusinessEmail && configData?.email && (
                    <Typography
                      onClick={handleEmailClick}
                      fontSize="14px"
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {configData.email}
                    </Typography>
                  )}
                </Stack>
              </>
            )}
          </Stack>
        </CustomStackFullWidth>
      </Container>
      </Box>
    </>
  );
};

export default Maintainance;

export const getServerSideProps = async (context) =>
  getCommonServerSideProps(context, "maintenance");
