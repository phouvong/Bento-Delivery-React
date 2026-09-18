export const normalizeCartGroups = (groups = []) => {
  if (!Array.isArray(groups)) return [];

  return groups
    .map((g) => {
      const store = g?.store ?? g?.restaurant ?? g?.provider ?? null;
      if (!store?.id) return null;

      const rawCarts = Array.isArray(g?.carts)
        ? g.carts
        : Array.isArray(g?.items)
        ? g.items
        : [];

      const carts = rawCarts.map((row) => {
        const item = row?.item ?? row?.service ?? row?.product ?? {};
        const storeId =
          row?.store_id ?? row?.provider_id ?? item?.store_id ?? store?.id;
        const moduleType =
          row?.module_type ?? item?.module_type ?? store?.module_type ?? null;

        return { ...row, item, store_id: storeId, module_type: moduleType };
      });

      return { store, carts };
    })
    .filter(Boolean);
};

export const flattenNormalizedGroups = (
  normalizedGroups = [],
  currentModuleType,
) => {
  if (!Array.isArray(normalizedGroups)) return [];

  return normalizedGroups.flatMap(({ store, carts }) =>
    carts.map((row) => {
      const product = row?.item ?? {};
      const quantity = row?.quantity ?? 1;
      const isService = currentModuleType
        ? currentModuleType === "service"
        : (row?.module_type ?? product?.module_type) === "service";

      if (isService) {
        // For service variation items, use the variation's own price/discount.
        // For non-variation service items, use the base service price/discount.
        // This avoids double-discounting (backend row.price is already discounted).
        const variation = row?.variation ?? null;
        const hasVariation = !!(variation?.variant_key || variation?.name);
        const serviceUnitPrice = hasVariation
          ? variation.price ?? 0
          : product?.base_price ?? 0;
        const serviceDiscount = hasVariation
          ? variation.discount ?? 0
          : product?.discount ?? 0;
        const serviceDiscountType = hasVariation
          ? variation.discount_type ?? product?.discount_type
          : product?.discount_type;

        return {
          ...product,
          image_full_url:
            product?.image_full_url ?? product?.thumbnail_full_url,
          price: serviceUnitPrice,
          totalPrice: serviceUnitPrice * quantity,
          discount: serviceDiscount,
          discount_type: serviceDiscountType,
          cartItemId: row?.id,
          quantity,
          itemBasePrice: product?.base_price ?? row?.price,
          selectedAddons: product?.addons ?? [],
          food_variations: product?.food_variations ?? [],
          selectedOption: row?.variation,
          store_id: row?.store_id ?? store?.id,
          module_type: row?.module_type ?? product?.module_type,
        };
      }

      const totalPrice = row?.price ?? product?.price ?? 0;
      return {
        ...product,
        image_full_url: product?.image_full_url ?? product?.thumbnail_full_url,
        price: product?.price ?? 0,
        cartItemId: row?.id,
        quantity,
        totalPrice,
        itemBasePrice: product?.price,
        selectedAddons: product?.addons ?? [],
        food_variations: product?.food_variations ?? [],
        selectedOption: row?.variation,
        store_id: row?.store_id ?? store?.id,
        module_type: row?.module_type ?? product?.module_type,
      };
    }),
  );
};
