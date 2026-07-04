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

export interface ChatMessageMetadata {
  products?: ChatProduct[];
  stores?: ChatStore[];
  categories?: ChatCategory[];
  cart_items?: ChatCartItem[];
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

export const mapApiMessage = (m: AiChatMessageApi): ChatMessage => ({
  id: String(m.id),
  role: m.role === "user" ? "user" : "bot",
  text: m.content ?? "",
  createdAt: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
  toolName: m.tool_name,
  metadata: m.metadata,
});
