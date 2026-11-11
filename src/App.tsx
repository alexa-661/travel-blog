import { Route, Routes } from 'react-router'
import './App.css'
import NavBar from './components/NavBar'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'
import ArticlePage from './components/pages/ArticlePage'
import Footer from './components/Footer'
import HomePage from './components/pages/HomePage'
import GalleryPage from './components/pages/GalleryPage'
import SinglePage from './components/pages/SinglePage'
import ArticlesPage from './components/pages/ArticlesPage'
import { useAppDispatch } from './hooks/customHooks'
import { fetchFeedPosts, setSelectedLanguage } from './store/globalSlice'
import { useEffect } from 'react'
import { languageOptions, STORAGE_KEY } from './constants/constants'
import type { Language } from './types/types'

function App() {

   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(fetchFeedPosts());
      const savedLanguage: string | null = localStorage.getItem(STORAGE_KEY);
      const initialLanguage = (): Language =>
      {
         if (savedLanguage === null)
         {
            return languageOptions[0];
         }
         return languageOptions.find((language) => language === savedLanguage) ?? languageOptions[0];

      }
      dispatch(setSelectedLanguage(initialLanguage()));

   }, [dispatch]);

   return (
      <>
         <NavBar />
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<SinglePage title="About" children={<AboutPage />} />} />
            <Route path="/contact" element={<SinglePage title="Contact" children={<ContactPage />} />} />
            <Route path="/articles" element={<SinglePage title="Articles" children={<ArticlesPage />} />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/gallery" element={<SinglePage title="Gallery" children={<GalleryPage />} />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
