import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  pets: [],
  status: 'idle',
  error: null,
};

export const fetchAllPets = createAsyncThunk(
  'pets/fetchAllPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/pets/');
      const data = await response.json();
      console.log('data:', data);
      if (!response.ok) {
        throw new Error(`Error fetching pets: ${data.message}`);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Issue fetching all pets');
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
      const response = await fetch('/api/pets/user/');
      const data = await response.json();
      console.log('data:', data);
      if (!response.ok) {
        throw new Error(`Error fetching pets: ${data.message}`);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Issue fetching user pets');
    }
  }
);

export const addPet = createAsyncThunk(
  'pets/addPet',
  async (pet, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/pets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Error adding pet: ${data.message}`);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Issue adding pet');
    }
  }
);

export const updatePet = createAsyncThunk(
  'pets/updatePet',
  async ({ id, pet }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pets/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Error updating pet: ${data.message}`);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Issue updating pet');
    }
  }
);

export const deletePet = createAsyncThunk(
  'pets/deletePet',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pets/${id}/`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Error deleting pet: ${data.message}`);
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Issue deleting pet');
    }
  }
);

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
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
        state.error = null;
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