import { Route, Routes } from 'react-router'
import './App.css'
import GlobalMap from './components/GlobalMap'
import NavBar from './components/NavBar'
import About from './components/About'
import Contact from './components/Contact'
import Article from './components/Article'
import Footer from './components/Footer'
import Articles from './components/Articles'

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<GlobalMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/articles" element={<Articles />} /> 
        <Route path="/articles/:slug" element={<Article />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
