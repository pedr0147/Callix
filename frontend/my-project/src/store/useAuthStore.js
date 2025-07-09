import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { createSocket } from "../lib/socket";
import { getBaseURL } from "../lib/baseUrl.js";

const API_URL = getBaseURL();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,


  // Verificar estado de autenticação
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Registar
  signup: async (data) => {
  set({ isSigningUp: true });
  try {
    const res = await axiosInstance.post("/api/auth/signup", data); // data já inclui recaptchaToken
    set({ authUser: res.data });
    toast.success("Account created successfully");
    get().connectSocket();
  } catch (error) {
    toast.error("Error signing up: " + (error.response?.data?.message || ""));
  } finally {
    set({ isSigningUp: false });
  }
},

  // Iniciar sessão
  login: async (data) => {
  set({ isLoggingIn: true });
  try {
    await get().disconnectSocket();
    const res = await axiosInstance.post("/api/auth/login", data); // data já inclui recaptchaToken
    set({ authUser: res.data });
    toast.success("Logged in successfully");
    get().connectSocket();
  } catch (error) {
    toast.error("Error logging in: " + (error.response?.data?.message || ""));
    throw error;
  } finally {
    set({ isLoggingIn: false });
  }
},

  // Terminar sessão
  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out: " + (error.response?.data?.message || ""));
    }
  },

  // Atualizar perfil
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/api/auth/update", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  changePassword: async ({ currentPassword, newPassword }) => {
  try {
    await axiosInstance.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    toast.success("Password changed successfully");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error changing password"
    );
    throw error;
  }
},

deleteAccount: async ({email, password, recaptchaToken}) => {
  try {
    await axiosInstance.post("/api/auth/delete-account", {
      email,
      password,
      recaptchaToken,
    });
    get().disconnectSocket();
    set({ authUser: null });
    toast.success("Account deleted successfully.");
  } catch (error) {
    console.error("Error deleting account:", error);
    toast.error(
      error.response?.data?.message || "Error deleting account."
    );
    throw error;
  }
},


  // Conectar socket
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser?._id) return; // Só conectar se o utilizador estiver autenticado
    if (socket?.connected) return; // Já está conectado

    const newSocket = createSocket(authUser._id);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  // Desconectar socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
