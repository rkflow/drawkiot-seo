import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect} from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { replace } from "../utils/replace-node";

const resetPassword = async (email) => {
  const respons= await supabase.auth.api.resetPasswordForEmail(email, {
    redirectTo: "https://www.drawkit.com/change-password",
  });
    return respons; 
};

export default function ResetPassword(props) {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const parseOption={
    replace
  };
  
  useEffect(() => {
    if (loader)
      document.getElementById('loaderWrapper').innerHTML = `<div id="reset-email"class="button-wrap">
      <div class="btn-primary align-bottom"><div>Loading... <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div></div>
      <div class="btn-overlay"></div>
    </div>`
    else
      document.getElementById('loaderWrapper').innerHTML = `<div id="reset-email"class="button-wrap">
    <div class="btn-primary"><div>submit</div></div>
    <div class="btn-overlay"></div>
  </div>`
  }, [loader])

  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#reset-email").get(0)) {
      let response = await resetPassword(email)
      if (!response.error) {
        setLoader(true)
        $(".validator-success-message").show();
        $(".validator-message").text('');
        setTimeout(function () {
        router.push("/signin");
      }, 3500);
       
      } else {
        $(".validator-message").text(response.error.message);
        $(".validator-success-message").hide();
        setLoader(false);
      }
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#resetpw-email").get(0)) {
      setEmail($el.val());
      $(".validator-message").text("");
      $(".validator-success-message").hide();

    }
  }
  return (
    <>
     <Head>
        {parseHtml(props.headContent)}
      </Head>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.bodyContent,parseOption)}
      </div>
       
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}
ResetPassword.getLayout=function PageLayout(page){
  return(
    <>

    {page}
    </>
  )
}
export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/password-reset").catch(
    (err) => {
      console.error(err);
    }
  );
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const bodyContent = $(`.main-wrapper`).html();
  //   const navDrop=$('.nav-dropdown-wrapper').html();
  const headContent = $(`head`).html();
  const globalStyles = $(".global-styles").html();

  return {
    props: {
      bodyContent,
      headContent,
      globalStyles,
    },
    revalidate: 3,
  };
}
