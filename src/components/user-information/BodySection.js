import React, { useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import ProfileTab from "./ProfileTab";
import Divider from "@mui/material/Divider";
import ProfileBody from "./ProfileBody";
import Address from "../address";
import AddAddressComponent from "../address/add-new-address/AddAddressComponent";
import { menuData } from "../header/second-navbar/account-popover/menuData";
import Router from "next/router";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import useGetAddressList from "../../api-manage/hooks/react-query/address/useGetAddressList";

const ProfileCard = styled(CustomPaperBigCard)(({ theme }) => ({}));

const BodySection = ({
  page,
  configData,
  orderId,
  userToken,
  deleteUserHandler,
  isLoadingDelete,
  accountDeleteStatus,
  setAccountDeleteStatus,
}) => {
  const [editProfile, setEditProfile] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading, refetch } = useGetAddressList();
  const handleActivePage = (item) => {
    Router.push(
      {
        pathname: "/profile",
        query: { page: item?.name },
      },
      undefined,
      { shallow: true },
    );
  };
  return (
    <CustomStackFullWidth spacing={4}>
      {/* Personal Details card — hidden on profile-settings (only show addAddress form) */}
      {page === "addresses" ? (
        addAddress && (
          <CustomPaperBigCard padding="10px" noboxshadow={isSmall ? "" : "true"}>
            <AddAddressComponent
              setAddAddress={setAddAddress}
              configData={configData}
              editAddress={editAddress}
              addressRefetch={refetch}
              setEditAddress={setEditAddress}
            />
          </CustomPaperBigCard>
        )
      ) : page === "profile-settings" ? (
        addAddress && (
          <CustomPaperBigCard padding="10px" noboxshadow={isSmall ? "" : "true"}>
            <ProfileBody
              key={`${page}-${orderId || "no-order"}`}
              page={page}
              configData={configData}
              orderId={orderId}
              editProfile={editProfile}
              setEditProfile={setEditProfile}
              addAddress={addAddress}
              setAddAddress={setAddAddress}
              editAddress={editAddress}
              refetch={refetch}
              setEditAddress={setEditAddress}
              deleteUserHandler={deleteUserHandler}
              accountDeleteStatus={accountDeleteStatus}
              setAccountDeleteStatus={setAccountDeleteStatus}
              isLoadingDelete={isLoadingDelete}
            />
          </CustomPaperBigCard>
        )
      ) : page === "track-order" ? (
        /* Track order has its own card UI — no outer profile card/padding/border */
        <ProfileBody
          key={`${page}-${orderId || "no-order"}`}
          page={page}
          configData={configData}
          orderId={orderId}
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          addAddress={addAddress}
          setAddAddress={setAddAddress}
          editAddress={editAddress}
          refetch={refetch}
          setEditAddress={setEditAddress}
          deleteUserHandler={deleteUserHandler}
          accountDeleteStatus={accountDeleteStatus}
          setAccountDeleteStatus={setAccountDeleteStatus}
          isLoadingDelete={isLoadingDelete}
        />
      ) : (
        <CustomPaperBigCard
          padding={page === "my-orders" || page === "inbox" || page === "monthly-cart-list" || page === "coupons" ? "0px" : "10px"}
          noboxshadow={
            isSmall
              ? page === "my-orders" || page === "inbox" || page === "monthly-cart-list" || page === "coupons"
                ? "true"
                : ""
              : "true"
          }
          backgroundcolor={
            isSmall &&
            (page === "my-orders" || page === "inbox" || page === "monthly-cart-list" || page === "coupons") &&
            theme.palette.background.default
          }
        >
          <ProfileBody
            key={`${page}-${orderId || "no-order"}`}
            page={page}
            configData={configData}
            orderId={orderId}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            addAddress={addAddress}
            setAddAddress={setAddAddress}
            editAddress={editAddress}
            refetch={refetch}
            setEditAddress={setEditAddress}
            deleteUserHandler={deleteUserHandler}
            accountDeleteStatus={accountDeleteStatus}
            setAccountDeleteStatus={setAccountDeleteStatus}
            isLoadingDelete={isLoadingDelete}
          />
        </CustomPaperBigCard>
      )}

      {(page === "profile-settings" || page === "addresses") && !addAddress && (
        <CustomPaperBigCard padding="10px" noboxshadow={isSmall ? "" : "true"}>
          <Address
            configData={configData}
            addAddress={addAddress}
            setAddAddress={setAddAddress}
            setEditAddress={setEditAddress}
            data={data}
            refetch={refetch}
            isLoading={isLoading}
          />
        </CustomPaperBigCard>
      )}
    </CustomStackFullWidth>
  );
};

export default BodySection;
