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

export const bidApi = createApi({
  reducerPath: 'bidApi',
  baseQuery,
  tagTypes: ['Bid'],
  endpoints: (builder) => ({
    submitBid: builder.mutation({
      query: ({ rfqId, ...data }) => ({
        url: `/bids/rfqs/${rfqId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bid'],
    }),
    getBidsForRfq: builder.query({
      query: (rfqId) => `/bids/rfqs/${rfqId}`,
      providesTags: ['Bid'],
    }),
    getBidComparison: builder.query({
      query: (rfqId) => `/bids/rfqs/${rfqId}/comparison`,
      providesTags: ['Bid'],
    }),
    getBid: builder.query({
      query: (id) => `/bids/${id}`,
      providesTags: ['Bid'],
    }),
    updateBid: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/bids/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Bid'],
    }),
    withdrawBid: builder.mutation({
      query: (id) => ({
        url: `/bids/${id}/withdraw`,
        method: 'POST',
      }),
      invalidatesTags: ['Bid'],
    }),
    uploadBidAttachments: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/bids/${id}/attachments`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Bid'],
    }),
  }),
});

export const {
  useSubmitBidMutation,
  useGetBidsForRfqQuery,
  useGetBidComparisonQuery,
  useGetBidQuery,
  useUpdateBidMutation,
  useWithdrawBidMutation,
  useUploadBidAttachmentsMutation,
} = bidApi;
