import Head from "next/head";
import Nav from "./nav/Nav";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Ryan Rose</title>
        <meta name="description" content="Ryan Rose" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="border-b-[1px] border-slate-300">
        <Nav />
      </div>
      {children}
    </div>
  );
};

export default Layout;
