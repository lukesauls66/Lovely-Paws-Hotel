import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllPets = createAsyncThunk(
  'pets/fetchAllPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/pets');
      const responseText = await response.text();
      console.log('Response:', responseText);
      if (!response.ok) {
        throw new Error(`Error fetching pets: ${responseText}`);
      }
      return JSON.parse(responseText);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPets = createAsyncThunk(
  'pets/fetchUserPets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.session.user;
      if (!user) {
        throw new Error('You must be logged in to view your pets!');
      }
      const response = await fetch('/api/pets/user');
      const responseText = await response.text();
      console.log('Response:', responseText);
      if (!response.ok) {
        throw new Error(`Error fetching pets: ${responseText}`);
      }
      return JSON.parse(responseText);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPet = createAsyncThunk(
  'pets/addPet',
  async (pet, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      if (!response.ok) {
        throw new Error('Error adding pet');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePet = createAsyncThunk(
  'pets/updatePet',
  async ({ id, pet }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      if (!response.ok) {
        throw new Error('Error updating pet');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePet = createAsyncThunk(
  'pets/deletePet',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Error deleting pet');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const petsSlice = createSlice({
  name: 'pets',
  initialState: {
    pets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllPets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets = action.payload.Pets;
      })
      .addCase(fetchAllPets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserPets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets = action.payload.Pets;
      })
      .addCase(fetchUserPets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.pets.push(action.payload);
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        state.pets[index] = action.payload;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((pet) => pet.id !== action.payload);
      });
  },
});

export default petsSlice.reducer;