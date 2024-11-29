"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCurrencies } from "@/actions/currency.server.action";
import { Currency } from "@/db/schema";

interface CurrencyState {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  currencies: [],
  loading: false,
  error: null,
};

export const fetchCurrencies = createAsyncThunk("currency", async () => {
  const result = await getCurrencies();
  return result;
});

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    appendCurrency: (state, action: PayloadAction<Currency>) => {
      state.currencies.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch currencies";
      });
  },
});

export const { appendCurrency } = currencySlice.actions;

export default currencySlice.reducer;
