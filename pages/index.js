import Head from "next/head";
import Nav from "../components/nav/Nav";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Ryan Rose</title>
        <meta name="description" content="Ryan Rose" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="border-b-[1px] border-slate-300">
        <Nav></Nav>
      </div>
    </div>
  );
}
