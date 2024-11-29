"use client";

import { getAllCustomers } from "@/actions/customer.server.action";
import { Customer } from "@/db/schema";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk("customer", async () => {
  const result = await getAllCustomers();
  return result;
});

const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    appendCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});

export const { appendCustomer } = CustomerSlice.actions;

export default CustomerSlice.reducer;
