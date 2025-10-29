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

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery,
  tagTypes: ['Organization'],
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: '/organizations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),
    getOrganizations: builder.query({
      query: ({ page = 1, limit = 10 }) => `/organizations?page=${page}&limit=${limit}`,
      providesTags: ['Organization'],
    }),
    getOrganization: builder.query({
      query: (id) => `/organizations/${id}`,
      providesTags: ['Organization'],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/organizations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organization'],
    }),
    addPreferredVendor: builder.mutation({
      query: ({ id, vendorId }) => ({
        url: `/organizations/${id}/preferred-vendors`,
        method: 'POST',
        body: { vendorId },
      }),
      invalidatesTags: ['Organization'],
    }),
    removePreferredVendor: builder.mutation({
      query: ({ id, vendorId }) => ({
        url: `/organizations/${id}/preferred-vendors/${vendorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useAddPreferredVendorMutation,
  useRemovePreferredVendorMutation,
} = organizationApi;
