import { useRouter } from "next/router";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";
// import { replace } from "../../utils/replace-node";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useUser } from "../../lib/authInfo";
import Link from "next/link";
import LogRocket from "logrocket";
import $, { type } from "jquery";
import Head from "next/head";



const types = [];
export default function Illustration(props) {


  const { user, setUser } = useUser();
  

  let [auth, setAuth] = useState(supabase.auth.session());
  const [file, setFile] = useState([]);
  let [favourites, setFavraties] = useState([]);
  // let [types, settypes] = useState([]);

  const [incr, setIncr] = useState(1);
  var pricing_type = '';
  const router = useRouter();
  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty("class")) {
      attribs["className"] = attribs["class"];
      delete attribs.class;
    }

    if (node.name == "div") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("sb-function")) {
          pricing_type = node.children[3].children[0].data;
        }
      }
    }

    // hide discriptions of card
    if ((supabase.auth.session() === null || supabase.auth.session() !== null) && pricing_type == "Free") {
      if (node.name == "div") {
        const { ...props } = attribs;
        if (props.className) {

          if (props.className.includes("upgrade-wrap")) {
            return (
              //download
              <div {...props}>


              </div>
            );
          }
        }
      }

    }
    if (user.subscription_details.status == "active") {
      if (node.name == "div") {
        const { ...props } = attribs;
        if (props.className) {

          if (props.className.includes("upgrade-wrap")) {
            return (
              //download
              <div {...props}>


              </div>
            );
          }
        }
      }
    }
    /////////
    // Replace links with Next links
    if (node.name == "div") {

      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("sb-function")) {
          pricing_type = node.children[3].children[0].data;
        }

        if (props.className.includes("sb-function")) {
          // console.log(node.children[3].children[0].data);
          // let pricing_type = node.children[3].children[0].data;
          if (supabase.auth.session() === null) {
            if (pricing_type == "Free") {
              return (
                //download
                <div {...props}>
                  Sign up to download
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(
                      [node.children[1], node.children[2]],
                      parseOptions
                    )}

                </div>
              );
            }
            if (pricing_type == "Drawkit Pro") {
              return (
                //download
                <div {...props}>
                  Upgrade to DrawKit Pro
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(
                      [node.children[1], node.children[2]],
                      parseOptions
                    )}

                </div>
              );
            }
          } else {



            if (
              (pricing_type == "Drawkit Pro" &&
                user.subscription_details.status == "active") ||
              (pricing_type == "Free" && auth != null)
            ) {
              return (
                //download
                <div {...props}>
                  Download illustrations
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(
                      [node.children[1], node.children[2]],
                      parseOptions
                    )}
                </div>
              );
            } else {
              return (
                //download
                <div {...props}>
                  Upgrade to DrawKit Pro
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(
                      [node.children[1], node.children[2]],
                      parseOptions
                    )}
                </div>
              );
            }
          }
        }
      }
    }

    if (node.name == "section") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("section-home_hero")) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
        if (props.className.match(/^section-brands$/)) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
      }
    }

    if (node.name == `a`) {
      let { href, style, ...props } = attribs;
      if (href) {
        if (
          href.includes("/illustration-types/") ||
          href.includes("/illustration-categories/") ||
          href.includes("/single-illustrations/") ||
          (href.includes("/illustrations") &&
            !props.className.includes("upgrade-plan-link "))
        ) {
          // console.log(href.slice(href.lastIndexOf("/"), href.length));
          return (
            <Link
              href={"/product" + href.slice(href.lastIndexOf("/"), href.length)}
            >
              <a {...props}>
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(node.children, parseOptions)}
              </a>
            </Link>
          );
        }
        if (attribs.className) {
          if (props.className.includes("upgrade-plan-link ")) {
            // console.log(node.children[2].children[0].data);

            if (!supabase.auth.session()) {
              if (node.children[2].children[0].data == "Drawkit Pro") {
                return (
                  <Link href="/plans">
                    <div className="drawkitprostyle">
                      <a {...props}>
                        <div className="upgradedownload">View Collection</div>
                        <img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fb80eb0cead8fb779fca8a_premium-arrow-white.png" loading="lazy" alt="" className="white-arrow-right" />
                        {!!node.children &&
                          !!node.children.length &&
                          domToReact([node.children[1]], parseOptions)}
                      </a>
                    </div>
                  </Link>
                );
              }
              // // not sigedin user
              // return (
              //   <Link href="/plans">
              //     <a {...props}>
              //       <div className="upgradedownload">Upgrade Your Plan</div>
              //       {!!node.children &&
              //         !!node.children.length &&
              //         domToReact([node.children[1]], parseOptions)}
              //     </a>
              //   </Link>
              // );
            }
            else {
              if (
                node.children[2].children[0].data == "Drawkit Pro" &&
                user.subscription_details.status != "active"
              ) {
                return (
                  <Link href="/plans">
                    <a {...props}>
                      <div className="upgradedownload">Upgrade Your Plan</div>
                      <img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c0f112dd600_black-arrow.svg" loading="lazy" alt="" className="black-arrow-right" />
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              } else {

                if (node.children[2].children[0].data == "Drawkit Pro") {
                  return (
                    //download
                    <Link href={href.replace("illustrations", "product")}>
                      <a {...props}>
                        <div className="upgradedownload">Download Now</div>
                        <img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c0f112dd600_black-arrow.svg" loading="lazy" alt="" className="black-arrow-right" />
                        {!!node.children &&
                          !!node.children.length &&
                          domToReact([node.children[1]], parseOptions)}
                      </a>
                    </Link>
                  );
                } else {
                  return (
                    //download
                    <Link href={href.replace("illustrations", "product")}>
                      <a {...props}>
                        <div className="upgradedownload">Download Now</div>
                        {!!node.children &&
                          !!node.children.length &&
                          domToReact([node.children[1]], parseOptions)}
                      </a>
                    </Link>
                  );
                }



              }
            }
          } else {
            return (
              <Link href={href}>
                <a {...props}>
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(node.children, parseOptions)}
                </a>
              </Link>
            );
          }
        }

        return (
          <Link href={href}>
            <a {...props}>
              {!!node.children &&
                !!node.children.length &&
                domToReact(node.children, parseOptions)}
            </a>
          </Link>
        );
      }
    }
    // Make Google Fonts scripts work
    if (node.name === `script`) {
      let content = get(node, `children.0.data`, ``);

      if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
        content = `setTimeout(function(){${content}}, 1)`;
        return (
          <Script
            {...attribs}
            dangerouslySetInnerHTML={{ __html: content }}
          ></Script>
        );
      } else {
        <Script
          {...attribs}
          dangerouslySetInnerHTML={{ __html: content }}
          strategy="lazyOnload"
        ></Script>;
      }
    }
    const { href, style, ...props } = attribs;
  }

  const parseOptions = { replace };
  const downloadSupabase = async (item_id) => {
    console.log('suraj')
    var span = document.createElement("span");
    span.textContent = 'Please wait...';
    span.setAttribute('class', 'downloadChecking');
    document.querySelector('#sb-download').append(span);

    var span = document.createElement("span");
    span.textContent = 'Please wait...';
    span.setAttribute('class', 'downloadChecking');
    document.querySelectorAll('#sb-download')[1].append(span);

    const path = await supabase
      .from("illustrations_pack")
      .select("downloadable_illustration,pricing_type")
      .eq("wf_item_id", item_id);
    const pricing_type = path.data[0].pricing_type;
    if (
      (pricing_type == "Drawkit Pro" &&
        user.subscription_details.status == "active") ||
      pricing_type == "Free"
    ) {
      const file = path.data[0].downloadable_illustration;
      const fileName = file.substring(file.lastIndexOf("/") + 1, file.length);
      //console.log(fileName);

      const { data, error } = await supabase.storage
        .from("illustration-downloadable")
        .download(fileName);
      if (!error) {
        var span = document.createElement("span");
        span.textContent = 'Downloading...';
        span.setAttribute('class', 'downloadChecking');
        document.querySelector('#sb-download').append(span);

        var span = document.createElement("span");
        span.textContent = 'Downloading...';
        span.setAttribute('class', 'downloadChecking');
        document.querySelectorAll('#sb-download')[1].append(span);

        console.log(data.size / 36000);
        setTimeout(() => {
          document.querySelectorAll('#sb-download')[0].children[2].remove();
          document.querySelectorAll('#sb-download')[0].children[2].remove();

          document.querySelectorAll('#sb-download')[1].children[2].remove();
          document.querySelectorAll('#sb-download')[1].children[2].remove();
          var span = document.createElement("span");
          span.textContent = 'Download done!';

          span.setAttribute('class', 'downloadChecking');

          document.querySelectorAll('#sb-download')[0].append(span);
          var span = document.createElement("span");
          span.textContent = 'Download done!';

          span.setAttribute('class', 'downloadChecking');
          document.querySelectorAll('#sb-download')[1].append(span);

        }, (data.size) / 36000)
      }

      const strip = await supabase.from("stripe_users").select("*");
      //console.log(strip);
      saveAs(data, fileName);
    } else {
      router.push("/plans");
    }
  };

  async function wrapClickHandler(event) {
    var $el = $(event.target);


    if (!!$el.closest(".request").get(0)) {
      //console.log($el);
      $(".request-popup").show();
      setTimeout(function () {
        $("#loader").hide();
        $(".iframe-holder").show();
      }, 3000);
    }




    // working on like and dislike

    if ($el.closest(".like-buttons-wrap").get(0)) {
      let wf_item_id = $el.closest(".like-buttons-wrap").get(0)
        .children[0].innerText;
      //console.log(wf_item_id);
      if (auth) {
        if (favourites.length > 0) {
          if (favourites.length > 0 && favourites.includes(wf_item_id)) {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" stroke="#14181F" stroke-width="0.8" stroke-miterlimit="10"/>
              </svg></div>`;
            favourites.splice(favourites.indexOf(wf_item_id), 1);
            //console.log("favoirate", favourites);
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: favourites })
              .eq("user_id", auth.user.id);

            setFavraties((f) => {
              return [...f];
            });
          } else {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.096 2.85602C22.708 3.45232 23.1945 4.16513 23.5266 4.95242C23.8587 5.73971 24.0298 6.58554 24.0298 7.44002C24.0298 8.2945 23.8587 9.14033 23.5266 9.92762C23.1945 10.7149 22.708 11.4277 22.096 12.024L21.168 12.952L13.856 20.28C13.6137 20.5234 13.3257 20.7164 13.0086 20.8482C12.6915 20.9799 12.3514 21.0478 12.008 21.0478C11.6646 21.0478 11.3246 20.9799 11.0074 20.8482C10.6903 20.7164 10.4023 20.5234 10.16 20.28L2.84801 12.968L1.90401 12.024C1.29199 11.4277 0.805576 10.7149 0.47345 9.92762C0.141324 9.14033 -0.0297852 8.2945 -0.0297852 7.44002C-0.0297852 6.58554 0.141324 5.73971 0.47345 4.95242C0.805576 4.16513 1.29199 3.45232 1.90401 2.85602C3.12148 1.64351 4.76975 0.962736 6.48801 0.962736C8.20628 0.962736 9.85455 1.64351 11.072 2.85602L12 3.80002L12.944 2.85602C13.5401 2.24645 14.2519 1.7621 15.0377 1.43143C15.8235 1.10076 16.6675 0.93042 17.52 0.93042C18.3726 0.93042 19.2165 1.10076 20.0023 1.43143C20.7882 1.7621 21.5 2.24645 22.096 2.85602Z" fill="#F075C6"/>
          <defs>
          <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"></feBlend>
          </filter>
          </defs>
          </svg></div>`;

            favourites.push(wf_item_id);
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: favourites })
              .eq("user_id", auth.user.id);
            setFavraties((f) => {
              return [...f];
            });
          }
        } else {
          $el
            .closest(".like-buttons-wrap")
            .get(
              0
            ).children[1].innerHTML = `<div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.096 2.85602C22.708 3.45232 23.1945 4.16513 23.5266 4.95242C23.8587 5.73971 24.0298 6.58554 24.0298 7.44002C24.0298 8.2945 23.8587 9.14033 23.5266 9.92762C23.1945 10.7149 22.708 11.4277 22.096 12.024L21.168 12.952L13.856 20.28C13.6137 20.5234 13.3257 20.7164 13.0086 20.8482C12.6915 20.9799 12.3514 21.0478 12.008 21.0478C11.6646 21.0478 11.3246 20.9799 11.0074 20.8482C10.6903 20.7164 10.4023 20.5234 10.16 20.28L2.84801 12.968L1.90401 12.024C1.29199 11.4277 0.805576 10.7149 0.47345 9.92762C0.141324 9.14033 -0.0297852 8.2945 -0.0297852 7.44002C-0.0297852 6.58554 0.141324 5.73971 0.47345 4.95242C0.805576 4.16513 1.29199 3.45232 1.90401 2.85602C3.12148 1.64351 4.76975 0.962736 6.48801 0.962736C8.20628 0.962736 9.85455 1.64351 11.072 2.85602L12 3.80002L12.944 2.85602C13.5401 2.24645 14.2519 1.7621 15.0377 1.43143C15.8235 1.10076 16.6675 0.93042 17.52 0.93042C18.3726 0.93042 19.2165 1.10076 20.0023 1.43143C20.7882 1.7621 21.5 2.24645 22.096 2.85602Z" fill="#F075C6"/>
        <defs>
        <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
        <feOffset></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"></feBlend>
        </filter>
        </defs>
        </svg></div>`;
          favourites.push(wf_item_id);

          const { data, error } = await supabase
            .from("user_profile")
            .update({ liked_illustrations: favourites })
            .eq("user_id", auth.user.id);

          setFavraties((f) => {
            return [...f];
          });
        }
      } else {
        const signinpopup = document.querySelector(".signup-popup");
        signinpopup.style.display = "flex";
      }
    }

    // upgrade plan

    if (!!$el.closest(".upgrade-plan").get(0)) {
      event.preventDefault();
      if (await downloadSupabase()) {
        // router.push("/");
      }
    }
    if (!!$el.closest("#sb-download").get(0)) {
      console.log('dheeraj')
      if (supabase.auth.session() != null) {

        var item = $("#sb-download").children().get(1).innerText;


        await downloadSupabase(item);
      } else {
        router.push("/signup");
      }
    }
  }

  useEffect(() => {
    if (document.getElementById('all-home') != null)
      document.getElementById('all-home').classList.add('active-all-black')
    $('.filter-all-button').click(function () {
      document.getElementById('all-home').classList.remove('active-all-black')
    })


  }, [router])


  useEffect(() => {

    if (auth) {
      (async () => {
        const { data, error } = await supabase
          .from("user_profile")
          .select()
          .eq("user_id", auth.user.id);
        if (data.length > 0 && data[0].liked_illustrations) {
          setFavraties(data[0].liked_illustrations);
        }
      })();
    }
    (async () => {
      const { data, error } = await supabase
        .from("illustration_type")
        .select("name");
      //console.log(data);
      data.forEach((ele) => {
        types.push(ele.name);
      });
    })();
  }, [router, auth]);

  useEffect(() => {
    $(".cancel,.request-popup").click(function () {
      $(".request-popup").hide();
      $("#loader").show();
      $(".iframe-holder").hide();
    });
  }, [])

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
  }, [props.CrentPageProps]);


  //console.log(favourites);
  //console.log(types);

  useEffect(() => {
    //console.log("checking useEffect");
    //console.log(types);

    //heighlight the liked_illustrations
    let likeIcon = document.querySelectorAll(".like-buttons-wrap");
    likeIcon.forEach((icon) => {
      let wf_item_id = icon.children[0].innerText;
      //console.log(wf_item_id);
      const like = icon.children[1];
      icon.addEventListener("click", (e) => {
        // console.log(e);
        if (auth) {
        } else {
          const signinpopup = document.querySelector(".signup-popup");
          signinpopup.style.display = "flex";
        }
      });
      // console.log(like)
      if (favourites.includes(wf_item_id)) {
        // console.log(wf_item_id, icon);
        icon.children[1].innerHTML = `<div><div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.096 2.85602C22.708 3.45232 23.1945 4.16513 23.5266 4.95242C23.8587 5.73971 24.0298 6.58554 24.0298 7.44002C24.0298 8.2945 23.8587 9.14033 23.5266 9.92762C23.1945 10.7149 22.708 11.4277 22.096 12.024L21.168 12.952L13.856 20.28C13.6137 20.5234 13.3257 20.7164 13.0086 20.8482C12.6915 20.9799 12.3514 21.0478 12.008 21.0478C11.6646 21.0478 11.3246 20.9799 11.0074 20.8482C10.6903 20.7164 10.4023 20.5234 10.16 20.28L2.84801 12.968L1.90401 12.024C1.29199 11.4277 0.805576 10.7149 0.47345 9.92762C0.141324 9.14033 -0.0297852 8.2945 -0.0297852 7.44002C-0.0297852 6.58554 0.141324 5.73971 0.47345 4.95242C0.805576 4.16513 1.29199 3.45232 1.90401 2.85602C3.12148 1.64351 4.76975 0.962736 6.48801 0.962736C8.20628 0.962736 9.85455 1.64351 11.072 2.85602L12 3.80002L12.944 2.85602C13.5401 2.24645 14.2519 1.7621 15.0377 1.43143C15.8235 1.10076 16.6675 0.93042 17.52 0.93042C18.3726 0.93042 19.2165 1.10076 20.0023 1.43143C20.7882 1.7621 21.5 2.24645 22.096 2.85602Z" fill="#F075C6"/>
        <defs>
        <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"/>
        </filter>
        </defs>
        </svg></div></div>`;
      } else {
        icon.children[1].innerHTML = `<div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" stroke="#14181F" stroke-width="0.8" stroke-miterlimit="10"/>
        </svg></div>`;
      }
    });
    // hiding signup popup
    const hide = document.querySelector(".signup-popup");
    hide.addEventListener("click", hidefn);
    function hidefn() {
      hide.style.display = "none";
    }

    //console.log("types", types);
  }, [favourites]);

  if (router.isFallback) {
    return  <div className="loadingContainer">
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  }

  return (
    <>
      <Head>
        {parseHtml(props.globalStyles, parseOptions)}
        {parseHtml(props.headContent, parseOptions)}
      </Head>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.bodyContent, parseOptions)}

        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  let illTypes = [];
  let illCatg = ["Education"];
  let illustrations = [];
  const { data, error } = await supabase.from("illustration_type").select();
  if (!error) {
    illTypes = data.map((el) => ({ params: { slug: el.wf_slug } }));
  }
  const categories = await supabase.from("illustration_category").select();

  if (!categories.error) {
    illCatg = categories.data.map((category) => ({
      params: { slug: category.wf_slug },
    }));
  }
  const illustration = await supabase.from("illustrations_pack").select();

  if (!illustration.error) {
    illustrations = illustration.data.map((illustration) => ({
      params: { slug: illustration.wf_slug },
    }));
  }

  return {
    paths: illTypes.concat(illCatg, illustrations),
    fallback: true, // can also be true or 'blocking'
  };
}

export const getStaticProps = async (paths) => {
  console.log(paths);
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;
  let illTypes = [];
  let illCatg = [];
  let CrentPageProps=''
  const { data, error } = await supabase.from("illustration_type").select();
  if (!error) {
    illTypes = data.map((el) => el.wf_slug);
  }
  const categories = await supabase.from("illustration_category").select();

  if (!categories.error) {
    illCatg = categories.data.map((category) => category.wf_slug);
  }

  let res;
  if (illTypes.includes(paths.params.slug)) {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustration-types/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });
    CrentPageProps="illustration-types";
  } else if (illCatg.includes(paths.params.slug)) {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustration-categories/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });
    CrentPageProps="illustration-categories"

  } else {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustrations/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });
    CrentPageProps="illustrations"
    // if (!res) {
    //   res = await axios(
    //     `https://drawkit-v2.webflow.io/single-illustrations/${paths.params.slug}`
    //   ).catch((err) => {
    //     console.error(err);
    //   });
    // }
  }
  if (res) {
    const html = res.data;

    const $ = cheerio.load(html);

    //   $('.navlink').addClass('title').html()
    // const navBar = $(`.nav-access`).html();
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
      .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
      .join("");

    return {
      props: {
        bodyContent,
        headContent,
        supportScripts,
        footer,
        globalStyles,
        CrentPageProps
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
};
