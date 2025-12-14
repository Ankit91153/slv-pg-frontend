import { useQuery } from '@tanstack/react-query';
import { userService } from '../api/services/userService';

export const useTenantUsers = () => {
  return useQuery({
    queryKey: ['tenantUsers'],
    queryFn: userService.getAllTenantUsers,
  });
};
