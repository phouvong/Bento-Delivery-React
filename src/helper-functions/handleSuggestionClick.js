import { handleProductRedirect } from "./handleProductRedirect";
import { handleStoreRedirect } from "./handleStoreRedirect";
import { openSearchProductModal } from "redux/slices/searchProductModal";
import { getCurrentModuleType } from "./getCurrentModuleType";

export const handleSuggestionItemClick = (
  item,
  router,
  dispatch,
  closeSuggestion,
) => {
  closeSuggestion?.();

  const moduleType = item?.module_type ?? getCurrentModuleType();
  if (moduleType === "ecommerce") {
    handleProductRedirect(item, router);
    return;
  }

  if (!item?.id) return;
  dispatch(openSearchProductModal(item));
};

export const handleSuggestionStoreClick = (store, router, closeSuggestion) => {
  closeSuggestion?.();
  handleStoreRedirect(store, router);
};
