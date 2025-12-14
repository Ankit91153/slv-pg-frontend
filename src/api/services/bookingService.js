import axiosInstance from '../axiosConfig';

export const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    const response = await axiosInstance.get('/pg-booking');
    console.log(response,"RRRRRRRR");
    
    return response.data.data;
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/pg-booking/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/pg-booking', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/pg-booking/${id}`, data);
    return response.data;
  },

  // Delete booking
  deleteBooking: async (id) => {
    const response = await axiosInstance.delete(`/pg-booking/${id}`);
    return response.data;
  },
};
