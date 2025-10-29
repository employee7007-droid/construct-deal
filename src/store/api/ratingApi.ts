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
    getRatingsForUser: builder.query({
      query: ({ userId, page = 1, limit = 10 }) =>
        `/ratings/users/${userId}?page=${page}&limit=${limit}`,
      providesTags: ['Rating'],
    }),
    getRatingsForContract: builder.query({
      query: (contractId) => `/ratings/contracts/${contractId}`,
      providesTags: ['Rating'],
    }),
    getRating: builder.query({
      query: (id) => `/ratings/${id}`,
      providesTags: ['Rating'],
    }),
  }),
});

export const {
  useCreateRatingMutation,
  useGetRatingsForUserQuery,
  useGetRatingsForContractQuery,
  useGetRatingQuery,
} = ratingApi;
