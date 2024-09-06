import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "utils/CustomFunctions";
import SignIn from "../../../src/components/auth/sign-in";
import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";
import { getServerSideProps } from "../../index";

const Index = ({ configData, landingPageData }) => {
	const [token, setToken] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
			router.push("/home");
		}
	}, []);
	return (
		<>
			<CssBaseline />
			<SEO
				title={configData ? `Sign In` : "Loading..."}
				image={`${getImageUrl(
					{ value: configData?.logo_storage },
					"business_logo_url",
					configData
				)}/${configData?.fav_icon}`}
				businessName={configData?.business_name}
				configData={configData}
			/>
			<MainLayout configData={configData} landingPageData={landingPageData}>
				<NoSsr>{!token && <SignIn configData={configData} />}</NoSsr>
			</MainLayout>
		</>
	);
};

export default Index;

export { getServerSideProps };
