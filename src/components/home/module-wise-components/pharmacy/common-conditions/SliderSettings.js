import { Next, Prev } from "../../../popular-items-nearby/SliderSettings";
import { WhiteNext, WhitePrev } from "../../../visit-again/SliderSettings";

export const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  swipeToSlide: true,
  slidesPerRow: 1,
  rows: 2,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1450,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        swipeToSlide: true,
        rows: 4,
      },
    },
    {
      breakpoint: 1250,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        swipeToSlide: true,
        rows: 2,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        rows: 2,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        swipeToSlide: true,
        rows: 2,
        dots: false,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        rows: 2,
        dots: false,
      },
    },
    {
      breakpoint: 360,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        rows: 4,
        dots: false,
      },
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        rows: 5,
        dots: false,
      },
    },
  ],
  prevArrow: <Prev />,
  nextArrow: <Next />,
};
