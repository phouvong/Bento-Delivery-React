import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceIcon from "@mui/icons-material/Place";
import {alpha, Button, Card, Grid, styled, Typography, useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { DistanceCalculate } from "helper-functions/DistanceCalculate";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import { IsSmallScreen } from "utils/CommonValues";
import { not_logged_in_message } from "utils/toasterMessages";
import CustomImageContainer from "../CustomImageContainer";
import CustomRatingBox from "../CustomRatingBox";
import ProductMoreView from "../home/visit-again/ProductMoreView";
import { CustomOverLay } from "./Card.style";
import QuickView, { PrimaryToolTip } from "./QuickView";
import NextImage from "components/NextImage";

export const getModuleWiseData = () => {
	switch (getCurrentModuleType()) {
		case ModuleTypes.GROCERY:
			return {
				borderRadiusButton: "5px",
				borderRadiusSmallImage: "4px",
				smallImageGap: "8px",
				smallImageMarginLeft: "false",
				border: "false",
			};
		case ModuleTypes.PHARMACY:
			return {
				borderRadiusButton: "100px",
				borderRadiusSmallImage: "50%",
				smallImageGap: "0px",
				smallImageMarginLeft: "true",
				border: "true",
			};
		case ModuleTypes.ECOMMERCE:
			return {
				borderRadiusButton: "5px",
				borderRadiusSmallImage: "4px",
				smallImageGap: "8px",
				smallImageMarginLeft: "false",
				border: "false",
			};
		case ModuleTypes.FOOD:
			return {
				borderRadiusButton: "2px",
				borderRadiusSmallImage: "4px",
				smallImageGap: "8px",
				smallImageMarginLeft: "false",
				border: "false",
			};
	}
};
export const ImageWrapperMore = styled(Box)(
	({ theme, margin_left, is_border, width, height }) => ({
		position: "relative",
		height: height ?? "30px",
		width: width ?? "30px",
		marginLeft: margin_left === "true" ? "-5px" : "0px",
		border:
			is_border === "true"
				? `1px solid ${theme.palette.background.default}`
				: "none",
		[theme.breakpoints.down("sm")]: {
			height: "21px",
			width: "21px",
		},
	})
);
const KmShowing = ({ distance }) => {
	const { t } = useTranslation();

	return (
		<Stack
			sx={{
				background: "rgba(255, 255, 255, 0.9)",
				borderRadius: "0px 5px 5px 0px",
				p: "5px",
				color: "primary.main",
			}}
			direction="row"
			alignItems="center"
			justifyContent="center"
		>
			<PlaceIcon color="primary.main" sx={{ fontSize: "16px" }} />
			<Typography variant={IsSmallScreen() ? "body3" : "body1"}>
				<b>
					<DistanceCalculate distance={distance} />
				</b>{" "}
				{t("From You")}
			</Typography>
		</Stack>
	);
};

const VisitAgainCard = (props) => {
	const { item, isVisited } = props;
	const classes = textWithEllipsis();
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const [isHover, setIsHover] = useState(false);
	const { t } = useTranslation();
	const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
	const { mutate } = useWishListStoreDelete();
	const dispatch = useDispatch();
	const router = useRouter();
	const { wishLists } = useSelector((state) => state.wishList);
	const [isWishlisted, setIsWishlisted] = useState(false);


	useEffect(() => {
		wishlistItemExistHandler();
	}, [wishLists]);
	const handleClick = () => {
		router.push({
			pathname: `/store/[id]`,
			query: {
				id: `${item?.slug ? item?.slug : item?.id}`,
				module_id: `${item?.module_id}`,
				module_type: getCurrentModuleType(),
				store_zone_id: `${item?.zone_id}`,
			},
		});
	};
	const quickViewHandleClick = () => {
		handleClick();
	};
	const imageUrl = item?.cover_photo_full_url;

	const addToWishlistHandler = (e) => {
		e.stopPropagation();
		let token = undefined;
		if (typeof window !== "undefined") {
			token = localStorage.getItem("token");
		}
		if (token) {
			addFavoriteMutation(item?.id, {
				onSuccess: (response) => {
					if (response) {
						dispatch(addWishListStore(item));
						setIsWishlisted(true);
						toast.success(response?.message);
					}
				},
				onError: (error) => {
					toast.error(error.response.data.message);
				},
			});
		} else toast.error(t(not_logged_in_message));
	};
	const removeFromWishlistHandler = (e) => {
		e.stopPropagation();
		const onSuccessHandlerForDelete = (res) => {
			dispatch(removeWishListStore(item?.id));
			setIsWishlisted(false);
			toast.success(res.message, {
				id: "wishlist",
			});
		};
		mutate(item?.id, {
			onSuccess: onSuccessHandlerForDelete,
			onError: (error) => {
				toast.error(error.response.data.message);
			},
		});
	};
	const wishlistItemExistHandler = () => {
		if (wishLists?.store?.find((wishItem) => wishItem.id === item?.id)) {
			setIsWishlisted(true);
		} else {
			setIsWishlisted(false);
		}
	};

	return (
		<Card
			onClick={handleClick}
			sx={{
				background: theme.palette.neutral[100],
				padding: "10px",
				width: { xs: "220px", md: "280px" },
				cursor: "pointer",
				"&:hover": {
					img: {
						transform: "scale(1.1)",
					},
				},
				".MuiTypography-subtitle2": {
					transition: "all ease 0.5s",
				},
				"&:hover .MuiTypography-subtitle2": {
					color: theme.palette.primary.main,
					letterSpacing: "0.02em",
				},
			}}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<Box
				sx={{
					borderRadius: "10px",
					position: "relative",
					height: { xs: "100px", md: "132px" },
					width: "100%",
					img:{
						width:"100%",
						height: "100%",}

				}}
			>
				<NextImage
					src={imageUrl}
					alt={item?.name}
					height={isSmall ? 100 : 132}
					width={261}
					obejctfit="contain"
					borderRadius="10px"
				/>
				{getCurrentModuleType() !== ModuleTypes.FOOD && (
					<Box
						sx={{ position: "absolute", bottom: 12, left: 0, zIndex: 2 }}
					>
						<KmShowing distance={item?.distance} />
					</Box>
				)}

				{isWishlisted && (
					<Stack
						alignItems="center"
						justifyContent="center"
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							backgroundColor: (theme) => theme.palette.neutral[100],
							height: "30px",
							width: "30px",
							borderRadius: "4px",
							color: "primary.main",
						}}
					>
						<FavoriteIcon fontSize="small" />
					</Stack>
				)}

				<CustomOverLay hover={isHover}>
					<QuickView
						quickViewHandleClick={quickViewHandleClick}
						isHover={isHover}
						addToWishlistHandler={addToWishlistHandler}
						removeFromWishlistHandler={removeFromWishlistHandler}
						isWishlisted={isWishlisted}
					/>
				</CustomOverLay>
			</Box>
			<CustomBoxFullWidth sx={{ mt: "10px" }}>
				<Grid container spacing={1.5}>
					<Grid item xs={8.5} md={9}>
						<PrimaryToolTip
							text={item?.name}
							placement="bottom"
							arrow="false"
						>
							<Typography
								className={classes.singleLineEllipsis}
								fontSize={{ xs: "12px", md: "14px" }}
								fontWeight="500"
								component="h3"
							>
								{item?.name}
							</Typography>
						</PrimaryToolTip>
						<Typography
							color="text.secondary"
							className={classes.multiLineEllipsis}
							height="40px"
							fontSize="12px"
						>
							{item?.address}
						</Typography>
					</Grid>
					<Grid item xs={3.5} md={3}>
						<CustomRatingBox rating={item?.avg_rating} />
					</Grid>
				</Grid>
			</CustomBoxFullWidth>
			{isVisited && (
				<CustomBoxFullWidth sx={{ mt: "15px" }}>
					<Grid
						container
						spacing={1}
						alignItems="center"
						justifyContent="center"
					>
						<Grid item xs={7}>
							<ProductMoreView products={item?.items} />
						</Grid>
						<Grid item xs={5} align="right">
							<Button
								variant="contained"
								sx={{
									fontSize: "10px",
									borderRadius:
										getModuleWiseData?.()?.borderRadiusButton,
									padding: { xs: "4px 10px", sm: "8px 16px" },
									backgroundColor: (theme) =>
										getCurrentModuleType() === ModuleTypes.FOOD
											? theme.palette.moduleTheme.food
											: theme.palette.primary.main,
									"&:hover": {
										backgroundColor: (theme) =>
											getCurrentModuleType() === ModuleTypes.FOOD &&
											alpha(theme.palette.moduleTheme.food, 0.7),
									},
								}}
								onClick={handleClick}
							>
								{t("Visit Again")}
							</Button>
						</Grid>
					</Grid>
				</CustomBoxFullWidth>
			)}
		</Card>
	);
};

VisitAgainCard.propTypes = {};

export default VisitAgainCard;
