import { useState, SyntheticEvent } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { t } from "i18next";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Props {
  faqs?: FaqItem[];
}

const ServiceFaq = ({ faqs }: Props) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | false>(false);

  if (!faqs?.length) return null;

  const handleChange =
    (id: number) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? id : false);
    };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}
      >
        {t("FAQ")}
      </Typography>
      {faqs.map((faq) => (
        <Accordion
          key={faq.id}
          expanded={expanded === faq.id}
          onChange={handleChange(faq.id)}
          sx={{
            mb: 1.5,
            borderRadius: "8px !important",
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={
              expanded === faq.id ? (
                <RemoveIcon sx={{ color: theme.palette.primary.main }} />
              ) : (
                <AddIcon sx={{ color: theme.palette.primary.main }} />
              )
            }
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: expanded === faq.id ? "8px 8px 0 0" : "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.85rem", md: "1rem" },
                fontWeight: 600,
                color:
                  expanded === faq.id
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
              }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${theme.palette.divider}`,
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: theme.palette.text.secondary,
                lineHeight: 1.7,
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ServiceFaq;
