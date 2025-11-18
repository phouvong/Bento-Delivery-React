import React from 'react';
import Image from 'next/image';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DollarSignHighlighter from 'components/DollarSignHighlighter';

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    title?: string;
}

interface GalleryCard {
    status: number;
    image_full_url: string;
}

interface GallerySectionData {
    gallery_section_status: number;
    gallery_content_title: string;
    gallery_content_sub_title: string;
    cards: GalleryCard[];
}

interface GallerySectionProps {
    title?: string;
    subtitle?: string;
    galleryItems?: GalleryItem[];
    gallery_section?: GallerySectionData;
}

const StyledCard = styled(Card)(({ }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: "10px",
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

}));

const ImageWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    '& img': {
        transition: 'transform 0.3s ease-in-out',
    },
});

const ImageOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
    color: 'white',
    padding: '20px',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease-in-out',
});

const GallerySection: React.FC<GallerySectionProps> = ({
    gallery_section
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Use dynamic data if available, otherwise fallback to props/defaults
    const dynamicTitle = gallery_section?.gallery_content_title
    const dynamicSubtitle = gallery_section?.gallery_content_sub_title

    // Transform gallery_section cards to GalleryItem format
    const dynamicGalleryItems = gallery_section?.cards
        ?.filter(card => card.status === 1)
        ?.map((card, index) => ({
            id: index + 1,
            src: card.image_full_url,
            alt: `Gallery Image ${index + 1}`,
            title: undefined // No titles in the dynamic data
        }))

    const totalImages = dynamicGalleryItems?.length || 0;

    // Don't render if gallery_section is provided but disabled or no images
    if (gallery_section && gallery_section.gallery_section_status !== 1) {
        return null;
    }

    if (totalImages === 0) {
        return null;
    }

    const featuredImage = dynamicGalleryItems[0];
    const gridImages = dynamicGalleryItems.slice(1);

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 4, md: 6 },
            }}
        >
            <Container maxWidth="lg">
                {/* Title and Subtitle */}
                <Box textAlign="center" mb={3}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontSize: { xs: '1.2rem', md: '1.9rem' },
                            fontWeight: 600,
                        }}
                    >
                        <DollarSignHighlighter text={dynamicTitle} theme={theme} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            fontSize: { xs: '.8rem', md: '1rem' },
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.4,
                        }}
                    >
                        {dynamicSubtitle}
                    </Typography>
                </Box>

                {/* Gallery Grid */}
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Grid container spacing={{ xs: 1, md: 3 }} sx={{
                        maxWidth: "980px",
                        width: '100%'
                    }}>
                        {/* Layout for 1 image - Full width */}
                        {totalImages === 1 && (
                            <Grid item xs={12}>
                                <StyledCard>
                                    <ImageWrapper
                                        sx={{
                                            height: isMobile ? 200 : 350,
                                        }}
                                    >
                                        <Image
                                            src={featuredImage?.src}
                                            alt={featuredImage?.alt}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, 980px"
                                        />
                                    </ImageWrapper>
                                    {featuredImage?.title && (
                                        <ImageOverlay className="image-overlay">
                                            <Typography variant="h5" component="h3" fontWeight={600}>
                                                {featuredImage.title}
                                            </Typography>
                                        </ImageOverlay>
                                    )}
                                </StyledCard>
                            </Grid>
                        )}

                        {/* Layout for 2 images - Two equal columns */}
                        {totalImages === 2 && dynamicGalleryItems.map((item) => (
                            <Grid item xs={6} key={item.id}>
                                <StyledCard>
                                    <ImageWrapper
                                        sx={{
                                            height: isMobile ? 200 : 500,
                                        }}
                                    >
                                        <Image
                                            src={item?.src}
                                            alt={item?.alt}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 50vw, 490px"
                                        />
                                    </ImageWrapper>
                                    {item?.title && (
                                        <ImageOverlay className="image-overlay">
                                            <Typography variant="h5" component="h3" fontWeight={600}>
                                                {item.title}
                                            </Typography>
                                        </ImageOverlay>
                                    )}
                                </StyledCard>
                            </Grid>
                        ))}

                        {/* Layout for 3 images - One large, two stacked */}
                        {totalImages === 3 && (
                            <>
                                <Grid item xs={6} md={6}>
                                    <StyledCard>
                                        <ImageWrapper
                                            sx={{
                                                height: isMobile ? 200 : 550,
                                            }}
                                        >
                                            <Image
                                                src={featuredImage?.src}
                                                alt={featuredImage?.alt}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 50vw, 490px"
                                            />
                                        </ImageWrapper>
                                        {featuredImage?.title && (
                                            <ImageOverlay className="image-overlay">
                                                <Typography variant="h5" component="h3" fontWeight={600}>
                                                    {featuredImage.title}
                                                </Typography>
                                            </ImageOverlay>
                                        )}
                                    </StyledCard>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Grid container spacing={{ xs: 1, md: 3 }} sx={{ height: '100%' }}>
                                        {gridImages.map((item) => (
                                            <Grid item xs={12} key={item.id}>
                                                <StyledCard sx={{ height: isMobile ? 95 : 265 }}>
                                                    <ImageWrapper sx={{ height: '100%' }}>
                                                        <Image
                                                            src={item?.src}
                                                            alt={item?.alt}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            sizes="(max-width: 768px) 50vw, 490px"
                                                        />
                                                    </ImageWrapper>
                                                    {item?.title && (
                                                        <ImageOverlay className="image-overlay">
                                                            <Typography variant="h6" component="h4" fontWeight={600}>
                                                                {item?.title}
                                                            </Typography>
                                                        </ImageOverlay>
                                                    )}
                                                </StyledCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {/* Layout for 4+ images - Original layout (1 large + 3 in grid) */}
                        {totalImages >= 4 && (
                            <>
                                <Grid item xs={4} md={4}>
                                    <StyledCard>
                                        <ImageWrapper
                                            sx={{
                                                height: isMobile ? 200 : 640,
                                                maxHeight: 640,
                                            }}
                                        >
                                            <Image
                                                src={featuredImage?.src}
                                                alt={featuredImage?.alt}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 33vw, 25vw"
                                            />
                                        </ImageWrapper>
                                        {featuredImage?.title && (
                                            <ImageOverlay className="image-overlay">
                                                <Typography variant="h5" component="h3" fontWeight={600}>
                                                    {featuredImage.title}
                                                </Typography>
                                            </ImageOverlay>
                                        )}
                                    </StyledCard>
                                </Grid>

                                <Grid item xs={8} md={8}>
                                    <Grid container spacing={{ xs: 1, md: 3 }} sx={{ height: '100%' }}>
                                        {/* Top row - 2 images */}
                                        {gridImages.slice(0, 2).map((item) => (
                                            <Grid item xs={6} sm={6} key={item.id}>
                                                <StyledCard sx={{ height: isMobile ? 95 : 310 }}>
                                                    <ImageWrapper sx={{ height: '100%' }}>
                                                        <Image
                                                            src={item?.src}
                                                            alt={item?.alt}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            sizes="(max-width: 768px) 50vw, 33vw"
                                                        />
                                                    </ImageWrapper>
                                                    {item?.title && (
                                                        <ImageOverlay className="image-overlay">
                                                            <Typography variant="h6" component="h4" fontWeight={600}>
                                                                {item?.title}
                                                            </Typography>
                                                        </ImageOverlay>
                                                    )}
                                                </StyledCard>
                                            </Grid>
                                        ))}

                                        {/* Bottom row - 1 full width image */}
                                        {gridImages.slice(2, 3).map((item) => (
                                            <Grid item xs={12} key={item.id}>
                                                <StyledCard sx={{ height: isMobile ? 95 : 310 }}>
                                                    <ImageWrapper sx={{ height: '100%' }}>
                                                        <Image
                                                            src={item?.src}
                                                            alt={item?.alt}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            sizes="(max-width: 768px) 66vw, 50vw"
                                                        />
                                                    </ImageWrapper>
                                                    {item?.title && (
                                                        <ImageOverlay className="image-overlay">
                                                            <Typography variant="h6" component="h4" fontWeight={600}>
                                                                {item.title}
                                                            </Typography>
                                                        </ImageOverlay>
                                                    )}
                                                </StyledCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default GallerySection;