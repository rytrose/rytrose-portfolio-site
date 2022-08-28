import Socials from "./Socials";

const Footer = () => {
  return (
    <>
      <footer className="hidden sm:block fixed overscroll-none bottom-0 left-0 right-0 z-[99999]">
        <div className="grid grid-cols-3 items-center gap-6 px-3 py-2 bg-white border-t-[1px] border-slate-300 h-[49px]">
          <div></div>
          <div className="justify-self-center">
            <Socials />
          </div>
          <p className="justify-self-end font-serif text-xs">
            © 2022, ryan taylor rose
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
