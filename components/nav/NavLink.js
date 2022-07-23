import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, selectedPosition, onClick, children }) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <div
        className="text-sm cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600"
        onClick={onClick}
      >
        <div className="inline-block">
          <span
            className={`${
              router.pathname === href &&
              (selectedPosition === "left"
                ? "-ml-2 before:mr-1 before:inline-block before:align-middle before:content-[''] before:rounded-full before:bg-slate-400 before:hover:bg-slate-500 before:w-1 before:h-1"
                : "-mb-1 after:content-[''] after:block after:mx-auto after:rounded-full after:bg-slate-400 after:hover:bg-slate-500 after:w-1 after:h-1")
            }`}
          >
            {children}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NavLink;
