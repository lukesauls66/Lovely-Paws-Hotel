import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  booking: null,
  bookings: [],
  loading: false,
  errors: null,
};

export const getAllBookings = createAsyncThunk(
  "booking/getAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/bookings/");
      const data = await res.json();
      console.log("bookings after delete:", data.bookings);
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || "Trouble getting All Bookings");
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Trouble getting Booking by Id");
    }
  }
);

export const getBookingByPetId = createAsyncThunk(
  "booking/getBookingByPetId",
  async (petId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/bookings/pet/${petId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Trouble getting Booking by Pet Id"
      );
    }
  }
);

export const getBookingsByUser = createAsyncThunk(
  "booking/getBookingsByUser",
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
  "booking/getBookingsByDate",
  async ({ date }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/bookings/date/${date}`);
      const data = await res.json();
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.message || "Trouble getting Booking by Date"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (
    { client_id, pet_id, booking_type, drop_off_date, pick_up_date, services },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id,
          pet_id,
          booking_type,
          drop_off_date,
          pick_up_date,
          services,
        }),
      });
      console.log("res > ", res);
      const data = await res.json();
      console.log("data > ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Create Booking Failed");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async (
    {
      id,
      client_id,
      pet_id,
      booking_type,
      drop_off_date,
      pick_up_date,
      services,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          client_id,
          pet_id,
          booking_type,
          drop_off_date,
          pick_up_date,
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
  "booking/deleteBooking",
  async (booking_id, { rejectWithValue }) => {
    try {
      await fetch(`/api/bookings/${booking_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete booking");
      }

      return;
    } catch (error) {
      return rejectWithValue(error.message || "Delete booking Failed");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(getBookingByPetId.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getBookingByPetId.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getBookingByPetId.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(getBookingsByUser.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getBookingsByUser.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByDate.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getBookingsByDate.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getBookingsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = null;
      });
  },
});

export default bookingSlice.reducer;
