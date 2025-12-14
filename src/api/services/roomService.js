import axiosInstance from "../axiosConfig";

export const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await axiosInstance.get("/pg-room");
    return response.data.data;
  },

  // Get available rooms (rooms with bed capacity)
  getAvailableRooms: async () => {
    const response = await axiosInstance.get("/pg-room/available");
    return response.data;
  },

  // Get single room by ID
  getRoomById: async (id) => {
    const response = await axiosInstance.get(`/pg-room/${id}`);
    return response.data;
  },

  // Create new room
  createRoom: async (roomData) => {
    const response = await axiosInstance.post("/pg-room", roomData);
    return response.data;
  },

  // Update room
  updateRoom: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/pg-room/${id}`, data);
    return response.data;
  },

  // Delete room
  deleteRoom: async (id) => {
    const response = await axiosInstance.delete(`/pg-room/${id}`);
    return response.data;
  },
};
