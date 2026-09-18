// const mockServiceDetailData = {
//   id: 101,
//   name: "Professional Home Cleaning Service",
//   description:
//     "A thorough top-to-bottom cleaning of your home by trained professionals. Includes dusting, vacuuming, mopping, bathroom sanitization, and kitchen deep-clean. Eco-friendly products used on request.",
//   price: 49.99,
//   stock: 20,
//   discount: 15,
//   discount_type: "percent",
//   store_discount: 0,
//   image_full_url:
//     "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
//   images_full_url: [
//     "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
//     "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800",
//     "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
//   ],
//   avg_rating: 4.7,
//   rating_count: 238,
//   whislists_count: 54,
//   organic: false,
//   isCampaignItem: false,
//   available_date_starts: null,
//   maximum_cart_quantity: 10,
//   store_id: 1,
//   video_preview_available: false,
//   video_preview_type: null,
//   video_thumbnail_url: null,
//   video_preview_modal_type: null,
//   video_preview_modal_url: null,
//   video_preview_url: null,
//   tags: [
//     { id: 1, name: "Cleaning" },
//     { id: 2, name: "Home Service" },
//     { id: 3, name: "Professional" },
//   ],
//   category_ids: [
//     { id: 10, name: "Home Services" },
//     { id: 11, name: "Cleaning" },
//   ],
//   variations: [
//     {
//       type: "Basic Clean",
//       name: "Basic Clean",
//       price: 49.99,
//       discount: 15,
//       discount_type: "percent",
//       store_discount: 0,
//       stock: 10,
//     },
//     {
//       type: "Deep Clean",
//       name: "Deep Clean",
//       price: 89.99,
//       discount: 10,
//       discount_type: "percent",
//       store_discount: 0,
//       stock: 8,
//     },
//     {
//       type: "Move-In / Move-Out Clean",
//       name: "Move-In / Move-Out Clean",
//       price: 129.99,
//       discount: 0,
//       discount_type: "percent",
//       store_discount: 5,
//       stock: 5,
//     },
//   ],
//   selectedOption: null,
//   quantity: 1,
//   totalPrice: 49.99,
//   reviews: [
//     {
//       id: 1,
//       customer_name: "Sarah M.",
//       rating: 5,
//       comment:
//         "Absolutely amazing! The team was punctual, thorough, and left the house spotless.",
//       created_at: "2025-05-12T10:30:00Z",
//     },
//     {
//       id: 2,
//       customer_name: "James T.",
//       rating: 4,
//       comment:
//         "Great service overall. Would have given 5 stars but they missed one corner in the bathroom.",
//       created_at: "2025-04-28T14:15:00Z",
//     },
//     {
//       id: 3,
//       customer_name: "Priya K.",
//       rating: 5,
//       comment: "Booked the deep clean and it was worth every penny. Will book again!",
//       created_at: "2025-03-19T09:00:00Z",
//     },
//   ],
//   store_details: {
//     id: 1,
//     slug: "sparkle-home-services",
//     name: "Sparkle Home Services",
//     logo_full_url:
//       "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200",
//     verified_seller: true,
//     avg_rating: 4.6,
//     total_items: 18,
//     positive_rating: 94,
//     delivery_time: "60 min",
//     minimum_order: 30,
//   },
//   meta_title: "Professional Home Cleaning Service | 6amMart",
//   meta_description:
//     "Book professional home cleaning services — basic, deep clean, or move-in/move-out packages.",
//   meta_image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
//   meta_data: null,
// };
const mockServiceDetailData = {
  id: 45,
  name: "Red Garnet Earrings",
  description: "Add a touch of elegance to your jewelry collection. Beautiful red garnet stones set in sterling silver. Durable construction ensures long-lasting wear.",
  image: "2024-10-31-67234f114e935.png",
  image_full_url: "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-31-67234f114e935.png",
  images_full_url: [
    "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-31-67234f114e935.png"
  ],
  video: null,
  video_preview_available: false,
  
  module_type: "service",
  isCampaignItem: false,
  
  price: 49.00,
  discount: 10,
  discount_type: "percent",
  maximum_cart_quantity: 5,
  whislists_count: 3,

  variations: [
    { id: 1, type: "Silver", price: 49.00, stock: 10 },
    { id: 2, type: "Gold", price: 69.00, stock: 5 },
  ],
  // variations: [],

  avg_rating: 4.5,
  rating_count: 12,
  reviews: [
    {
      id: 1,
      comment: "Beautiful pair of earrings, very shiny!",
      rating: 5,
      customer_name: "Sarah Doe",
      customer_image: "",
      created_at: "2026-05-01T12:00:00.000000Z"
    }
  ],

  category_ids: [
    { id: 31, name: "Jewelry" },
    { id: 38, name: "Women’s Trend" }
  ],
  tags: ["earrings", "garnet", "jewelry", "fashion"],

  store_id: 21,
  store_details: {
    id: 21,
    name: "KK Fashion",
    logo_full_url: "https://6ammart-dev.6amdev.xyz/storage/app/public/store/2024-10-29-67205ff131473.png",
    avg_rating: 4.8,
    positive_rating: 95,
    delivery_time: "3-5 days",
    minimum_order: 50,
    verified_seller: 1
  },

  meta_title: "Red Garnet Earrings | KK Fashion",
  meta_description: "Elegant Red Garnet sterling silver earrings.",
  meta_image: "2024-10-31-67234f114e935.png",
  meta_data: {
    meta_index: "1",
    meta_no_follow: "nofollow",
    meta_no_archive: "noarchive",
    meta_no_snippet: "nosnippet"
  }
};

export default mockServiceDetailData;
