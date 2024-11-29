"use client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Features/counter/counterSlice";
import currencyReducer from "./Features/currency/currencySlice";
import customerReducer from "./Features/customer/customerSlice";
import staffReducer from "./Features/staff/staffSlice";
import receiptReducer from "./Features/receipt/receiptSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currency: currencyReducer,
    customer: customerReducer,
    staff: staffReducer,
    receipt: receiptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
