/**
 * @typedef {Object} RentalProvider
 * @property {number|string} id - Provider unique id
 * @property {string} name - Provider display name (e.g. "Luxury Car Rentals")
 * @property {string} [logo_full_url] - URL for the provider's logo
 * @property {string} [cover_full_url] - URL for the cover/banner image on the card
 * @property {string} [image_full_url] - Fallback image URL if cover not present
 * @property {number} [avg_rating] - Average rating, 0-5 (e.g. 4.5)
 * @property {number} [total_reviews] - Total number of reviews (e.g. 150)
 * @property {boolean} [verified] - Whether the provider is verified
 * @property {boolean} [verified_seller] - Backend alias for `verified`
 * @property {string} [vehicle_types] - Comma-separated vehicle types
 *   (e.g. "Sedan, SUV, Mercedes-Benz, Toyota Aqua")
 * @property {string} [response_time] - Response/availability window
 *   (e.g. "0-30 min", "20-30 min")
 * @property {number} [total_vehicles] - Total vehicles available
 * @property {number} [vehicle_count] - Backend alias for `total_vehicles`
 * @property {boolean} [is_ad] - Whether this is a sponsored listing
 * @property {boolean} [sponsored] - Backend alias for `is_ad`
 * @property {number} [discount_percent] - Discount percentage to badge
 *   (e.g. 10 renders as "-10%")
 * @property {number} [discount] - Backend alias for `discount_percent`
 * @property {boolean} [isWishlisted] - Initial wishlist state for this provider
 */

/**
 * Normalize raw API response into the shape `RentalProviderCard` expects.
 * Update field mappings here when API contract changes; the card will not
 * need to know about backend field names.
 *
 * @param {Object} raw - Raw provider object from API
 * @returns {RentalProvider}
 */
export const normalizeRentalProvider = (raw = {}) => ({
  id: raw.id,
  slug: raw.slug,
  name: raw.name || raw.provider_name || "",
  logo_full_url: raw.logo_full_url || raw.logo || "",
  cover_full_url:
    raw.cover_full_url ||
    raw.cover_photo_full_url ||
    raw.image_full_url ||
    raw.banner_full_url ||
    "",
  avg_rating: raw.avg_rating ?? raw.rating ?? 0,
  total_reviews:
    raw.total_reviews ??
    raw.review_count ??
    raw.reviews_count ??
    raw.rating_count ??
    0,
  verified: raw.verified ?? raw.verified_seller ?? false,
  vehicle_types:
    raw.vehicle_types ||
    raw.tags ||
    (Array.isArray(raw.categories)
      ? raw.categories.map((c) => c.name).join(", ")
      : "") ||
    raw.module?.module_name ||
    "",
  address: raw.address || raw.full_address || "",
  response_time:
    raw.response_time ||
    raw.avg_response_time ||
    raw.delivery_time ||
    "0-30 min",
  total_vehicles:
    raw.total_vehicles ?? raw.vehicle_count ?? raw.total_items ?? 0,
  min_price: Number(raw.min_price ?? raw.min) || 0,
  max_price: Number(raw.max_price ?? raw.max) || 0,
  is_ad: raw.is_ad ?? raw.sponsored ?? Number(raw.ad) === 1,
  discount_percent: Number(raw.discount_percent ?? raw.discount ?? 0) || 0,
  isWishlisted: raw.isWishlisted ?? raw.is_wishlisted ?? false,
});

/**
 * Static demo data used while the API isn't wired up. Replace `DEMO_PROVIDERS`
 * imports with the result of `data?.providers?.map(normalizeRentalProvider)`
 * once the endpoint is ready.
 * @type {RentalProvider[]}
 */
export const DEMO_PROVIDERS = [
  {
    id: 1,
    name: "Luxury Car Rentals",
    logo_full_url: "",
    cover_full_url:
      "https://images.unsplash.com/photo-1592805144716-feeccccef5ac?auto=format&fit=crop&w=600&q=60",
    avg_rating: 4.5,
    total_reviews: 950,
    verified: true,
    vehicle_types: "Sedan, Suv, Mercedes-Benz, Toyota Aqua",
    response_time: "0-30 min",
    total_vehicles: 18,
    is_ad: true,
    discount_percent: 10,
  },
  {
    id: 2,
    name: "VIP Car Charters",
    logo_full_url: "",
    cover_full_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=60",
    avg_rating: 4.9,
    total_reviews: 80,
    verified: true,
    vehicle_types: "Luxury Car, Sail Car",
    response_time: "0-30 min",
    total_vehicles: 10,
    is_ad: true,
    discount_percent: 20,
  },
  {
    id: 3,
    name: "Private Car Services",
    logo_full_url: "",
    cover_full_url:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=60",
    avg_rating: 4.7,
    total_reviews: 40,
    verified: true,
    vehicle_types: "Small Car, Car",
    response_time: "0-30 min",
    total_vehicles: 12,
    is_ad: true,
    discount_percent: 15,
  },
  {
    id: 4,
    name: "Daily Car Rental",
    logo_full_url: "",
    cover_full_url:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=60",
    avg_rating: 4.3,
    total_reviews: 120,
    verified: true,
    vehicle_types: "Mountain, Road, Electric",
    response_time: "0-30 min",
    total_vehicles: 8,
    is_ad: true,
    discount_percent: 5,
  },
  {
    id: 5,
    name: "Premium Auto Hub",
    logo_full_url: "",
    cover_full_url:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=60",
    avg_rating: 4.6,
    total_reviews: 210,
    verified: true,
    vehicle_types: "Audi, BMW, Mercedes",
    response_time: "0-30 min",
    total_vehicles: 22,
    is_ad: false,
    discount_percent: 12,
  },
];
