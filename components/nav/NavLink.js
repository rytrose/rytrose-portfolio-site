import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, onClick, children }) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <div
        className="inline-block text-sm cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600"
        onClick={onClick}
      >
        <p className={`${router.pathname === href && "font-semibold"}`}>
          {children}
        </p>
      </div>
    </Link>
  );
};

export default NavLink;
