import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { t } from "i18next";
import CreateIcon from "@mui/icons-material/Create";
import { setOpenAddressModal } from "redux/slices/addAddress";
import PlaceIcon from "@mui/icons-material/Place";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import MapsHomeWorkSharpIcon from "@mui/icons-material/MapsHomeWorkSharp";
import CustomModal from "../../modal";
import GuestUserInforForm from "../../address/GuestUserInforForm";
import EmailIcon from "@mui/icons-material/Email";

const CheckoutSelectedAddressGuest = ({
  address,
  refetch,
  configData,
  editAddress,
  setEditAddress,
  orderType,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openGuestUserModal, setOpenGuestUserModal] = useState(false);
  const { openAddressModal } = useSelector((state) => state.addressModel);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const handleClick = () => {
    if (orderType === "take_away") {
      setOpenGuestUserModal(true);
    } else {
      setEditAddress(address);
      dispatch(setOpenAddressModal(true));
    }
  };

  return (
    <div>
      <CustomStackFullWidth
        border={`1px solid ${theme.palette.primary.main}`}
        borderRadius="5px"
        alignItems="flex-start"
        padding="10px"
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          borderBottom={`2px solid ${theme.palette.neutral[200]}`}
        >
          <CustomStackFullWidth padding="8px">
            {guestUserInfo ? (
              <CustomStackFullWidth
                direction={{
                  xs: "column",
                  md: "row",
                }}
                sx={{
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="5px"
                  padding="8px"
                >
                  <PersonIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography>{guestUserInfo?.contact_person_name}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="5px"
                  padding="8px"
                >
                  <CallIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography>
                    {`+ ${guestUserInfo?.contact_person_number}`}
                  </Typography>
                </Stack>
                {guestUserInfo?.contact_person_email && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="5px"
                    padding="8px"
                  >
                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography>
                      {`${guestUserInfo?.contact_person_email}`}
                    </Typography>
                  </Stack>
                )}
                {orderType !== "take_away" &&
                  (guestUserInfo?.house || guestUserInfo?.floor) && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="5px"
                      padding="8px"
                    >
                      <MapsHomeWorkSharpIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography>{`Road - ${guestUserInfo?.road} , House - ${guestUserInfo?.house} , Floor - ${guestUserInfo?.floor}, `}</Typography>
                    </Stack>
                  )}
              </CustomStackFullWidth>
            ) : (
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap="5px"
              >
                <Stack sx={{ cursor: "pointer" }}>
                  <Tooltip
                    arrow
                    placement="top"
                    TransitionComponent={Zoom}
                    title={t("Please enter your contact info")}
                  >
                    <ErrorOutlineOutlinedIcon
                      sx={{ color: theme.palette.error.light }}
                    />
                  </Tooltip>
                </Stack>
                <Typography sx={{ color: theme.palette.error.light }}>
                  {t("No Contact Info Added")}
                </Typography>
              </CustomStackFullWidth>
            )}
          </CustomStackFullWidth>
          <Stack marginBottom="auto">
            <Tooltip
              arrow
              placement="top"
              TransitionComponent={Zoom}
              title={t("Please add your delivery address")}
            >
              <IconButton onClick={handleClick} padding="0px">
                <CreateIcon
                  sx={{
                    width: "20px",
                    height: "26px",
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          gap="5px"
          padding="8px"
        >
          {orderType !== "take_away" && (
            <>
              <PlaceIcon sx={{ color: theme.palette.primary.main }} />
              <Typography>
                {guestUserInfo?.address
                  ? guestUserInfo?.address
                  : address?.address}
              </Typography>
            </>
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
      {/* <AddNewAddress
                openAddressModal={openAddressModal}
                refetch={refetch}
                t={t}
                configData={configData}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
            /> */}
      {openGuestUserModal && (
        <CustomModal
          openModal={openGuestUserModal}
          handleClose={() => setOpenGuestUserModal(false)}
        >
          <GuestUserInforForm
            configData={configData}
            editAddress={editAddress}
            setEditAddress={setEditAddress}
            handleClose={() => setOpenGuestUserModal(false)}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default CheckoutSelectedAddressGuest;
