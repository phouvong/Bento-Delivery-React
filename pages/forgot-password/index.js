import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { getImageUrl } from "utils/CustomFunctions";
import ForgotPassword from "../../src/components/auth/ForgotPassword/ForgotPassword";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import { getServerSideProps } from "../index";

const index = ({ configData, landingPageData }) => {
	return (
		<>
			<CssBaseline />
			<SEO
				title={configData ? `Forgot password` : "Loading..."}
				image={`${getImageUrl(
					{ value: configData?.logo_storage },
					"business_logo_url",
					configData
				)}/${configData?.fav_icon}`}
				businessName={configData?.business_name}
				configData={configData}
			/>
			<MainLayout configData={configData} landingPageData={landingPageData}>
				<NoSsr>
					<ForgotPassword configData={configData} />
				</NoSsr>
			</MainLayout>
		</>
	);
};

export default index;
export { getServerSideProps };
