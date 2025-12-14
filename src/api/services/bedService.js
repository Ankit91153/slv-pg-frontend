import axiosInstance from '../axiosConfig';

export const bedService = {
  // Get all beds with optional filters
  getAllBeds: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.floorNumber) params.append('floorNumber', filters.floorNumber);
    if (filters.roomType) params.append('roomType', filters.roomType);
    
    const response = await axiosInstance.get(`/pg-bed?${params.toString()}`);
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
