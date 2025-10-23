import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { gameApi } from '../services/gameApi';
import gameListReducer from './gameListSlice'; 
import searchReducer from './searchSlice'; 

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
    gameList: gameListReducer, 
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gameApi.middleware),
});

setupListeners(store.dispatch);

// This is what `hooks.ts` will use
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;