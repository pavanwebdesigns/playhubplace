import { createSlice } from '@reduxjs/toolkit';
// We need the 'Game' type. We must use `import type`
import type { Game } from '../services/gameApi';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface GameListState {
  allGames: Game[];
  fetchPage: number;
  hasLoadedAll: boolean;
}

const initialState: GameListState = {
  allGames: [],
  fetchPage: 1,
  hasLoadedAll: false,
};

// This slice manages the *state* of our game catalog
export const gameListSlice = createSlice({
  name: 'gameList',
  initialState,
  reducers: {
    // Adds new games to the list, avoiding duplicates
    appendGames: (state, action: PayloadAction<Game[]>) => {
      const existingIds = new Set(state.allGames.map(g => g.id));
      const newGames = action.payload.filter(g => !existingIds.has(g.id));
      state.allGames.push(...newGames);
    },
    // Tells the app to fetch the next page
    goToNextPage: (state) => {
      state.fetchPage += 1;
    },
    // Marks the fetch as complete so it doesn't run again
    setHasLoadedAll: (state, action: PayloadAction<boolean>) => {
      state.hasLoadedAll = action.payload;
    },
  },
});

export const { appendGames, goToNextPage, setHasLoadedAll } = gameListSlice.actions;

export default gameListSlice.reducer;