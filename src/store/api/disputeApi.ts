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
    updateDispute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/disputes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Dispute'],
    }),
    uploadDisputeEvidence: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/disputes/${id}/evidence`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Dispute'],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetDisputesQuery,
  useGetDisputeQuery,
  useUpdateDisputeMutation,
  useUploadDisputeEvidenceMutation,
} = disputeApi;
