/**
 * @typedef {Object} PopularService
 * @property {number|string} id - Service unique id
 * @property {string} name - Service display name
 * @property {string} [image_full_url] - Service image URL
 * @property {string} [store_name] - Service provider/store name
 * @property {number} [avg_rating] - Average rating
 * @property {number} [price] - Price of the service
 * @property {number} [discount] - Discount amount or percent
 * @property {string} [discount_type] - Type of discount (e.g. "percent", "amount")
 * @property {string} [module_type] - Module type ("service")
 * @property {boolean} [verified_seller] - Verified store status
 * @property {Object} [store] - Service provider/store details
 * @property {string} [store.logo_full_url] - Store logo URL
 * @property {boolean} [store.verified_seller] - Verified seller status
 */

/**
 * Normalize raw API response into the shape PopularServices expects.
 *
 * @param {Object} raw - Raw service object from API
 * @returns {PopularService}
 */
export const normalizePopularService = (raw = {}) => ({
  id: raw.id,
  slug: raw.slug || "",
  name: raw.name || "",
  image_full_url: raw.thumbnail_full_url || raw.image_full_url || raw.image || "",
  thumbnail_full_url: raw.thumbnail_full_url || raw.image_full_url || raw.image || "",
  store_id: raw.store_id ?? null,
  store_name: raw.store_name || raw.store?.name || "",
  avg_rating: raw.avg_rating ?? raw.rating ?? 0,
  rating_count: raw.rating_count ?? 0,
  price: raw.base_price ?? raw.price ?? 0,
  base_price: raw.base_price ?? raw.price ?? 0,
  discount: raw.discount ?? 0,
  discount_type: raw.discount_type || "percent",
  variations: raw.variations ?? [],
  module_type: raw.module_type || "service",
  verified_seller: raw.verified_seller ?? raw.store?.verified_seller ?? false,
  store: {
    logo_full_url: raw.store?.logo_full_url || raw.store?.logo || "",
    verified_seller: raw.store?.verified_seller ?? raw.verified_seller ?? false,
  },
});

/**
 * Static demo data used while the API isn't wired up or returning products.
 * @type {PopularService[]}
 */
export const DEMO_SERVICES = [
  {
    id: "service-1",
    slug: "home-deep-cleaning-service",
    name: "Home Deep Cleaning Service",
    image_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "Super Cleaners",
    avg_rating: 4.8,
    rating_count: 120,
    price: 120, base_price: 120,
    discount: 10,
    discount_type: "percent",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
      verified_seller: true,
    },
  },
  {
    id: "service-2",
    slug: "ac-repair-maintenance",
    name: "AC Repair & Maintenance",
    image_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "CoolAir Techs",
    avg_rating: 4.9,
    rating_count: 85,
    price: 85, base_price: 85,
    discount: 0,
    discount_type: "amount",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
      verified_seller: true,
    },
  },
  {
    id: "service-3",
    slug: "emergency-electrical-work",
    name: "Emergency Electrical Work",
    image_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "BrightVolt Solutions",
    avg_rating: 4.7,
    rating_count: 63,
    price: 95, base_price: 95,
    discount: 15,
    discount_type: "percent",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
      verified_seller: false,
    },
  },
  {
    id: "service-4",
    slug: "professional-plumbing-service",
    name: "Professional Plumbing Service",
    image_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "PlumbFlow Experts",
    avg_rating: 4.6,
    rating_count: 97,
    price: 110, base_price: 110,
    discount: 15,
    discount_type: "amount",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
      verified_seller: true,
    },
  },
  {
    id: "service-5",
    slug: "home-painting-wallpapering",
    name: "Home Painting & Wallpapering",
    image_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "WallArt Decor",
    avg_rating: 4.5,
    rating_count: 42,
    price: 350, base_price: 350,
    discount: 50,
    discount_type: "amount",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      verified_seller: false,
    },
  },
  {
    id: "service-6",
    slug: "emergency-electrical-work-2",
    name: "Emergency Electrical Work",
    image_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "BrightVolt Solutions",
    avg_rating: 4.7,
    rating_count: 63,
    price: 95, base_price: 95,
    discount: 15,
    discount_type: "percent",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
      verified_seller: false,
    },
  },
  {
    id: "service-7",
    slug: "professional-plumbing-service-2",
    name: "Professional Plumbing Service",
    image_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "PlumbFlow Experts",
    avg_rating: 4.6,
    rating_count: 97,
    price: 110, base_price: 110,
    discount: 15,
    discount_type: "amount",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
      verified_seller: true,
    },
  },
  {
    id: "service-8",
    slug: "home-painting-wallpapering-2",
    name: "Home Painting & Wallpapering",
    image_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
    store_id: null,
    store_name: "WallArt Decor",
    avg_rating: 4.5,
    rating_count: 42,
    price: 350, base_price: 350,
    discount: 50,
    discount_type: "amount",
    variations: [],
    module_type: "service",
    store: {
      logo_full_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      verified_seller: false,
    },
  },
];
