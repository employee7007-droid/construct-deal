import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { organizationApi } from './api/organizationApi';
import { buildingApi } from './api/buildingApi';
import { vendorApi } from './api/vendorApi';
import { categoryApi } from './api/categoryApi';
import { rfqApi } from './api/rfqApi';
import { bidApi } from './api/bidApi';
import { contractApi } from './api/contractApi';
import { invoiceApi } from './api/invoiceApi';
import { ratingApi } from './api/ratingApi';
import { disputeApi } from './api/disputeApi';
import { adminApi } from './api/adminApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [rfqApi.reducerPath]: rfqApi.reducer,
    [bidApi.reducerPath]: bidApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [ratingApi.reducerPath]: ratingApi.reducer,
    [disputeApi.reducerPath]: disputeApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      buildingApi.middleware,
      vendorApi.middleware,
      categoryApi.middleware,
      rfqApi.middleware,
      bidApi.middleware,
      contractApi.middleware,
      invoiceApi.middleware,
      ratingApi.middleware,
      disputeApi.middleware,
      adminApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
