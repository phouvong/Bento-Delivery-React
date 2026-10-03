import { t } from "i18next";
import BundleBogoModal from "./BundleBogoModal";

const toRows = (items, isFree) =>
  (items || []).map((item) => ({
    key: item?.item_id,
    name: item?.item?.name,
    image: item?.item?.image_full_url,
    price: item?.price,
    quantity: item?.quantity,
    variationText: item?.variationText,
    addOnSummary: item?.addOnSummary,
    isFree,
  }));

const BogoOrderDetailsViewModal = ({ open, onClose, data }) => {
  if (!data) return null;
  const { bogoDetails, quantity } = data;

  return (
    <BundleBogoModal
      {...{
        open,
        onClose,
        quantity,
        title: bogoDetails?.offer_title,
        badgeLabel: t("Bogo"),
        sections: [
          {
            title: t("Buying Item"),
            rows: toRows(bogoDetails?.buy_items, false),
          },
          {
            title: t("Free Item"),
            rows: toRows(bogoDetails?.free_items, true),
          },
        ],
        unitLabel: t("per bogo"),
        unitPrice: bogoDetails?.final_price ?? bogoDetails?.bundle_price ?? 0,
      }}
    />
  );
};

export default BogoOrderDetailsViewModal;
