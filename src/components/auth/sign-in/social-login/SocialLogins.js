import { Stack } from "@mui/material";
import { memo } from "react";
import GoogleLoginComp from "./GoogleLoginComp";
// import FbLoginComp from "./FbLoginComp";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import useGetProfile from "../../../../api-manage/hooks/react-query/profile/useGetProfile";
import { useWishListGet } from "../../../../api-manage/hooks/react-query/wish-list/useWishListGet";
import { setUser } from "../../../../redux/slices/profileInfo";
import { setWishList } from "../../../../redux/slices/wishList";
import { loginSuccessFull } from "../../../../utils/toasterMessages";
import FbLoginComp from "./FbLoginComp";

import { useRouter } from "next/router";

const SocialLogins = (props) => {
	const router = useRouter();
	const { socialLogin, configData } = props;
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const userOnSuccessHandler = (res) => {
		dispatch(setUser(res));
	};
	const { refetch: profileRefetch } = useGetProfile(userOnSuccessHandler);

	const onSuccessHandler = (response) => {
		dispatch(setWishList(response));
	};
	const { refetch } = useWishListGet(onSuccessHandler);
	const handleSuccess = async (value) => {
		localStorage.setItem("token", value);
		toast.success(t(loginSuccessFull));
		await refetch();
		await profileRefetch();
		router.push("/home", undefined, { shallow: true });
	};

	return (
		<Stack alignItems="center" justifyContent="center" spacing={1}>
			{socialLogin?.map((item, index) => {
				if (item?.login_medium === "google" && item.status === true) {
					return (
						<GoogleLoginComp
							key={index}
							handleSuccess={handleSuccess}
							configData={configData}
						/>
					);
				} else if (
					item?.login_medium === "facebook" &&
					item.status === true
				) {
					return (
						<FbLoginComp
							key={index}
							handleSuccess={handleSuccess}
							//handleParentModalClose={handleParentModalClose}
							configData={configData}
						/>
					);
				}
			})}
			{/*<AppleLoginComp/>*/}
		</Stack>
	);
};

SocialLogins.propTypes = {};

export default memo(SocialLogins);
