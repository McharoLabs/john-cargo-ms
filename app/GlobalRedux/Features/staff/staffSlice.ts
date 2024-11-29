"use client";

import { getAll } from "@/actions/staff.server.action";
import { Staff } from "@/db/schema";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface StaffState {
  staffs: Staff[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staffs: [],
  loading: false,
  error: null,
};

export const fetchStaffs = createAsyncThunk("Staff", async () => {
  const result = await getAll();
  return result;
});

const StaffSlice = createSlice({
  name: "Staff",
  initialState,
  reducers: {
    appendStaff: (state, action: PayloadAction<Staff>) => {
      state.staffs.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload;
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Staffs";
      });
  },
});

export const { appendStaff } = StaffSlice.actions;

export default StaffSlice.reducer;
