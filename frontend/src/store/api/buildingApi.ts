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

export const buildingApi = createApi({
  reducerPath: 'buildingApi',
  baseQuery,
  tagTypes: ['Building'],
  endpoints: (builder) => ({
    createBuilding: builder.mutation({
      query: (data) => ({
        url: '/buildings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Building'],
    }),
    getBuildings: builder.query({
      query: ({ page = 1, limit = 10 }) => `/buildings?page=${page}&limit=${limit}`,
      providesTags: ['Building'],
    }),
    getBuilding: builder.query({
      query: (id) => `/buildings/${id}`,
      providesTags: ['Building'],
    }),
    updateBuilding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/buildings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Building'],
    }),
    deleteBuilding: builder.mutation({
      query: (id) => ({
        url: `/buildings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Building'],
    }),
  }),
});

export const {
  useCreateBuildingMutation,
  useGetBuildingsQuery,
  useGetBuildingQuery,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingApi;
