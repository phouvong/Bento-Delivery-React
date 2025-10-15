import { Box } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import styled from '@emotion/styled'
import {CustomIconButton} from "styled-components/CustomStyles.style";

export const LeftArrowStyle = styled(Box)(
  ({ theme, language_direction, left, top }) => ({
    zIndex: '1',
    top: top ? top : '20%',
    padding: '5px',
    position: 'absolute',
    background: theme.palette.neutral[100],
    borderRadius: '50%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    right: language_direction === 'rtl' && '0px',
    left: `${language_direction === 'rtl' ? 'unset' : '-2px'}`,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  })
)
export const RightArrowStyle = styled(Box)(
  ({ theme, language_direction, right, top }) => ({
    zIndex: '1',
    position: 'absolute',
    padding: '5px',
    top: top ? top : '20%',
    background: theme.palette.neutral[100],
    borderRadius: '50%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    right: `${language_direction === 'rtl' ? 'unset' : '-2px'}`,
    left: language_direction === 'rtl' ? '0px' : 'unset',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  })
)

const PrevArrow = ({ onClick, className }) => {
  return (
    <LeftArrowStyle
      onClick={onClick}
      top="7%"
      sx={{
        display: className?.includes('slick-disabled') && 'none',
        left: '-12px !important',
      }}
    >
      <CustomIconButton>
        <ArrowBackIosNewIcon
          style={{
            width: '23px',
            height: '20px',
          }}
        />
      </CustomIconButton>
    </LeftArrowStyle>
  )
}
const NextArrow = ({ onClick, className }) => {
  return (
    <RightArrowStyle
      onClick={onClick}
      top="7%"
      sx={{
        right: '-12px !important',
        display: className?.includes('slick-disabled') && 'none',
      }}
    >
      <CustomIconButton>
        <ArrowForwardIosIcon
          style={{
            width: '23px',
            height: '20px',
          }}
        />
      </CustomIconButton>
    </RightArrowStyle>
  )
}

export const shareSettings = {
  dots: false,
  infinite: false,
  slidesToShow: 9,
  slidesToScroll: 1,
  nextArrow: <NextArrow displayNoneOnMobile />,
  prevArrow: <PrevArrow displayNoneOnMobile />,

  responsive: [
    {
      breakpoint: 1450,
      settings: {
        slidesToShow: 8,
        slidesToScroll: 3,
        infinite: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 2,
        infinite: false,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
  ],
}