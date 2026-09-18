export type ChatRole = "user" | "bot";

export interface ChatProduct {
  id: number;
  name: string;
  price: number;
  discounted_price: number;
  discount: number;
  discount_type: "percent" | "amount" | string;
  discount_label: string;
  avg_rating: number;
  rating_count: number;
  image: string;
  image_full_url?: string;
  store_id: number;
  store_name: string;
  store_logo?: string;
  store_logo_full_url?: string;
  category_name?: string;
  stock?: number;
  variations?: Array<{ type: string; price: number; stock?: number }>;
}

export interface ChatStore {
  id: number;
  name: string;
  logo?: string;
  logo_full_url?: string | null;
  cover_photo?: string;
  cover_photo_full_url?: string | null;
  avg_rating: number;
  rating_count?: number;
  order_count?: number;
  delivery_time?: string;
  minimum_order?: number;
  free_delivery?: boolean;
  is_open?: boolean;
  featured?: boolean;
  delivery?: boolean;
  take_away?: boolean;
  veg?: boolean;
  non_veg?: boolean;
}

export interface ChatCartItem {
  id?: number;
  cart_id?: number;
  item_id?: number;
  name?: string;
  image?: string;
  image_full_url?: string;
  price?: number;
  unit_price?: number;
  discounted_price?: number;
  quantity: number;
  total_price?: number;
  line_total?: number;
  store_id?: number;
  store_name?: string;
  variation?: unknown;
  item?: ChatProduct & Record<string, any>;
}

export interface ChatCategory {
  id: number;
  name: string;
  image?: string;
  image_full_url?: string;
  slug?: string;
  parent_id?: number | null;
  priority?: number;
}

// Persisted messages store the cart grouped by store instead of the flat
// `cart_items` list the live send response uses.
export interface ChatCartStoreGroup {
  store_id?: number;
  store_name?: string;
  items?: ChatCartItem[];
  store_subtotal?: number;
}

export interface ChatCartSummary {
  stores?: ChatCartStoreGroup[];
  grand_total?: number;
  total_items?: number;
}

export interface ChatMessageMetadata {
  products?: ChatProduct[];
  stores?: ChatStore[];
  categories?: ChatCategory[];
  cart_items?: ChatCartItem[];
  cart?: ChatCartSummary;
  cart_updated?: boolean;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
  toolName?: string | null;
  metadata?: ChatMessageMetadata | null;
}

export interface ChatConversation {
  id: string;
  title: string;
  preview?: string;
  updatedAt: number;
  unread?: number;
  messagesCount?: number;
  status?: string;
  messages?: ChatMessage[];
  isDraft?: boolean;
  // Module the conversation was created under (from AiChatConversationApi.module_id).
  // The active site module can change after a conversation is created — items
  // rendered in its history still belong to THIS module, not whatever is
  // currently active, so redirects/quick-view must key off this, not
  // getCurrentModuleType().
  moduleId?: number | null;
}

export interface AiChatConversationApi {
  id: number;
  user_id: number | null;
  guest_id: string | null;
  module_id: number | null;
  zone_id: number | null;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages_count: number;
}

export interface AiChatConversationsResponse {
  total_size: number;
  limit: number;
  offset: number;
  data: AiChatConversationApi[];
}

export const mapApiConversation = (
  c: AiChatConversationApi
): ChatConversation => ({
  id: String(c.id),
  title: c.title || "Untitled chat",
  updatedAt: c.updated_at ? new Date(c.updated_at).getTime() : Date.now(),
  messagesCount: c.messages_count,
  status: c.status,
  unread: 0,
  moduleId: c.module_id ?? null,
});

export interface AiChatMessageApi {
  id: number;
  conversation_id: number;
  role: "user" | "assistant" | string;
  content: string;
  tool_name: string | null;
  metadata: ChatMessageMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface AiChatMessagesResponse {
  total_size?: number;
  limit?: number;
  offset: number;
  conversation_id: number;
  data: AiChatMessageApi[];
}

// Persisted messages group the cart under metadata.cart.stores[].items[]
// while the live send response uses a flat metadata.cart_items — flatten the
// grouped shape (carrying each store's id/name onto its items) so the UI can
// always read cart_items.
const flattenCartStores = (
  cart: ChatCartSummary | undefined
): ChatCartItem[] => {
  if (!Array.isArray(cart?.stores)) return [];
  return cart.stores.flatMap((store) =>
    (Array.isArray(store?.items) ? store.items : []).map((item) => ({
      ...item,
      store_id: item?.store_id ?? store?.store_id,
      store_name: item?.store_name ?? store?.store_name,
    }))
  );
};

// The messages API may deliver `metadata` as a JSON string (unparsed DB
// column) — normalize so consumers can always read metadata.cart_items etc.
export const normalizeMetadata = (
  metadata: unknown
): ChatMessageMetadata | null => {
  let meta: ChatMessageMetadata | null = null;
  if (!metadata) return null;
  if (typeof metadata === "string") {
    try {
      const parsed = JSON.parse(metadata);
      meta = typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  } else if (typeof metadata === "object") {
    meta = metadata as ChatMessageMetadata;
  }
  if (!meta) return null;
  if (!meta.cart_items?.length && meta.cart?.stores?.length) {
    meta = { ...meta, cart_items: flattenCartStores(meta.cart) };
  }
  return meta;
};

export const mapApiMessage = (m: AiChatMessageApi): ChatMessage => ({
  id: String(m.id),
  role: m.role === "user" ? "user" : "bot",
  text: m.content ?? "",
  createdAt: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
  toolName: m.tool_name,
  metadata: normalizeMetadata(m.metadata),
});
