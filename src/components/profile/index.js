import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useGetUserInfo from "../../api-manage/hooks/react-query/user/useGetUserInfo";
import BasicInformation from "./basic-information";
import { setWalletAmount } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const Profile = (props) => {
  const {
    configData,
    setEditProfile,
    editProfile,
    setAddAddress,
    addAddress,
    editAddress,
    addressRefetch,
    setEditAddress,
  } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSuccess = (res) => {
    localStorage.setItem("wallet_amount", res?.wallet_balance);
    dispatch(setWalletAmount(res?.wallet_balance));
    dispatch(setUser(res));
  };
  const { data, refetch } = useGetUserInfo(handleSuccess);
  return (
    <>
      <BasicInformation
        data={data}
        refetch={refetch}
        configData={configData}
        t={t}
        editProfile={editProfile}
        setEditProfile={setEditProfile}
        addAddress={addAddress}
        setAddAddress={setAddAddress}
        editAddress={editAddress}
        addressRefetch={addressRefetch}
        setEditAddress={setEditAddress}
      />
    </>
  );
};

Profile.propTypes = {};

export default Profile;
