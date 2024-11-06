/* eslint-disable @next/next/no-img-element */
import { styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";

import { RTL } from "components/rtl";
import { getLanguage } from "helper-functions/getLanguage";
import CustomContainer from "../container";
import DollarSignHighlighter from "../DollarSignHighlighter";
import NextIcon from "../icons/NextIcon";
import PrevIcon from "../icons/PrevIcon";

const PrevWrapper = styled(Box)(({ theme }) => ({
	zIndex: 1,
	[theme.breakpoints.down("lg")]: {
		left: -5,
	},
	[theme.breakpoints.down("sm")]: {
		left: -10,
		display: "none",
	},
}));
const NextWrapper = styled(Box)(({ theme }) => ({
	zIndex: 1,
	[theme.breakpoints.down("lg")]: {
		right: -5,
	},
	[theme.breakpoints.down("sm")]: {
		right: -5,
		display: "none",
	},
}));
const Next = ({ onClick, className }) => {
	return (
		<NextWrapper
			className={`client-nav client-next ${className}`}
			onClick={onClick}
		>
			<NextIcon />
		</NextWrapper>
	);
};
const Prev = ({ onClick, className }) => {
	return (
		<PrevWrapper
			className={`client-nav client-prev ${className}`}
			onClick={onClick}
		>
			<PrevIcon />
		</PrevWrapper>
	);
};
const Testimonials = ({ isSmall, landingPageData }) => {
	const theme = useTheme();

	const [testimonials, setTestimonials] = useState([]);
	const lanDirection = getLanguage() ? getLanguage() : "ltr";

	useEffect(() => {
		// Filter the testimonial_list based on the status property
		const filteredTestimonials = landingPageData?.testimonial_list?.filter(
			(item) => item?.status === 1
		);

		// Set the filtered testimonials in the state
		setTestimonials(filteredTestimonials);
	}, [landingPageData]);

	const [nav1, setNav1] = useState(null);
	const [nav2, setNav2] = useState(null);
	const [indexState, setIndexState] = useState({
		oldSlide: 0,
		activeSlide: 0,
		activeSlide2: 0,
	});
	const setting = {
		autoplay: true,
		dots: false,
		arrow: true,
		infinite: testimonials.length > 1 ? true : false,
		slidesToShow: testimonials.length > 4 ? 3 : 1,
		focusOnSelect: true,
		className: "center",
		centerMode: true,
		centerPadding: "200px",
		speed: testimonials.length > 4 ? 1000 : 2000,
		autoplaySpeed: 4000,
		beforeChange: (current, next) =>
			setIndexState({ oldSlide: current, activeSlide: next }),
		afterChange: (current) => setIndexState({ activeSlide2: current }),
		prevArrow: testimonials.length > 1 && <Prev />,
		nextArrow: testimonials.length > 1 && <Next />,
		responsive: [
			{
				breakpoint: 1023,
				settings: {
					slidesToShow: testimonials.length > 3 ? 3 : 1,
					centerPadding: "64px",
				},
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: testimonials.length > 3 ? 3 : 1,
					centerPadding: "0",
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: testimonials.length > 3 ? 3 : 1,
					initialSlide: 2,
					centerPadding: "0",
				},
			},
		],
	};
	const textSliderSettings = {
		fade: true,
	};
	if (!testimonials?.length) {
		return;
	}
	return (
		<RTL direction={lanDirection}>
			{landingPageData && testimonials?.length > 0 && (
				<CustomContainer>
					<CustomStackFullWidth
						py={{ xs: "30px", md: "3.35rem" }}
						spacing={4}
					>
						<Typography
							textAlign="center"
							variant={isSmall ? "h7" : "h4"}
							fontSize={{ xs: "17px", sm: "24px", md: "30px" }}
							fontWeight={500}
							sx={{ opacity: ".9" }}
							component="h2"
						>
							<DollarSignHighlighter
								theme={theme}
								text={landingPageData?.testimonial_title}
							/>
						</Typography>
					</CustomStackFullWidth>
					<CustomStackFullWidth
						pb={{ xs: "0px", md: "45px" }}
						sx={{
							marginTop: "5px",
							textAlign: "center",
						}}
					>
						<Box
							sx={{ display: "block", position: "relative" }}
							className={"testimonials-slider"}
						>
							<Box sx={{ gap: "35px" }}>
								<Box className="slider-wrapper">
									<Slider
										asNavFor={nav2}
										ref={(e) => setNav1(e)}
										{...setting}
										rtl={landingPageData?.direction === "rtl"}
									>
										{testimonials?.map((item, i) => (
											<>
												{item?.status === 1 && (
													<TestimonialSlideImage
														img={item?.reviewer_image_full_url}
														key={i}
														indexState={indexState}
														currentIndex={i}
														lanDirection={lanDirection}
													/>
												)}
											</>
										))}
									</Slider>
								</Box>
								<Slider
									asNavFor={nav1}
									ref={(e) => setNav2(e)}
									{...textSliderSettings}
									rtl={landingPageData?.direction === "rtl"}
								>
									{testimonials.map((item, i) => (
										<TestimonialSlideText
											{...item}
											key={i}
											lanDirection={lanDirection}
										/>
									))}
								</Slider>
							</Box>
						</Box>
					</CustomStackFullWidth>
				</CustomContainer>
			)}
		</RTL>
	);
};
export const TestimonialSlideImage = (props) => {
	const { img, indexState, currentIndex, lanDirection } = props;
	const theme = useTheme();
	const primary = theme.palette.primary.main;
	return (
		<>
			<Stack
				p="4px"
				sx={{
					position: "relative",
					width: "100%",
					maxWidth: "140px",
					aspectRatio: "1",
					margin: "2px auto",
					direction: lanDirection,
				}}
			>
				<Box
					sx={{
						position: "absolute",
						inset: "0",
						background:
							currentIndex === indexState?.activeSlide2 && primary,
						width: "100%",
						height: "100%",
						aspectRatio: "1",
						borderRadius: "50%",
						overflow: "hidden", // Ensure content inside is not visible outside the circle
						padding: "5px",
						transition: "background-color ease-in-out 0.3s", // Smoother background color transition
						transform: `scale(${
							currentIndex === indexState?.activeSlide2 ? 1.01 : 1
						})`, // Scale effect for smoother transition
					}}
				>
					<CustomImageContainer
						src={img}
						alt=""
						width="100%"
						objectFit="cover"
						borderRadius="50%"
					/>
				</Box>
			</Stack>
		</>
	);
};

export const TestimonialSlideText = (props) => {
	const theme = useTheme();
	const { name, designation, review, activeState, index, lanDirection } =
		props;
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	return (
		<Box
			className={`slide-item ${
				index > activeState
					? "next-slide"
					: index == activeState
					? "active"
					: "prev-slide"
			}`}
			sx={{ marginTop: "30px" }}
		>
			<Stack
				className="content"
				spacing={3}
				alignItems="center"
				sx={{ direction: lanDirection }}
			>
				{review && (
					<Typography
						fontSize={{ xs: "12px", md: "18px" }}
						fontWeight="400"
						color={theme.palette.primary.main}
						lineHeight="2"
						fontStyle="italic"
						sx={{ maxWidth: { xs: "280px", sm: "400px", md: "580px" } }}
					>
						“{review}”
					</Typography>
				)}
				<Stack spacing={1}>
					{name && (
						<Typography
							variant={isSmall ? "subtitle2" : "h6"}
							fontWeight="600"
							component="h3"
						>
							{name}
						</Typography>
					)}
					{designation && (
						<Typography
							variant={isSmall ? "body2" : "body1"}
							fontSize={{ xs: "12px", sm: "14px", md: "16px" }}
							fontWeight={400}
							className="designation"
							color="text.secondary"
						>
							{designation}
						</Typography>
					)}
				</Stack>
			</Stack>
		</Box>
	);
};
Testimonials.propTypes = {};

export default Testimonials;
