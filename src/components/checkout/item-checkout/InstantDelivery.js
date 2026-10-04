import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Modal,
  Radio,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RestaurantScheduleTime from "./RestaurantScheduleTime";

const DEFAULT_OPTIONS = [
  {
    value: "express",
    label: "Express Delivery",
    time: "10-20 min",
    extraCharge: 10,
  },
  {
    value: "delay",
    label: "Delay Delivery",
    time: "10-20 min",
    extraCharge: 10,
  },
  {
    value: "standard",
    label: "Standard Delivery",
    time: "10-20 min",
    extraCharge: 0,
  },
];

const InstantDelivery = (props) => {
  const {
    options = DEFAULT_OPTIONS,
    value,
    onChange,
    onEdit,
    currencySymbol = "$",
    storeData,
    configData,
    today,
    tomorrow,
    numberOfDay,
    setDayNumber,
    handleChange,
    setScheduleAt,
    orderType,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selected, setSelected] = useState(value ?? "standard");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const handleSelect = (val) => {
    setSelected(val);
    onChange?.(val);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
    setScheduleOpen(true);
  };
  console.log({ orderType });

  const handleScheduleClose = () => setScheduleOpen(false);

  const scheduleNode = (
    <RestaurantScheduleTime
      variant="modal"
      storeData={storeData}
      configData={configData}
      today={today}
      tomorrow={tomorrow}
      numberOfDay={numberOfDay}
      setDayNumber={setDayNumber}
      handleChange={handleChange}
      setScheduleAt={setScheduleAt}
      onClose={handleScheduleClose}
    />
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: { xs: "10px", md: "14px" },
          boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction={{ xs: "column" }}
          alignItems={{ xs: "stretch" }}
          justifyContent="space-between"
          gap={{ xs: 1.5, md: 2 }}
          width="100%"
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            gap={1}
            sx={{ width: { xs: "100%", md: "auto" }, flexShrink: 0 }}
          >
            <Stack spacing={0.25}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "14px", md: "16px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t("Instant Delivery")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "11px", md: "12px" },
                  color: theme.palette.text.secondary,
                }}
              >
                {t(
                  "You can have it delivered now or pick a time for scheduled delivery!",
                )}
              </Typography>
            </Stack>
            {orderType === "schedule_order" && (
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: "8px",
                  padding: "6px",
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="stretch"
            gap={{ xs: 1, md: 1.5 }}
            sx={{ flex: 1, width: "100%", overflow: "hidden" }}
          >
            {options.map((option) => {
              const isSelected = selected === option.value;
              return (
                <Box
                  key={option.value}
                  role="button"
                  onClick={() => handleSelect(option.value)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    width: { xs: "100%", sm: "auto" },
                    cursor: "pointer",
                    border: `1px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    borderRadius: "10px",
                    px: { xs: 1.25, md: 1.5 },
                    py: { xs: 1, md: 1.25 },
                    backgroundColor: theme.palette.background.paper,
                    transition: "border-color 0.15s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    sx={{ height: "100%" }}
                  >
                    <Stack spacing={0.25} minWidth={0} flex={1}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: {
                            xs: "13px",
                            md: "14px",
                          },
                          color: theme.palette.text.primary,
                          wordBreak: "break-word",
                        }}
                      >
                        {t(option.label)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            md: "12px",
                          },
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {option.time}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={0.5}
                      flexShrink={0}
                    >
                      {option.extraCharge > 0 && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: {
                              xs: "12px",
                              md: "13px",
                            },
                            color: theme.palette.text.primary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {`+ ${currencySymbol}${option.extraCharge}`}
                        </Typography>
                      )}
                      <Radio
                        checked={isSelected}
                        value={option.value}
                        onChange={() => handleSelect(option.value)}
                        size={isSmall ? "small" : "medium"}
                        sx={{
                          padding: 0,
                          color: theme.palette.divider,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={scheduleOpen}
          onClose={handleScheduleClose}
          PaperProps={{
            sx: {
              borderRadius: "16px 16px 0 0",
              backgroundColor: "transparent",
            },
          }}
        >
          {scheduleNode}
        </Drawer>
      ) : (
        <Modal
          open={scheduleOpen}
          onClose={handleScheduleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 560,
              outline: "none",
            }}
          >
            {scheduleNode}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default InstantDelivery;
