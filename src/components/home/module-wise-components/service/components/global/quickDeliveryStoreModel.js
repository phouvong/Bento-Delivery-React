/**
 * @typedef {Object} QuickDeliveryItem
 * @property {number|string} id - Item unique id
 * @property {string} name - Item display name
 * @property {string} [image_full_url] - Item image URL
 * @property {number} [price] - Price of the item
 * @property {number} [discount] - Discount amount or percent
 * @property {string} [discount_type] - Type of discount (e.g. "percent", "amount")
 */

/**
 * @typedef {Object} QuickDeliveryStore
 * @property {number|string} id - Store unique id
 * @property {string} name - Store display name
 * @property {string} [logo_full_url] - Store logo URL
 * @property {string} [delivery_time] - Expected delivery time
 * @property {number} [distance] - Distance in meters
 * @property {boolean} [active] - Is store active
 * @property {boolean} [open] - Is store open/operating
 * @property {boolean} [verified_seller] - Whether seller is verified
 * @property {QuickDeliveryItem[]} [top_items] - List of top items
 */

/**
 * Normalize raw API response into the shape QuickDeliverySection expects.
 *
 * @param {Object} raw - Raw store object from API
 * @returns {QuickDeliveryStore}
 */
export const normalizeQuickDeliveryStore = (raw = {}) => ({
  id: raw.id,
  name: raw.name || raw.store_name || "",
  logo_full_url: raw.logo_full_url || raw.logo || "",
  delivery_time: raw.delivery_time || "15-30 min",
  distance: raw.distance ?? (raw.distance_km != null ? raw.distance_km * 1000 : 0),
  active: raw.active ?? true,
  open: raw.open ?? true,
  verified_seller: raw.verified_seller ?? raw.verified ?? false,
  top_items: (
    raw.top_items ??
    raw.top_services ??
    raw.services ??
    raw.items ??
    []
  ).map((item) => ({
    id: item.id,
    name: item.name || "",
    image_full_url:
      item.thumbnail_full_url ||
      item.image_full_url ||
      item.cover_photo_full_url ||
      item.image ||
      "",
    thumbnail_full_url:
      item.thumbnail_full_url ||
      item.image_full_url ||
      item.cover_photo_full_url ||
      item.image ||
      "",
    price: item.base_price ?? item.price ?? item.service_price ?? 0,
    base_price: item.base_price ?? item.price ?? item.service_price ?? 0,
    discount: item.discount ?? 0,
    discount_type: item.discount_type || "percent",
  })),
});

/**
 * Fallback data for the Quick Emergency Experts section.
 * Mirrors the live API response from /api/v1/service/quick-emergency-experts (preview_count=4).
 *
 * HOW TO REMOVE: Delete this export and remove the isMockData fallback branch
 * in QuickDeliverySection.jsx once the real API is returning data.
 * @type {QuickDeliveryStore[]}
 */
export const MOCK_QUICK_EMERGENCY_EXPERTS = [
  {
    id: 3001,
    slug: "rapid-electricians-co",
    name: "Rapid Electricians & Co.",
    logo_full_url:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.8,
    rating_count: 214,
    delivery_time: "15–30 min",
    distance: 800,
    top_items: [
      { id: 30011, name: "Short Circuit Fix", thumbnail_full_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", base_price: 35.0, discount: 10, discount_type: "percent" },
      { id: 30012, name: "Ceiling Fan Install", thumbnail_full_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80", base_price: 20.0, discount: 0, discount_type: "percent" },
      { id: 30013, name: "Switchboard Repair", thumbnail_full_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", base_price: 15.0, discount: 2, discount_type: "amount" },
      { id: 30014, name: "Emergency Wiring", thumbnail_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80", base_price: 80.0, discount: 5, discount_type: "percent" },
    ],
  },
  {
    id: 3002,
    slug: "emergency-plumbing-crew",
    name: "Emergency Plumbing Crew",
    logo_full_url:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.6,
    rating_count: 178,
    delivery_time: "20–40 min",
    distance: 1200,
    top_items: [
      { id: 30021, name: "Pipe Leak Repair", thumbnail_full_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80", base_price: 45.0, discount: 15, discount_type: "percent" },
      { id: 30022, name: "Drain Unclogging", thumbnail_full_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80", base_price: 30.0, discount: 0, discount_type: "percent" },
      { id: 30023, name: "Water Heater Setup", thumbnail_full_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80", base_price: 120.0, discount: 10, discount_type: "percent" },
      { id: 30024, name: "Tap Replacement", thumbnail_full_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80", base_price: 25.0, discount: 0, discount_type: "percent" },
    ],
  },
  {
    id: 3003,
    slug: "fast-key-locksmith",
    name: "Fast Key & Locksmith",
    logo_full_url:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.9,
    rating_count: 301,
    delivery_time: "10–20 min",
    distance: 600,
    top_items: [
      { id: 30031, name: "Emergency Lockout", thumbnail_full_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80", base_price: 50.0, discount: 5, discount_type: "percent" },
      { id: 30032, name: "Key Duplication", thumbnail_full_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80", base_price: 10.0, discount: 0, discount_type: "percent" },
      { id: 30033, name: "Smart Lock Install", thumbnail_full_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80", base_price: 150.0, discount: 15, discount_type: "amount" },
      { id: 30034, name: "Safe Box Opening", thumbnail_full_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80", base_price: 90.0, discount: 0, discount_type: "percent" },
    ],
  },
  {
    id: 3004,
    slug: "safe-pest-control",
    name: "Safe Pest Control",
    logo_full_url:
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200&q=80",
    cover_photo_full_url:
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800&q=80",
    verified_seller: true,
    active: true,
    open: true,
    avg_rating: 4.5,
    rating_count: 96,
    delivery_time: "30–50 min",
    distance: 2100,
    top_items: [
      { id: 30041, name: "Bed Bug Spray", thumbnail_full_url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=300&q=80", base_price: 75.0, discount: 10, discount_type: "percent" },
      { id: 30042, name: "Cockroach Control", thumbnail_full_url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=300&q=80", base_price: 40.0, discount: 0, discount_type: "percent" },
      { id: 30043, name: "Termite Treatment", thumbnail_full_url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=300&q=80", base_price: 200.0, discount: 20, discount_type: "percent" },
      { id: 30044, name: "Rodent Baiting", thumbnail_full_url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=300&q=80", base_price: 60.0, discount: 5, discount_type: "amount" },
    ],
  },
];

/**
 * Static demo data used while the API isn't wired up or returning stores.
 * @type {QuickDeliveryStore[]}
 */
export const DEMO_SERVICE_PROVIDERS = [
  {
    id: "s1",
    name: "Rapid Electricians & Co.",
    logo_full_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=120&q=80",
    delivery_time: "15-30 min",
    distance: 800,
    active: true,
    open: true,
    verified_seller: true,
    top_items: [
      {
        id: "e1",
        name: "Short Circuit Fix",
        image_full_url: null,
        price: 35.00,
        discount: 10,
        discount_type: "percent"
      },
      {
        id: "e2",
        name: "Ceiling Fan Install",
        image_full_url: null,
        price: 20.00,
        discount: 0
      },
      {
        id: "e3",
        name: "Switchboard Repair",
        image_full_url: null,
        price: 15.00,
        discount: 2,
        discount_type: "amount"
      },
      {
        id: "e4",
        name: "Emergency Wiring",
        image_full_url: null,
        price: 80.00,
        discount: 5,
        discount_type: "percent"
      }
    ]
  },
  {
    id: "s2",
    name: "Emergency Plumbing Crew",
    logo_full_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=120&q=80",
    delivery_time: "20-40 min",
    distance: 1200,
    active: true,
    open: true,
    verified_seller: true,
    top_items: [
      {
        id: "p1",
        name: "Pipe Leak Repair",
        image_full_url: null,
        price: 45.00,
        discount: 15,
        discount_type: "percent"
      },
      {
        id: "p2",
        name: "Drain Unclogging",
        image_full_url: null,
        price: 30.00,
        discount: 0
      },
      {
        id: "p3",
        name: "Water Heater Setup",
        image_full_url: null,
        price: 120.00,
        discount: 10,
        discount_type: "percent"
      },
      {
        id: "p4",
        name: "Tap Replacement",
        image_full_url: null,
        price: 25.00,
        discount: 0
      }
    ]
  },
  {
    id: "s3",
    name: "Fast Key & Locksmith",
    logo_full_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=120&q=80",
    delivery_time: "10-20 min",
    distance: 600,
    active: true,
    open: true,
    verified_seller: true,
    top_items: [
      {
        id: "l1",
        name: "Emergency Lockout",
        image_full_url: null,
        price: 50.00,
        discount: 5,
        discount_type: "percent"
      },
      {
        id: "l2",
        name: "Key Duplication",
        image_full_url: null,
        price: 10.00,
        discount: 0
      },
      {
        id: "l3",
        name: "Smart Lock Install",
        image_full_url: null,
        price: 150.00,
        discount: 15,
        discount_type: "amount"
      },
      {
        id: "l4",
        name: "Safe Box Opening",
        image_full_url: null,
        price: 90.00,
        discount: 0
      }
    ]
  },
  {
    id: "s4",
    name: "Safe Pest Control",
    logo_full_url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=120&q=80",
    delivery_time: "30-50 min",
    distance: 2100,
    active: true,
    open: true,
    verified_seller: true,
    top_items: [
      {
        id: "c1",
        name: "Bed Bug Spray",
        image_full_url: null,
        price: 75.00,
        discount: 10,
        discount_type: "percent"
      },
      {
        id: "c2",
        name: "Cockroach Control",
        image_full_url: null,
        price: 40.00,
        discount: 0
      },
      {
        id: "c3",
        name: "Termite Treatment",
        image_full_url: null,
        price: 200.00,
        discount: 20,
        discount_type: "percent"
      },
      {
        id: "c4",
        name: "Rodent Baiting",
        image_full_url: null,
        price: 60.00,
        discount: 5,
        discount_type: "amount"
      }
    ]
  }
];
