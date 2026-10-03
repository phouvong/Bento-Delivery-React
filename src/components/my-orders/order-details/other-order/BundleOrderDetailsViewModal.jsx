import { t } from "i18next";
import BundleBogoModal from "./BundleBogoModal";

const BundleOrderDetailsViewModal = ({ open, onClose, data }) => {
  if (!data) return null;
  const { bundleDetails, quantity } = data;
  const rows = (bundleDetails?.items || []).map((item) => ({
    key: item?.item_id,
    name: item?.name,
    image: item?.image_full_url,
    price: item?.price,
    quantity: item?.quantity,
    variationText: item?.variationText,
    addOnSummary: item?.addOnSummary,
  }));

  return (
    <BundleBogoModal
      {...{
        open,
        onClose,
        quantity,
        title: bundleDetails?.name,
        badgeLabel: t("Bundle"),
        sections: [{ rows }],
        unitLabel: t("per bundle"),
        unitPrice: bundleDetails?.base_price ?? 0,
      }}
    />
  );
};

export default BundleOrderDetailsViewModal;
