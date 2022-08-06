import { useCallback, useState, useRef } from "react";
import { atLeastSm } from "../../utils/responsive";
import Name from "./Name";
import NavLink from "./NavLink";
import useResizeObserver from "use-resize-observer";
import useEventListener from "../../hooks/useEventListener";

const Nav = ({ children }) => {
  const hamburgerInput = useRef();
  const mobileMenuInput = useRef();
  const navRef = useRef();

  // For some reason, useEventListener does not work with just useRef.
  // Instead, populate the element with a callback ref.
  const [mobileMenuElement, setMobileMenuElement] = useState();
  const mobileMenuRef = useCallback((node) => {
    setMobileMenuElement(node);
  }, []);

  // Close mobile menu if window changes size to remove mobile menu
  const onWindowResize = useCallback(
    (_) => {
      if (atLeastSm(window) && hamburgerInput.current.checked) {
        hamburgerInput.current.checked = false;
        mobileMenuInput.current.checked = false;
      }
    },
    [hamburgerInput]
  );

  // Detect changes in window size to collapse mobile menu if hiding for desktop
  useResizeObserver({
    ref: navRef,
    onResize: onWindowResize,
  });

  // Close mobile menu when a link is clicked
  const onLinkClick = () => {
    hamburgerInput.current.click();
  };

  const links = (
    <>
      <NavLink href="/" onClick={onLinkClick}>
        home
      </NavLink>
      <NavLink href="/bio" onClick={onLinkClick}>
        bio
      </NavLink>
      <NavLink href="/projects" onClick={onLinkClick}>
        projects
      </NavLink>
    </>
  );

  // On mobile hamburger menu press, check additional checkbox
  // used as peer, and set overflow-hidden to prevent content
  // from scrolling under mobile menu.
  const onMobileMenuInput = (e) => {
    if (!atLeastSm(window)) {
      mobileMenuInput.current.checked = e.target.checked;
      document.body.classList.toggle("overflow-hidden", e.target.checked);
    }
  };

  // When mobile menu is beginning to open, expand height to full page and make visible
  useEventListener(
    "transitionstart",
    (e) => {
      if (e.target == mobileMenuElement && mobileMenuInput.current.checked) {
        mobileMenuElement.style.visibility = "visible";
        mobileMenuElement.classList.toggle("h-screen", true);
        mobileMenuElement.classList.toggle("h-0", false);
      }
    },
    mobileMenuElement
  );

  // When mobile menu is closed, minimize height and make invisible
  useEventListener(
    "transitionend",
    (e) => {
      if (e.target == mobileMenuElement && !mobileMenuInput.current.checked) {
        mobileMenuElement.style.visibility = "hidden";
        mobileMenuElement.classList.toggle("h-screen", false);
        mobileMenuElement.classList.toggle("h-0", true);
      }
    },
    mobileMenuElement
  );

  return (
    <>
      <nav
        ref={navRef}
        className="fixed overscroll-none top-0 left-0 z-[99999]"
      >
        <div className="flex items-center gap-6 px-3 py-2 bg-white border-b-[1px] border-slate-300">
          <div className="flex-grow sm:flex-none">
            <Name />
          </div>
          <div className="hidden sm:flex sm:gap-6">{links}</div>
          {/* TODO -- add social links */}
          <label className="order-last outline-none cursor-pointer sm:hidden">
            <input
              ref={hamburgerInput}
              className="peer opacity-0 absolute left-[-99999rem]"
              type="checkbox"
              onClick={onMobileMenuInput}
            />
            <svg
              className="h-5 w-5 fill-slate-400
              peer-checked:fill-slate-600
              [&>*]:transition-[opacity,transform] [&>*]:duration-300
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
          ref={mobileMenuInput}
          className="peer opacity-0 absolute left-[-99999rem]"
          type="checkbox"
        />
        <div
          ref={mobileMenuRef}
          className="bg-white w-screen h-0
          transition-[opacity,transform] duration-300
          invisible opacity-0
          peer-checked:opacity-100
          peer-checked:[&>*]:opacity-100
          peer-checked:[&>*]:translate-y-0"
        >
          <div
            className="flex flex-col gap-4 pt-8 text-center
            opacity-0 translate-y-6
            transition-[transform,opacity] duration-300
            [&>*]:text-lg"
          >
            {links}
          </div>
        </div>
      </nav>
      <div className="mt-[49px]">{children}</div>
    </>
  );
};

export default Nav;
