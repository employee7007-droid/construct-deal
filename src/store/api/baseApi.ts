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

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: [
    'Auth',
    'Organization',
    'Building',
    'Vendor',
    'Category',
    'RFQ',
    'Bid',
    'Contract',
    'Invoice',
    'Rating',
    'Dispute',
    'Admin',
  ],
  endpoints: () => ({}),
});
