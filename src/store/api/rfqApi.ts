import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const rfqApi = createApi({
  reducerPath: 'rfqApi',
  baseQuery,
  tagTypes: ['RFQ'],
  endpoints: (builder) => ({
    createRfq: builder.mutation({
      query: (data) => ({
        url: '/rfqs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RFQ'],
    }),
    getRfqs: builder.query({
      query: ({ status, category, building, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (category) params.append('category', category);
        if (building) params.append('building', building);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/rfqs?${params.toString()}`;
      },
      providesTags: ['RFQ'],
    }),
    getRfq: builder.query({
      query: (id) => `/rfqs/${id}`,
      providesTags: ['RFQ'],
    }),
    updateRfq: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/rfqs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['RFQ'],
    }),
    publishRfq: builder.mutation({
      query: (id) => ({
        url: `/rfqs/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['RFQ'],
    }),
    uploadRfqAttachments: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/rfqs/${id}/attachments`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['RFQ'],
    }),
    addAddendum: builder.mutation({
      query: ({ id, title, description }) => ({
        url: `/rfqs/${id}/addenda`,
        method: 'POST',
        body: { title, description },
      }),
      invalidatesTags: ['RFQ'],
    }),
    closeRfq: builder.mutation({
      query: (id) => ({
        url: `/rfqs/${id}/close`,
        method: 'POST',
      }),
      invalidatesTags: ['RFQ'],
    }),
    cancelRfq: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/rfqs/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['RFQ'],
    }),
  }),
});

export const {
  useCreateRfqMutation,
  useGetRfqsQuery,
  useGetRfqQuery,
  useUpdateRfqMutation,
  usePublishRfqMutation,
  useUploadRfqAttachmentsMutation,
  useAddAddendumMutation,
  useCloseRfqMutation,
  useCancelRfqMutation,
} = rfqApi;
