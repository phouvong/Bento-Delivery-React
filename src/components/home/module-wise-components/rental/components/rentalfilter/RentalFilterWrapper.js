import H4 from "components/typographies/H4";
import React from "react";
import RentalCardWrapper from "../global/RentalCardWrapper";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const RentalFilterWrapper = ({ title, content }) => {
	return (
		<CustomBoxFullWidth sx={{ mb: "30px" }}>
			<H4 text={title} sx={{ fontWeight: "600", mb: "10px" }} />
			<RentalCardWrapper borderRadius="10px" padding="15px">
				{content}
			</RentalCardWrapper>
		</CustomBoxFullWidth>
	);
};

export default RentalFilterWrapper;
