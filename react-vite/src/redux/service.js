import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  service: null,
  services: [],
  loading: false,
  errors: null,
};

export const getAllServices = createAsyncThunk(
  "service/getAllServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/services/");
      console.log("res:", res);
      const data = await res.json();
      console.log("data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Issue getting all services");
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      });
  },
});

export default serviceSlice.reducer;
