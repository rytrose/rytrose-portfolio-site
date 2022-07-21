import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, children }) => {
  const router = useRouter();

  return (
    <div className="text-sm cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600">
      <Link href={href}>
        <div className="inline-block">
          <span
            className={`block ${
              router.pathname == href
                ? "-mb-1 after:content-[''] after:block after:mx-auto after:rounded-full after:bg-slate-400 after:hover:bg-slate-500 after:w-1 after:h-1"
                : ""
            }`}
          >
            {children}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default NavLink;
