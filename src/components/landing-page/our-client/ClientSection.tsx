import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import NextImage from 'components/NextImage';
import DollarSignHighlighter from 'components/DollarSignHighlighter';


interface CardData {
    id: number;
    image: string;
    image_full_url: string;
}

interface PopularClientSection {
    popular_client_title: string;
    popular_client_sub_title: string;
    cards: CardData[];
}

interface ClientSectionProps {
    popular_client_section: PopularClientSection;
}

const ClientSection: React.FC<ClientSectionProps> = ({ popular_client_section }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isRTL = theme.direction === 'rtl';

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const cards = popular_client_section?.cards || [];

    const getVisibleCards = (): number => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 8;
    };

    const handleNext = (): void => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = (): void => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);
    const canGoNext = cards.length > visibleCards && currentIndex < maxIndex;
    const canGoPrev = currentIndex > 0;


    // console.log({ popular_client_section });

    return (
        <Box sx={{ py: 6 }}>
            <Box textAlign="center" mb={4}>
                <Typography
                    variant="h3"
                    fontSize={{ xs: "18px", md: '30px' }}
                    mb={1}
                >
                    <DollarSignHighlighter text={popular_client_section?.popular_client_title || 'Our Clients'} theme={theme} />
                    { }
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontSize={{ xs: "14px", md: '16px' }}
                    fontWeight="400"
                >
                    {popular_client_section?.popular_client_sub_title || 'Trusted by leading brands for fast and reliable delivery services.'}
                </Typography>
            </Box>

            <Box position="relative">
                <Box
                    ref={scrollRef}
                    sx={{
                        overflow: 'hidden',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            transform: isRTL
                                ? `translateX(${currentIndex * (100 / visibleCards)}%)`
                                : `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: 'transform 0.3s ease-in-out',
                            gap: 1
                        }}
                    >
                        {cards.map((card) => (
                            <Box
                                key={card.id}
                                sx={{
                                    px: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: alpha(theme.palette.neutral[200], .5),
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                        width: 130,
                                        height: 130,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',


                                        '& img': {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }
                                    }}
                                >
                                    <NextImage
                                        width={130}
                                        src={card.image_full_url}
                                        alt={`Card ${card.id}`}
                                        objectFit="cover"
                                        height={130}
                                        borderRadius="5px"
                                        aspectRatio="1/1"
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Navigation Arrows */}
                <IconButton
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    sx={{
                        width: "33px",
                        borderRadius: 2.5,
                        position: 'absolute',
                        ...(isRTL ? { right: { xs: -11, md: -20 } } : { left: { xs: -11, md: -20 } }),
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: 'grey.100'
                        },
                        '&:disabled': {
                            opacity: 0.3
                        }
                    }}
                >
                    {isRTL ? (
                        <ArrowForwardIos sx={{ fontSize: "16px" }} />
                    ) : (
                        <ArrowBackIos sx={{ fontSize: "16px", marginLeft: '6px' }} />
                    )}
                </IconButton>

                <IconButton
                    onClick={handleNext}
                    disabled={!canGoNext}
                    sx={{
                        width: "33px",
                        borderRadius: 2.5,
                        position: 'absolute',
                        ...(isRTL ? { left: { xs: -11, md: -20 } } : { right: { xs: -11, md: -20 } }),
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: 'grey.100'
                        },
                        '&:disabled': {
                            opacity: 0.3
                        }
                    }}
                >
                    {isRTL ? (
                        <ArrowBackIos sx={{ fontSize: "16px", marginInlineEnd: "6px" }} />
                    ) : (
                        <ArrowForwardIos sx={{ fontSize: "16px" }} />
                    )}
                </IconButton>
            </Box>
        </Box>
    );
};

export default ClientSection;
