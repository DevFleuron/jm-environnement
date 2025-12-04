import api from "./axios";
import Cookies from "js-cookie";

export const authService = {
  // Login
  async login(username, password) {
    const { data } = await api.post("/auth/login", { username, password });
    if (data.token) {
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("role", data.user.role, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
    }
    return data;
  },

  // Logout
  logout() {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    window.location.href = "/login";
  },

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userStr = Cookies.get("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated() {
    return !!Cookies.get("token");
  },

  isAdmin() {
    return Cookies.get("role") === "admin";
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async changePassword(oldPassword, newPassword) {
    const { data } = await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return data;
  },
};

export const userService = {
  async createUser(userData) {
    const { data } = await api.post("/auth/users", userData);
    return data;
  },

  async getAllUsers() {
    const { data } = await api.get("/auth/users");
    return data;
  },

  async getUserById(id) {
    const { data } = await api.get(`/auth/users/${id}`);
    return data;
  },

  async updateUser(id, userData) {
    const { data } = await api.put(`/auth/users/${id}`, userData);
    return data;
  },

  async deleteUser(id) {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
  },
};
