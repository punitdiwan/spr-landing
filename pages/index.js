import Layout from "../layouts/index";
import getBlogData from "../data/blog";
import StoryblokService from "../data/StoryblokService";
import { useState, useEffect } from "react";
import Color from "color";
import Head from "next/head";

export default function Page(props) {
  // const focused = useFocus();
  // useEffect(() => {
  //   if (focused) {
  //     fetch(window.location, {
  //       headers: {
  //         pragma: "no-cache"
  //       }
  //     }).then(res => {
  //       if (res.ok && res.headers.get("x-version") !== props.etag) {
  //         window.location.reload();
  //       }
  //     });
  //   }
  // }, [focused]);

  return (
    <Layout>
      <Head>
        <title>This Data</title>
        <meta name="description" content="Test Description" />
      </Head>
      <div>{props.stories[0].content.Heading}</div>
      <div>{props.etag}</div>
    </Layout>
  );
}

Page.getInitialProps = async ({ res }) => {
  //const blog = await getBlogData();
  const response = await StoryblokService.get(`cdn/stories`);
  const blog = response.data;
  const etag = require("crypto")
    .createHash("md5")
    .update(JSON.stringify(blog))
    .digest("hex");

  if (res) {
    //res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.setHeader("X-version", etag);
  }

  return { ...blog, etag };
};

const useFocus = () => {
  const [state, setState] = useState(null);
  const onFocusEvent = event => {
    setState(true);
  };
  const onBlurEvent = event => {
    setState(false);
  };
  useEffect(() => {
    window.addEventListener("focus", onFocusEvent);
    window.addEventListener("blur", onBlurEvent);
    return () => {
      window.removeEventListener("focus", onFocusEvent);
      window.removeEventListener("blur", onBlurEvent);
    };
  });
  return state;
};
