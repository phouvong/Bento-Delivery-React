import React from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

import CustomDialogConfirm from "components/custom-dialog/confirm/CustomDialogConfirm";

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);
const AuthModal = dynamic(() => import("components/auth/AuthModal"));
const GuestCheckoutModal = dynamic(() =>
  import("components/cards/GuestCheckoutModal")
);

const CartAuxModals = ({
  clearOpen,
  setClearOpen,
  handleClearCart,
  clearLoading,
  guestOpen,
  setGuestOpen,
  handleGuestRoute,
  modalFor,
  setModalFor,
  authOpen,
  setAuthOpen,
  proFeatureEnabled,
  proModalOpen,
  setProModalOpen,
  handleProSubscribe,
  subscribeProMutation,
  proPaymentOpen,
  setProPaymentOpen,
  proSelectedPlan,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to clear cart?")}
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onSuccess={handleClearCart}
        isLoading={clearLoading}
      />

      {guestOpen && (
        <GuestCheckoutModal
          open={guestOpen}
          setOpen={setGuestOpen}
          setSideDrawerOpen={() => {}}
          handleRoute={handleGuestRoute}
          setModalFor={setModalFor}
          setOpenAuth={setAuthOpen}
        />
      )}
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={authOpen}
        handleClose={() => setAuthOpen(false)}
      />

      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </>
  );
};

export default CartAuxModals;
