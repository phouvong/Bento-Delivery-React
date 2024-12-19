import React, { useState } from "react";
import PropTypes from "prop-types";
import { CustomPaperBigCard } from "../../../styled-components/CustomStyles.style";
import {
  Button,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BasicInformationForm from "./BasicInformationForm";
import { Box, Stack, styled } from "@mui/system";
import CustomAlert from "../../alert/CustomAlert";
import AccountInformation from "./AccountInformation";
import EditIcon from "@mui/icons-material/Edit";
import AddAddress from "../../../redux/slices/addAddress";
import AddAddressComponent from "../../address/add-new-address/AddAddressComponent";
import { useSelector } from "react-redux";
import editIcon from "../asset/editIcon.png";
import CustomImageContainer from "../../CustomImageContainer";
import { useTheme } from "@emotion/react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VerifiedIcon from "components/profile/VerifiedIcon";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

export const SmallDeviceIconButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.neutral[400],
  borderRadius: "50%",
  padding: "6px",
}));
const BasicInformation = (props) => {
  const {
    data,
    t,
    refetch,
    setEditProfile,
    editProfile,
    setAddAddress,
    addAddress,
    editAddress,
    addressRefetch,
    setEditAddress,
  } = props;
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const handleClick = () => {
    setEditProfile((prvState) => !prvState);
  };
  return (
    <>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        padding={{ xs: "10px", sm: "15px", md: "20px" }}
      >
        {addAddress ? (
          <Grid container item xs={12} md={12} spacing={3}>
            <AddAddressComponent
              setAddAddress={setAddAddress}
              configData={configData}
              userData={data}
              editAddress={editAddress}
              addressRefetch={addressRefetch}
              setEditAddress={setEditAddress}
            />
          </Grid>
        ) : (
          <>
            {editProfile ? (
              <>
                <Grid container item xs={12} md={12}>
                  <BasicInformationForm
                    data={data}
                    configData={configData}
                    setEditProfile={setEditProfile}
                    handleClick={handleClick}
                    t={t}
                    refetch={refetch}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item md={12} xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize={{ xs: "14px", sm: "14px", md: "16px" }}
                      fontWeight="700"
                    >
                      {t("Personal Details")}
                    </Typography>
                    {isSmall && (
                      <SmallDeviceIconButton onClick={handleClick}>
                        <CustomImageContainer
                          src={editIcon.src}
                          height="16px"
                          width="16px"
                        />
                      </SmallDeviceIconButton>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack
                    spacing={{ xs: 1, sm: 1, md: 1 }}
                    paddingLeft={{ xs: "0px", md: "20px" }}
                  >
                    {data ? (
                      <>
                        <Typography
                          fontWeight="500"
                          fontSize={{ xs: "12px", md: "14px" }}
                        >
                          {t("User Name")}
                          <Typography
                            component="span"
                            marginLeft={{ xs: "13px", md: "10px" }}
                            fontSize={{ xs: "12px", md: "14px" }}
                          >
                            {`${data?.f_name ? data?.f_name : ""} ${
                              data?.l_name ? data?.l_name : ""
                            }`}
                          </Typography>
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          fontWeight="500"
                          fontSize={{ xs: "12px", md: "14px" }}
                        >
                          <Typography
                            component="span"
                            fontSize={{ xs: "12px", md: "14px" }}
                          >
                            {t("Email")}
                          </Typography>
                          <Typography
                            fontSize={{ xs: "12px", md: "14px" }}
                            component="span"
                            marginLeft={{ xs: "8px", md: "8px" }}
                          >
                            {data?.email || ""}
                          </Typography>
                          {data?.is_email_verified === 1 ? (
                            <VerifiedIcon style={{ marginLeft: "8px" }} />
                          ) : (
                            configData?.centralize_login
                              ?.email_verification_status === 1 && (
                              <ReportProblemIcon
                                sx={{
                                  color: (theme) => theme.palette.error.main,
                                  width: "1.2rem",
                                  marginLeft: "8px",
                                }}
                              />
                            )
                          )}
                        </Box>
                      </>
                    ) : (
                      <Stack>
                        <Skeleton variant="text" width={150} height={20} />
                        <Skeleton variant="text" width={150} height={20} />
                      </Stack>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack
                    spacing={{ xs: 1, sm: 1, md: 1 }}
                    alignItems="center"
                    width="100%"
                    justifyContent="center"
                  >
                    {data ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography
                          fontWeight="500"
                          fontSize={{ xs: "12px", md: "14px" }}
                        >
                          {t("Phone")}
                        </Typography>
                        <Typography
                          component="span"
                          fontSize={{ xs: "12px", md: "14px" }}
                          marginLeft={{ xs: "8px", md: "10px" }}
                          display="flex"
                          alignItems="center"
                        >
                          {data?.phone}
                          {data?.is_phone_verified === 1 ? (
                            <VerifiedIcon style={{ marginLeft: "8px" }} />
                          ) : (
                            configData?.centralize_login
                              ?.phone_verification_status === 1 && (
                              <ReportProblemIcon
                                sx={{
                                  color: (theme) => theme.palette.error.main,
                                  width: "1.2rem",
                                  marginLeft: "8px",
                                }}
                              />
                            )
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      <Stack>
                        <Skeleton variant="text" width={170} height={20} />
                        <Skeleton variant="text" width={170} height={20} />
                      </Stack>
                    )}
                  </Stack>
                </Grid>

                {!isSmall && (
                  <Grid
                    item
                    xs={6}
                    md={6}
                    align="right"
                    alignSelf="flex-start"
                    marginTop={{ xs: "5px", md: "0px" }}
                  >
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      sx={{ fontSize: "12px", borderRadius: "5px" }}
                      startIcon={
                        <BorderColorIcon
                          style={{ width: "13px", height: "13px" }}
                        />
                      }
                    >
                      {t("Edit Profile")}
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

BasicInformation.propTypes = {};

export default BasicInformation;
