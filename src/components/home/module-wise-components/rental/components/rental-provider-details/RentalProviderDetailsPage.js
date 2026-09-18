import CustomContainer from "components/container";
import RentalProviderBanner from "./RentalProviderBanner";
import RentalFilterLayout from "../global/RentalFilterLayout";
import { provider_details } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const RentalProviderDetailsPage = ({ configData }) => {
	return (
		<CustomContainer>
			<RentalFilterLayout
				api_endpoint={provider_details}
				topContent={<RentalProviderBanner configData={configData} />}
			/>
		</CustomContainer>
	);
};

export default RentalProviderDetailsPage;
