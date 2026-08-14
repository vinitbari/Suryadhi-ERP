import apiClient from '@/lib/api-client';

export const dashboardApi = {
  getKPIs: () => apiClient.get('/dashboard/kpis'),
  getFinancials: () => apiClient.get('/dashboard/financials'),
  getProgramCounts: () => apiClient.get('/dashboard/program-counts'),
  getFeeRateCard: () => apiClient.get('/dashboard/fee-rate-card'),
};
