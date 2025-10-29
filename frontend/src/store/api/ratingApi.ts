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

export const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery,
  tagTypes: ['Rating'],
  endpoints: (builder) => ({
    createRating: builder.mutation({
      query: (data) => ({
        url: '/ratings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rating'],
    }),
    getVendorRatings: builder.query({
      query: ({ vendorId, page = 1, limit = 10 }) => `/ratings/vendors/${vendorId}?page=${page}&limit=${limit}`,
      providesTags: ['Rating'],
    }),
    getClientRatings: builder.query({
      query: ({ clientId, page = 1, limit = 10 }) => `/ratings/clients/${clientId}?page=${page}&limit=${limit}`,
      providesTags: ['Rating'],
    }),
    updateRating: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/ratings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Rating'],
    }),
    deleteRating: builder.mutation({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rating'],
    }),
  }),
});

export const {
  useCreateRatingMutation,
  useGetVendorRatingsQuery,
  useGetClientRatingsQuery,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} = ratingApi;
