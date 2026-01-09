import { useTheme } from "@emotion/react";
import { Card, Box, Tooltip, Typography } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { PrimaryToolTip } from "components/cards/QuickView";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import CustomImageContainer from "../../CustomImageContainer";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

const ParcelCard = styled(Card)(({ theme }) => ({
	padding: "20px",
	cursor: "pointer",
	border: "1px solid",
	borderColor: "#EAEEF2",
	transition: "all ease 0.5s",
	"&:hover": {
		boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
		img: {
			transform: "scale(1.1)",
		},
		".MuiTypography-body1:first-child": {
			color: theme.palette.primary.main,
			letterSpacing: "0.02em",
		},
	},
	".MuiTypography-body1:first-child": {
		transition: "all ease 0.5s",
	},
}));

const ParcelCategoryCard = (props) => {
	const theme = useTheme();
	const { data } = props;
	const dispatch = useDispatch();
	const router = useRouter();

	const handleClick = () => {
        if(props.onClick){
            props.onClick(data)
        }else{
            dispatch(setParcelCategories(data));
			router.push("/parcel-delivery-info", undefined, { shallow: true });
        }
	};
	const classes = textWithEllipsis();
	const { ref: textRef, isEllipsed } = useTextEllipsis(data?.name);
	return (
    <CustomStackFullWidth>
			<ParcelCard {...props} onClick={handleClick} sx={{borderColor:props?.selected ? theme.palette.primary.main : ""}}>
				<Stack direction="row" alignItems="center" gap={3}>
					<Box
						sx={{
							img: {
								width: "72px",
								height: "72px",
							}
						}}>
							<NextImage
								width={72}
								height={72}
								src={data?.image_full_url}
								objectFit="contain"
							/>
						</Box>
						<Stack width="100%">
							<Tooltip
								title={data?.name || ""}
								placement="bottom"
								arrow
								disableHoverListener={!isEllipsed}
								componentsProps={{
									tooltip: {
										sx: {
											bgcolor: (theme) => theme.palette.toolTipColor,
											"& .MuiTooltip-arrow": {
												color: (theme) => theme.palette.toolTipColor,
											},
										},
									},
								}}
							>
								<Typography
									ref={textRef}
									fontSize={{ xs: "14px", sm: "18px", md: "18px" }}
									fontWeight="500"
									component="h3"
									sx={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										width: "100%",
									}}
								>
									{data?.name}
								</Typography>
							</Tooltip>
							<Typography
								fontSize={{ xs: "12px", sm: "14px", md: "14px" }}
								color={theme.palette.neutral[400]}
								className={classes.multiLineEllipsis}
								maxHeight="40px"
							>
								{data?.description}
							</Typography>
						</Stack>
				</Stack>
			</ParcelCard>
		</CustomStackFullWidth>
	);
};

export default ParcelCategoryCard;
