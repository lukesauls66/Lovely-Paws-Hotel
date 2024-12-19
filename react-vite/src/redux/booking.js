import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  booking: null,
  bookings: [],
  loading: false,
  errors: null,
};

export const getAllBookings = createAsyncThunk(
  "bookings/",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/bookings/");
      const data = await res.json();
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || "Trouble getting All Bookings");
    }
  }
);

export const getBookingsByUser = createAsyncThunk(
  "bookings/user",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/bookings/user");
      const data = await res.json();
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.message || "Trouble getting Booking by User"
      );
    }
  }
);

export const getBookingsByDate = createAsyncThunk(
  "bookings/date",
  async ({ date }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/bookings/${date}`);
      const data = await res.json();
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.message || "Trouble getting Booking by Date"
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "bookings/id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.message || "Trouble getting Booking by Id");
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/",
  async (
    {
      client_id,
      pet_id,
      booking_type,
      drop_off_date,
      pick_up_date,
      daily_price,
      services,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id,
          pet_id,
          booking_type,
          drop_off_date,
          pick_up_date,
          daily_price,
          services,
        }),
      });
      const data = await res.json();
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.message || "Create Booking Failed");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/id",
  async (
    {
      booking_id,
      client_id,
      pet_id,
      booking_type,
      drop_off_date,
      pick_up_date,
      daily_price,
      services,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`api/bookings/${booking_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id,
          pet_id,
          booking_type,
          drop_off_date,
          pick_up_date,
          daily_price,
          services,
        }),
      });
      const data = await res.json();
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.message || "Update Booking Failed");
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/id",
  async ({ booking_id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`api/bookings/${booking_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.message || "Delete booking Failed");
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getAllBookings.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(getAllBookings.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(getAllBookings.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.bookings = action.payload;
  //     })
  //     .addCase(getBookingsByUser.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(getBookingsByUser.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(getBookingsByUser.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.bookings = action.payload;
  //     })
  //     .addCase(getBookingsByDate.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(getBookingsByDate.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(getBookingsByDate.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.bookings = action.payload;
  //     })
  //     .addCase(getBookingById.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(getBookingById.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(getBookingById.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.booking = action.payload;
  //     })
  //     .addCase(createBooking.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(createBooking.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(createBooking.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.booking = action.payload;
  //     })
  //     .addCase(updateBooking.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(updateBooking.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(updateBooking.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.booking = action.payload;
  //     })
  //     .addCase(deleteBooking.pending, (state) => {
  //       state.loading = true;
  //       state.errors = null;
  //     })
  //     .addCase(deleteBooking.rejected, (state, action) => {
  //       state.loading = false;
  //       state.errors = action.payload;
  //     })
  //     .addCase(deleteBooking.fulfilled, (state) => {
  //       state.loading = false;
  //       state.booking = null;
  //     });
  // },
});

export default bookingSlice.reducer;
