import axiosInstance from '../axiosConfig';

export const roomTypeService = {
  // Get all room types
  getAllRoomTypes: async () => {
    const response = await axiosInstance.get('/pg-room-type');
    console.log(response);
    
    return response.data.data;
  },

  // Get single room type by ID
  getRoomTypeById: async (id) => {
    const response = await axiosInstance.get(`/pg-room-type/${id}`);
    return response.data;
  },

  // Create new room type
  createRoomType: async (roomTypeData) => {
    const response = await axiosInstance.post('/pg-room-type', roomTypeData);
    return response.data;
  },

  // Update room type
  updateRoomType: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/pg-room-type/${id}`, data);
    return response.data;
  },

  // Delete room type
  deleteRoomType: async (id) => {
    const response = await axiosInstance.delete(`/pg-room-type/${id}`);
    return response.data;
  },
};
