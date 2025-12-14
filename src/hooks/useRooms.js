import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../api/services/roomService';

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: roomService.getAllRooms,
  });
};

export const useAvailableRooms = () => {
  return useQuery({
    queryKey: ['availableRooms'],
    queryFn: roomService.getAvailableRooms,
  });
};

export const useRoom = (id) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoomById(id),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
