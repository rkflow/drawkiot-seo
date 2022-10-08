import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import { supabase } from "../utils/supabaseClient";
import Script from "next/script";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import NavbarContent from "./navbar";
import { replace } from "../utils/replace-node";
import $, { type } from "jquery";

export default function Plans(props) {
  const router = useRouter();
  const [premiumUser, setPremiumUser] = useState("inactive");
  let [auth, setAuth] = useState(supabase.auth.session());
  //console.log(router);
  //................................................................................................................................//
   let {search}=router.query
  console.log(router);
  function isUrlInternal(link) {
    if (
      !link ||
      link.indexOf(`https:`) === 0 ||
      link.indexOf(`#`) === 0 ||
      link.indexOf(`http`) === 0 ||
      link.indexOf(`://`) === 0
    ) {
      return false;
    }
    return true;
  }


  const parseOptions = { replace };

  //..................................................................................................................................//


  // hide and show signup while liking
  useEffect(() => {
    let likeIcon = document.querySelectorAll(".like-buttons-wrap");
    likeIcon.forEach((icon) => {
      let wf_item_id = icon.children[0].innerText;
      //console.log(wf_item_id)
      icon.addEventListener('click', (e) => {
        //console.log(e);
        if (auth) {

        } else {
          const signinpopup = document.querySelector('.signup-popup');
          signinpopup.style.display = "flex"
        }
      })
    });
    // hiding signup popup
    const hide = document.querySelector('.signup-popup');
    hide.addEventListener('click', hidefn);
    function hidefn() {
      hide.style.display = "none";
    }
    const search_page_close = document.querySelector('#search-page-cancel');
    const search_page_input = document.querySelector('#search-page-input');
    search_page_close.style.display = 'block'

    //console.log(search_page_close);
    search_page_close.addEventListener('click', () => {


      search_page_input.value = "";
      document.getElementById('all-search').click()
      search_page_input.addEventListener('change', (e) => {
        //console.log(e)
      })

      search_page_close.style.display = "none"
    })

    search_page_input.addEventListener('keyup', (e) => {
      // console.log(search_page_close)

      // console.log(search_page_input.value)
      if (search_page_input.value)
        search_page_close.style.display = "block"
      else
        search_page_close.style.display = "none"
    })
  }, [])

  useEffect(() => {
    if (supabase.auth.session()) {
      fetch("/api/check-active-status", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({ user_id: auth.user.id }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          setPremiumUser(data.status);
        });

      // let uid = supabase.auth.session().user.id;
      // supabase
      //   .from("stripe_users")
      //   .select("stripe_user_id")
      //   .eq("user_id", uid)
      //   .then(({ data, error }) => {
      //     fetch("api/c")
      //       .then(function (response) {
      //         return response.json();
      //       })
      //       .then(function (data) {
      //         console.log(data);
      //         setPremiumUser(data.status);
      //       });
      //   });
    }
  }, []);
  useEffect(() => {
    // setTimeout(() => {
    //   if (document.querySelector(".view-more")) {
    //     document.querySelector(".view-more").classList.remove("jetboost-hidden")
    //   }
    // }, 2000);

    if (typeof Jetboost !== "undefined") {
      Jetboost = null;
    }

    if (typeof window !== "undefined") {
      window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";

      (function (d) {
        var s = d.createElement("script");
        s.src = "https://cdn.jetboost.io/jetboost.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);

        d.getElementsByTagName("head")[0].removeChild(s);
      })(document);

      ((d) => {
        d.querySelectorAll(".nav-menu .w--open").forEach((el) => {
          el.classList.remove("w--open");
        });
        if (d.querySelectorAll(".nav-left-wrapper .w--open").length > 0) {
          document.querySelector(".menu-icon").click();
        }
      })(document);
    }

    if (location.href.split("/").includes("#")) {
      location.href = location.href.replace(/#/, "");
    }
    if (document.querySelector(".view-more") != null)
      document.querySelector(".view-more").addEventListener(
        "click",
        () => {
          // setTimeout(() => {
          //   document.querySelector(".view-more").attributes["class"].value =
          //     document
          //       .querySelector(".view-more")
          //       .attributes["class"].value.split(" jetboost-hidden")
          //       .join("");
          // }, 1000);

          setTimeout(() => {
            const allItems = document.querySelectorAll(
              ".illustration-card-wrapper-bottom"
            );
            const allLoaderPlace = document.querySelectorAll(
              ".illustration-card-wrapper-bottom .upgrade-plan-link"
            );

            allItems.forEach((ele1, ind1) => {
              ele1.addEventListener("click", () => {
                if (router.asPath != "/")
                  if (
                    document.querySelectorAll("#sb-download")[0].children[2] !=
                    undefined
                  ) {
                    document
                      .querySelectorAll("#sb-download")[0]
                      .children[2].remove();
                    document
                      .querySelectorAll("#sb-download")[1]
                      .children[2].remove();
                  }

                console.log(ele1);
                // allLoaderPlace.forEach((ele, ind2) => {
                //   if (ind1 === ind2) {
                //     ele.style.position = "relative";
                //     var span = document.createElement("span");
                //     span.textContent = "Loading...";
                //     span.setAttribute("class", "cardLoadingTime");
                //     ele.append(span);
                //   }
                // });
              });
            });
          }, 2000);

          // setTimeout(() => {
          //   if (document.querySelector(".cardLoadingTime") != null)
          //     document.querySelectorAll(".cardLoadingTime").forEach((ele) => {
          //       ele.remove();
          //     });
          // }, 2000);
        },
        2000
      );
  }, []);

  useEffect(()=>{
    if (typeof window !== "undefined") {
        $(".cancel,.request-popup").click(function () {
          $(".request-popup").hide();
          $("#loader").show();
          $(".iframe-holder").hide();
      });
    }
  },[])


  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest(".request").get(0)) {
      //console.log($el);
      $(".request-popup").show();
      setTimeout(function () {
        $("#loader").hide();
        $(".iframe-holder").show();
      }, 3000);
    }

    if (!!$el.closest("#subscribe").get(0)) {
      if (auth != null) {
        //strip payment
        fetch("/api/strip", {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          body: JSON.stringify({ user_id: auth.user.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.session.url) router.push(data.session.url);
            else alert(data.session.message);
          });
      } else {
        router.push("/signup");
      }
    }
    // if (!!$el.closest("#search-close").get(0)) {
    //   $("#nav-search-input").val("");
    //   $("#close").hide();
    // }
    // if (!!$el.closest("#search").get(0)) {
    //   let params = "/search-results?search=" + $("#nav-search-input").val();
    //   router.push(params);
    // }

  }
  return (
    <>
     <Head>
        {parseHtml(props.globalStyles, parseOptions)}
        {parseHtml(props.headContent, parseOptions)}
        <title>DrawKit | Search result for {search?search:"Illustrations"}</title>
      </Head>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

export async function getServerSideProps(search) {



  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;
  // console.log("https://drawkit-v2.webflow.io" + search.resolvedUrl);

  let res = await axios("https://drawkit-v2.webflow.io" + search.resolvedUrl).catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const globalStyles = $(".global-styles").html();
  const bodyContent = $(`.main-wrapper`).html();
  const navbarContent = $(".nav-access").html();
  const headContent = $(`head`).html();
  const supportScripts = Object.keys($(`script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    })
    .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    .join("")
    .toString();
  const footer = $(`.footer-access`).html();

  return {
    props: {
      bodyContent: bodyContent,
      headContent: headContent,
      navbarContent: navbarContent,
      supportScripts: supportScripts,
      footer: footer,
      globalStyles: globalStyles,
    }
  };
}
