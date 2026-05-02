import { type Contact } from "~/types/chat";
import { useProfileStore } from "#imports";

export const useCallStore = defineStore("call", () => {
  const profileStore = useProfileStore();
  const isActive = ref(false);
  const isPiP = ref(false);
  const localStream = ref<MediaStream | null>(null);
  const remoteStream = ref<MediaStream | null>(null);

  const initCall = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    isActive.value = true;
  };

  const callMembers = computed<Contact[]>(() => {
  // 1. Format current user from Profile Store as a Contact
  const currentUser: Contact = {
    ...profileStore.userData,
    isOnline: true,
    lastSeen: new Date(),
    isActive: false,
    unreadCount: 0,
    serviceType: "chat",
    birthDate: profileStore.userData.birthDate || new Date(),
  };

  // 2. Create 4 mock members to reach a total of 5
  const mockMembers: Contact[] = Array(4).fill(null).map((_, i) => ({
    id: i + 2, // Unique ID starting from 2
    name: "امیر",
    lastName: "سعیدی",
    isOnline: true,
    lastSeen: new Date(),
    imageUrl: `https://i.pravatar.cc/150?u=${i + 2}`,
    isActive: false,
    unreadCount: 2,
    serviceType: "chat",
    birthDate: new Date(),
  }));

  return [currentUser, ...mockMembers];
});

  return {
    isActive,
    isPiP,
    localStream,
    remoteStream,
    initCall,
    callMembers,
  };
});
