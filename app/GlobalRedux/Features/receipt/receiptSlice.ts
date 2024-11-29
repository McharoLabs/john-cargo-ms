"use client";

import { getAllReceipts } from "@/actions/receipt.server.action";
import { ReceiptWithRelations } from "@/db/schema";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ReceiptState {
  receipts: ReceiptWithRelations[];
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptState = {
  receipts: [],
  loading: false,
  error: null,
};

export const fetchReceipts = createAsyncThunk("receipt", async () => {
  const result = await getAllReceipts();
  return result;
});

const ReceiptSlice = createSlice({
  name: "Receipt",
  initialState,
  reducers: {
    appendReceipt: (state, action: PayloadAction<ReceiptWithRelations>) => {
      state.receipts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch receipts";
      });
  },
});

export const { appendReceipt } = ReceiptSlice.actions;

export default ReceiptSlice.reducer;
