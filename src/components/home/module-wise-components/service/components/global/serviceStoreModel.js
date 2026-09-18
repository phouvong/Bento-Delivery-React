
/**
 * @typedef {Object} ServiceStoreProduct
 * @property {number|string} id - Product unique id
 * @property {string} name - Product display name
 * @property {string} [image_full_url] - Product cover photo/image URL
 * @property {string} [store_name] - Associated service provider / store name
 * @property {number} [avg_rating] - Average rating
 * @property {number} [price] - Base price of the service/product
 * @property {number} [discount] - Discount amount or percent
 * @property {string} [discount_type] - Type of discount (e.g. "percent", "amount")
 * @property {string} [module_type] - Module type ("service")
 * @property {boolean} [verified_seller] - Verified store status
 * @property {Object} [store] - Associated store details
 * @property {string} [store.logo_full_url] - Associated store logo URL
 * @property {boolean} [store.free_delivery] - Free delivery status
 * @property {boolean} [store.verified_seller] - Verified seller status
 */

/**
 * Normalize raw API response or mock data into the shape NewProductCard expects.
 *
 * @param {Object} raw - Raw product/service object
 * @returns {ServiceStoreProduct}
 */
export const normalizeServiceStore = (raw = {}) => ({
  id: raw.id,
  name: raw.name || "",
  image_full_url: raw.thumbnail_full_url || raw.image_full_url || raw.image || "",
  thumbnail_full_url: raw.thumbnail_full_url || raw.image_full_url || raw.image || "",
  store_name: raw.store_name || raw.store?.name || "",
  avg_rating: raw.avg_rating ?? raw.rating ?? 0,
  price: raw.base_price ?? raw.price ?? 0,
  base_price: raw.base_price ?? raw.price ?? 0,
  discount: raw.discount ?? 0,
  discount_type: raw.discount_type || "percent",
  module_type: raw.module_type || "service",
  verified_seller: raw.verified_seller ?? raw.store?.verified_seller ?? false,
  store: {
    logo_full_url: raw.store?.logo_full_url || raw.store?.logo || "",
    free_delivery: raw.store?.free_delivery ?? false,
    verified_seller: raw.store?.verified_seller ?? raw.verified_seller ?? false,
  },
});

/**
 * Static mock data representing services/products grouped by explorer tabs.
 * @type {Object.<string, ServiceStoreProduct[]>}
 */
export const MOCK_SERVICES = {
  all: [
    {
      id: "service-1",
      name: "Home Deep Cleaning Service",
      image_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      store_name: "Super Cleaners Ltd.",
      avg_rating: 4.8,
      price: 120, base_price: 120,
      discount: 10,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-2",
      name: "AC Repair & Maintenance",
      image_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
      store_name: "CoolAir Techs",
      avg_rating: 4.9,
      price: 85, base_price: 85,
      discount: 0,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-3",
      name: "Emergency Electrical Work",
      image_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
      store_name: "BrightVolt Solutions",
      avg_rating: 4.7,
      price: 95, base_price: 95,
      discount: 15,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-4",
      name: "Professional Plumbing Service",
      image_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
      store_name: "PlumbFlow Experts",
      avg_rating: 4.6,
      price: 110, base_price: 110,
      discount: 15,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-5",
      name: "Home Painting & Wallpapering",
      image_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
      store_name: "WallArt Decor",
      avg_rating: 4.5,
      price: 350, base_price: 350,
      discount: 50,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-6",
      name: "Car Washing & Detailing",
      image_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600",
      store_name: "AutoSparkle Detailing",
      avg_rating: 4.8,
      price: 55, base_price: 55,
      discount: 5,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-7",
      name: "Appliance Repair & Setup",
      image_full_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600",
      store_name: "FixAll Appliances",
      avg_rating: 4.4,
      price: 75, base_price: 75,
      discount: 10,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-8",
      name: "Pest Control Treatment",
      image_full_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
      store_name: "PestGuard Solutions",
      avg_rating: 4.7,
      price: 150, base_price: 150,
      discount: 20,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    }
  ],
  newly_joined: [
    {
      id: "service-5",
      name: "Home Painting & Wallpapering",
      image_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
      store_name: "WallArt Decor",
      avg_rating: 4.5,
      price: 350, base_price: 350,
      discount: 50,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-6",
      name: "Car Washing & Detailing",
      image_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600",
      store_name: "AutoSparkle Detailing",
      avg_rating: 4.8,
      price: 55, base_price: 55,
      discount: 5,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
  ],
  nearby: [
    {
      id: "service-2",
      name: "AC Repair & Maintenance",
      image_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
      store_name: "CoolAir Techs",
      avg_rating: 4.9,
      price: 85, base_price: 85,
      discount: 0,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-3",
      name: "Emergency Electrical Work",
      image_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
      store_name: "BrightVolt Solutions",
      avg_rating: 4.7,
      price: 95, base_price: 95,
      discount: 15,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-4",
      name: "Professional Plumbing Service",
      image_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
      store_name: "PlumbFlow Experts",
      avg_rating: 4.6,
      price: 110, base_price: 110,
      discount: 15,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
  ],
  top_rated: [
    {
      id: "service-2",
      name: "AC Repair & Maintenance",
      image_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
      store_name: "CoolAir Techs",
      avg_rating: 4.9,
      price: 85, base_price: 85,
      discount: 0,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-1",
      name: "Home Deep Cleaning Service",
      image_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      store_name: "Super Cleaners Ltd.",
      avg_rating: 4.8,
      price: 120, base_price: 120,
      discount: 10,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-6",
      name: "Car Washing & Detailing",
      image_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1601362840469-81e4df86161a?auto=format&fit=crop&q=80&w=600",
      store_name: "AutoSparkle Detailing",
      avg_rating: 4.8,
      price: 55, base_price: 55,
      discount: 5,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
  ],
  popular: [
    {
      id: "service-1",
      name: "Home Deep Cleaning Service",
      image_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      store_name: "Super Cleaners Ltd.",
      avg_rating: 4.8,
      price: 120, base_price: 120,
      discount: 10,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
    {
      id: "service-3",
      name: "Emergency Electrical Work",
      image_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=600",
      store_name: "BrightVolt Solutions",
      avg_rating: 4.7,
      price: 95, base_price: 95,
      discount: 15,
      discount_type: "percent",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
        verified_seller: false,
      },
    },
    {
      id: "service-8",
      name: "Pest Control Treatment",
      image_full_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600", thumbnail_full_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
      store_name: "PestGuard Solutions",
      avg_rating: 4.7,
      price: 150, base_price: 150,
      discount: 20,
      discount_type: "amount",
      module_type: "service",
      store: {
        logo_full_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
        verified_seller: true,
      },
    },
  ]
};

export const MOCK_SERVICE_CATEGORIES = [
  {
    id: "service-cat-1",
    name: "Ac Repair",
    slug: "ac-repair",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=120",
    serviceTime: "40 mins",
    childes: [
      {
        id: "service-subcat-1-1",
        name: "Split AC Service",
        slug: "split-ac-service",
      },
      {
        id: "service-subcat-1-2",
        name: "Window AC Service",
        slug: "window-ac-service",
      },
      {
        id: "service-subcat-1-3",
        name: "Leakage Repair",
        slug: "leakage-repair",
      }
    ]
  },
  {
    id: "service-cat-2",
    name: "Appliance Repair",
    slug: "appliance-repair",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-2-1",
        name: "Washing Machine",
        slug: "washing-machine-repair",
      },
      {
        id: "service-subcat-2-2",
        name: "Refrigerator",
        slug: "refrigerator-repair",
      },
      {
        id: "service-subcat-2-3",
        name: "Microwave Oven",
        slug: "microwave-repair",
      }
    ]
  },
  {
    id: "service-cat-3",
    name: "Shifting",
    slug: "shifting",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-3-1",
        name: "Home Shifting",
        slug: "home-shifting",
      },
      {
        id: "service-subcat-3-2",
        name: "Office Shifting",
        slug: "office-shifting",
      }
    ]
  },
  {
    id: "service-cat-4",
    name: "Plumbing",
    slug: "plumbing",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-4-1",
        name: "Pipe Repair",
        slug: "pipe-repair",
      },
      {
        id: "service-subcat-4-2",
        name: "Basin & Sink Installation",
        slug: "basin-sink-installation",
      }
    ]
  },
  {
    id: "service-cat-5",
    name: "Painting & Renovation",
    slug: "painting-renovation",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-5-1",
        name: "Wall Painting",
        slug: "wall-painting",
      },
      {
        id: "service-subcat-5-2",
        name: "Wallpaper Installation",
        slug: "wallpaper-installation",
      }
    ]
  },
  {
    id: "service-cat-6",
    name: "House Cleaning",
    slug: "house-cleaning",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-6-1",
        name: "Deep Cleaning",
        slug: "deep-cleaning",
      },
      {
        id: "service-subcat-6-2",
        name: "Kitchen Cleaning",
        slug: "kitchen-cleaning",
      }
    ]
  },
  {
    id: "service-cat-7",
    name: "Gadget Repair",
    slug: "gadget-repair",
    image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-7-1",
        name: "Mobile Repair",
        slug: "mobile-repair",
      },
      {
        id: "service-subcat-7-2",
        name: "Laptop Repair",
        slug: "laptop-repair",
      }
    ]
  },
  {
    id: "service-cat-8",
    name: "Emergency Services",
    slug: "emergency",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=120",
    image_full_url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=120", thumbnail_full_url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=120",
    childes: [
      {
        id: "service-subcat-8-1",
        name: "Short Circuit Fix",
        slug: "short-circuit-fix",
      },
      {
        id: "service-subcat-8-2",
        name: "Emergency Gas Leak",
        slug: "emergency-gas-leak",
      }
    ]
  }
];

/**
 * Mock verified provider stores — shaped to match NewStoreCard's `item` prop.
 * Replace with real API response when backend is ready; shape must stay identical.
 */
export const MOCK_VERIFIED_PROVIDERS = [
  {
    id: "vp-1",
    name: "Repair Service, Shifting Service",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.5,
    rating_count: 150,
    category_names: ["Repair Service", "Shifting Service"],
    delivery_time: "In 20-30 min",
    distance: null,
    minimum_delivery_fee: 0,
    free_delivery: true,
    active: true,
    open: 1,
    is_new: true,
    ad: 1,
    discount: { discount: 10, discount_type: "percent" },
    slug: "repair-service-shifting-vp1",
    module_type: "service",
  },
  {
    id: "vp-2",
    name: "Moving Assistance, Cleaning Service",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.0,
    rating_count: 200,
    category_names: ["Moving Assistance", "Cleaning Service"],
    delivery_time: "In 30-40 min",
    distance: null,
    minimum_delivery_fee: 0,
    free_delivery: false,
    active: true,
    open: 1,
    is_new: false,
    ad: 0,
    discount: { discount: 5, discount_type: "percent" },
    slug: "moving-assistance-cleaning-vp2",
    module_type: "service",
  },
  {
    id: "vp-3",
    name: "Home Deep Cleaning",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.8,
    rating_count: 320,
    category_names: ["House Cleaning", "Deep Cleaning"],
    delivery_time: "In 40-60 min",
    distance: null,
    minimum_delivery_fee: 5,
    free_delivery: false,
    active: true,
    open: 1,
    is_new: false,
    ad: 0,
    discount: null,
    slug: "home-deep-cleaning-vp3",
    module_type: "service",
  },
  {
    id: "vp-4",
    name: "AC Repair & Maintenance",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.9,
    rating_count: 98,
    category_names: ["AC Repair", "Appliance Repair"],
    delivery_time: "In 15-25 min",
    distance: null,
    minimum_delivery_fee: 0,
    free_delivery: true,
    active: true,
    open: 1,
    is_new: true,
    ad: 0,
    discount: { discount: 15, discount_type: "percent" },
    slug: "ac-repair-maintenance-vp4",
    module_type: "service",
  },
  {
    id: "vp-5",
    name: "Professional Plumbing",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.6,
    rating_count: 75,
    category_names: ["Plumbing", "Emergency Services"],
    delivery_time: "In 25-35 min",
    distance: null,
    minimum_delivery_fee: 8,
    free_delivery: false,
    active: true,
    open: 1,
    is_new: false,
    ad: 0,
    discount: null,
    slug: "professional-plumbing-vp5",
    module_type: "service",
  },
  {
    id: "vp-6",
    name: "Gadget Repair Experts",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80&w=600",
    verified_seller: 1,
    avg_rating: 4.7,
    rating_count: 210,
    category_names: ["Gadget Repair", "Mobile Repair"],
    delivery_time: "In 10-20 min",
    distance: null,
    minimum_delivery_fee: 0,
    free_delivery: true,
    active: true,
    open: 1,
    is_new: false,
    ad: 0,
    discount: { discount: 20, discount_type: "percent" },
    slug: "gadget-repair-experts-vp6",
    module_type: "service",
  },
];

export const MOCK_SERVICE_FEATURED_STORES = [
  {
    "id": 21,
    "name": "KK Fashion",
    "phone": "010000000011",
    "email": "ecommerce.store6@demo.com",
    "logo": "2024-10-29-67205ff131473.png",
    "latitude": "23.565611969144307",
    "longitude": "90.38765689543095",
    "address": "House: 00, Road: 00, City-0000, Country",
    "footer_text": null,
    "minimum_order": 66,
    "comission": null,
    "schedule_order": false,
    "status": 1,
    "vendor_id": 21,
    "created_at": "2022-03-22T06:03:20.000000Z",
    "updated_at": "2026-04-22T11:15:51.000000Z",
    "free_delivery": false,
    "cover_photo": "2024-10-29-67205ff132dba.png",
    "delivery": true,
    "take_away": true,
    "item_section": true,
    "tax": 15,
    "zone_id": 1,
    "reviews_section": true,
    "active": true,
    "off_day": " ",
    "self_delivery_system": 1,
    "pos_system": false,
    "minimum_shipping_charge": 50,
    "delivery_time": "3-5 days",
    "veg": 0,
    "non_veg": 1,
    "order_count": 5,
    "total_order": 71,
    "module_id": 3,
    "order_place_to_schedule_interval": 0,
    "featured": 1,
    "per_km_shipping_charge": 0,
    "prescription_order": false,
    "slug": "kr-fashion21",
    "maximum_shipping_charge": 51,
    "cutlery": false,
    "meta_title": "1995 \u2013 Our Founder Mr. Sanjaybdhffh",
    "meta_description": "Kumar started Garments dhhdfhManufacturing and Export Business with humble bdhhdhd",
    "meta_image": null,
    "meta_data": {
      "meta_index": "1",
      "meta_no_follow": "nofollow",
      "meta_no_archive": "noarchive",
      "meta_no_snippet": "nosnippet",
      "meta_max_snippet": 1,
      "meta_no_image_index": "noimageindex",
      "meta_max_image_preview": 1,
      "meta_max_snippet_value": 10,
      "meta_max_video_preview": 1,
      "meta_max_image_preview_value": "small",
      "meta_max_video_preview_value": 60
    },
    "announcement": 0,
    "announcement_message": "hh",
    "store_business_model": "commission",
    "package_id": null,
    "pickup_zone_id": null,
    "comment": null,
    "tin": null,
    "tin_expire_date": null,
    "tin_certificate_image": null,
    "open": 1,
    "distance": 18540.574408336546,
    "min_delivery_time": "9999",
    "reviews_count": 0,
    "orders_count": 71,
    "category_ids": [
      31,
      45,
      39,
      40,
      146,
      38,
      33
    ],
    "category_names": [
      "Jewelry",
      "Men's Clothing",
      "Men's Footwear",
      "Women's bag",
      "Kitchen"
    ],
    "top_items": [
      {
        "id": 65,
        "name": "Avia Men\u2019s Tenon",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720ca16a11cf.png",
        "price": 120,
        "discounted_price": 90,
        "discount": 25,
        "discount_type": "percent",
        "order_count": 2,
        "avg_rating": 0
      },
      {
        "id": 126,
        "name": "YOTAMI Womens Tops",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720d11e0b7da.png",
        "price": 150,
        "discounted_price": 112.5,
        "discount": 25,
        "discount_type": "percent",
        "order_count": 1,
        "avg_rating": 0
      },
      {
        "id": 49,
        "name": "Men's Jeans Pant",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720c943ae303.png",
        "price": 49,
        "discounted_price": 43.12,
        "discount": 12,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 475,
        "name": "Men's Black Leather Sandals",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-04-29-69f1a447d1082.WebP",
        "price": 2500,
        "discounted_price": 1875,
        "discount": 25,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 474,
        "name": "Men's Black Leather Sandals",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-04-29-69f1a0652dad5.WebP",
        "price": 2500,
        "discounted_price": 2225,
        "discount": 11,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      }
    ],
    "discount_status": true,
    "ratings": [
      0,
      0,
      0,
      0,
      0
    ],
    "avg_rating": 0,
    "rating_count": 0,
    "positive_rating": 0,
    "total_items": 17,
    "total_campaigns": 1,
    "min": 49,
    "max": 2500,
    "is_recommended": true,
    "halal_tag_status": false,
    "verified_seller": 1,
    "extra_packaging_status": false,
    "extra_packaging_amount": 0,
    "current_opening_time": "00:00:00",
    "show_low_stock_count": 1,
    "minimum_stock_for_warning": 10,
    "gst_status": false,
    "gst_code": "",
    "logo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/2024-10-29-67205ff131473.png",
    "cover_photo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/cover/2024-10-29-67205ff132dba.png",
    "meta_image_full_url": null,
    "tin_certificate_image_full_url": null,
    "ad": 0,
    "discount": {
      "id": 6,
      "start_date": "2024-11-19",
      "end_date": "2026-12-31",
      "start_time": "00:00:00",
      "end_time": "23:59:00",
      "min_purchase": 0,
      "max_discount": 1000,
      "discount": 25,
      "discount_type": "percent",
      "store_id": 21,
      "created_at": null,
      "updated_at": null
    },
    "translations": [
      {
        "id": 1615,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 21,
        "locale": "en",
        "key": "name",
        "value": "KK Fashion",
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 1616,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 21,
        "locale": "en",
        "key": "address",
        "value": "House: 00, Road: 00, City-0000, Country",
        "created_at": null,
        "updated_at": null
      }
    ],
    "storage": [
      {
        "id": 302,
        "data_type": "App\\Models\\Store",
        "data_id": "21",
        "key": "logo",
        "value": "public",
        "created_at": "2024-10-29 10:09:21",
        "updated_at": "2024-10-29 10:09:21"
      },
      {
        "id": 303,
        "data_type": "App\\Models\\Store",
        "data_id": "21",
        "key": "cover_photo",
        "value": "public",
        "created_at": "2024-10-29 10:09:21",
        "updated_at": "2024-10-29 10:09:21"
      },
      {
        "id": 1655,
        "data_type": "App\\Models\\Store",
        "data_id": "21",
        "key": "meta_image",
        "value": "public",
        "created_at": "2026-02-07 13:37:49",
        "updated_at": "2026-02-07 13:37:49"
      }
    ],
    "module": {
      "id": 3,
      "module_name": "Shop",
      "module_type": "ecommerce",
      "thumbnail": "2026-04-07-69d4d2366b28f.webp",
      "status": "1",
      "stores_count": 14,
      "created_at": "2022-03-22T04:46:05.000000Z",
      "updated_at": "2026-06-03T05:59:59.000000Z",
      "icon": "2026-04-07-69d4d23669978.webp",
      "theme_id": 1,
      "description": "<p>All Types Medicine &amp; Healthcare</p>",
      "all_zone_service": 0,
      "slug": "shop",
      "icon_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d23669978.webp",
      "thumbnail_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d2366b28f.webp",
      "translations": [
        {
          "id": 1862,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "module_name",
          "value": "Shop",
          "created_at": null,
          "updated_at": null
        },
        {
          "id": 1863,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "description",
          "value": "<p>All Types Medicine &amp; Healthcare</p>",
          "created_at": null,
          "updated_at": null
        }
      ],
      "storage": [
        {
          "id": 654,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "thumbnail",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        },
        {
          "id": 867,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "icon",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        }
      ]
    },
    "schedules": [
      {
        "id": 85,
        "store_id": 21,
        "day": 0,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 86,
        "store_id": 21,
        "day": 1,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 87,
        "store_id": 21,
        "day": 2,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 88,
        "store_id": 21,
        "day": 3,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 89,
        "store_id": 21,
        "day": 4,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 90,
        "store_id": 21,
        "day": 5,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      },
      {
        "id": 91,
        "store_id": 21,
        "day": 6,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:20.000000Z",
        "updated_at": "2022-03-22T06:03:20.000000Z"
      }
    ]
  },
  {
    "id": 22,
    "name": "Bicycle",
    "phone": "+8801700002222",
    "email": "ecommerce.store1@demo.com",
    "logo": "2024-10-29-672066cb8096c.png",
    "latitude": "38.538314573716",
    "longitude": "86.84759046509035",
    "address": "House: 00, Road: 00, City-000, Country",
    "footer_text": null,
    "minimum_order": 0,
    "comission": null,
    "schedule_order": false,
    "status": 1,
    "vendor_id": 22,
    "created_at": "2022-03-22T06:03:36.000000Z",
    "updated_at": "2026-03-04T03:57:29.000000Z",
    "free_delivery": false,
    "cover_photo": "2024-10-29-672066cb813e6.png",
    "delivery": true,
    "take_away": true,
    "item_section": true,
    "tax": 15,
    "zone_id": 1,
    "reviews_section": true,
    "active": true,
    "off_day": " ",
    "self_delivery_system": 0,
    "pos_system": false,
    "minimum_shipping_charge": 0,
    "delivery_time": "3-5 days",
    "veg": 1,
    "non_veg": 1,
    "order_count": 3,
    "total_order": 3,
    "module_id": 3,
    "order_place_to_schedule_interval": 0,
    "featured": 1,
    "per_km_shipping_charge": 0,
    "prescription_order": false,
    "slug": "bicycle22",
    "maximum_shipping_charge": null,
    "cutlery": false,
    "meta_title": "Vyyv",
    "meta_description": "Ygyg",
    "meta_image": null,
    "meta_data": {
      "meta_index": "index",
      "meta_no_follow": null,
      "meta_no_archive": null,
      "meta_no_snippet": null,
      "meta_max_snippet": 0,
      "meta_no_image_index": null,
      "meta_max_image_preview": 0,
      "meta_max_snippet_value": null,
      "meta_max_video_preview": 0,
      "meta_max_image_preview_value": "large",
      "meta_max_video_preview_value": null
    },
    "announcement": 0,
    "announcement_message": null,
    "store_business_model": "commission",
    "package_id": null,
    "pickup_zone_id": null,
    "comment": null,
    "tin": null,
    "tin_expire_date": null,
    "tin_certificate_image": null,
    "open": 1,
    "distance": 1679938.150406654,
    "min_delivery_time": "9999",
    "reviews_count": 0,
    "orders_count": 3,
    "category_ids": [
      145,
      38
    ],
    "category_names": [
      "Footwear"
    ],
    "top_items": [
      {
        "id": 120,
        "name": "women's Low heel",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-02-10-698b050c1b6f9.png",
        "price": 200,
        "discounted_price": 184,
        "discount": 8,
        "discount_type": "percent",
        "order_count": 2,
        "avg_rating": 0
      },
      {
        "id": 430,
        "name": "sdfas",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-03-12-69b276d890ed0.webp",
        "price": 30,
        "discounted_price": 24,
        "discount": 20,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 417,
        "name": "Bbc",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-01-26-69775ce24ddb3.webp",
        "price": 20,
        "discounted_price": 16,
        "discount": 20,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      }
    ],
    "discount_status": true,
    "ratings": [
      0,
      0,
      0,
      0,
      0
    ],
    "avg_rating": 0,
    "rating_count": 0,
    "positive_rating": 0,
    "total_items": 3,
    "total_campaigns": 0,
    "min": 20,
    "max": 200,
    "is_recommended": false,
    "halal_tag_status": false,
    "verified_seller": 0,
    "extra_packaging_status": false,
    "extra_packaging_amount": 0,
    "current_opening_time": "00:00:00",
    "show_low_stock_count": 1,
    "minimum_stock_for_warning": 0,
    "gst_status": false,
    "gst_code": "",
    "logo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/2024-10-29-672066cb8096c.png",
    "cover_photo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/cover/2024-10-29-672066cb813e6.png",
    "meta_image_full_url": null,
    "tin_certificate_image_full_url": null,
    "ad": 0,
    "discount": null,
    "translations": [
      {
        "id": 1619,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 22,
        "locale": "en",
        "key": "name",
        "value": "Bicycle",
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 1620,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 22,
        "locale": "en",
        "key": "address",
        "value": "House: 00, Road: 00, City-000, Country",
        "created_at": null,
        "updated_at": null
      }
    ],
    "storage": [
      {
        "id": 306,
        "data_type": "App\\Models\\Store",
        "data_id": "22",
        "key": "logo",
        "value": "public",
        "created_at": "2024-10-29 10:38:35",
        "updated_at": "2024-10-29 10:38:35"
      },
      {
        "id": 307,
        "data_type": "App\\Models\\Store",
        "data_id": "22",
        "key": "cover_photo",
        "value": "public",
        "created_at": "2024-10-29 10:38:35",
        "updated_at": "2024-10-29 10:38:35"
      }
    ],
    "module": {
      "id": 3,
      "module_name": "Shop",
      "module_type": "ecommerce",
      "thumbnail": "2026-04-07-69d4d2366b28f.webp",
      "status": "1",
      "stores_count": 14,
      "created_at": "2022-03-22T04:46:05.000000Z",
      "updated_at": "2026-06-03T05:59:59.000000Z",
      "icon": "2026-04-07-69d4d23669978.webp",
      "theme_id": 1,
      "description": "<p>All Types Medicine &amp; Healthcare</p>",
      "all_zone_service": 0,
      "slug": "shop",
      "icon_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d23669978.webp",
      "thumbnail_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d2366b28f.webp",
      "translations": [
        {
          "id": 1862,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "module_name",
          "value": "Shop",
          "created_at": null,
          "updated_at": null
        },
        {
          "id": 1863,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "description",
          "value": "<p>All Types Medicine &amp; Healthcare</p>",
          "created_at": null,
          "updated_at": null
        }
      ],
      "storage": [
        {
          "id": 654,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "thumbnail",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        },
        {
          "id": 867,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "icon",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        }
      ]
    },
    "schedules": [
      {
        "id": 92,
        "store_id": 22,
        "day": 0,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 93,
        "store_id": 22,
        "day": 1,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 94,
        "store_id": 22,
        "day": 2,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 95,
        "store_id": 22,
        "day": 3,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 96,
        "store_id": 22,
        "day": 4,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 97,
        "store_id": 22,
        "day": 5,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      },
      {
        "id": 98,
        "store_id": 22,
        "day": 6,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:03:36.000000Z",
        "updated_at": "2022-03-22T06:03:36.000000Z"
      }
    ]
  },
  {
    "id": 26,
    "name": "Organic Market",
    "phone": "+8801700000014",
    "email": "ecommerce.store8@demo.com",
    "logo": "2024-10-29-672085858ed01.png",
    "latitude": "40.70666615117246",
    "longitude": "-73.98379497726798",
    "address": "House: 00, Road: 00, City-0000, Country",
    "footer_text": null,
    "minimum_order": 0,
    "comission": null,
    "schedule_order": false,
    "status": 1,
    "vendor_id": 26,
    "created_at": "2022-03-22T06:08:38.000000Z",
    "updated_at": "2026-05-12T07:45:09.000000Z",
    "free_delivery": false,
    "cover_photo": "2024-10-29-672085858f796.png",
    "delivery": true,
    "take_away": true,
    "item_section": true,
    "tax": 15,
    "zone_id": 1,
    "reviews_section": true,
    "active": true,
    "off_day": " ",
    "self_delivery_system": 0,
    "pos_system": false,
    "minimum_shipping_charge": 0,
    "delivery_time": "3-5 days",
    "veg": 0,
    "non_veg": 0,
    "order_count": 2,
    "total_order": 8,
    "module_id": 3,
    "order_place_to_schedule_interval": null,
    "featured": 1,
    "per_km_shipping_charge": 0,
    "prescription_order": false,
    "slug": "organic-market26",
    "maximum_shipping_charge": 0,
    "cutlery": false,
    "meta_title": "Title",
    "meta_description": "Des",
    "meta_image": "2026-03-08-69ad07b11ee1d.webp",
    "meta_data": {
      "meta_index": "1",
      "meta_no_follow": null,
      "meta_no_archive": null,
      "meta_no_snippet": null,
      "meta_max_snippet": 0,
      "meta_no_image_index": null,
      "meta_max_image_preview": 1,
      "meta_max_snippet_value": null,
      "meta_max_video_preview": 0,
      "meta_max_image_preview_value": "large",
      "meta_max_video_preview_value": null
    },
    "announcement": 0,
    "announcement_message": null,
    "store_business_model": "commission",
    "package_id": null,
    "pickup_zone_id": null,
    "comment": null,
    "tin": null,
    "tin_expire_date": null,
    "tin_certificate_image": null,
    "open": 1,
    "distance": 12669604.493467862,
    "min_delivery_time": "9999",
    "reviews_count": 1,
    "orders_count": 8,
    "category_ids": [
      33,
      34,
      36
    ],
    "category_names": [
      "Kitchen",
      "Pet Supplies",
      "Health"
    ],
    "top_items": [
      {
        "id": 371,
        "name": "Carote Nonstick Pots",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-11-17-67397ed1871be.png",
        "price": 60,
        "discounted_price": 60,
        "discount": 0,
        "discount_type": "percent",
        "order_count": 1,
        "avg_rating": 5
      },
      {
        "id": 33,
        "name": "Inulin Powder Capsules",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-31-67234c7fd9c1c.png",
        "price": 50,
        "discounted_price": 45,
        "discount": 10,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 98,
        "name": "Buffalo Dog Food",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720c4aec4ccd.png",
        "price": 55,
        "discounted_price": 55,
        "discount": 0,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 107,
        "name": "Fresh Dog Food",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720c53a023d0.png",
        "price": 89,
        "discounted_price": 88.11,
        "discount": 1,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      },
      {
        "id": 111,
        "name": "Meow Mix original choice",
        "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-31-67235177e7329.png",
        "price": 42,
        "discounted_price": 42,
        "discount": 0,
        "discount_type": "percent",
        "order_count": 0,
        "avg_rating": 0
      }
    ],
    "discount_status": true,
    "ratings": [
      1,
      0,
      0,
      0,
      0
    ],
    "avg_rating": 5,
    "rating_count": 1,
    "positive_rating": 100,
    "total_items": 9,
    "total_campaigns": 1,
    "min": 26,
    "max": 150,
    "is_recommended": true,
    "halal_tag_status": false,
    "verified_seller": 0,
    "extra_packaging_status": false,
    "extra_packaging_amount": 0,
    "current_opening_time": "00:00:00",
    "show_low_stock_count": 1,
    "minimum_stock_for_warning": 0,
    "gst_status": false,
    "gst_code": "",
    "logo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/2024-10-29-672085858ed01.png",
    "cover_photo_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/cover/2024-10-29-672085858f796.png",
    "meta_image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/store/2026-03-08-69ad07b11ee1d.webp",
    "tin_certificate_image_full_url": null,
    "ad": 0,
    "discount": null,
    "translations": [
      {
        "id": 1625,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 26,
        "locale": "en",
        "key": "name",
        "value": "Organic Market",
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 1626,
        "translationable_type": "App\\Models\\Store",
        "translationable_id": 26,
        "locale": "en",
        "key": "address",
        "value": "House: 00, Road: 00, City-0000, Country",
        "created_at": null,
        "updated_at": null
      }
    ],
    "storage": [
      {
        "id": 316,
        "data_type": "App\\Models\\Store",
        "data_id": "26",
        "key": "logo",
        "value": "public",
        "created_at": "2024-10-29 12:49:41",
        "updated_at": "2024-10-29 12:49:41"
      },
      {
        "id": 317,
        "data_type": "App\\Models\\Store",
        "data_id": "26",
        "key": "cover_photo",
        "value": "public",
        "created_at": "2024-10-29 12:49:41",
        "updated_at": "2024-10-29 12:49:41"
      },
      {
        "id": 1923,
        "data_type": "App\\Models\\Store",
        "data_id": "26",
        "key": "meta_image",
        "value": "public",
        "created_at": "2026-03-08 11:22:57",
        "updated_at": "2026-03-08 11:22:57"
      }
    ],
    "module": {
      "id": 3,
      "module_name": "Shop",
      "module_type": "ecommerce",
      "thumbnail": "2026-04-07-69d4d2366b28f.webp",
      "status": "1",
      "stores_count": 14,
      "created_at": "2022-03-22T04:46:05.000000Z",
      "updated_at": "2026-06-03T05:59:59.000000Z",
      "icon": "2026-04-07-69d4d23669978.webp",
      "theme_id": 1,
      "description": "<p>All Types Medicine &amp; Healthcare</p>",
      "all_zone_service": 0,
      "slug": "shop",
      "icon_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d23669978.webp",
      "thumbnail_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/module/2026-04-07-69d4d2366b28f.webp",
      "translations": [
        {
          "id": 1862,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "module_name",
          "value": "Shop",
          "created_at": null,
          "updated_at": null
        },
        {
          "id": 1863,
          "translationable_type": "App\\Models\\Module",
          "translationable_id": 3,
          "locale": "en",
          "key": "description",
          "value": "<p>All Types Medicine &amp; Healthcare</p>",
          "created_at": null,
          "updated_at": null
        }
      ],
      "storage": [
        {
          "id": 654,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "thumbnail",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        },
        {
          "id": 867,
          "data_type": "App\\Models\\Module",
          "data_id": "3",
          "key": "icon",
          "value": "public",
          "created_at": "2026-04-07 15:45:26",
          "updated_at": "2026-04-07 15:45:26"
        }
      ]
    },
    "schedules": [
      {
        "id": 120,
        "store_id": 26,
        "day": 0,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 121,
        "store_id": 26,
        "day": 1,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 122,
        "store_id": 26,
        "day": 2,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 123,
        "store_id": 26,
        "day": 3,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 124,
        "store_id": 26,
        "day": 4,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 125,
        "store_id": 26,
        "day": 5,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      },
      {
        "id": 126,
        "store_id": 26,
        "day": 6,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59",
        "created_at": "2022-03-22T06:08:38.000000Z",
        "updated_at": "2022-03-22T06:08:38.000000Z"
      }
    ]
  }
];

