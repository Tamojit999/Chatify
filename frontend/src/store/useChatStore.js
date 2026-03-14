import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isChatsLoading: false,
  isMessagesLoading: false,
  isSoundEnabled:
    localStorage.getItem("isSoundEnabled") === "true" ? true : false,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  setSelectuser: (user) => {
    set({ selectedUser: user });
  },
  getAllContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      console.log("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      set({ isContactsLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      console.log("Error fetching chat partners:", error);
      toast.error("Failed to fetch chat partners");
    } finally {
      set({ isChatsLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const re = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: re.data });
    } catch (error) {
      console.log("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = "temp-" + Date.now();
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify optimistic messages
    };
    set({ messages: [...messages, optimisticMessage] });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      console.log("Error sending message:", error);

      toast.error("Failed to send message");
    }
  },
}));
