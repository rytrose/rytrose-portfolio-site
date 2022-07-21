import Name from "./Name";
import NavLink from "./NavLink";

const Nav = () => {
  return (
    <nav className="flex items-center gap-4 px-3 py-2">
      <Name />
      <div className="order-last sm:hidden">
        <button className="flex items-center mx-2">
          {/* TODO: copypasta'd consider replacing */}
          <svg
            className="h-3 w-3 fill-slate-400 hover:fill-slate-500 active:fill-slate-600"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow">
        <NavLink href="/bio">bio</NavLink>
      </div>
    </nav>
  );
};

export default Nav;
