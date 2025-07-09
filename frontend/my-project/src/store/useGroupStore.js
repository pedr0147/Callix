import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useGroupStore = create((set) => ({
  groups: [],

  fetchGroups: async () => {
    const res = await axiosInstance.get("/groups/my");
    set({ groups: res.data });
  },

  createGroup: async (name, members) => {
    const res = await axiosInstance.post("/groups/create", { name, members });
    set((state) => ({ groups: [...state.groups, res.data] }));
  },
}));
