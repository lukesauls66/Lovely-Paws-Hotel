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
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Issue getting all services");
    }
  }
);

export const createNewService = createAsyncThunk(
  "service/createNewService",
  async ({ service, price, staff }, { rejectWithValue }) => {
    try {
      const res = await fetch("api/services/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          price,
          staff,
        }),
      });
      console.log("res:", res);
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      console.log("data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Could not create new spot");
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
      })
      .addCase(createNewService.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createNewService.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(createNewService.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
      });
  },
});

export default serviceSlice.reducer;
