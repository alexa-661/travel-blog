import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>The World Is Still Beautiful</h1>
      </Link>
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
    </nav>
  );
};

export default NavBar;