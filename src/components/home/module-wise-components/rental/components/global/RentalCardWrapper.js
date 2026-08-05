import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const RentalCardWrapper = ({
	children,
	border,
	height,
	padding = "20px",
	borderRadius = "20px",
	borderTopLeftRadius,
	borderTopRightRadius,
	sx,
}) => {
	return (
		<CustomStackFullWidth
			sx={{
				p: padding, // Padding
				borderRadius: borderRadius,
				border: border,
				height: height,
				borderTopLeftRadius: borderTopLeftRadius,
				borderTopRightRadius: borderTopRightRadius,
				backgroundColor: (theme) => theme.palette.background.paper, // Dynamic background
				boxShadow: "0px 2px 5px 0px rgba(71, 71, 71, 0.07)",
				...sx, // Fixed rgba syntax
			}}
		>
			{children}
		</CustomStackFullWidth>
	);
};

export default RentalCardWrapper;
