import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $, { type } from "jquery";
import Head from "next/head";
import { useUser } from "../lib/authInfo";
import { replace } from "../utils/replace-node";
import { useRouter } from "next/router";
import { log } from "logrocket";
import get from "lodash/get";
import { } from './navbar'

import animationData from './lottie2.json';
import Lottie from 'react-lottie-player'
export default function Home(props) {

  let [auth, setAuth] = useState(supabase.auth.session());
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [blog, setBlog] = useState(props.showBlog);
  let [illusHead, setIllusHead] = useState(props.illustrationHead);
  let [illusHeadLogin, setIllusHeadLogin] = useState("");
  let [showFree, setShowfree] = useState(props.showFree);
  let [PremiumUser, setPremiumUser] = useState("inactive");
  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);
  let [favourites, setFavraties] = useState([]);
  let [name, setName] = useState(null);
  const [types, setTypes] = useState([])
  const { user, setUser } = useUser();
  supabase.auth.onAuthStateChange((event, session) => {
    setAuth(supabase.auth.session());
  });
  const router = useRouter();

  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty("class")) {
      attribs["className"] = attribs["class"];
      delete attribs.class;
    }

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,

    };
    // Replace --> links with Next links 
    if (node.name == 'span') {
      const { ...props } = attribs;
      if (auth) {
        if (props.className) {
          if (props.className.includes("welcome-user-name")) {
            let email = auth.user.email
            return (
              <span {...props}>
                {name != null ? name : auth ? email.split('').splice(0, email.indexOf('@')) : 'User'}
              </span>
            )
          }
        }
      }
    }
    if (node.name == "div") {
      const { ...props } = attribs;
      if (props.className) {




        // if (props.className.includes("lottie-2")) {
        //   return (
        //     <div
        //       className="lottie-2"
        //     > 
        //       <Lottie
        //         loop
        //         animationData={animationData}
        //         play
        //         style={{  
        //           width: "100%",
        //           height: "100%"
        //         }}
        //       />
        //     </div>
        //   )
        // }


        if (props.className.includes("contact-form-hero")) {
          return (
            <div
              {...props}
              dangerouslySetInnerHTML={{
                __html: ` <form
                      id="wf-form-form-home"
                      name="wf-form-form-home"
                      data-name="form-home"
                      method="get"
                      class="contact-form responsive-grid"
                      aria-label="form-home"
                    >
                      <div
                        id="w-node-_6e04061e-ac3d-547e-dce7-8a022d94f7de-0820319e"
                        class="hero-input-field"
                        style="border: 1px solid rgb(204, 209, 214)"
                      >
                        <img
                          loading="lazy"
                          src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c07172dd663_Profile.svg"
                          alt="profile"
                          class="user-icon"
                        />
                        <input
                          type="text"
                          class="text-field w-input"
                          maxlength="256"
                          name="Name"
                          data-name="Name"
                          placeholder="Your full name"
                          id="Name-3"
                          required=""
                        />
                      </div>
                      <div
                        id="w-node-_6e04061e-ac3d-547e-dce7-8a022d94f7e1-0820319e"
                        class="hero-input-field"
                      >
                        <img
                          loading="lazy"
                          src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                          alt="Email"
                          class="user-icon"
                        />
                        <input
                          type="email"
                          class="text-field w-input"
                          maxlength="256"
                          name="Email"
                          data-name="Email"
                          placeholder="Your email"
                          id="Email"
                          required=""
                        />
                      </div>
                      <div
                        id="w-node-_742b536b-b539-2c95-f8ba-7b2c6f8198e3-0820319e"
                        data-w-id="742b536b-b539-2c95-f8ba-7b2c6f8198e3"
                        class="button-wrap home-form"
                      >
                        <div class="btn-primary">
                          <div>Submit</div>
                          <input
                            type="submit"
                            value="Submit"
                            data-wait="Please wait..."
                            class="submit-button w-button"
                          />
                          <img
                            loading="lazy"
                            src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c2bb32dd5f5_Arrows.svg"
                            alt=""
                            class="button-icon"
                          />
                        </div>
                        <div class="btn-overlay"></div>
                      </div>
                    </form>`,
              }}
            ></div>
          );
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
          if (props.className.includes("upgrade-plan-link")) {
            //console.log(node.children[2].children[0].data);
            //not signed in user
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
              else {
                return (
                  <Link href="/plans">
                    <a {...props}>
                      <div className="upgradedownload">View Collection</div>
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              }
            } else {
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

  const parseOptions = {
    replace,
  };

  useEffect(() => {
    if (auth) {
      (async () => {
        const { data, error } = await supabase
          .from("user_profile")
          .select()
          .eq("user_id", auth.user.id);
        if (data.length > 0 && data[0].first_name) {
          setName(data[0].first_name);
        }
      })();
    }
  }, [auth])

  useEffect(() => {
    if (typeof window !== "undefined") {
      $(".cancel,.request-popup").click(function () {
        $(".request-popup").hide();
        $("#loader").show();
        $(".iframe-holder").hide();
      });

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

    }
    // (async () => {
    //   const { data, error } = await supabase
    //     .from("illustration_type")
    //     .select('name')
    //   console.log('data1', data)
    //   data.forEach((ele) => {
    //     // console.log('typename', ele.name)
    //     types.push(ele.name)

    //   })
    // })();

  }, [router]);



  useEffect(() => {
    // console.log('allType', types)
    //heighlight the liked_illustrations
    let likeIcon = document.querySelectorAll(".like-buttons-wrap");
    likeIcon.forEach((icon) => {
      let wf_item_id = icon.children[0].innerText;
      if (favourites.includes(wf_item_id)) {
        //console.log(wf_item_id, icon);
        icon.children[1].innerHTML = `<div class="heart-magenta"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      } else {
        icon.children[1].innerHTML = `<div class="heart-magenta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" stroke="#14181F" stroke-width="0.8" stroke-miterlimit="10"/>
        </svg></div>`
      }
    });
    //console.log('useEffect testing')
  }, [favourites, router]);


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

    if ($el.closest(".like-buttons-wrap").get(0)) {
      let wf_item_id = $el.closest(".like-buttons-wrap").get(0)
        .children[0].innerText;
      //console.log(wf_item_id);
      if (auth) {

        if (favourites.length > 0) {
          let liked_illustrations = favourites;
          if (
            liked_illustrations.length > 0 &&
            liked_illustrations.includes(wf_item_id)
          ) {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div class="heart-magenta">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" stroke="#14181F" stroke-width="0.8" stroke-miterlimit="10"/>
              </svg></div>`;
            liked_illustrations.splice(
              liked_illustrations.indexOf(wf_item_id),
              1
            );
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id);
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

            liked_illustrations.push(wf_item_id);
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id);
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

        }
      }
      else {
        const signinpopup = document.querySelector('.signup-popup');
        signinpopup.style.display = "flex"
      }
    }
  }
  useEffect(() => {
    if (typeof window != "updefined") {
      const hide = document.querySelector('.signup-popup');
      hide.addEventListener('click', hidefn);
      function hidefn() {
        hide.style.display = "none";
      }
    }
  }, [])

  useEffect(() => {

    router.push("/")

  }, [router.asPath]);

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

      // ((d) => {
      //   d.querySelectorAll(".nav-menu .w--open").forEach((el) => {
      //     el.classList.remove("w--open");
      //   });
      //   if (d.querySelectorAll(".nav-left-wrapper .w--open").length > 0) {
      //     document.querySelector(".menu-icon").click();
      //   }
      // })(document);
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


  useEffect(() => {
    document.getElementById('all-home').classList.add('active-all-black')
    $('.filter-all-button').click(function () {
      document.getElementById('all-home').classList.remove('active-all-black')
    })
  }, [router])

  return (
    <>
      <Head>
        {parseHtml(props.headContent, parseOptions)}
      </Head>
      <div onClick={wrapClickHandler}>

        {auth == null ? parseHtml(hideLogin, parseOptions) : null}
        {auth == null
          ? parseHtml(illusHeadLogin, parseOptions)
          : parseHtml(props.illustrationHeadLogin, parseOptions)}

        {auth == null ? parseHtml(illusHead, parseOptions) : null}
        {auth == null ? (
          parseHtml(props.HomeIllustration, parseOptions)
        ) : (
          <div className="l">
            {parseHtml(props.HomeIllustration, parseOptions)}
          </div>
        )}
        {parseHtml(showFree, parseOptions)}
        {auth == null ? (
          <div className="showCaseBeforLogin">
            {parseHtml(props.showcase, parseOptions)}
          </div>
        ) : (
          <div className="showCaseAfterLogin">
            {parseHtml(props.showcase, parseOptions)}
          </div>
        )}

        {auth == null ? null : parseHtml(blog, parseOptions)}
        {parseHtml(props.allShow, parseOptions)}
        {/* </div> */}
        {/* <Script strategy="lazyOnload" id="jetboost-script" type="text/javascript" src='https://cdn.jetboost.io/jetboost.js' async  onError={(e) => {
          console.error('Script failed to load', e)
        }}></Script> */}
      </div>
    </>

  );
}

/** data fetching  from w-drawkit site*/
export async function getStaticProps() {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

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
  const navBar = $(".nav-access").html();
  const globalStyles = $(".global-styles").html();
  const LoggedinnavBar = $(`.logged-in-user-nav`).html();
  const hideLogin = $(`.hide-login`).html();
  const homeIllustration = $(`.show-all-illustration`).html();
  const showFree = $(`.show-free`).html();
  const showcase = $(`.showcase`).html();
  const illustrationHeadLogin = $(`.after-login-heading`).html();
  const illustrationHead = $(".before-login-heading").html();
  const showBlog = $(`.show-blogs-login`).html();
  const allShow = $(`.show-all`).html();
  const headContent = $(`head`).html();
  const footer = $(`.footer-access`).html();

  return {
    props: {
      headContent: headContent,
      globalStyles: globalStyles,
      supportScripts: supportScripts,
      navBar: navBar,
      hideLogin: hideLogin,
      LoggedinnavBar: LoggedinnavBar,
      footer: footer,
      showFree: showFree,
      showcase: showcase,
      showBlog: showBlog,
      illustrationHeadLogin: illustrationHeadLogin,
      illustrationHead: illustrationHead,
      HomeIllustration: homeIllustration,


      showFree: showFree,
      allShow: allShow,
    },
  };
}
