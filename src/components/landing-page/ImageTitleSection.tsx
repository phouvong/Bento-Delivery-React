import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    useTheme
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NextImage from 'components/NextImage';

interface HighlightSectionData {
    highlight_section_status: number;
    highlight_title: string;
    highlight_sub_title: string;
    highlight_button_title: string;
    highlight_image_full_url: string;
}

interface ImageTitleSectionProps {
    image?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    highlight_section?: HighlightSectionData;
}

const ImageTitleSection: React.FC<ImageTitleSectionProps> = ({
    onButtonClick = () => { },
    highlight_section
}) => {


    const theme = useTheme();

    // Use dynamic data if available, otherwise fallback to props/defaults
    const dynamicImage = highlight_section?.highlight_image_full_url
    const dynamicTitle = highlight_section?.highlight_title
    const dynamicSubtitle = highlight_section?.highlight_sub_title
    const dynamicButtonText = highlight_section?.highlight_button_title

    // Don't render if highlight_section is provided but disabled
    if (highlight_section && highlight_section.highlight_section_status !== 1) {
        return null;
    }

    return (
        <Box

            sx={{
                py: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 100%)`,
                borderRadius: '1rem',
                my: { xs: "0", md: 4 },
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                px: "1rem"
            }}
        >
            <Grid container spacing={4} alignItems="center">
                {/* Left Grid - Col-8 with Image, Title, Subtitle in Row */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3} alignItems="center">
                        {/* Image */}
                        <Grid item xs={12} sm={4}
                            sx={{
                                "img": {
                                    objectFit: "cover"
                                }
                            }}
                        >
                            <NextImage
                                src={dynamicImage}
                                alt={dynamicTitle}
                                width={300}
                                height={140}
                                objectFit="cover"
                                borderRadius={12}
                                aspectRatio="auto"
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Grid>

                        {/* Title and Subtitle */}
                        <Grid item xs={12} sm={8}>
                            <Box>
                                <Typography
                                    textAlign={{ xs: "center", md: "left" }}
                                    variant="h3"
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: '1.2rem', md: '1.8rem' },
                                        fontWeight: 600,
                                        mb: 1,
                                        color: theme.palette.primary.contrastText,
                                    }}
                                >
                                    {dynamicTitle}
                                </Typography>
                                <Typography
                                    textAlign={{ xs: "center", md: "left" }}
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '0.8rem', md: '1rem' },
                                        color: theme.palette.primary.contrastText,
                                        opacity: 0.8,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {dynamicSubtitle}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Grid - Col-4 with Button */}
                {/* <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-end' },
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={onButtonClick}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                px: 2,
                                py: 1,
                                fontSize: '14px',
                                fontWeight: 500,
                                borderRadius: 1,
                                textTransform: 'none',
                                backgroundColor: 'white',
                                color: theme.palette.primary.main,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            {dynamicButtonText}
                        </Button>
                    </Box>
                </Grid> */}
            </Grid>

        </Box>
    );
};

export default ImageTitleSection;