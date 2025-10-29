import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const disputeApi = createApi({
  reducerPath: 'disputeApi',
  baseQuery,
  tagTypes: ['Dispute'],
  endpoints: (builder) => ({
    createDispute: builder.mutation({
      query: (data) => ({
        url: '/disputes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Dispute'],
    }),
    getDisputes: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/disputes?${params.toString()}`;
      },
      providesTags: ['Dispute'],
    }),
    getDispute: builder.query({
      query: (id) => `/disputes/${id}`,
      providesTags: ['Dispute'],
    }),
    addDisputeMessage: builder.mutation({
      query: ({ id, message, attachments }) => ({
        url: `/disputes/${id}/messages`,
        method: 'POST',
        body: { message, attachments },
      }),
      invalidatesTags: ['Dispute'],
    }),
    resolveDispute: builder.mutation({
      query: ({ id, resolution, resolution_notes }) => ({
        url: `/disputes/${id}/resolve`,
        method: 'POST',
        body: { resolution, resolution_notes },
      }),
      invalidatesTags: ['Dispute'],
    }),
    escalateDispute: builder.mutation({
      query: ({ id, escalation_reason }) => ({
        url: `/disputes/${id}/escalate`,
        method: 'POST',
        body: { escalation_reason },
      }),
      invalidatesTags: ['Dispute'],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetDisputesQuery,
  useGetDisputeQuery,
  useAddDisputeMessageMutation,
  useResolveDisputeMutation,
  useEscalateDisputeMutation,
} = disputeApi;
