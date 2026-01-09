import {
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { t } from "i18next";
import {
  CustomBoxFullWidth,
} from "styled-components/CustomStyles.style";
import React, { useEffect, useState } from "react";
import { alpha, Box, display } from "@mui/system";
import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from "dayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CustomModal from "components/modal";
import AccountCircle from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { toast } from "react-hot-toast";

const acceptedFileInputFormat =
  "application/pdf,image/*,text/plain,.doc, .docx,.txt";
const supportedFormatMultiImages = [
  "jpg",
  "jpeg",
  "gif",
  "png",
  "pdf",
  "doc",
  "docx",
  "deb",
];
const BusinessTin = ({
  RestaurantJoinFormik,
  selectedDates,
  setSelectedDates,
  imageOnchangeHandlerForTinImage,
  singleFileUploadHandlerForTinFile,
  tinNumberHandler,
  file,
  setFile,
  preview,
  setPreview,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      const fileName = selected.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const forbiddenExtensions = ['js', 'php'];

      if (forbiddenExtensions.includes(fileExtension)) {
        toast.error(t("File type not supported"));
        e.target.value = ''; // Clear the input
        return;
      }

      if (selected.size < 1024 * 1024) {
        // Set state for UI feedback
        setFile(selected);

        // Call preview/image handler
        imageOnchangeHandlerForTinImage(selected);

        // Call upload handler
        singleFileUploadHandlerForTinFile(selected);

        // Show preview only if image
        if (selected.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(selected);
          setPreview(imageUrl);
        } else {
          setPreview(null);
        }
      } else {
        // alert(t("File must be less than 1MB"));
      }
    }
  };

  const handleDateChange = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    setSelectedDates([dateString]); // ✅ Set as a single-element array
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const renderDay = (date, selectedDate, pickersDayProps) => {
    const isSelected = selectedDate === date.format("YYYY-MM-DD");

    return (
      <PickersDay
        {...pickersDayProps}
        selected={isSelected}
        sx={{
          backgroundColor: isSelected ? "#1976d2" : "transparent",
          color: isSelected ? "white" : "inherit",
          "&:hover": {
            backgroundColor: isSelected
              ? "#1565c0"
              : "rgba(25, 118, 210, 0.08)",
          },
        }}
      />
    );
  };

  // Helper function to truncate filename with ellipsis before extension
  const truncateFilename = (filename, maxLength = 25) => {
    if (filename.length <= maxLength) return filename;

    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      // No extension found, just truncate
      return filename.substring(0, maxLength - 3) + '...';
    }

    const extension = filename.substring(lastDotIndex);
    const nameWithoutExt = filename.substring(0, lastDotIndex);
    const availableLength = maxLength - extension.length - 3; // 3 for "..."

    if (availableLength <= 0) {
      return '...' + extension;
    }

    return nameWithoutExt.substring(0, availableLength) + '...' + extension;
  };


  return (
    <>
      <CustomBoxFullWidth>
        <Typography fontSize={{ xs: "16px", sm: "18px" }} fontWeight="500" textAlign="left" p={{ xs: 1.2, sm: 2 }} sx={{
          borderBottom: `1px solid ${alpha(
            theme.palette.neutral[400],
            0.2
          )}`,
        }}>
          {t("Business TIN")}
        </Typography>

        <Stack px={2} py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    fontSize="12px"
                    label={t("Taxpayer Identification Number (TIN)")}
                    placeholder={t("Type your tin number")}
                    type="text"
                    //inputMode="numeric"
                    fullWidth
                    name="tin"
                    value={RestaurantJoinFormik.values.tin}
                    onChange={RestaurantJoinFormik.handleChange}
                    onBlur={RestaurantJoinFormik.handleBlur}

                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle
                            sx={{
                              color: alpha(theme.palette.neutral[400], 0.7),
                              fontSize: "18px",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    error={
                      RestaurantJoinFormik.touched.tin &&
                      Boolean(RestaurantJoinFormik.errors.tin)
                    }
                    helperText={
                      RestaurantJoinFormik.touched.tin &&
                      RestaurantJoinFormik.errors.tin
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "45px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "12px",
                        padding: "0 14px", // Adjust padding to center the text vertically
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="medium"
                    label="Expire Date"
                    fullWidth
                    value={selectedDates ? selectedDates[0] : ""}
                    onClick={handleOpen}
                    readOnly
                    error={
                      RestaurantJoinFormik.touched.tin_expire_date &&
                      Boolean(RestaurantJoinFormik.errors.tin_expire_date)
                    }
                    helperText={
                      RestaurantJoinFormik.touched.tin_expire_date &&
                      RestaurantJoinFormik.errors.tin_expire_date
                    }
                    InputLabelProps={{
                      shrink: true, // ✅ this fixes the label overlapping
                    }}
                    sx={{
                      cursor: "pointer",
                      "& .MuiInputBase-root": {
                        height: "45px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "12px",
                        padding: "0 14px", // Adjust padding to center the text vertically
                      },
                      "& .MuiInputLabel-root": {
                        //  fontSize: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon
                            sx={{
                              color: alpha(theme.palette.neutral[400], 0.7),
                              fontSize: "18px",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthIcon
                            sx={{
                              color: theme.palette.primary.main,
                              fontSize: "18px",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {open && (
                    <CustomModal
                      openModal={open}
                      handleClose={() => setOpen(false)}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          <DateCalendar
                            value={selectedDates ? dayjs(selectedDates) : null}
                            onChange={handleDateChange}
                            minDate={dayjs()}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpen(false)}
                            disabled={!selectedDates}
                            sx={{
                              width: "fit-content",
                              alignSelf: "flex-end",
                              marginRight: "10px",
                              marginBottom: "10px",
                              zIndex: 177,
                            }}
                          >
                            {t("OK")}
                          </Button>
                        </Box>
                      </LocalizationProvider>
                    </CustomModal>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                {/* Label and Info */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <InputLabel
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "12px", sm: "14px" },
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {t("TIN Certificate")}
                  </InputLabel>
                  <Typography
                    fontSize="12px"
                    sx={{
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    ({t("pdf, doc, jpg. File size : max 2 MB")})
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    maxHeight: "130px",
                    position: "relative",
                  }}
                >
                  {file ? (
                    <Box
                      sx={{
                        width: "100%",
                        border: `1px dashed ${alpha(theme.palette.neutral[400], 0.5)}`,
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        position: "relative",
                      }}
                    >
                      {/* Edit Button */}
                      <Box
                        component="label"
                        htmlFor="file-input"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          backgroundColor: theme.palette.info.main,
                          color: "white",
                          width: "26px",
                          height: "26px",
                          borderRadius: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          zIndex: 2,
                          "&:hover": {
                            backgroundColor: theme.palette.info.dark,
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: "1rem" }} />
                      </Box>

                      {preview ? (
                        // Image preview - clickable to view
                        <Box
                          onClick={() => window.open(preview, '_blank')}
                          sx={{
                            cursor: "pointer",
                            borderRadius: "8px",
                            overflow: "hidden",
                            "&:hover": {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Image
                            src={preview}
                            alt="Uploaded preview"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "130px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </Box>
                      ) : (
                        // PDF/Document preview - two sections design
                        <Box>
                          {/* Top Section - PDF Preview with Dark Overlay */}
                          <Box
                            onClick={() => {
                              if (file) {
                                const fileUrl = URL.createObjectURL(file);
                                window.open(fileUrl, '_blank');
                              }
                            }}
                            sx={{
                              position: "relative",
                              height: "60px",
                              backgroundColor: alpha(theme.palette.neutral[400], 0.1),
                              borderRadius: "8px 8px 0 0",
                              cursor: "pointer",
                              overflow: "hidden",
                            }}
                          >
                            {/* PDF Preview */}
                            <object
                              data={file ? URL.createObjectURL(file) : ''}
                              type="application/pdf"
                              style={{
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                              }}
                            >
                              {/* Fallback icon if PDF can't be rendered */}
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <DescriptionIcon
                                  sx={{
                                    fontSize: "3rem",
                                    color: alpha(theme.palette.neutral[400], 0.3),
                                  }}
                                />
                              </Box>
                            </object>

                            {/* Dark Overlay */}
                            <Box
                              className="overlay"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.4)",
                                opacity: 0.5,
                                pointerEvents: "none",
                              }}
                            />
                          </Box>

                          {/* Bottom Section - Filename and Text with Icon */}
                          <Box
                            onClick={() => {
                              if (file) {
                                const fileUrl = URL.createObjectURL(file);
                                window.open(fileUrl, '_blank');
                              }
                            }}
                            sx={{
                              padding: "0.75rem",
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: "0 0 8px 8px",
                              cursor: "pointer",
                              transition: "background-color 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.neutral[100], 0.5),
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              {/* Document Icon on the left */}
                              <DescriptionIcon
                                sx={{
                                  fontSize: "2.5rem",
                                  color: alpha(theme.palette.neutral[600], 0.3),
                                }}
                              />
                              {/* Text content */}
                              <Stack spacing={0.25} sx={{ flex: 1 }}>
                                <Typography
                                  fontSize="14px"
                                  fontWeight="500"
                                  sx={{
                                    color: theme.palette.neutral[1000],
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {truncateFilename(file.name)}
                                </Typography>
                                <Typography
                                  fontSize="12px"
                                  sx={{
                                    color: alpha(theme.palette.neutral[600], 0.8),
                                  }}
                                >
                                  {t("Click to view The file")}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      component="label"
                      htmlFor="file-input"
                      sx={{
                        width: "100%",
                        border: `1px dashed ${alpha(theme.palette.neutral[400], 0.5)}`,
                        padding: "1.5rem",
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        display: "block",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <CloudUploadIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: alpha(theme.palette.neutral[600], 0.6),
                          }}
                        />
                        <Stack direction="row" spacing={0.5}>
                          <Typography
                            fontSize="12px"
                            sx={{
                              color: theme.palette.neutral[600],
                              fontWeight: 400,
                            }}
                          >
                            {t("Select a file ")}
                          </Typography>

                          <Typography
                            fontSize="12px"
                            sx={{
                              color: theme.palette.neutral[600],
                              fontWeight: 400,
                            }}
                          >
                            {t("here")}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    hidden
                    accept=".pdf, .doc, .docx, .jpeg, .jpg, .png"
                    onChange={handleFileChange}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </CustomBoxFullWidth>
    </>
  );
};

export default BusinessTin;
