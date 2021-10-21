import Head from "next/head";

const Layout = props => (
  <div className="Layout">
    <Head>
      <title>Smile Fight</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
    <div>{props.children}</div>
  </div>
);

export default Layout;