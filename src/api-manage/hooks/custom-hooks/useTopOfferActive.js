import useGetTopOffer from "../react-query/useGetTopOffer";

// Keep this condition in step with the early return at the top of
// components/home/module-wise-components/food/TopOfferNotifyBanner.js.
const useTopOfferActive = () => {
  const { data } = useGetTopOffer();
  return Boolean(data) && data?.discount > 0;
};

export default useTopOfferActive;
