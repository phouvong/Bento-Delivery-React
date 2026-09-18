import { Grid } from "@mui/material";
import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Skeleton from "@mui/material/Skeleton";
import RentalCardWrapper from "../RentalCardWrapper";
import { Box } from "@mui/system";
const TripStatusDetailsSkeleton = () => {
	return (
		<>
			<CustomStackFullWidth sx={{ mt: "40px" }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={8}>
						<Skeleton
							variant="rectangular"
							width={"100%"}
							height={100}
						/>
						<RentalCardWrapper sx={{ mt: "20px" }}>
							{[1, 2].map((item, index) => {
								return (
									<Skeleton
										key={index}
										variant="rectangular"
										height={120}
										sx={{ mb: "20px" }}
									/>
								);
							})}
						</RentalCardWrapper>

						<RentalCardWrapper sx={{ mt: "20px" }}>
							<Skeleton
								variant="rectangular"
								width={"20%"}
								height={20}
								sx={{ mb: "20px" }}
							/>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: "16px",
								}}
							>
								<Skeleton
									variant="rectangular"
									width={32}
									height={32}
									sx={{ mb: "20px", borderRadius: "5px" }}
								/>
								<Skeleton
									variant="rectangular"
									width={"100%"}
									height={20}
									sx={{ mb: "20px" }}
								/>
							</Box>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: "16px",
								}}
							>
								<Skeleton
									variant="rectangular"
									width={32}
									height={32}
									sx={{ mb: "20px", borderRadius: "5px" }}
								/>
								<Skeleton
									variant="rectangular"
									width={"50%"}
									height={20}
									sx={{ mb: "20px" }}
								/>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									width: "100%",
									gap: "20px",
								}}
							>
								{[1, 2].map((data, index) => {
									return (
										<Box
											key={index}
											sx={{
												display: "flex",
												alignItems: "center",
												gap: "16px",
												flex: 1,
											}}
										>
											<Skeleton
												variant="rectangular"
												width={32}
												height={32}
												sx={{
													mb: "20px",
													borderRadius: "5px",
												}}
											/>
											<Box sx={{ width: "100%" }}>
												<Skeleton
													variant="rectangular"
													width={"100%"}
													height={20}
													sx={{ mb: "20px" }}
												/>
												<Skeleton
													variant="rectangular"
													width={"50%"}
													height={20}
													sx={{ mb: "20px" }}
												/>
											</Box>
										</Box>
									);
								})}
							</Box>
						</RentalCardWrapper>

						<RentalCardWrapper sx={{ mt: "20px" }}>
							<Skeleton
								variant="rectangular"
								width={"20%"}
								height={20}
								sx={{ mb: "20px" }}
							/>

							<Skeleton
								variant="rectangular"
								width={"100%"}
								height={20}
								sx={{ mb: "20px" }}
							/>
						</RentalCardWrapper>
					</Grid>
					<Grid item xs={12} md={4}>
						<RentalCardWrapper>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Skeleton
									variant="rectangular"
									width={"40%"}
									height={20}
									sx={{ mb: "20px" }}
								/>
								<Skeleton
									variant="rectangular"
									width={20}
									height={20}
									sx={{ mb: "20px", borderRadius: "50%" }}
								/>
							</Box>

							{[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										gap: "20px",
									}}
								>
									<Skeleton
										variant="rectangular"
										width={"100%"}
										height={20}
										sx={{ mb: "20px" }}
									/>
									<Skeleton
										variant="rectangular"
										width={"100%"}
										height={20}
										sx={{ mb: "20px" }}
									/>
								</Box>
							))}
							<Skeleton
								variant="rectangular"
								width={"100%"}
								height={45}
								sx={{ mb: "20px" }}
							/>
						</RentalCardWrapper>
					</Grid>
				</Grid>
			</CustomStackFullWidth>
		</>
	);
};

export default TripStatusDetailsSkeleton;
