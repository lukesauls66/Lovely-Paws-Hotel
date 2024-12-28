import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
    loading: false,
    errors: null
}

export const getAllReviews = createAsyncThunk(
    "review/getAllReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/reviews");
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Error getting reviews: ${data.message}`);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Error fetching all reviews");
        }
    }
);

export const getOrderedReviews = createAsyncThunk(
    "review/getOrderedReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/reviews/ordered");
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Error getting reviews: ${data.message}`);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Error fetching ordered reviews");
        }
    }
)

export const createNewReview = createAsyncThunk(
    "review/createNewReview",
    async ({ review, paws }, { rejectWithValue }) => {
        try {
            const res = await fetch("api/reviews/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    review,
                    paws,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Could not create new review");
        }
    }
);

export const updateReview = createAsyncThunk(
    "review/updateReview",
    async ({ id, review }, { rejectWithValue }) => {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error updating review.");
        }
        return data;
      } catch (error) {
        return rejectWithValue(error.message || "Error updating review.");
      }
    }
);

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Error deleting review: ${data.message}`);
            }
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Error deleting user review");
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReviews.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
            })
            .addCase(getOrderedReviews.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(getOrderedReviews.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(getOrderedReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
            })
            .addCase(createNewReview.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(createNewReview.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(createNewReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
            })
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reviews.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((review) => review.id !== action.payload);
            })
    },
});

export default reviewSlice.reducer;

