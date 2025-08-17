import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {alpha, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import { t } from "i18next";
import moment from "moment";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from "components/campaigns-details/CampaignIcon";

const MiddleSection = ({ campaignsDetails, image }) => {
  const theme = useTheme();
  return (
    <CustomStackFullWidth spacing={1} >
      <Stack gap="40ppx" direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems='center' spacing={2} width="100%">
        <Stack justifyContent="center" alignItems="flex-start" width="100%">
          <Typography fontWeight="700" variant="h6">
            {campaignsDetails?.title}
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.neutral[400]}>
            {campaignsDetails?.description}
          </Typography>
        </Stack>
        <Stack sx={{backgroundColor:theme=>alpha(theme.palette.neutral[400],.2),
          padding:"10px 12px",
          borderRadius:"8px",
          maxWidth:"600px"
        }}
               justifyContent={{xs:"center",md:"space-between"}}
               alignItems="center"
               direction={{xs:"column",md:"row"}} width="100%" gap="20px">
         <Stack direction="row" gap="8px" alignItems="center">
           <CampaignIcon/>
           <Typography fontWeight="500">
             {t("Campaign Duration")}
           </Typography>
         </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            gap={1} // 8px (MUI spacing system)
            width={{ xs: '100%', md: 'auto' }}
            sx={{
              bgcolor: (theme) => theme.palette.neutral[100],
              borderRadius: 1, // 5px ≈ 1 spacing unit
              px: 1.25, // padding left & right (10px)
              py: 1,    // padding top & bottom (8px)
            }}
          >
            <Typography sx={{borderRight: { xs: 'none', sm: '1px solid' },     // No right border on mobile
              borderBottom: { xs: '1px solid', sm: 'none' },     // Add bottom border on mobile
              paddingRight: { xs: 0, sm: '8px' },
              paddingBottom: { xs: '8px', sm: 0 }}}>
              {campaignsDetails?.available_date_starts
                ? moment(
                  campaignsDetails.available_date_starts.replace(/(\d+)(st|nd|rd|th)/, '$1')
                ).format('MMM D, YYYY')
                : 'N/A'}
              {' - '}
              {campaignsDetails?.available_date_ends
                ? moment(
                  campaignsDetails.available_date_ends.replace(/(\d+)(st|nd|rd|th)/, '$1')
                ).format('MMM D, YYYY')
                : 'N/A'}
            </Typography>
            <Typography> {moment(campaignsDetails?.start_time, ["HH:mm"]).format(
              "hh:mm a"
            )}{" "}
              -{" "}
              {moment(campaignsDetails?.end_time, ["HH:mm"]).format("hh:mm a")}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </CustomStackFullWidth>
  );
};

export default MiddleSection;
