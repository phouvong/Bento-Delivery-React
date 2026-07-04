import { useState } from "react";
import { useSelector } from "react-redux";
import ModuleTabbedLayout from "./ModuleTabbedLayout";
import Coupons from "../coupons";

/**
 * Coupons page with a module tab row on top (same UI as the Orders page).
 * Selecting a module overrides the `moduleId` request header so the coupon
 * list is fetched per module rather than for the globally active module.
 */
const CouponsTabbedPage = ({ configData }) => {
  const { modules } = useSelector((state) => state.configData);
  const [activeModuleId, setActiveModuleId] = useState(
    () => modules?.[0]?.id ?? null,
  );

  const activeModule =
    modules?.find((m) => m.id === activeModuleId) ?? modules?.[0];

  const onModuleChange = (module) => {
    setActiveModuleId(module.id);
  };

  return (
    <ModuleTabbedLayout
      activeModuleId={activeModuleId}
      onModuleChange={onModuleChange}
      mobileBareContent
    >
      <Coupons
        key={activeModule?.id}
        moduleId={activeModule?.id}
        moduleType={activeModule?.module_type}
        configData={configData}
      />
    </ModuleTabbedLayout>
  );
};

export default CouponsTabbedPage;
