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
            console.log("RESPONSE:", response);

            const data = await response.json();
            console.log('DATA:', data);
            if (!response.ok) {
                throw new Error(`Error getting reviews: ${data.message}`);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Error fetching all reviews");
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
                state.reviews = action.payload.reviews; // Access the `reviews` array correctly
            });            
    },
});

export default reviewSlice.reducer;
