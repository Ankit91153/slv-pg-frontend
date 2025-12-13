import axiosInstance from '../axiosConfig';

export const bedService = {
  // Get all beds
  getAllBeds: async () => {
    const response = await axiosInstance.get('/pg-bed');
    return response.data;
  },

  // Get single bed by ID
  getBedById: async (id) => {
    const response = await axiosInstance.get(`/pg-bed/${id}`);
    return response.data;
  },

  // Create new bed
  createBed: async (bedData) => {
    const response = await axiosInstance.post('/pg-bed', bedData);
    return response.data;
  },

  // Update bed
  updateBed: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/pg-bed/${id}`, data);
    return response.data;
  },

  // Delete bed
  deleteBed: async (id) => {
    const response = await axiosInstance.delete(`/pg-bed/${id}`);
    return response.data;
  },
};
