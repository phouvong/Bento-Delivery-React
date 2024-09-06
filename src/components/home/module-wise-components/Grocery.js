import { Grid } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import PaidAds from "components/home/paid-ads";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../api-manage/hooks/react-query/useGetOtherBanners";
import { IsSmallScreen } from "../../../utils/CommonValues";
import CustomContainer from "../../container";
import OrderDetailsModal from "../../order-details-modal/OrderDetailsModal";
import PromotionalBanner from "../PromotionalBanner";
import Banners from "../banners";
import BestReviewedItems from "../best-reviewed-items";
import Coupons from "../coupons";
import FeaturedCategories from "../featured-categories";
import LoveItem from "../love-item";
import NewArrivalStores from "../new-arrival-stores";
import PopularItemsNearby from "../popular-items-nearby";
import RunningCampaigns from "../running-campaigns";
import SpecialFoodOffers from "../special-food-offers";
import Stores from "../stores";
import VisitAgain from "../visit-again";
import PharmacyStaticBanners from "./pharmacy/pharmacy-banners/PharmacyStaticBanners";

const menus = ["All", "Beauty", "Bread & Juice", "Drinks", "Milks"];
const Grocery = (props) => {
	const { configData } = props;
	const token = getToken();
	const [isVisited, setIsVisited] = useState(false);
	const [storeData, setStoreData] = React.useState([]); //setStoreData
	const { orderDetailsModalOpen, orderInformation } = useSelector(
		(state) => state.utilsData
	);
	const { data, refetch, isLoading } = useGetOtherBanners();
	const { data: visitedStores, refetch: refetchVisitAgain } =
		useGetVisitAgain();
	const {
		data: newStore,
		refetch: newStoreRefetch,
		isFetching,
	} = useGetNewArrivalStores({
		type: "all",
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				await refetch();
				if (token) {
					await refetchVisitAgain();
				}
				newStoreRefetch();
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [token]);
	useEffect(() => {
		if (visitedStores?.length > 0 || newStore?.stores?.length > 0) {
			if (visitedStores?.length > 0 && visitedStores) {
				setStoreData(visitedStores);
				setIsVisited(true);
			} else {
				if (newStore?.stores) {
					setStoreData(newStore?.stores);
				}
			}
		}
	}, [visitedStores, newStore?.stores, getModuleId()]);

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} sx={{ marginTop: { xs: "-10px", sm: "10px" } }}>
				<CustomContainer>
					<FeaturedCategories configData={configData} />
				</CustomContainer>
			</Grid>
			<Grid item xs={12} mb={3} sx={{ display: token ? "" : "none" }}>
				{IsSmallScreen() ? (
					<VisitAgain
						configData={configData}
						isVisited={isVisited}
						visitedStores={storeData}
					/>
				) : (
					<CustomContainer>
						<VisitAgain
							configData={configData}
							isVisited={isVisited}
							visitedStores={storeData}
						/>
					</CustomContainer>
				)}
			</Grid>
			<Grid item xs={12} mb={3}>
				<CustomContainer>
					<PaidAds />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<PopularItemsNearby
						title="Most Popular Items"
						subTitle="We provide best quality & fresh grocery items near your location"
					/>
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<PharmacyStaticBanners />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<SpecialFoodOffers />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<Banners />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<BestReviewedItems
						menus={menus}
						title="Best Reviewed Items"
						bannerIsLoading={isLoading}
						info={data}
					/>
				</CustomContainer>
			</Grid>
			{/*<Grid item xs={12}>*/}
			{/*  <CustomContainer>*/}
			{/*    <DiscountedProductRedirectBanner />*/}
			{/*  </CustomContainer>*/}
			{/*</Grid>*/}
			<Grid item xs={12} mt="10px">
				<CustomContainer>
					<RunningCampaigns />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<LoveItem />
				</CustomContainer>
			</Grid>
			<Grid item xs={12} mb={2}>
				{IsSmallScreen() ? (
					<Coupons />
				) : (
					<CustomContainer>
						<Coupons />
					</CustomContainer>
				)}
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<NewArrivalStores />
				</CustomContainer>
			</Grid>
			<Grid item xs={12}>
				<CustomContainer>
					<PromotionalBanner bannerData={data} />
				</CustomContainer>
			</Grid>

			<Grid item xs={12}>
				<CustomContainer>
					<Stores />
				</CustomContainer>
			</Grid>
			{orderDetailsModalOpen && !token && (
				<OrderDetailsModal
					orderDetailsModalOpen={orderDetailsModalOpen}
					orderInformation={orderInformation}
				/>
			)}
		</Grid>
	);
};

Grocery.propTypes = {};

export default Grocery;
