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

export const contractApi = createApi({
  reducerPath: 'contractApi',
  baseQuery,
  tagTypes: ['Contract'],
  endpoints: (builder) => ({
    awardContract: builder.mutation({
      query: (data) => ({
        url: '/contracts/award',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contract'],
    }),
    getContracts: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/contracts?${params.toString()}`;
      },
      providesTags: ['Contract'],
    }),
    getContract: builder.query({
      query: (id) => `/contracts/${id}`,
      providesTags: ['Contract'],
    }),
    acceptContract: builder.mutation({
      query: (id) => ({
        url: `/contracts/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Contract'],
    }),
    declineContract: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/contracts/${id}/decline`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Contract'],
    }),
    updateMilestoneProgress: builder.mutation({
      query: ({ contractId, milestoneId, comment, percentage, attachments }) => ({
        url: `/contracts/${contractId}/milestones/${milestoneId}/progress`,
        method: 'POST',
        body: { comment, percentage, attachments },
      }),
      invalidatesTags: ['Contract'],
    }),
    approveMilestone: builder.mutation({
      query: ({ contractId, milestoneId, comment }) => ({
        url: `/contracts/${contractId}/milestones/${milestoneId}/approve`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: ['Contract'],
    }),
    rejectMilestone: builder.mutation({
      query: ({ contractId, milestoneId, comment }) => ({
        url: `/contracts/${contractId}/milestones/${milestoneId}/reject`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: ['Contract'],
    }),
  }),
});

export const {
  useAwardContractMutation,
  useGetContractsQuery,
  useGetContractQuery,
  useAcceptContractMutation,
  useDeclineContractMutation,
  useUpdateMilestoneProgressMutation,
  useApproveMilestoneMutation,
  useRejectMilestoneMutation,
} = contractApi;
