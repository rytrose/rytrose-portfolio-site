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
      <Nav>
        <div className="py-8 mx-8 sm:mx-24">{children}</div>
      </Nav>
    </div>
  );
};

export default Layout;
