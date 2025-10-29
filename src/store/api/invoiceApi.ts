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

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery,
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
    }),
    getInvoicesForContract: builder.query({
      query: ({ contractId, page = 1, limit = 10 }) =>
        `/invoices/contracts/${contractId}?page=${page}&limit=${limit}`,
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice'],
    }),
    approveInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    rejectInvoice: builder.mutation({
      query: ({ id, rejectionReason }) => ({
        url: `/invoices/${id}/reject`,
        method: 'POST',
        body: { rejectionReason },
      }),
      invalidatesTags: ['Invoice'],
    }),
    markInvoiceAsPaid: builder.mutation({
      query: ({ id, paymentMethod, transactionId }) => ({
        url: `/invoices/${id}/mark-paid`,
        method: 'POST',
        body: { paymentMethod, transactionId },
      }),
      invalidatesTags: ['Invoice'],
    }),
    processInvoicePayment: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/process-payment`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    uploadInvoiceAttachments: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/invoices/${id}/attachments`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoicesForContractQuery,
  useGetInvoiceQuery,
  useApproveInvoiceMutation,
  useRejectInvoiceMutation,
  useMarkInvoiceAsPaidMutation,
  useProcessInvoicePaymentMutation,
  useUploadInvoiceAttachmentsMutation,
} = invoiceApi;
