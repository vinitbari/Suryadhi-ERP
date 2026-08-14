/**
 * Auth API functions.
 */
import apiClient from '@/lib/api-client';

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),

  signup: (data: any) =>
    apiClient.post('/auth/signup', data),

  logout: () =>
    apiClient.post('/auth/logout'),

  me: () =>
    apiClient.get('/auth/me'),

  refresh: () =>
    apiClient.post('/auth/refresh', {
      refreshToken: localStorage.getItem('refreshToken') || undefined,
    }),

  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),

  listUsers: () =>
    apiClient.get('/auth/users'),

  createUser: (data: any) =>
    apiClient.post('/auth/users', data),

  updateUser: (id: string, data: any) =>
    apiClient.put(`/auth/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete(`/auth/users/${id}`),

  getSchoolsLookup: () =>
    apiClient.get('/lookups/schools'),
};
