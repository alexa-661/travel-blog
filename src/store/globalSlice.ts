import { createSlice, configureStore, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { languageOptions } from '../constants/constants';
import type { FeedPost, Language } from '../types/types';

type ArticlesStatus = "idle" | "loading" | "succeeded" | "failed";

interface GlobalState {
   selectedLanguage: Language;
   articles: FeedPost[];
   articlesStatus: ArticlesStatus;
   articlesError: string | null;
}

const initialState: GlobalState = {
   selectedLanguage: languageOptions[0],
   articles: [],
   articlesStatus: "idle",
   articlesError: null
};

export const fetchFeedPosts = createAsyncThunk<FeedPost[]>(
   'global/fetchFeedPosts',
   async () =>
   {
      const response = await fetch('/api/posts');
      if (!response.ok)
      {
         throw new Error('Failed to fetch feed posts.');
      }
      const data: FeedPost[] = await response.json();
      console.dir(data);
      return data;
   }
);

const globalSlice = createSlice({
   name: 'global',
   initialState,
   reducers: {
      setSelectedLanguage: (state, action: PayloadAction<Language>) => {
         state.selectedLanguage = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchFeedPosts.pending, (state) => {
            state.articlesStatus = "loading";
         })
         .addCase(fetchFeedPosts.fulfilled, (state, action) => {
            state.articlesStatus = "succeeded";
            state.articles = action.payload;
         })
         .addCase(fetchFeedPosts.rejected, (state, action) => {
            state.articlesStatus = "failed";
            state.articlesError = action.error.message || "An error occurred.";
         });
   }
});

const store = configureStore({
   reducer: {
      global: globalSlice.reducer,
   },
});

export const { setSelectedLanguage } = globalSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
