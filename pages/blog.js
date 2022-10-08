import Router, { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";
import Script from "next/script";
import { supabase } from "../utils/supabaseClient";
import { replace } from "../utils/replace-node";
import NavbarContent from "./navbar";
import { useEffect } from "react";
export default function Slug(props) {
  let router = useRouter();
  const parseOptions = { replace };
  const loadActive = () => {
    if (typeof window !== "undefined") {
      $(".filter-all-button").addClass("active-all");
    }
  };
  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest(".view-all-add-button").get(0)) {
      $(".button-filter-item").show();
      $(".view-all-add-button").hide();
    }
    if (!!$el.closest(".blog-filter-button").get(0)) {
      $(".filter-all-button").removeClass("active-all");
    }
  }

  useEffect(() => {
    // document.querySelector('.like-buttons-wrap').innerText;
    // const faq = document.querySelectorAll('.faq');
    const faq_answer = document.querySelectorAll(".faq-answer");
    const plus_icon_faq = document.querySelectorAll(".plus-icon-faq");
    const faq_question = document.querySelectorAll(".faq-question");
    faq_question.forEach((ele, index1) => {
      ele.addEventListener("click", (element) => {
        //code for cross pannel
        plus_icon_faq.forEach((e, i) => {
          if (i == index1) {
            e.classList.toggle("open_close");
            e.children[0].style.transition = "all 0.5s";
          } else {
            e.classList.remove("open_close");
            e.children[0].style.transition = "all 0.5s";
          }
        });
        faq_answer.forEach((e, index2) => {
          if (index1 == index2) {
            e.classList.toggle("faq-answer-open");
            e.classList.remove("faq-answer-close");
          } else {
            e.classList.remove("faq-answer-open");
            e.classList.toggle("faq-answer-close");
          }
        });
      });
    });
  }, []);
  console.log(props);
  useEffect(() => {
    console.log("paggeload", props.CrentPageProps);
    if (typeof window !== "undefined") {
      if (typeof Jetboost !== "undefined") {
        Jetboost = null;
      }

      window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";

      (function (d) {
        var s = d.createElement("script");
        s.src = "https://cdn.jetboost.io/jetboost.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);

        d.getElementsByTagName("head")[0].removeChild(s);
      })(document);

    //   ((d) => {
    //     d.querySelectorAll(".nav-menu .w--open").forEach((el) => {
    //       el.classList.remove("w--open");
    //     });
    //     if (d.querySelectorAll(".nav-left-wrapper .w--open").length > 0) {
    //       document.querySelector(".menu-icon").click();
    //     }
    //   })(document);
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
  return (
    <>
      <Head>
        {parseHtml(props.globalStyles, parseOptions)}
        {parseHtml(props.headContent, parseOptions)}
      </Head>
      <Script
        defer
        src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-selectcustom@1/selectcustom.js"
      ></Script>
      <div onClick={wrapClickHandler}>
        <Script
          strategy="afterInteractive"
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
          onLoad={loadActive}
        ></Script>
        <div>{parseHtml(props.bodyContent, parseOptions)}</div>
      </div>
    </>
  );
}

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { slug: ["about"] } },
//       { params: { slug: ["premium-illustrations"] } },
//       { params: { slug: ["premium-illustrations"] } },
//       { params: { slug: ["free-illustrations"] } },
//       { params: { slug: ["blog"] } },
//       {
//         params: {
//           slug: ["post", "useful-design-resources-for-the-non-designers"],
//         },
//       },
//       { params: { slug: ["post", "tips-for-junior-product-designer-galuh"] } },
//       { params: { slug: ["post", "custom-illustration-builders"] } },
//       { params: { slug: ["post", "graphic-design-industry-statistics"] } },
//       { params: { slug: ["post", "motion-design-resources-for-creatives"] } },
//     ],
//     fallback: true,
//   };
// }

export async function getStaticProps(paths) {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res;
  res = await axios(
    `https://drawkit-v2.webflow.io/blog`
  ).catch((err) => {
    //console.error(err);
  });

  if (res) {
    const html = res.data;

    const $ = cheerio.load(html);

    //   $('.navlink').addClass('title').html()
    const navBar = $(`.nav-access`).html();
    const bodyContent = $(`.main-wrapper`).html();
    //   const navDrop=$('.nav-dropdown-wrapper').html();
    const headContent = $(`head`).html();
    const footer = $(`.footer-access`).html();
    const globalStyles = $(".global-styles").html();

    const supportScripts = Object.keys($(`script`))
      .map((key) => {
        if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
      })
      .filter((src) => {
        if (src) return src;
      })
      .map(
        (m) =>
          `<Script type="text/javascript"  strategy="afterInteractive" src="${m}"></Script>`
      )
      .join("");

    return {
      props: {
        bodyContent,
        headContent,
        navBar,
        supportScripts,
        footer,
        globalStyles,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/400",
        permanent: false,
      },
    };
  }
}
