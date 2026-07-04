/**
 * Shared data shape consumed by `LastOrdersSection` and `CartStoreCard`.
 * Every module (food, rental, ecommerce, pharmacy, parcel...) maps its own
 * API response into this shape via a normalizer, so the UI stays unified.
 *
 * @typedef {Object} LastOrderStore
 * @property {number|string} id
 * @property {string} name
 * @property {string} [logo_full_url]
 * @property {string} [slug]
 *
 * @typedef {Object} LastOrderItem
 * @property {string} [image_full_url] - URL for the item avatar shown in the
 *   stacked avatars row.
 *
 * @typedef {Object} LastOrder
 * @property {number|string} id - Unique order id
 * @property {LastOrderStore} store - Store/provider that fulfilled the order
 * @property {LastOrderItem[]} items - Items in the order (used for avatars)
 * @property {number} totalPrice - Total amount paid
 * @property {string} placedDate - Human-readable placed date
 *   (e.g. "20 Mar, 2026")
 * @property {string} [module] - Originating module name, useful for routing
 *   on reorder click (e.g. "food", "rental", "ecommerce")
 */

const isImg = (url) => typeof url === "string" && url.length > 0;

const formatDate = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string") {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return raw;
  }
  return new Date(raw).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const pickStore = (raw, paths) => {
  for (const path of paths) {
    const v = path.split(".").reduce((acc, key) => acc?.[key], raw);
    if (v) return v;
  }
  return undefined;
};

/**
 * Food-module order normalizer.
 * Backend keys: `restaurant`, `details[].food.image_full_url`, `order_amount`,
 * `created_at` / `order_date`.
 *
 * @param {Object} raw
 * @returns {LastOrder}
 */
export const normalizeFoodOrder = (raw = {}) => {
  const store = pickStore(raw, ["store", "restaurant"]) || {};
  const items = Array.isArray(raw.details)
    ? raw.details
        .map((d) => ({
          image_full_url:
            d?.food?.image_full_url ||
            d?.item?.image_full_url ||
            d?.image_full_url,
        }))
        .filter((i) => isImg(i.image_full_url))
    : Array.isArray(raw.items)
    ? raw.items
    : [];
  return {
    id: raw.id,
    store: {
      id: store.id,
      name: store.name,
      logo_full_url: store.logo_full_url || store.logo,
      slug: store.slug,
    },
    items,
    totalPrice: raw.totalPrice ?? raw.order_amount ?? raw.total_amount ?? 0,
    placedDate: raw.placedDate || formatDate(raw.created_at || raw.order_date),
    module: "food",
  };
};

/**
 * Rental-module order/trip normalizer.
 * Backend keys: `provider` instead of `store`, `vehicles[].thumbnail_full_url`,
 * `total_amount`, `pickup_time` / `created_at`. The `placedDate` field is
 * rendered as `"<date> | <duration>"` (e.g. "16 Aug 2025 | 3hr") to match the
 * rental "Your Last Trips" design.
 *
 * @param {Object} raw
 * @returns {LastOrder}
 */
export const normalizeRentalOrder = (raw = {}) => {
  const provider =
    pickStore(raw, ["store", "provider", "rental_provider"]) || {};
  const vehicleList =
    raw.vehicles || raw.cart || raw.items || raw.rental_items || [];
  const items = (Array.isArray(vehicleList) ? vehicleList : [])
    .map((v) => ({
      image_full_url:
        v?.vehicle?.thumbnail_full_url ||
        v?.thumbnail_full_url ||
        v?.image_full_url,
    }))
    .filter((i) => isImg(i.image_full_url));

  const date = formatDate(raw.pickup_time || raw.created_at || raw.trip_date);
  const duration =
    raw.duration ||
    (raw.estimated_hours
      ? `${raw.estimated_hours}hr`
      : raw.estimated_days
      ? `${raw.estimated_days} ${raw.estimated_days > 1 ? "nights" : "night"}`
      : "");
  const placedDate =
    raw.placedDate || [date, duration].filter(Boolean).join(" | ");

  return {
    id: raw.id,
    store: {
      id: provider.id,
      name: provider.name,
      logo_full_url:
        provider.logo_full_url || provider.image_full_url || provider.logo,
      slug: provider.slug,
    },
    items,
    totalPrice: raw.totalPrice ?? raw.total_amount ?? raw.order_amount ?? 0,
    placedDate,
    module: "rental",
  };
};

/**
 * Ecommerce-module order normalizer.
 * Backend keys: `store`, `details[].product.image_full_url`, `order_amount`.
 *
 * @param {Object} raw
 * @returns {LastOrder}
 */
export const normalizeEcommerceOrder = (raw = {}) => {
  const store = pickStore(raw, ["store", "shop"]) || {};
  const items = Array.isArray(raw.details)
    ? raw.details
        .map((d) => ({
          image_full_url:
            d?.product?.image_full_url ||
            d?.item?.image_full_url ||
            d?.image_full_url,
        }))
        .filter((i) => isImg(i.image_full_url))
    : [];
  return {
    id: raw.id,
    store: {
      id: store.id,
      name: store.name,
      logo_full_url: store.logo_full_url || store.logo,
      slug: store.slug,
    },
    items,
    totalPrice: raw.totalPrice ?? raw.order_amount ?? raw.total_amount ?? 0,
    placedDate: raw.placedDate || formatDate(raw.created_at || raw.order_date),
    module: "ecommerce",
  };
};

/**
 * Generic normalizer for modules that don't fit any of the above. Pass in
 * an explicit field map.
 *
 * @param {Object} raw
 * @param {{ id?: string, storePath?: string, itemsPath?: string,
 *   itemImagePath?: string, totalPath?: string, datePath?: string,
 *   module?: string }} opts
 * @returns {LastOrder}
 */
export const normalizeOrder = (raw = {}, opts = {}) => {
  const {
    storePath = "store",
    itemsPath = "items",
    itemImagePath = "image_full_url",
    totalPath = "total_amount",
    datePath = "created_at",
    module: moduleName = "generic",
  } = opts;
  const store = storePath.split(".").reduce((a, k) => a?.[k], raw) || {};
  const list = itemsPath.split(".").reduce((a, k) => a?.[k], raw) || [];
  const items = (Array.isArray(list) ? list : [])
    .map(
      (it) =>
        itemImagePath.split(".").reduce((a, k) => a?.[k], it) && {
          image_full_url: itemImagePath.split(".").reduce((a, k) => a?.[k], it),
        }
    )
    .filter(Boolean);
  return {
    id: raw.id,
    store: {
      id: store.id,
      name: store.name,
      logo_full_url: store.logo_full_url || store.logo,
      slug: store.slug,
    },
    items,
    totalPrice: totalPath.split(".").reduce((a, k) => a?.[k], raw) ?? 0,
    placedDate: formatDate(datePath.split(".").reduce((a, k) => a?.[k], raw)),
    module: moduleName,
  };
};

// ─── Demo data ─────────────────────────────────────────────────────────────

const RENTAL_LOGO =
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=80&q=60";
const RENTAL_VEH_1 =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=60";
const RENTAL_VEH_2 =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=200&q=60";
const RENTAL_VEH_3 =
  "https://images.unsplash.com/photo-1592805144716-feeccccef5ac?auto=format&fit=crop&w=200&q=60";
const RENTAL_VEH_4 =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=200&q=60";

/**
 * Demo rental "Your Last Trips" data — already in normalized `LastOrder`
 * shape, so it can be passed straight to `<LastOrdersSection orders={...} />`.
 * Replace with `data?.trips?.map(normalizeRentalOrder)` once the API is wired.
 * @type {LastOrder[]}
 */
export const DEMO_RENTAL_LAST_TRIPS = [
  {
    id: "rt1",
    store: {
      id: "p1",
      name: "Car Rental Worldwide",
      logo_full_url: RENTAL_LOGO,
    },
    items: [{ image_full_url: RENTAL_VEH_1 }, { image_full_url: RENTAL_VEH_2 }],
    totalPrice: 20.32,
    placedDate: "16 Aug 2025 | 3hr",
    module: "rental",
  },
  {
    id: "rt2",
    store: { id: "p2", name: "Rental Car", logo_full_url: RENTAL_LOGO },
    items: [
      { image_full_url: RENTAL_VEH_2 },
      { image_full_url: RENTAL_VEH_3 },
      { image_full_url: RENTAL_VEH_4 },
      { image_full_url: RENTAL_VEH_1 },
    ],
    totalPrice: 150.75,
    placedDate: "18 Aug 2025 | 2 nights",
    module: "rental",
  },
  {
    id: "rt3",
    store: { id: "p3", name: "Car Rent Service", logo_full_url: RENTAL_LOGO },
    items: [{ image_full_url: RENTAL_VEH_3 }],
    totalPrice: 20.32,
    placedDate: "16 Aug 2025 | 3hr",
    module: "rental",
  },
  {
    id: "rt4",
    store: { id: "p4", name: "Tokyo Car Rent", logo_full_url: RENTAL_LOGO },
    items: [
      { image_full_url: RENTAL_VEH_4 },
      { image_full_url: RENTAL_VEH_1 },
      { image_full_url: RENTAL_VEH_2 },
    ],
    totalPrice: 900.0,
    placedDate: "20 Aug 2025 | 12hr",
    module: "rental",
  },
  {
    id: "rt5",
    store: { id: "p5", name: "Tokyo City Rent", logo_full_url: RENTAL_LOGO },
    items: [
      { image_full_url: RENTAL_VEH_1 },
      { image_full_url: RENTAL_VEH_3 },
      { image_full_url: RENTAL_VEH_4 },
    ],
    totalPrice: 450.5,
    placedDate: "20 Aug 2025 | 8hr",
    module: "rental",
  },
];
