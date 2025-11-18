import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    Button,
    Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Link from 'next/link';
import { t } from 'i18next';
import faqImage from "../../../public/landingpage/Question mark.svg"

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    user_type: string;
    status: number;
}

interface FaqSectionData {
    faq_section_status: number;
    faq_title: string;
    faq_list: FaqItem[];
}

interface FaqTabSectionProps {
    faq_section?: FaqSectionData;
}

const FaqTabSection: React.FC<FaqTabSectionProps> = ({ faq_section }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [expandedAccordion, setExpandedAccordion] = useState<number | false>(false);

    // Prevent rendering when FAQ section is disabled
    if (faq_section && faq_section.faq_section_status !== 1) {
        return null;
    }

    // Filter FAQ data
    const dynamicCustomerFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'customer' && faq.status === 1
    );

    const dynamicSellerFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'restaurant' && faq.status === 1
    );

    const dynamicDriverFaqs = faq_section?.faq_list?.filter(
        faq => faq.user_type === 'deliveryman' && faq.status === 1
    );

    // Build dynamic tabs
    const tabs = [];

    if (dynamicCustomerFaqs?.length) {
        tabs.push({
            label: "I'm a Customer",
            icon: <PersonIcon />,
            type: "customer"
        });
    }

    if (dynamicSellerFaqs?.length) {
        tabs.push({
            label: "I'm a Seller",
            icon: <StorefrontIcon />,
            type: "restaurant"
        });
    }

    if (dynamicDriverFaqs?.length) {
        tabs.push({
            label: "I'm a Rider",
            icon: <DirectionsCarIcon />,
            type: "deliveryman"
        });
    }

    // Get current FAQ list
    const getCurrentFaqs = () => {
        const tabType = tabs[activeTab]?.type;

        if (tabType === "customer") return dynamicCustomerFaqs;
        if (tabType === "restaurant") return dynamicSellerFaqs;
        if (tabType === "deliveryman") return dynamicDriverFaqs;

        return [];
    };

    const handleAccordionChange = (panel: number) => (_event: any, isExpanded: boolean) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        setExpandedAccordion(false);
    };

    return (
        <Box component="section" sx={{ py: 3, backgroundColor: theme.palette.background.default }}>
            <Box maxWidth="lg">

                {/* Title */}
                <Box textAlign="center" mb={3}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '18px', md: '1.9rem' },
                            fontWeight: 760,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {faq_section?.faq_title}
                    </Typography>
                </Box>

                {/* Dynamic Tabs */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            backgroundColor: theme.palette.neutral[100],
                            borderRadius: '5px',
                            p: 1,
                            gap: 0.5,
                            boxShadow: "0px 5px 15px -2px #1C1E201A",
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Box
                                key={index}
                                onClick={() => handleTabChange(index)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: { xs: 1, md: 2 },
                                    py: 1,
                                    cursor: 'pointer',
                                    fontSize: { xs: '0.9rem', md: '.9rem' },
                                    fontWeight: 600,
                                    backgroundColor:
                                        activeTab === index
                                            ? theme.palette.neutral[100]
                                            : 'transparent',
                                    color:
                                        activeTab === index
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                    borderBottom:
                                        activeTab === index
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : '2px solid transparent',
                                }}
                            >
                                {tab.icon}
                                <Typography>{t(tab.label)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* FAQ List */}
                <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
                    {getCurrentFaqs()?.map(faq => (
                        <Accordion
                            key={faq.id}
                            expanded={expandedAccordion === faq.id}
                            onChange={handleAccordionChange(faq.id)}
                            sx={{
                                mb: 2,
                                borderRadius: '8px !important',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:before': { display: 'none' },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    expandedAccordion === faq.id
                                        ? <RemoveIcon sx={{ color: theme.palette.primary.main }} />
                                        : <AddIcon sx={{ color: theme.palette.primary.main }} />
                                }
                                sx={{
                                    backgroundColor: expandedAccordion === faq.id
                                        ? theme.palette.neutral[100]
                                        : theme.palette.neutral[300],
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: '.8rem', md: '1.1rem' },
                                        fontWeight: 600,
                                        color:
                                            expandedAccordion === faq.id
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails
                                sx={{
                                    backgroundColor: theme.palette.neutral[100],
                                    borderBottomLeftRadius: '8px',
                                    borderBottomRightRadius: '8px',
                                }}
                            >
                                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Contact Box */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={'center'}
                    spacing={{ xs: 1.5, md: 2.5 }}
                    sx={{
                        maxWidth: '900px',
                        mx: 'auto',
                        mt: '30px',
                        backgroundColor: theme.palette.neutral[200],
                        px: { xs: "12px", md: "20px" },
                        py: '15px',
                        borderRadius: '10px',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.neutral[100],
                                padding: '3px',
                                borderRadius: '50%',
                                width: { xs: '30px', md: '40px' },
                                height: { xs: '30px', md: '40px' },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img src={faqImage.src} alt="FAQ" style={{ width: '100%' }} />
                        </Box>

                        <Box>
                            <Typography fontWeight="600" fontSize={{ xs: '16px', sm: '20px' }}>
                                {t('Still have questions?')}
                            </Typography>
                            <Typography fontSize={{ xs: '12px', sm: '14px' }}>
                                {t('We’re just a click away if you have more questions.')}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                        <Link href={`tel:${global?.phone}`} style={{ color: "white", textDecoration: 'none' }}>
                            {t('Contact Us')}
                        </Link>
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default FaqTabSection;
