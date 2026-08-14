import apiClient from '@/lib/api-client';

export const communicationsApi = {
  getAcademicVisits: () => apiClient.get('/communications/academics-visits'),
  getBusinessVisits: () => apiClient.get('/communications/business-visits'),
  getAppReport: () => apiClient.get('/communications/app-report'),
  resendNotification: (id: string) => apiClient.post(`/communications/resend/${id}`),
};

export default communicationsApi;
