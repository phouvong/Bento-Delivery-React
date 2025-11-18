import React, { useRef, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	Avatar,
	IconButton,
	useTheme,
	Button,
	alpha
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import MapModal from "components/Map/MapModal";
import { useGeolocated } from "react-geolocated";
import DollarSignHighlighter from 'components/DollarSignHighlighter';

const testimonialData = [
	{
		id: 1,
		name: "John Smith",
		role: "Customer",
		rating: 5,
		comment: "Amazing service! Fast delivery and great food quality. Highly recommended!",
		avatar: "/images/avatar1.jpg"
	},
	{
		id: 2,
		name: "Sarah Johnson",
		role: "Regular Customer",
		rating: 5,
		comment: "The app is so easy to use and the delivery is always on time. Love it!",
		avatar: "/images/avatar2.jpg"
	},
	{
		id: 3,
		name: "Mike Wilson",
		role: "Food Lover",
		rating: 4,
		comment: "Great variety of restaurants and quick service. Very satisfied!",
		avatar: "/images/avatar3.jpg"
	},
	{
		id: 4,
		name: "Emma Davis",
		role: "Busy Professional",
		rating: 5,
		comment: "Perfect for my busy schedule. Reliable and convenient food delivery.",
		avatar: "/images/avatar4.jpg"
	}
];

const TestimonialCard = ({ testimonial, }) => {
	const [open, setOpen] = useState(false)

	const theme = useTheme();
	const { coords } =
		useGeolocated({
			positionOptions: {
				enableHighAccuracy: false,
			},
			userDecisionTimeout: 5000,
			isGeolocationEnabled: true,
		});

	return (
		<Card
			sx={{
				height: '100%',
				p: 2,
				borderRadius: '12px',
				boxShadow: '0px 0px 80px 0px #CDCDCD40',
				//border: `1px solid ${theme.palette.divider}`,
				minHeight: '200px'
			}}
		>
			<CardContent sx={{ textAlign: 'center', padding: "18px" }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
					<FormatQuoteOutlinedIcon
						sx={{
							fontSize: 40,
							color: theme.palette.primary.main,
							opacity: 0.7
						}}
					/>
				</Box>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						lineHeight: 1.6,
						mb: 2,
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{testimonial.review}
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Avatar
						src={testimonial.reviewer_image_full_url}
						sx={{ width: 50, height: 50, mb: 1 }}
					>
						{testimonial.name.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
							{testimonial.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{testimonial.designation}
						</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

const Testimonials = ({ testimonial_section, handleOrderNow }) => {
	const theme = useTheme();
	const sliderRef = useRef(null);
	const data = testimonial_section?.testimonial_list || testimonialData;

	const handleNext = () => {
		sliderRef.current?.slickNext();
	};

	const handlePrev = () => {
		sliderRef.current?.slickPrev();
	};

	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 4000,
		pauseOnHover: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
			<Grid container spacing={4} alignItems="center">
				{/* Left side - Title and Subtitle */}
				<Grid item xs={12} md={4}>
					<Box sx={{ pr: { md: 3 }, textAlign: { xs: 'center', md: 'left' } }}>
						<Typography
							variant="h3"
							sx={{
								fontWeight: 600,
								fontSize: { xs: '18px', md: '30px' },
								mb: 2,
								color: theme.palette.text.primary
							}}
						>
							<DollarSignHighlighter text={testimonial_section?.testimonial_title} theme={theme} />

						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: theme.palette.text.secondary,
								fontSize: '16px',
								lineHeight: 1.6
							}}
						>
							{testimonial_section?.testimonial_sub_title}
						</Typography>
						<Button onClick={handleOrderNow} variant='contained' sx={{ mt: { xs: "10px", md: "1rem" } }}>
							{testimonial_section?.testimonial_button_title}
						</Button>
					</Box>
				</Grid>

				{/* Right side - React Slick Slider */}
				<Grid item xs={12} md={8}>
					<Box sx={{ position: 'relative' }}>
						{/* Left Navigation Button */}
						<IconButton
							onClick={handlePrev}
							sx={{
								position: 'absolute',
								left: { xs: -11, md: -20 },
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#f5f5f5',
								color: '#666',
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: '#e0e0e0',
								},
								width: "33px",
								height: "33px"
							}}
						>
							{theme.direction === 'rtl' ? (
								<ArrowForwardIos sx={{ fontSize: "18px" }} />
							) : (
								<ArrowBackIos sx={{ fontSize: "18px", marginLeft: "6px" }} />
							)}
						</IconButton>

						{/* React Slick Slider */}
						<Box sx={{ background: { xs: "transparent", md: alpha(theme.palette.neutral[200], .1) }, paddingTop: "10px", pb: "5px", borderRadius: "10px" }} >
							<Slider ref={sliderRef} {...sliderSettings}>
								{data.map((testimonial) => (
									<Box key={testimonial.id} sx={{ px: 1 }}>
										<TestimonialCard testimonial={testimonial} />
									</Box>
								))}
							</Slider>
						</Box>

						{/* Right Navigation Button */}
						<IconButton
							onClick={handleNext}
							sx={{
								position: 'absolute',
								right: { xs: -11, md: -20 },
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#f5f5f5',
								color: '#666',
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: '#e0e0e0',
								},
								width: 30,
								height: 30
							}}
						>
							{theme.direction === 'rtl' ? (
								<ArrowBackIos sx={{ fontSize: "18px", marginInlineEnd: "6px" }} />
							) : (
								<ArrowForwardIos sx={{ fontSize: "18px" }} />
							)}
						</IconButton>
					</Box>
				</Grid>
			</Grid>

		</Container>
	);
};

export default Testimonials;