import { Link } from "react-router";
import LanguageButton from "./LanguageButton";

const NavBar = () => {
   return (
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
         <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>The World Is Still Beautiful</h1>
         </Link>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
               <li style={{ marginRight: '1rem' }}>
                  <Link to="/articles" style={{ textDecoration: 'none' }}>Articles</Link>
               </li>
               <li style={{ marginRight: '1rem' }}>
                  <Link to="/about" style={{ textDecoration: 'none' }}>About</Link>
               </li>
               <li style={{ marginRight: '1rem' }}>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>Contact</Link>
               </li>
               <li style={{ marginRight: '1rem' }}>
                  <Link to="/gallery" style={{ textDecoration: 'none' }}>Gallery</Link>
               </li>
            </ul>
            <LanguageButton />
         </div>
      </nav>
   );
};

export default NavBar;