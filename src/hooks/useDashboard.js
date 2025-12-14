import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
