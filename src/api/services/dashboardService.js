import axiosInstance from "../axiosConfig";

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await axiosInstance.get("/dashboard/stats");
    return response.data;
  },
};
