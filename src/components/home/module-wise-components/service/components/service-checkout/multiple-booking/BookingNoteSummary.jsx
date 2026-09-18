import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const getOrdinal = (n) => {
  if (n > 3 && n < 21) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
};

const formatNoteDate = (d) => {
  const date = dayjs(d);
  return `${getOrdinal(date.date())} ${date.format("MMM").toLowerCase()}, ${date.format("YYYY")}`;
};

export default function BookingNoteSummary({ startDate, endDate, arrivalTime, totalCount }) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!startDate || !endDate || !arrivalTime) return null;

  return (
    <Box
      sx={{
        mt: 2,
        px: { xs: 2, md: 2.5 },
        py: 1.5,
        borderRadius: "8px",
        backgroundColor: theme.palette.warning.lighter,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          color: theme.palette.text.primary,
          lineHeight: 1.6,
        }}
      >
        {t("Date Range")}{" "}
        <Box component="span" sx={{ fontWeight: 700 }}>
          {formatNoteDate(startDate)} {t("to")} {formatNoteDate(endDate)}
        </Box>
        {". "}
        {t("You will receive this services total")}{" "}
        <Box component="span" sx={{ fontWeight: 700 }}>
          {totalCount} {t("times")}
        </Box>
      </Typography>
    </Box>
  );
}
