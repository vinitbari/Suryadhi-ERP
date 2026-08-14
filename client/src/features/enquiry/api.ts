import apiClient from '@/lib/api-client';

export const enquiryApi = {
  list: (params?: Record<string, string>) => apiClient.get('/enquiries', { params }),
  getById: (id: string) => apiClient.get(`/enquiries/${id}`),
  create: (data: any) => apiClient.post('/enquiries', data),
  update: (id: string, data: any) => apiClient.put(`/enquiries/${id}`, data),
  addFollowUp: (id: string, data: any) => apiClient.post(`/enquiries/${id}/follow-ups`, data),
  convert: (id: string, data: any) => apiClient.post(`/admissions`, { ...data, enquiryId: id }),
};
