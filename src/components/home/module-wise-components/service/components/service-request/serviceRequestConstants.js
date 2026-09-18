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

// ── Mock list items ────────────────────────────────────────────────────────────
// status: "pending" | "on_review" | "rejected"
// feedback: present when admin has left a note (on_review / rejected)
export const MOCK_SERVICES = [
  {
    id: 1,
    category: "Car Servicing",
    category_id: 7,
    service_name: "Full Car Service",
    status: "pending",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback: null,
    created_at: "2026-06-17T10:00:00.000Z",
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
    category: "Car Servicing",
    category_id: 1,
    service_name: "Full Car Service",
    status: "on_review",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback:
      "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Nullam vel pellentesque nibh. Donec",
    created_at: "2026-06-17T09:00:00.000Z",
  },
  {
    id: 3,
    category: "Car Servicing",
    category_id: 2,
    service_name: "Full Car Service",
    status: "rejected",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback:
      "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Nullam vel pellentesque nibh. Donec",
    created_at: "2026-06-17T08:00:00.000Z",
  },
  {
    id: 4,
    category: "Car Servicing",
    category_id: 3,
    service_name: "Full Car Service",
    status: "pending",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback: null,
    created_at: "2026-05-04T10:00:00.000Z",
  },
  {
    id: 5,
    category: "Car Servicing",
    category_id: 8,
    service_name: "Full Car Service",
    status: "pending",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback: null,
    created_at: "2026-05-04T09:00:00.000Z",
  },
  {
    id: 6,
    category: "Car Servicing",
    category_id: 4,
    service_name: "Full Car Service",
    status: "on_review",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback:
      "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Nullam vel pellentesque nibh. Donec",
    created_at: "2026-06-15T11:00:00.000Z",
  },
  {
    id: 7,
    category: "Car Servicing",
    category_id: 5,
    service_name: "Full Car Service",
    status: "pending",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback: null,
    created_at: "2026-06-15T10:00:00.000Z",
  },
  {
    id: 8,
    category: "Car Servicing",
    category_id: 9,
    service_name: "Full Car Service",
    status: "rejected",
    image: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel pellentesque nibh. Donec.",
    feedback:
      "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Nullam vel pellentesque nibh. Donec",
    created_at: "2026-06-14T09:00:00.000Z",
  },
];

// Total count across all pages (used for pagination display)
export const MOCK_TOTAL_SIZE = 25;
