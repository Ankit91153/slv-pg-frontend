import axiosInstance from '../axiosConfig';

export const floorService = {
  // Get all floors
  getAllFloors: async () => {
    const response = await axiosInstance.get('/pg-floor');
    
    return response.data.data;
  },

  // Get single floor by ID
  getFloorById: async (id) => {
    const response = await axiosInstance.get(`/pg-floor/${id}`);
    return response.data;
  },

  // Create new floor
  createFloor: async (floorData) => {
    console.log(floorData,"FFFFFFFFF");
    
    const response = await axiosInstance.post('/pg-floor', floorData);
    return response.data;
  },

  // Update floor
  updateFloor: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/pg-floor/${id}`, data);
    return response.data;
  },

  // Delete floor
  deleteFloor: async (id) => {
    const response = await axiosInstance.delete(`/pg-floor/${id}`);
    return response.data;
  },
};
