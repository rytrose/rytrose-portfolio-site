import { useCallback, useRef } from "react";
import { atLeastSm } from "../../utils/responsive";
import Name from "./Name";
import NavLink from "./NavLink";
import useResizeObserver from "use-resize-observer";

const Nav = ({ children }) => {
  const hamburgerInput = useRef();
  const mobileMenu = useRef();
  const navRef = useRef();

  // Close mobile menu if window changes size to remove mobile menu
  const onWindowResize = useCallback(
    (_) => {
      if (atLeastSm(window) && hamburgerInput.current.checked) {
        hamburgerInput.current.checked = false;
        mobileMenu.current.checked = false;
      }
    },
    [hamburgerInput]
  );

  // Detect changes in window size
  useResizeObserver({
    ref: navRef,
    onResize: onWindowResize,
  });

  // Close mobile menu when a link is clicked
  const onLinkClick = () => {
    hamburgerInput.current.click();
  };

  const links = (selectedPosition) => (
    <>
      <NavLink
        href="/"
        selectedPosition={selectedPosition}
        onClick={onLinkClick}
      >
        home
      </NavLink>
      <NavLink
        href="/bio"
        selectedPosition={selectedPosition}
        onClick={onLinkClick}
      >
        bio
      </NavLink>
      <NavLink
        href="/projects"
        selectedPosition={selectedPosition}
        onClick={onLinkClick}
      >
        projects
      </NavLink>
    </>
  );

  const onMobileMenu = (e) => {
    if (!atLeastSm(window)) {
      mobileMenu.current.checked = e.target.checked;
      document.body.classList.toggle("overflow-hidden", e.target.checked);
    }
  };

  return (
    <>
      <nav ref={navRef} className="fixed overscroll-none top-0 left-0">
        <div className="flex items-center gap-4 px-3 py-2 bg-white border-b-[1px] border-slate-300">
          <div className="flex-grow sm:flex-none">
            <Name />
          </div>
          <div className="hidden sm:flex sm:gap-4">{links("below")}</div>
          {/* TODO -- add social links */}
          <label className="order-last outline-none cursor-pointer sm:hidden">
            <input
              ref={hamburgerInput}
              className="peer opacity-0 absolute left-[-99999rem]"
              type="checkbox"
              onClick={onMobileMenu}
            />
            <svg
              className="h-5 w-5 fill-slate-400
              peer-checked:fill-slate-600
              [&>*]:transition-[opacity,transform] [&>*]:duration-500
              peer-checked:[&>.line-1]:rotate-45 [&>.line-1]:origin-[1px_5px] 
              peer-checked:[&>.line-2]:opacity-0
              peer-checked:[&>.line-3]:-rotate-45 [&>.line-3]:origin-[3px_16px]"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path className="line-1" d="M0 3h20v2H0V3z" />
              <path className="line-2" d="M0 9h20v2H0V3z" />
              <path className="line-3" d="M0 15h20v2H0V3z" />
            </svg>
          </label>
        </div>

        {/* Used to trigger mobileMenu transitions */}
        <input
          ref={mobileMenu}
          className="peer opacity-0 absolute left-[-99999rem]"
          type="checkbox"
        />
        <div
          className="bg-white w-screen 
          transition-[opacity,transform] duration-500 
          opacity-0
          peer-checked:opacity-100 peer-checked:h-screen
          peer-checked:[&>*]:opacity-100 peer-checked:[&>*]:translate-y-0
          peer-checked:[&>*]:flex"
        >
          <div
            className="hidden flex-col gap-2 pt-4 pl-8
            opacity-0 translate-y-6
            transition-[transform,opacity] duration-500
            [&>*]:text-lg"
          >
            {links("left")}
          </div>
        </div>
      </nav>
      <div className="mt-[49px] overscroll-y-auto">{children}</div>
    </>
  );
};

export default Nav;
