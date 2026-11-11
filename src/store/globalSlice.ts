import { createSlice, configureStore, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import DOMPurify from 'dompurify';
import { languageOptions } from '../constants/constants';
import type { Article, ArticleLocation, Coordinates, FeedPost, GeoResult, Language } from '../types/types';
import { parseExcerpt, parseImages, parseLocation } from '../utils/normalizeFeedPost';

type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

interface GlobalState {
   selectedLanguage: Language;
   articles: Article[];
   articlesStatus: LoadingStatus;
   articlesError: string | null;
   coordinatesStatus: LoadingStatus;
   coordinatesError: string | null;
}

const initialState: GlobalState = {
   selectedLanguage: languageOptions[0],
   articles: [],
   articlesStatus: "idle",
   articlesError: null,
   coordinatesStatus: "idle",
   coordinatesError: null
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
         const images = parseImages(contentHTML);
         return [{
            slug: post.title.toLowerCase().trim().replace(/\s+/g, '-'),
            title: post.title,
            subtitle: post.subTitle,
            location: { country: location.country, city: location.city },
            content: DOMPurify.sanitize(post.content), //may not be necessary here
            excerpt:parseExcerpt(contentHTML),
            coordinates: null,
            galleryImages: images
         }]
      });
      return normalizedData;
   }
);

export const fetchCoordinates = createAsyncThunk<GeoResult[], ArticleLocation[]>(
   'global/fetchCoordinates',
   async(locations: ArticleLocation[]) => {
      const response = await fetch('/api/geocode', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ locations }),
      });
      if (!response.ok)
      {
         throw new Error('Could not fetch coordinates');
      }
      const JSONResult = await response.json();
      return JSONResult.results;
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
            state.articlesError = action.error.message || "An error occurred fetching the article data.";
         })
         .addCase(fetchCoordinates.pending, (state) =>{
            state.coordinatesStatus = "loading";
         })
         .addCase(fetchCoordinates.fulfilled, (state, action) => {
            state.coordinatesStatus = "succeeded";
            const coordinatesByLocation = new Map<string, Coordinates | null>(
               action.payload.map((result: GeoResult) => [
                  `${result.city.trim().toLowerCase()}|${result.country.trim().toLowerCase()}`,
                  result.coordinates,
               ])
            );
            console.dir(coordinatesByLocation);

            state.articles.forEach((article) => {
               const key =
                  `${article.location.city.trim().toLowerCase()}|` +
                  article.location.country.trim().toLowerCase();

               const coordinates = coordinatesByLocation.get(key);
               if (coordinates) {
                  article.coordinates = coordinates;
               }
            });            
         })
         .addCase(fetchCoordinates.rejected, (state, action) => {
            state.coordinatesStatus = "failed";
            state.articlesError = action.error.message || "An error occured fetching the coordinates data";
         })
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
