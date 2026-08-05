// ── Flip to false when the API is ready ───────────────────────────────────────
export const isMock = true;

// ── Categories — replace with useGetCustomServiceCategories when API is ready ─
export const MOCK_CATEGORIES = [
  { id: 1, name: "Cleaning" },
  { id: 2, name: "Plumbing" },
  { id: 3, name: "Electrical" },
  { id: 4, name: "Painting" },
  { id: 5, name: "Carpentry" },
  { id: 6, name: "Landscaping" },
  { id: 7, name: "Shifting" },
  { id: 8, name: "AC Service" },
  { id: 9, name: "Pest Control" },
  { id: 10, name: "Gardening" },
];

// ── Sub-categories keyed by category id ──────────────────────────────────────
export const MOCK_SUB_CATEGORIES_MAP = {
  1: [
    { id: 101, name: "Home Cleaning" },
    { id: 102, name: "Office Cleaning" },
    { id: 103, name: "Deep Cleaning" },
  ],
  2: [
    { id: 201, name: "Pipe Repair" },
    { id: 202, name: "Drain Cleaning" },
    { id: 203, name: "Water Heater" },
  ],
  3: [
    { id: 301, name: "Wiring" },
    { id: 302, name: "Panel Upgrade" },
    { id: 303, name: "Outlet Installation" },
  ],
  4: [
    { id: 401, name: "Interior Painting" },
    { id: 402, name: "Exterior Painting" },
    { id: 403, name: "Furniture Painting" },
  ],
  5: [
    { id: 501, name: "Furniture Assembly" },
    { id: 502, name: "Cabinet Installation" },
    { id: 503, name: "Door Repair" },
  ],
  6: [
    { id: 601, name: "Lawn Mowing" },
    { id: 602, name: "Tree Trimming" },
    { id: 603, name: "Garden Design" },
  ],
  7: [
    { id: 701, name: "Office Shifting" },
    { id: 702, name: "Home Shifting" },
  ],
  8: [
    { id: 801, name: "AC Installation" },
    { id: 802, name: "AC Repair" },
    { id: 803, name: "AC Cleaning" },
  ],
  9: [
    { id: 901, name: "Termite Treatment" },
    { id: 902, name: "General Pest Control" },
  ],
  10: [
    { id: 1001, name: "Lawn Maintenance" },
    { id: 1002, name: "Garden Design" },
  ],
};

// ── Mock list items — augmented with API-shape fields for edit support ────────
export const MOCK_SERVICES = [
  {
    id: 1,
    category: "Shifting",
    category_id: 7,
    sub_category: "Office Shifting",
    sub_category_id: 701,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 0,
    created_at: "2026-06-17T10:00:00.000Z",
    // Full fields needed for edit form:
    lat: 23.7104,
    lng: 90.4074,
    address: "123 Main Street, Dhaka",
    address_type: "Home",
    contact_person_name: "John Doe",
    contact_person_number: "+8801700000001",
    service_date: "2026-06-25",
    service_time: "10:00 AM",
  },
  {
    id: 2,
    category: "Home Cleaning",
    category_id: 1,
    sub_category: "Deep Cleaning",
    sub_category_id: 103,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 3,
    created_at: "2026-06-17T09:00:00.000Z",
  },
  {
    id: 3,
    category: "Plumbing",
    category_id: 2,
    sub_category: "Pipe Repair",
    sub_category_id: 201,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 0,
    created_at: "2026-06-17T08:00:00.000Z",
  },
  {
    id: 4,
    category: "Electrical",
    category_id: 3,
    sub_category: "Wiring & Fixtures",
    sub_category_id: 301,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 5,
    created_at: "2026-06-16T10:00:00.000Z",
  },
  {
    id: 5,
    category: "AC Service",
    category_id: 8,
    sub_category: "AC Installation",
    sub_category_id: 801,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 2,
    created_at: "2026-06-16T09:00:00.000Z",
  },
  {
    id: 6,
    category: "Painting",
    category_id: 4,
    sub_category: "Interior Painting",
    sub_category_id: 401,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 1,
    created_at: "2026-06-15T11:00:00.000Z",
  },
  {
    id: 7,
    category: "Carpentry",
    category_id: 5,
    sub_category: "Furniture Assembly",
    sub_category_id: 501,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 0,
    created_at: "2026-06-15T10:00:00.000Z",
  },
  {
    id: 8,
    category: "Pest Control",
    category_id: 9,
    sub_category: "Termite Treatment",
    sub_category_id: 901,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 4,
    created_at: "2026-06-14T09:00:00.000Z",
  },
  {
    id: 9,
    category: "Shifting",
    category_id: 7,
    sub_category: "Home Shifting",
    sub_category_id: 702,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 0,
    created_at: "2026-06-14T08:00:00.000Z",
  },
  {
    id: 10,
    category: "Gardening",
    category_id: 10,
    sub_category: "Lawn Maintenance",
    sub_category_id: 1001,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 2,
    created_at: "2026-06-13T10:00:00.000Z",
  },
  {
    id: 11,
    category: "Home Cleaning",
    category_id: 1,
    sub_category: "Window Cleaning",
    sub_category_id: 102,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipi.",
    bidding_count: 6,
    created_at: "2026-06-13T09:00:00.000Z",
  },
];

// Total count across all pages (used for pagination display)
export const MOCK_TOTAL_SIZE = 25;
