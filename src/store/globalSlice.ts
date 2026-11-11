import { createSlice, configureStore, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import DOMPurify from 'dompurify';
import { languageOptions } from '../constants/constants';
import type { Article, FeedPost, Language } from '../types/types';
import { parseExcerpt, parseHeaderImage, parseLocation } from '../utils/normalizeFeedPost';

type ArticlesStatus = "idle" | "loading" | "succeeded" | "failed";

interface GlobalState {
   selectedLanguage: Language;
   articles: Article[];
   articlesStatus: ArticlesStatus;
   articlesError: string | null;
}

const initialState: GlobalState = {
   selectedLanguage: languageOptions[0],
   articles: [],
   articlesStatus: "idle",
   articlesError: null
};

export const fetchFeedPosts = createAsyncThunk<Article[]>(
   'global/fetchFeedPosts',
   async () =>
   {
      const response = await fetch('/api/posts');
      if (!response.ok)
      {
         throw new Error('Failed to fetch feed posts.');
      }
      const posts: FeedPost[] = await response.json();
      const normalizedData = posts.flatMap((post) =>
      {
         const contentHTML = new DOMParser().parseFromString(post.content ?? '', 'text/html');
         const location = parseLocation(contentHTML);
         if (!location  || !post.title || !post.content)
         {
            return [];
         }
         return [{
            slug: post.title.toLowerCase().trim().replace(/\s+/g, '-'),
            title: post.title,
            subtitle: post.subTitle,
            country: location.country,
            city: location.city,
            content: DOMPurify.sanitize(post.content), //may not be necessary here
            excerpt:parseExcerpt(contentHTML),
            coordinates: {
               latitude: 0, //deal with this later
               longitude: 0
            },
            headerImage: parseHeaderImage(contentHTML),
            // galleryImages?: Image[]
         }]
      });
      return normalizedData;
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
