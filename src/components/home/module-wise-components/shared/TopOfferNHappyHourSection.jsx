import HappyHourSection from "components/happy-hour/HappyHourSection";
import useTopOfferActive from "api-manage/hooks/custom-hooks/useTopOfferActive";
import TopOfferNotifyBanner from "../food/TopOfferNotifyBanner";

const TopOfferNHappyHourSection = (props) => {
  const topOfferActive = useTopOfferActive();

  return (
    <HappyHourSection
      leftActive={topOfferActive}
      leftContent={<TopOfferNotifyBanner {...props} />}
    />
  );
};

export default TopOfferNHappyHourSection;
