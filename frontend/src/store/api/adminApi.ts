import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
    }),
    getAllUsers: builder.query({
      query: ({ role, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/users?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getAllOrganizations: builder.query({
      query: ({ search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/organizations?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getAllVendors: builder.query({
      query: ({ kycStatus, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (kycStatus) params.append('kycStatus', kycStatus);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/vendors?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getAllRfqs: builder.query({
      query: ({ status, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/rfqs?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getAllContracts: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/contracts?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getSystemLogs: builder.query({
      query: ({ level, startDate, endDate, search, page = 1, limit = 50 }) => {
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/admin/logs?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getFinancialReports: builder.query({
      query: ({ startDate, endDate, reportType }) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (reportType) params.append('reportType', reportType);
        return `/admin/reports/financial?${params.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    getSystemSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Admin'],
    }),
    updateSystemSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: { settings },
      }),
      invalidatesTags: ['Admin'],
    }),
    suspendUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/admin/users/${userId}/suspend`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Admin'],
    }),
    activateUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/activate`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetAllUsersQuery,
  useGetAllOrganizationsQuery,
  useGetAllVendorsQuery,
  useGetAllRfqsQuery,
  useGetAllContractsQuery,
  useGetSystemLogsQuery,
  useGetFinancialReportsQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
} = adminApi;
