import { Route, Routes } from 'react-router'
import './App.css'
import NavBar from './components/NavBar'
import About from './components/About'
import Contact from './components/Contact'
import Article from './components/Article'
import Footer from './components/Footer'
import Articles from './components/Articles'
import Home from './components/Home'
import Gallery from './components/Gallery'
import SinglePage from './components/SinglePage'

function App() {

   return (
      <>
         <NavBar />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<SinglePage title="About" children={<About />} />} />
            <Route path="/contact" element={<SinglePage title="Contact" children={<Contact />} />} />
            <Route path="/articles" element={<SinglePage title="Articles" children={<Articles />} />} />
            <Route path="/articles/:slug" element={<Article />} />
            <Route path="/gallery" element={<SinglePage title="Gallery" children={<Gallery />} />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
