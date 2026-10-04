import React from 'react';
import {CustomStackFullWidth, SliderCustom} from "styled-components/CustomStyles.style";
import CustomModal from "components/modal";
import {Button, IconButton, TextField, Typography, useMediaQuery} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import {Stack} from "@mui/system";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import {
  EmailIcon,
  EmailShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'
import Slider from "react-slick";
import {useTheme} from "@mui/styles";
import {useTranslation} from "react-i18next";
import {t} from "i18next";
import {shareSettings} from "components/store-details/shareSettings";

const StoreShare = (props) => {
  const {openShareModal,setOpenShareModal,handleCopy}=props
  const theme=useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const currentRoute =
    typeof window !== 'undefined' ? window.location.href : ''
  const size = isSmall ? 30 : 40
  const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''
  return (
    <CustomModal
      openModal={openShareModal}
      setOpenModal={setOpenShareModal}
      handleClose={() => setOpenShareModal(false)}
      maxWidth="550px"
    >
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ position: 'relative' }}
      >
        <IconButton
          onClick={() => setOpenShareModal(false)}
          sx={{
            zIndex: '99',
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: (theme) =>
              theme.palette.neutral[100],
            borderRadius: '50%',
            [theme.breakpoints.down('md')]: {
              top: 10,
              right: 5,
            },
          }}
        >
          <CloseIcon
            sx={{ fontSize: '24px', fontWeight: '500' }}
          />
        </IconButton>
      </CustomStackFullWidth>
      <CustomStackFullWidth padding="20px">
        <Typography
          fontWeight={600}
          fontSize="20px"
          color={theme.palette.neutral[1000]}
        >
          {t('Share')}
        </Typography>
        <Stack padding="10px" flexDirection="row" gap="10px">
          <TextField
            fullWidth
            variant="outlined"
            value={currentRoute}
            fontWeight={400}
            InputProps={{
              style: {
                height: '40px !important', // Adjust the height as needed
                fontSize: '12px',
              },
              readOnly: true,
            }}
          />
          <Button
            sx={{ minWidth: '45px', padding: '8px 10px' }}
            variant="contained"
            onClick={() => handleCopy(currentRoute)}
          >
            <ContentCopyIcon />
          </Button>
        </Stack>
        <Stack marginTop=".5rem">
          <SliderCustom nopadding="true">
            <Slider {...shareSettings}>
              <FacebookMessengerShareButton
                url={currentRoute}
                appId={FACEBOOK_APP_ID}
              >
                <FacebookMessengerIcon
                  size={size ? size : 40}
                  round
                />
              </FacebookMessengerShareButton>
              <TwitterShareButton url={currentRoute}>
                <TwitterIcon
                  size={size ? size : 40}
                  round
                />
              </TwitterShareButton>
              <WhatsappShareButton
                url={currentRoute}
                separator=":: "
              >
                <WhatsappIcon
                  size={size ? size : 40}
                  round
                />
              </WhatsappShareButton>
              <LinkedinShareButton
                url={currentRoute}
                source={currentRoute}
              >
                <LinkedinIcon
                  size={size ? size : 40}
                  round
                />
              </LinkedinShareButton>
              <TelegramShareButton url={currentRoute}>
                <TelegramIcon
                  size={size ? size : 40}
                  round
                />
              </TelegramShareButton>
              <EmailShareButton url={currentRoute}>
                <EmailIcon size={size ? size : 40} round />
              </EmailShareButton>
              <RedditShareButton
                url={currentRoute}
                windowWidth={660}
                windowHeight={460}
              >
                <RedditIcon size={size ? size : 40} round />
              </RedditShareButton>
              <TumblrShareButton
                url={String(window.location.origin)}
              >
                <TumblrIcon size={size ? size : 40} round />
              </TumblrShareButton>
              <LivejournalShareButton url={currentRoute}>
                <LivejournalIcon
                  size={size ? size : 40}
                  round
                />
              </LivejournalShareButton>
              <LineShareButton url={currentRoute}>
                <LineIcon size={size ? size : 40} round />
              </LineShareButton>
            </Slider>
          </SliderCustom>
        </Stack>
      </CustomStackFullWidth>
    </CustomModal>
  );
};

export default StoreShare;