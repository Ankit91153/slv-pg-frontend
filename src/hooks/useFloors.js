import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { floorService } from "../api/services/floorService";

export const useFloors = () => {
  return useQuery({
    queryKey: ["floors"],
    queryFn: floorService.getAllFloors,
  });
};

export const useFloor = (id) => {
  return useQuery({
    queryKey: ["floor", id],
    queryFn: () => floorService.getFloorById(id),
    enabled: !!id,
  });
};

export const useCreateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floorService.createFloor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

export const useUpdateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floorService.updateFloor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

export const useDeleteFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floorService.deleteFloor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};
