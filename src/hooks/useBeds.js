import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bedService } from '../api/services/bedService';

export const useBeds = (filters = {}) => {
  return useQuery({
    queryKey: ['beds', filters],
    queryFn: () => bedService.getAllBeds(filters),
  });
};

export const useBed = (id) => {
  return useQuery({
    queryKey: ['bed', id],
    queryFn: () => bedService.getBedById(id),
    enabled: !!id,
  });
};

export const useCreateBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bedService.createBed,
    onSuccess: () => {
      // Invalidate beds list
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      // Invalidate available rooms to refresh capacity
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      // Invalidate rooms list to update bed counts
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bedService.updateBed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
};

export const useDeleteBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bedService.deleteBed,
    onSuccess: () => {
      // Invalidate beds list
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      // Invalidate available rooms to refresh capacity
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      // Invalidate rooms list to update bed counts
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
