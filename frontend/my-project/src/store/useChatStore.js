import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {},
  unreadCount: 0,

  incrementeUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnread: () => set({ unreadCount: 0 }),

  selectUser: (userId) => {
    set({ selectedUser: userId });
    get().resetUnread(userId);
  },
  addMessage: (message) => {
    const { selectedUser } = get();
    if (!selectedUser || selectedUser._id !== message.senderId) {
      get().incrementeUnread();
    }
    set((state) => ({ messages: [...state.messages, message] }));
  },

  clearUnread: (userId) =>
    set((state) => {
      if (!userId || !state.unreadMessages[userId]) return {};
      const updated = { ...state.unreadMessages };
      delete updated[userId];
      return { unreadMessages: updated };
    }),


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: Array.isArray(res.data.messages) ? res.data.messages : [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket?.off) socket.off("newMessage");
  },

  //setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser?._id) {
      get().clearUnread(selectedUser._id);
    }
  },

  setMessages: (updater) =>
    set((state) => ({
      messages: typeof updater === "function" ? updater(state.messages) : updater,
    })),
}));
