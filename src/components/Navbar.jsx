import { Link, NavLink } from "react-router";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-serif font-bold text-xl text-accent">
          RecipeFinder
        </Link>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `font-medium hover:text-accent ${isActive ? "text-accent" : "text-text"}`
          }
        >
          Home
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
