import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomBookingModal from "./CustomBookingModal";

export default function CustomBooking({ onDatesChange, providerData }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [confirmedDates, setConfirmedDates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollToIndex, setScrollToIndex] = useState(null);
  const [tableExpanded, setTableExpanded] = useState(true);

  const hasDates = confirmedDates.length > 0;

  const startDate = hasDates ? dayjs(confirmedDates[0].date) : null;
  const endDate = hasDates ? dayjs(confirmedDates[confirmedDates.length - 1].date) : null;

  const handleEdit = () => {
    setScrollToIndex(null);
    setModalOpen(true);
  };

  const handleEditEntry = (index) => {
    setScrollToIndex(index);
    setModalOpen(true);
  };

  const handleDeleteEntry = (index) => {
    setConfirmedDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = ({ dates }) => {
    const merged = dates.map((d) => {
      const existing = confirmedDates.find((e) =>
        dayjs(e.date).isSame(dayjs(d.date), "day")
      );
      return { date: d.date, time: d.time ?? existing?.time ?? null };
    });
    setConfirmedDates(merged);
  };

  // Emit formatted dates to parent whenever confirmedDates changes.
  // time is "hh:mm A" (12-hour) → convert to 24-hour for the API.
  useEffect(() => {
    if (!onDatesChange) return;
    const complete = confirmedDates.filter((e) => e.time);
    if (complete.length === 0) { onDatesChange([]); return; }
    const dates = complete.map((entry) => {
      const d = dayjs(entry.date);
      const t = dayjs(entry.time, "hh:mm A");
      return { date: d.hour(t.hour()).minute(t.minute()).second(0).format("YYYY-MM-DD HH:mm:ss") };
    });
    onDatesChange(dates);
  }, [confirmedDates]);

  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        borderTop: `1px solid ${theme.palette.background.secondary}`,
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.4,
            }}
          >
            {t("Custom Schedule Service")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t(
              "You can have the service provided now or pick a time for scheduled service provide!"
            )}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={handleEdit}
          sx={{ color: theme.palette.info.main, flexShrink: 0, mt: "-4px" }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Date range banner */}
      {hasDates && startDate && endDate && (
        <Box
          sx={{
            mt: 2,
            px: 2,
            py: 1.25,
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Date Range")}{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {startDate.format("D MMM, YYYY")}
            </Box>{" "}
            {t("to")}{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {endDate.format("D MMM, YYYY")}.
            </Box>{" "}
            {t("You will receive this services total")}{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {confirmedDates.length} {t("times")}
            </Box>
          </Typography>
        </Box>
      )}

      {/* Selected days & time table */}
      {hasDates && (
        <Box
          sx={{
            mt: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: tableExpanded ? `${theme.palette.background.default}` : "none",
          }}
        >
          {/* Collapsible header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => setTableExpanded((v) => !v)}
            sx={{
              px: 2,
              py: 1.5,
              cursor: "pointer",
              userSelect: "none",
              borderBottom: tableExpanded
                ? `1px solid ${theme.palette.divider}`
                : "none",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "14px", md: "15px" },
                color: theme.palette.text.primary,
              }}
            >
              {t("Selected Days & Time")} ({confirmedDates.length})
            </Typography>
            {tableExpanded ? (
              <KeyboardArrowUpIcon sx={{ color: theme.palette.text.secondary }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: theme.palette.text.secondary }} />
            )}
          </Stack>

          <Collapse in={tableExpanded}>
            {confirmedDates.map((entry, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom:
                    index < confirmedDates.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "14px",
                    color: theme.palette.text.primary,
                  }}
                >
                  {dayjs(entry.date).format("ddd, MMM D")}
                </Typography>
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "14px",
                    color: theme.palette.text.primary,
                    textAlign: "center",
                  }}
                >
                  {entry.time || "—"}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditEntry(index)}
                    sx={{ color: theme.palette.info.main }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteEntry(index)}
                    sx={{ color: theme.palette.error.red }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Collapse>
        </Box>
      )}

      {/* Modal */}
      <CustomBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        value={{ dates: confirmedDates }}
        onConfirm={handleConfirm}
        scrollToIndex={scrollToIndex}
        providerData={providerData}
      />
    </Box>
  );
}
