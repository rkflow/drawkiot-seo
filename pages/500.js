import Head from "next/head";
import Script from "next/script";
import { replace } from "../utils/replace-node";
import parseHtml from "html-react-parser";
export default function ServerErrorPage(props) {
  const parseOptions = {
    replace,
  };

  return (
    <>
      <Head>{parseHtml(props.headContent, parseOptions)}</Head>
      <div>{parseHtml(props.bodyContent, parseOptions)}</div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

ServerErrorPage.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

export async function getStaticProps({ context }) {
  const cheerio = require (`cheerio`);
  const axios = require(`axios`);
  let res = await axios("https://drawkit-v2.webflow.io/500").catch((err) => {
    console.error(err);
  });
  const html = res.data;
  const $ = cheerio.load(html);
  const bodyContent = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();

  return {
    props: {
      bodyContent,
      headContent,
    },
  };
}
