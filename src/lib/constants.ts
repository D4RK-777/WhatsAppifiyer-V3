// Message types for dropdown

export const messageTypesArray = ["marketing", "authentication", "utility", "service"] as const;
export type MessageType = typeof messageTypesArray[number];

// Media types for dropdown
export const mediaTypesArray = ["standard", "image", "video", "pdf", "carousel", "catalog"] as const;
export type MediaType = typeof mediaTypesArray[number];

// Tone types for dropdown
export const toneTypesArray = ["professional", "friendly", "empathetic", "cheeky", "sincere", "urgent"] as const;
export type ToneType = typeof toneTypesArray[number];

// Media type descriptions for display
export const mediaTypeDescriptions: Record<MediaType, string> = {
  standard: "Standard Text (4,096 chars)",
  image: "Image + Text (4,096 chars caption)",
  video: "Video + Text (4,096 chars caption)",
  pdf: "PDF Document (4,096 chars + 100MB file)",
  carousel: "Carousel (2-10 cards, 1,024 chars each)",
  catalog: "Catalog (4,096 chars + product list)"
};

// Tone type descriptions for display
export const toneTypeDescriptions: Record<ToneType, string> = {
  professional: "Professional (Corporate, formal language)",
  friendly: "Friendly (Warm, approachable)",
  empathetic: "Empathetic (Understanding, supportive)",
  cheeky: "Cheeky (Playful, humorous)",
  sincere: "Sincere (Genuine, heartfelt)",
  urgent: "Urgent (Time-sensitive, action-oriented)"
};
