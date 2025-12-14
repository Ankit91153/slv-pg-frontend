import axiosInstance from '../axiosConfig';

export const userService = {
  // Get all tenant users (for admin)
  getAllTenantUsers: async () => {
    const response = await axiosInstance.get('/auth/users');
    return response.data;
  },
};
