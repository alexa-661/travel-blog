import { Route, Routes } from 'react-router'
import './App.css'
import GlobalMap from './components/GlobalMap'
import NavBar from './components/NavBar'
import About from './components/About'
import Contact from './components/Contact'

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<GlobalMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
    </>
  )
}

export default App
