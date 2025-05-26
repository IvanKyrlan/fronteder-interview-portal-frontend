import api from "./api";

const authService = {
  async login(username, password) {
    try {
      const response = await api.post("auth/login/", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  async register(username, email, password, password_confirm) {
    try {
      const response = await api.post("auth/register/", {
        username,
        email,
        password,
        password_confirm,
      });
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },

  async refreshToken(refreshToken) {
    try {
      const response = await api.post("auth/token/refresh/", {
        refresh: refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const response = await api.get("user/profile/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  async updateUserProfile(profileData) {
    try {
      const response = await api.put("user/profile/", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post("user/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  },
};

export default authService;
