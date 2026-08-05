/**
 * mockServiceTopStores
 *
 * Demo "top stores" data for the Service module.
 * Used as a fallback while the real search API is not yet available.
 *
 * Shape mirrors the live API response consumed by:
 *   - SearchResultStoreCard  (store + store.top_items)
 *   - NewStoreCard / StoresResult (store fields)
 *
 * HOW TO REMOVE AFTER REAL API IS READY:
 *   In ModuleSearchContainer.js, delete the one line that references this file.
 *   The rest of the code is already API-driven.
 */

const mockServiceTopStores = [
  {
    id: 1001,
    slug: "sparkle-home-services",
    name: "Sparkle Home Services",
    logo_full_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.8,
    rating_count: 312,
    positive_rating: 96,
    delivery_time: "60–90 min",
    distance: 1200, // metres
    minimum_order: 30,
    free_delivery: true,
    discount: { discount: 15, discount_type: "percent" },
    top_items: [
      {
        id: 10011,
        name: "Deep Home Cleaning",
        image_full_url:
          "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&q=80",
        price: 89.99,
        discount: 15,
        discount_type: "percent",
      },
      {
        id: 10012,
        name: "Kitchen Deep-Clean",
        image_full_url:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&q=80",
        price: 59.99,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10013,
        name: "Bathroom Sanitization",
        image_full_url:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80",
        price: 39.99,
        discount: 10,
        discount_type: "percent",
      },
    ],
  },
  {
    id: 1002,
    slug: "fixmaster-repair-pros",
    name: "FixMaster Repair Pros",
    logo_full_url:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.6,
    rating_count: 198,
    positive_rating: 93,
    delivery_time: "Same day",
    distance: 2400,
    minimum_order: 20,
    free_delivery: false,
    discount: { discount: 10, discount_type: "percent" },
    top_items: [
      {
        id: 10021,
        name: "AC Servicing",
        image_full_url:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80",
        price: 49.99,
        discount: 10,
        discount_type: "percent",
      },
      {
        id: 10022,
        name: "Refrigerator Repair",
        image_full_url:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
        price: 69.99,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10023,
        name: "Washing Machine Fix",
        image_full_url:
          "https://images.unsplash.com/photo-1626436819901-6e3fc8484d81?w=300&q=80",
        price: 55.0,
        discount: 5,
        discount_type: "percent",
      },
    ],
  },
  {
    id: 1003,
    slug: "greenlawn-garden-services",
    name: "GreenLawn Garden Services",
    logo_full_url:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    verified_seller: false,
    active: true,
    open: true,
    avg_rating: 4.5,
    rating_count: 87,
    positive_rating: 91,
    delivery_time: "Next day",
    distance: 3600,
    minimum_order: 25,
    free_delivery: true,
    discount: null,
    top_items: [
      {
        id: 10031,
        name: "Lawn Mowing",
        image_full_url:
          "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&q=80",
        price: 35.0,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10032,
        name: "Tree Trimming",
        image_full_url:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&q=80",
        price: 75.0,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10033,
        name: "Garden Design",
        image_full_url:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",
        price: 120.0,
        discount: 0,
        discount_type: "percent",
      },
    ],
  },
  {
    id: 1004,
    slug: "quickpaint-interior-studio",
    name: "QuickPaint Interior Studio",
    logo_full_url:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
    verified_seller: true,
    active: true,
    open: false, // closed now — tests ClosedNow badge
    avg_rating: 4.3,
    rating_count: 54,
    positive_rating: 88,
    delivery_time: "2–3 days",
    distance: 5100,
    minimum_order: 50,
    free_delivery: false,
    discount: { discount: 20, discount_type: "percent" },
    top_items: [
      {
        id: 10041,
        name: "Room Painting",
        image_full_url:
          "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80",
        price: 149.99,
        discount: 20,
        discount_type: "percent",
      },
      {
        id: 10042,
        name: "Full House Exterior",
        image_full_url:
          "https://images.unsplash.com/photo-1520637836993-5729f7e34f3d?w=300&q=80",
        price: 499.99,
        discount: 15,
        discount_type: "percent",
      },
    ],
  },
  {
    id: 1005,
    slug: "safelock-security-solutions",
    name: "SafeLock Security Solutions",
    logo_full_url:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.9,
    rating_count: 143,
    positive_rating: 98,
    delivery_time: "1–2 hours",
    distance: 800,
    minimum_order: 0,
    free_delivery: false,
    discount: null,
    top_items: [
      {
        id: 10051,
        name: "CCTV Installation",
        image_full_url:
          "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80",
        price: 199.0,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10052,
        name: "Smart Door Lock",
        image_full_url:
          "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80",
        price: 129.99,
        discount: 0,
        discount_type: "percent",
      },
      {
        id: 10053,
        name: "Alarm System Setup",
        image_full_url:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
        price: 89.0,
        discount: 0,
        discount_type: "percent",
      },
    ],
  },
];

export default mockServiceTopStores;
