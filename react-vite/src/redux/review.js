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

// export const getUserReviews = createAsyncThunk(
//     "review/getUserReviews",
//     async (_, { getState, rejectWithValue }) => {
//         try{
//             const state = getState();
//             const user = state.session.user;
//             if (!user) {
//                 throw new Error("You must be logged in to view your reviews");
//             }
//             const response = await fetch('/api/reviews/user');
//             const data = await response.json();
//             console.log("RESPONSE DATA:", data)
//             if (!response.ok) {
//                 throw new Error(`Error getting reviews: ${data.message}`)
//             }
//             return data;
//         } catch (error) {
//             return rejectWithValue(error.message || "Error fetching user reviews");
//         }
//     }
// );


const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all reviews
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
            });
            // .addCase(getUserReviews.pending, (state) => {
            //     state.loading = true;
            //     state.errors = null;
            // })       
            // .addCase(getUserReviews.rejected, (state, action) => {
            //     state.loading = false;
            //     state.errors = action.payload;
            // })
            // .addCase(getUserReviews.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.reviews = action.payload.reviews;
            // })

    },
});

export default reviewSlice.reducer;

