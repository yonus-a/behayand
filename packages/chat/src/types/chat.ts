/**
 * Core chat types - decoupled from any specific backend or framework
 */

export type MessageType = "text" | "image" | "file" | "voice" | "video";
export type MessageStatus = "pending" | "approved" | "rejected" | "expired";

export interface Message {
  id: number;
  conversationId: number;
  date: Date;
  type: MessageType;
  text?: string;
  imageUrl?: string[];
  fileUrl?: string;
  voiceUrl?: string;
  videoUrl?: string;
  isEdited: boolean;
  senderId: number;
  isSent: boolean;
  isRead: boolean;
  repliedTo?: Message | null;
  request?: Request;
}

export interface Contact {
  id: number;
  name: string;
  lastName: string;
  isOnline: boolean;
  lastSeen: Date;
  imageUrl: string;
  nationalCode?: string;
  phoneNumber?: string;
  isActive: boolean;
  birthDate?: Date;
  lastMessage?: Message;
  unreadCount?: number;
  serviceType?: "video-call" | "voice-call" | "chat";
  userType?: string[];
}

export type FilterKeys = "" | "online" | "ended" | "active";

export interface ChatFilter {
  key: FilterKeys;
  label: string;
}

export interface ExtendedMessage extends Message {
  prevMessage?: Message;
  nextMessage?: Message;
  isFirstInDate: boolean;
  contact?: Contact;
}

export interface Request {
  id: number;
  type: "personal-info" | "add-person";
  request: AccessRequest | ServiceRequest;
}

export interface AccessRequest {
  id: number;
  date: Date;
  status: MessageStatus;
}

export interface ServiceProvider {
  id: number;
  name?: string;
  lastName?: string;
  imageUrl?: string;
  expertise?: string;
  fellowship?: string;
  price?: number;
  status: "pending" | "approved" | "payment" | "rejected" | "expired";
}

export interface ServiceRequest {
  id: number;
  label?: string;
  icon?: string;
  status?:
    | "searching"
    | "pending"
    | "approved"
    | "payment"
    | "rejected"
    | "expired";
  provider?: ServiceProvider[];
  service?: { id: number; label?: string; icon?: string };
  invoice?: { id: number; amount?: number; status?: string };
}
