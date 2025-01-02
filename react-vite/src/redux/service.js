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
      const res = await fetch("/api/services/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          price,
          staff,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Could not create new service");
    }
  }
);

export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ id, service, price, staff }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          service,
          price,
          staff,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Could not update service");
    }
  }
);

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });
      return;
    } catch (error) {
      return rejectWithValue(error.message || "Service was not deleted");
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
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(deleteService.fulfilled, (state) => {
        state.loading = false;
        state.service = null;
      });
  },
});

export default serviceSlice.reducer;
