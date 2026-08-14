import apiClient from '@/lib/api-client';

export const admissionApi = {
  list: (params?: Record<string, string>) => apiClient.get('/admissions', { params }),
  getById: (id: string) => apiClient.get(`/admissions/${id}`),
  update: (id: string, data: any) => apiClient.put(`/admissions/${id}`, data),
  graduate: (id: string, data: any) => apiClient.post(`/admissions/${id}/graduate`, data),
  transferOut: (id: string, data: any) => apiClient.post(`/admissions/${id}/transfer-out`, data),
  quit: (id: string, data: any) => apiClient.post(`/admissions/${id}/quit`, data),
  changeName: (id: string, data: any) => apiClient.put(`/admissions/${id}/name-change`, data),
};
