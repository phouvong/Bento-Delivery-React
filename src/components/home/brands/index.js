/* eslint-disable react-hooks/exhaustive-deps */
import {
	alpha,
	Box,
	Button,
	Grid,
	Skeleton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import H2 from "components/typographies/H2";
import { t } from "i18next";
import Link from "next/link";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import useGetBrandsList from "api-manage/hooks/react-query/brands/useGetBrandsList";
import CustomContainer from "components/container";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBrands } from "redux/slices/brands";
import AtoZ from "sort/AtoZ";
import BrandCard from "./BrandCard";

export const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
	background: theme.palette.background.sklenton,
	maxWidth: "100%",
}));
const Brands = ({ viewAll }) => {
	const [sortBy, setSortBy] = useState("Default");
	const theme = useTheme();
	const sliderRef = useRef();
	const tabScreen = useMediaQuery("(max-width: 991px)");
	const { brands: data } = useSelector((state) => state?.brands);
	const { configData } = useSelector((state) => state?.configData);

	const dispatch = useDispatch();
	const handleSuccess = (response) => {
		dispatch(setBrands(response));
	};

	const { refetch, isLoading, isFetching } = useGetBrandsList(handleSuccess);

	useEffect(() => {
		if (!data) {
			refetch();
		}
	}, [data]);

	const baseUrl = configData?.base_urls?.brand_image_url;

	const handleSortBy = (value) => {
		setSortBy(value);
	};

	const [filteredData, setFilteredData] = useState(data);
	useEffect(() => {
		if (data) {
			if (sortBy === "AtoZ") {
				setFilteredData(
					[...data].sort((a, b) => a.name.localeCompare(b.name))
				);
			} else if (sortBy === "ZtoA") {
				setFilteredData(
					[...data].sort((a, b) => b.name.localeCompare(a.name))
				);
			} else {
				setFilteredData(data);
			}
		}
	}, [data, sortBy]);
	const router = useRouter();
	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (data?.length === 0 && viewAll) {
				router.push("/home");
			}
		}
	}, [isLoading, isFetching]);

	// Page View
	if (viewAll)
		return (
			<>
				<Box paddingBlock={"32px"}>
					<CustomContainer>
						{filteredData?.length > 0 ? (
							<Stack
								direction="row"
								flexWrap="wrap"
								justifyContent="space-between"
								marginBottom="30px"
								paddingBottom="20px"
								borderBottom={`1px solid ${theme.palette.divider}`}
								gap={2}
							>
								<Box
									width={{
										xs: "100%",
										sm: "0",
									}}
									flexGrow={"1"}
								>
									<H2
										text={"Brands"}
										textAlign={"left"}
										component="h2"
									/>
									<Typography variant={"body1"}>
										{t("Explore the Trusted and Trendsetting Brands")}
									</Typography>
								</Box>
								<AtoZ handleSortBy={handleSortBy} sortBy={sortBy} />
							</Stack>
						) : isLoading || isFetching ? (
							<>
								<Skeleton variant="text" width="80px" />
								<Skeleton variant="text" width="60px" />
							</>
						) : (
							""
						)}
						{isLoading || isFetching ? (
							<></>
						) : (
							filteredData?.length > 0 && (
								<Grid container spacing={2}>
									{filteredData?.map((item, i) => (
										<Grid item xs={6} md={3} key={item?.id}>
											<CustomBrandCard>
												<BrandCard
													name={item?.name}
													image={item?.image_full_url}
													stock={item?.items_count}
													id={item?.id}
													baseUrl={baseUrl}
													items_count={item?.items_count}
												/>
											</CustomBrandCard>
										</Grid>
									))}
								</Grid>
							)
						)}
					</CustomContainer>
				</Box>
			</>
		);
	// Section View
	return (
		<>
			<CustomStackFullWidth
				justifyContent="space-between"
				flexDirection="row"
			>
				{data?.length > 0 ? (
					<>
						<H2 text={"Brands"} component="h2" />

						<Link
							href={{
								pathname: "/all-brands",
							}}
						>
							<Button
								variant="text"
								sx={{
									transition: "all ease 0.5s",
									textTransform: "capitalize",
									"&:hover": {
										letterSpacing: "0.03em",
									},
								}}
							>
								{t("View all")}
							</Button>
						</Link>
					</>
				) : isLoading || isFetching ? (
					<>
						<Skeleton variant="text" width="80px" />
						<Skeleton variant="text" width="60px" />
					</>
				) : (
					""
				)}
			</CustomStackFullWidth>

			<>
				<Box
					sx={{
						paddingTop: "15px",
					}}
				>
					{isLoading || isFetching ? (
						<PopularCategoryStack>
							<CustomWrapperBox>
								<CustomSkeleton
									width={240}
									variant="rounded"
									animation={false}
									height={260}
								/>
							</CustomWrapperBox>
							<CustomWrapperStack direction="row" flexWrap="wrap">
								<CustomWrapperBox>
									<CustomSkeleton
										width={tabScreen ? "100%" : 240}
										variant="rounded"
										animation={false}
										height={tabScreen ? 400 : 260}
									/>
								</CustomWrapperBox>
								{Array(10)
									.fill()
									.map((_, i) => (
										<Box
											key={i}
											sx={{
												width: {
													md: "25%",
												},
												padding: "5px",
											}}
										>
											<CustomSkeleton
												width="100%"
												variant="rounded"
												animation={false}
												height={80}
											/>
										</Box>
									))
									.slice(1, 9)}
							</CustomWrapperStack>
						</PopularCategoryStack>
					) : (
						data?.length > 0 && (
							<PopularCategoryStack>
								<CustomWrapperBox>
									<BrandCard
										name={data[0].name}
										image={data[0].image_full_url}
										stock={data[0].items_count}
										horizontal
										id={data[0].id}
										baseUrl={baseUrl}
										items_count={data[0].items_count}
									/>
								</CustomWrapperBox>
								<CustomWrapperStack
									datalength={data?.length}
									direction="row"
									flexWrap="wrap"
								>
									<CustomWrapperBox>
										<BrandCard
											name={data[0].name}
											image={data[0].image_full_url}
											stock={data[0].items_count}
											horizontal
											id={data[0].id}
											baseUrl={baseUrl}
											items_count={data[0].items_count}
										/>
									</CustomWrapperBox>
									{data
										?.map((item, i) => (
											<Box
												key={item?.id}
												sx={{
													width: {
														md: "25%",
													},
													padding: "5px",
												}}
											>
												<BrandCard
													name={item?.name}
													image={item?.image_full_url}
													stock={item?.items_count}
													id={item?.id}
													baseUrl={baseUrl}
													items_count={item?.items_count}
												/>
											</Box>
										))
										.slice(1, 9)}
								</CustomWrapperStack>
							</PopularCategoryStack>
						)
					)}
				</Box>
			</>
		</>
	);
};

const CustomBrandCard = styled(Box)(({ theme }) => ({
	borderRadius: "10px",
	padding: "10px",
	background: theme.palette.background.default,
	border: `1px solid ${theme.palette.divider}`,
	transition: "all ease .3s",
	":hover": {
		boxShadow: theme.shadows[14],
	},
	[theme.breakpoints.up("xl")]: {
		".brand-card-image": {
			maxWidth: "100px",
			marginRight: "5px",
		},
	},
}));
const PopularCategoryStack = styled(Stack)(({ theme }) => ({
	flexDirection: "row",
	gap: 1,
	".MuiBox-root:first-of-type": {
		[theme.breakpoints.down("md")]: {
			display: "none",
		},
		":hover": {
			boxShadow: theme.shadows[18],
		},
	},
}));

const CustomWrapperBox = styled(Box)(({ theme }) => ({
	width: { xs: "100%" },
	maxWidth: { lg: "200px", xl: "270px" },

	background: theme.palette.background.paper,
	":hover": {
		boxShadow: theme.shadows[4],
	},
	borderRadius: "5px",
	[theme.breakpoints.up("xs")]: {
		padding: "17px 35px 22px",
	},
	[theme.breakpoints.up("md")]: {
		padding: "15px 20px 20px",
		boxShadow: theme.shadows[3],
	},
	[theme.breakpoints.up("xl")]: {
		padding: "17px 35px 22px",
	},
}));
const CustomWrapperStack = styled(Stack)(({ theme, datalength }) => ({
	width: "575px",
	flexGrow: "1",
	borderRadius: "5px",
	position: "relative",
	".MuiBox-root:first-of-type": {
		display: "none",
	},
	// rowGap: "24px",
	alignItems: "center",
	background: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
	[theme.breakpoints.up("xs")]: {
		padding: "20px 15px",
	},
	[theme.breakpoints.up("md")]: {
		padding: "20px 5px",
		"&::before": {
			position: "absolute",
			content: "''",
			left: "0",
			top: "50%",
			height: "1px",
			width: "100%",
			opacity: datalength > 4 ? "1" : "0",

			backgroundColor: alpha(theme.palette.neutral[400], 0.2),
		},
		":hover": {
			boxShadow: theme.shadows[4],
		},
	},
	[theme.breakpoints.up("xl")]: {
		padding: "45px 30px",
	},
	[theme.breakpoints.down("md")]: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		width: "100%",
		gap: ".5rem",
		"> .MuiBox-root": {
			// border: "1px solid #ddd",
			borderRadius: ".25rem",
		},
		".MuiBox-root:first-of-type": {
			display: "flex",
			gridRow: "span 4",
			justifyContent: "center",
			padding: ".25rem",
			img: {
				maxWidth: "80px",
			},
		},
	},
}));
export default Brands;
