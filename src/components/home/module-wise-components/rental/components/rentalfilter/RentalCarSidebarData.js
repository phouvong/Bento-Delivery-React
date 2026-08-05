import { Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import RentalFilter from "./RentalFilter";
import CarCard from "../global/CarCard";
import { Stack } from "@mui/system";
import { useInView } from "react-intersection-observer";
import EmptySearchResults from "components/EmptySearchResults";
import DotSpin from "components/DotSpin";
import { useRouter } from "next/router";

const RentalCarSidebarData = ({
	data,
	minMax,
	setMinMax,
	setSelectedCategoryIds,
	setSelectedBrandIds,
	setSelectedSeats,
	setAirCondition,
	setNoAirCondition,
	isFetching,
	setInViewport,
	currentView,
	from,
	rentalPriceFilterRange
	
}) => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const { ref, inView } = useInView();

	useEffect(() => {
		setInViewport(inView);
	}, [inView]);

	const isSearchPage = router.pathname === "/vehicle-search";

	return (
		<CustomBoxFullWidth>
			<Grid container spacing={3}>
				<Grid
					item
					xs={12}
					sm={12}
					md={3}
					lg={3}
					sx={{ display: { xs: "none", md: "block" } }}
				>
					<Box
						
					>
						<RentalFilter
							minMax={minMax}
							setMinMax={setMinMax}
							setSelectedCategoryIds={setSelectedCategoryIds}
							setSelectedBrandIds={setSelectedBrandIds}
							setSelectedSeats={setSelectedSeats}
							setNoAirCondition={setNoAirCondition}
							setAirCondition={setAirCondition}
							rentalPriceFilterRange={rentalPriceFilterRange}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={12} md={9} lg={9} spacing={2.5}>
					<Stack
						sx={{
							paddingBottom: "40px",
						}}
					>
						<Grid container spacing={3}>
							{data?.pages[0]?.total_size !== 0 ? (
								<>
									{data?.pages?.map((page) =>
										page?.vehicles?.map((vehicle) => (
											<Grid
												key={vehicle.id}
												item
												xs={12}
												sm={6}
												md={currentView === 0 ? 6 : 12}
												lg={currentView === 0 ? 4 : 12}
											>
												<CarCard
													currentView={currentView}
													setOpenModal={setOpenModal}
													data={vehicle}
													from={from}
												/>
											</Grid>
										))
									)}
								</>
							) : (
								<Grid item xs={12} sm={12} sx={{ pt: "20px" ,marginTop:{xs:"0px",md:"90px"}}}>
									<EmptySearchResults
										isRental={true}
										text="Rental Car Not Found!"
									/>
								</Grid>
							)}
						</Grid>
					</Stack>
					{isFetching && (
						<Stack alignItems="center" mt={5}>
							<DotSpin />
						</Stack>
					)}
					<Stack alignItems="center" ref={ref}></Stack>
				</Grid>
			</Grid>
		</CustomBoxFullWidth>
	);
};

export default RentalCarSidebarData;
