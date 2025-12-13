import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomTypeService } from '../api/services/roomTypeService';

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: roomTypeService.getAllRoomTypes,
  });
};

export const useRoomType = (id) => {
  return useQuery({
    queryKey: ['roomType', id],
    queryFn: () => roomTypeService.getRoomTypeById(id),
    enabled: !!id,
  });
};

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomTypeService.createRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
    },
  });
};

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomTypeService.updateRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
    },
  });
};

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomTypeService.deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
    },
  });
};
