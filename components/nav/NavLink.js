import Link from "next/link";

const NavLink = ({ href, children }) => {
  return (
    <div className="text-sm text-slate-400 hover:text-slate-500 active:text-slate-600">
      <Link href={href}>{children}</Link>
    </div>
  );
};

export default NavLink;
