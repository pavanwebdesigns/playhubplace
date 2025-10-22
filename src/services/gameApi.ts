import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the types (Unchanged)
export interface Game {
  id: string;
  title: string;
  namespace: string;
  description: string;
  category: string;
  orientation: string;
  quality_score: number;
  width: number;
  height: number;
  date_modified: string;
  date_published: string;
  banner_image: string;
  image: string;
  url: string;
}

export interface GamesResponse {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  next_url: string;
  first_page_url: string;
  last_page_url: string;
  modified: string;
  items: Game[];
}

// Create the API slice
export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://feeds.gamepix.com/v2/json',
  }),
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    getGames: builder.query<GamesResponse, { page?: number; pagination?: number }>({
      query: ({ page = 1, pagination = 96 } = {}) => ({
        url: '',
        params: {
          sid: 'S7100',
          pagination,
          page,
        },
      }),
      // We keep providesTags for the main list
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Game' as const, id })),
              { type: 'Game', id: 'LIST' },
            ]
          : [{ type: 'Game', id: 'LIST' }],
    }),
    getGameById: builder.query<Game, string>({
      query: (id) => ({
        url: `/${id}`,
        params: {
          sid: 'S7100',
        },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Game', id }],
    }),

    // --- NEW SEARCH ENDPOINT ---
    searchGames: builder.query<GamesResponse, string>({
      query: (searchQuery) => ({
        url: '',
        params: {
          sid: 'S7100',
          q: searchQuery, // Add the 'q' parameter for search
          pagination: 96, // Show up to 96 search results
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Game' as const, id })),
              { type: 'Game', id: 'SEARCH_LIST' },
            ]
          : [{ type: 'Game', id: 'SEARCH_LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components
// --- EXPORT THE NEW LAZY QUERY HOOK ---
export const { 
  useGetGamesQuery, 
  useGetGameByIdQuery, 
  useLazySearchGamesQuery // We use the "Lazy" hook
} = gameApi;