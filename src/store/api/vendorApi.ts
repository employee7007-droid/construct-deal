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

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
  baseQuery,
  tagTypes: ['Vendor'],
  endpoints: (builder) => ({
    createVendor: builder.mutation({
      query: (data) => ({
        url: '/vendors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vendor'],
    }),
    getVendors: builder.query({
      query: ({ category, city, minRating, featured, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (city) params.append('city', city);
        if (minRating) params.append('minRating', minRating);
        if (featured) params.append('featured', featured);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/vendors?${params.toString()}`;
      },
      providesTags: ['Vendor'],
    }),
    getVendor: builder.query({
      query: (id) => `/vendors/${id}`,
      providesTags: ['Vendor'],
    }),
    updateVendor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vendors/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vendor'],
    }),
    uploadKycDocuments: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/vendors/${id}/kyc-documents`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Vendor'],
    }),
    approveVendor: builder.mutation({
      query: (id) => ({
        url: `/vendors/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Vendor'],
    }),
    rejectVendor: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/vendors/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Vendor'],
    }),
    getPendingVendors: builder.query({
      query: ({ page = 1, limit = 10 }) => `/vendors/pending?page=${page}&limit=${limit}`,
      providesTags: ['Vendor'],
    }),
  }),
});

export const {
  useCreateVendorMutation,
  useGetVendorsQuery,
  useGetVendorQuery,
  useUpdateVendorMutation,
  useUploadKycDocumentsMutation,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useGetPendingVendorsQuery,
} = vendorApi;
