import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: '',
};

// This slice just holds the current text of the global search bar
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // This is the only action we need.
    // It sets the query to whatever the user types.
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = searchSlice.actions;

export default searchSlice.reducer;