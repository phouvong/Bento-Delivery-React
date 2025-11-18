import React from 'react';
import { Box, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomContainer from 'components/container';

// TypeScript interfaces
interface TrustCard {
    status: number;
    title: string;
    sub_title: string | null;
    image_full_url: string | null;
}

interface TrustSectionData {
    trust_section_status: number;
    cards: TrustCard[];
}

interface StatsSectionProps {
    trustSectionData?: TrustSectionData;
}

// Styled components
const StatsCard = styled(Box)(({ theme }) => ({
    height: "100%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: 'box-shadow: 0px 3px 10px 0px #0000000F',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: "14px",
        gap: theme.spacing(1),
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.neutral[300],
    color: theme.palette.primary.contrastText,
    fontSize: '24px',
    fontWeight: 'bold',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
        width: '30px',
        height: '30px',
        fontSize: '16px',
        fontWeight: 'bold',
    },
}));

const ContentContainer = styled(Stack)({
    flex: 1,
    width: '100%',
    overflow: 'hidden',
});

const StatsNumber = styled(Typography)(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: '500',
    color: theme.palette.text.primary,
    lineHeight: 1.4,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
}));

const StatsTitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
        fontSize: '11px',
    },
}));

const StatsSection: React.FC<StatsSectionProps> = ({ trustSectionData }) => {
    // Default trust section data if none provided


    const trustData = trustSectionData

    if (trustData.trust_section_status !== 1) {
        return null;
    }

    // Filter only active cards
    const activeCards = trustData.cards.filter(card => card.status === 1);


    return (
        <CustomContainer maxWidth="lg">
            <Grid container spacing={{ xs: 1, sm: 3 }} pt={{ xs: "1rem", md: "3.5rem" }}>
                {activeCards.map((card: TrustCard, index: number) => (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                        <StatsCard>
                            <IconContainer>
                                {card.image_full_url ? (
                                    <img
                                        src={card.image_full_url}
                                        alt={card.sub_title || card.title}
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            objectFit: 'cover',
                                            //borderRadius: '50%'
                                        }}
                                    />
                                ) : (
                                    '📊'
                                )}
                            </IconContainer>
                            <ContentContainer>
                                <StatsNumber>
                                    {card.title}
                                </StatsNumber>
                                {card.sub_title && (
                                    <StatsTitle variant="body2">
                                        {card.sub_title}
                                    </StatsTitle>
                                )}
                            </ContentContainer>
                        </StatsCard>
                    </Grid>
                ))}
            </Grid>
        </CustomContainer>
    );
};

export default StatsSection;