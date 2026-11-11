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
import { fetchFeedPosts } from './store/globalSlice'
import { useEffect } from 'react'

function App() {

   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(fetchFeedPosts());
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
