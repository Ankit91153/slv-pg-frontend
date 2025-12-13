import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bedService } from '../api/services/bedService';

export const useBeds = () => {
  return useQuery({
    queryKey: ['beds'],
    queryFn: bedService.getAllBeds,
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
      queryClient.invalidateQueries({ queryKey: ['beds'] });
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
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
};
