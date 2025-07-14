import {
  Grid,
  InputAdornment,
  Stack, TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import React, { useEffect, useState } from "react";
import { alpha, Box, display } from "@mui/system";
import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from 'dayjs'
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomModal from "components/modal";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import CustomDivider from "components/CustomDivider";

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

    if (selected && selected.size < 1024 * 1024) {
      // Set state for UI feedback
      setFile(selected);

      // Call preview/image handler
      imageOnchangeHandlerForTinImage(selected);

      // Call upload handler
      singleFileUploadHandlerForTinFile(selected);

      // Show preview only if image
      if (selected.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(selected);
        setPreview(imageUrl);
      } else {
        setPreview(null);
      }
    } else {
      alert(t('File must be less than 1MB'));
    }
  };



  const handleDateChange = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    setSelectedDates([dateString]); // ✅ Set as a single-element array
  };

  const handleOpen=()=>{
    setOpen(!open);
  }

  const renderDay = (date, selectedDate, pickersDayProps) => {
    const isSelected = selectedDate === date.format('YYYY-MM-DD');

    return (
      <PickersDay
        {...pickersDayProps}
        selected={isSelected}
        sx={{
          backgroundColor: isSelected ? '#1976d2' : 'transparent',
          color: isSelected ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: isSelected ? '#1565c0' : 'rgba(25, 118, 210, 0.08)'
          }
        }}
      />
    );
  };

  return (
    <>
      <CustomBoxFullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} align="left">
            <Typography fontSize="18px" fontWeight="500">
              {t("Business TIN")}
            </Typography>
            <CustomDivider border="1px" paddingTop="5px" />
          </Grid>
          <Grid item xs={12} lg={6} mt="10px">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fontSize="12px"
                  label={t("Taxpayer Identification Number(TIN)")}
                  placeholder={t("Type your tin number")}
                  type="text"
                  inputMode="numeric"
                  required
                  fullWidth
                  name="tin"
                  value={RestaurantJoinFormik.values.tin}
                  onChange={RestaurantJoinFormik.handleChange}
                  onBlur={RestaurantJoinFormik.handleBlur}
                  inputProps={{
                    pattern: "[0-9\\W]*",
                    onInput: (e) => {
                      e.target.value = e.target.value.replace(/[a-zA-Z]/g, '');
                    }
                  }}
                  error={RestaurantJoinFormik.touched.tin && Boolean(RestaurantJoinFormik.errors.tin)}
                  helperText={RestaurantJoinFormik.touched.tin && RestaurantJoinFormik.errors.tin}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '45px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '12px',
                      padding: '0 14px', // Adjust padding to center the text vertically
                    },
                    '& .MuiInputLabel-root': {
                    //  fontSize: '12px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="medium"
                  label="Expire Date"
                  // placeholder="Choose your preferable day"
                  required
                  fullWidth
                  value={selectedDates?selectedDates[0] : ''}
                  onClick={handleOpen}
                  readOnly
                  error={RestaurantJoinFormik.touched.tin_expire_date && Boolean(RestaurantJoinFormik.errors.tin_expire_date)}
                  helperText={RestaurantJoinFormik.touched.tin_expire_date && RestaurantJoinFormik.errors.tin_expire_date}
                  InputLabelProps={{
                    shrink: true, // ✅ this fixes the label overlapping
                  }}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiInputBase-root': {
                      height: '45px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '12px',
                      padding: '0 14px', // Adjust padding to center the text vertically
                    },
                    '& .MuiInputLabel-root': {
                      //  fontSize: '12px',
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarTodayIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    )
                  }}
                />
                {open && (
                  <CustomModal openModal={open} handleClose={()=>setOpen(false)} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={selectedDates ? dayjs(selectedDates) : null}
                        onChange={handleDateChange}
                        minDate={dayjs()}
                        renderDay={(date, _value, pickersDayProps) =>
                          renderDay(date, selectedDates, pickersDayProps)
                        }
                      />
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
                  required
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: (theme) => theme.palette.neutral[500],
                  }}
                >
                  {t('TIN Certificate')}
                </InputLabel>
                <Typography
                  fontSize="12px"
                  sx={{
                    color: (theme) => theme.palette.neutral[400],
                  }}
                >
                  {t('pdf, doc, jpg. File size : max 2 MB')}
                </Typography>
              </Stack>

              <Box
                component="label"
                htmlFor="file-input"
                sx={{
                  maxWidth:"200px",
                  width: '100%',
                  border: '1px dashed #aaa',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: theme=>theme.palette.neutral[100],
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Uploaded preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '6px' }}
                  />
                ) : (
                  <Typography
                    fontSize="14px"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {file ? file.name : t('Click to select an image or document')}
                  </Typography>
                )}
                <input
                  id="file-input"
                  type="file"
                  hidden
                  accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  onChange={handleFileChange}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </>
  );
};

export default BusinessTin;
