import Head from "next/head";
import Script from "next/script";
import Footer from "./Footer";
import Nav from "./nav/Nav";

const Layout = ({ children, className, hideHeaderFooter }) => {
  return (
    <html className={className}>
      <body>
        <Head>
          <title>Ryan Rose</title>
          <meta name="description" content="Ryan Rose" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Script src="https://kit.fontawesome.com/f587b9131c.js" />
        {hideHeaderFooter ? (
          <div>{children}</div>
        ) : (
          <>
            <Nav>
              <div className="py-8 mx-8 sm:mx-24">{children}</div>
            </Nav>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
};

export default Layout;
