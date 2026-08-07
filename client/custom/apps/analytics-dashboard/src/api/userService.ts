import { apiClient } from './client';
import { UserRecord } from '../types';

export const userService = {
  async getUsers(): Promise<UserRecord[]> {
    try {
      const response = await apiClient.get('/User', {
        params: {
          maxSize: 100,
          select: 'id,name,userName',
          orderBy: 'name'
        }
      });
      return response.data.list || [];
    } catch (error) {
      console.warn('[Analytics BI] Failed to fetch users from EspoCRM API.', error);
      return [];
    }
  }
};
