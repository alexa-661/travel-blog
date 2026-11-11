import { createSlice, configureStore, type PayloadAction } from '@reduxjs/toolkit';
import { languageOptions } from '../constants/constants';
import type { Language } from '../types/types';

interface GlobalState {
   selectedLanguage: Language;
}

const initialState: GlobalState = {
   selectedLanguage: languageOptions[0],
};

const globalSlice = createSlice({
   name: 'global',
   initialState,
   reducers: {
      setSelectedLanguage: (state, action: PayloadAction<Language>) => {
         state.selectedLanguage = action.payload;
      }
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
