import axiosInstance from "../axiosConfig";

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data.data;
  },

  verifyOTP: async (otpData) => {
    const response = await axiosInstance.post("/auth/verify-email", otpData);
    return response.data;
  },

  resendOTP: async (data) => {
    const response = await axiosInstance.post("/auth/resend-otp", data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};
