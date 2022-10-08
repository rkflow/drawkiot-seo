import { useRouter } from "next/router";
import Head from "next/head";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "../utils/supabaseClient";
import { replace } from "../utils/replace-node";
import { useUser } from "../lib/authInfo";

import NavbarContent from "./navbar";
import { log } from "logrocket";

function unixDateToLocalDate(unxStamp) {
  return new Date(unxStamp * 1000).toLocaleDateString();
}
export default function Illustration(props) {
  const { user, setUser } = useUser();
  const parseOptions = { replace };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savefName, setsavefName] = useState("");
  const [savelName, setsavelName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [favraties, setFavraties] = useState([]);
  const [auth, setAuth] = useState(supabase.auth.session());
  const router = useRouter();
  const [nameChecker, setNameCheckr] = useState(null)

  console.log(user)
  function cancel() {
    if (supabase.auth.session()) {
      let uid = supabase.auth.session().user.id;

      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {
          if (data.length > 0) {
            fetch("api/cancel-subscriptions", {
              method: "POST",
              headers: {
                contentType: "application/json",
              },
              body: JSON.stringify({ customer: data[0].stripe_user_id }),
            })
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                if (!data.error) {
                  alert("successfully cancelled your subscription");
                } else {
                  alert("You have no active subscriptions");
                }
              });
          }
        });
    }
  }
  useEffect(() => {

    if (supabase.auth.session() != null) {
      let uid = supabase.auth.session().user.id;

      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {

          if (data.length > 0) {
            fetch("/api/payment-intents", {
              method: "POST",
              headers: {
                contentType: "application/json",
              },
              body: JSON.stringify({ customer: data[0].stripe_user_id }),
            })
              .then((response) => response.json())
              .then((data) => {
                setPaymentDetails(data);
              });
          }
        });
    }

    if (supabase.auth.session() != null) {
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



  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {


      if (favraties.length > 0) {
        (async () => {
          let favcardCantainer = "";
          let { data, error } = await supabase
            .from("illustrations_pack")
            .select("*")
            .in("wf_item_id", favraties);
          if (!error) {
            console.log("packs", data);
            data.forEach((pack) => {
              favcardCantainer += `
              <div class="favourite-details">
              <a href="/product/${pack.wf_slug}" class="favourite-flex w-inline-block">
                  <div class="pack_id">${pack.wf_item_id}</div>
                  <div class="favourite-image-wrapper">
                      <img src="${pack.thumbnail_img}" loading="lazy" alt="" class="favourites-image">
                  </div>
                  <div class="liked-content">
                      <div class="favourite-title text-style-1lines ">${pack.name}
                      </div>
                  </div>
              </a>
      
              <div class="cancel-favourite-wrapper">
                  <div class="cancel-favourite-icon">
                      <div class="heart-bg heart-magenta">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      </svg>
                      </div>
                  </div>
              </div>
          </div>
              `;
            });
            document.querySelector(".favourite-content-wrapper").innerHTML =
              favcardCantainer;
          }
        })();
      } else {
        document.querySelector(".favourite-content-wrapper").innerHTML = `<div class="w-layout-grid favourites-grid-profile"><div id="w-node-_1f6cf04d-131e-d345-fba9-91e37f091557-94a70818" class="no-favourite-text">No Illustrations has been Liked Yet...</div></div>`
      }
    }



  }, [favraties]);
  // useEffect(() => {

  //   if (typeof window !== "undefined" && paymentDetails) {
  //     let parentDiv = document.getElementById("invoice-detail");
  //     let innerText = "";
  //     paymentDetails.paymentIntents.data.forEach((payment) => {
  //       let invoice = paymentDetails.invoices.data.find(
  //         (el) => el.payment_intent == payment.id
  //       );
  //       innerText += `<div class="subscription-invoice-details"><div class="bill-date">${(payment.amount_received / 100).toFixed(2) +
  //         " " +
  //         payment.currency.toUpperCase()
  //         }</div> 
  //       <div class="bill-date">${unixDateToLocalDate(
  //           invoice.lines.data[0].period.start
  //         )
  //         }</div>
  //       <div class="bill-date">${unixDateToLocalDate(
  //           invoice.lines.data[0].period.end
  //         )}</div>
  //       <div class="bill-date"><a href="${invoice.hosted_invoice_url
  //         }" target='_blank'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download" style="&#10;    color: black;&#10;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></a></div></div>
  //       `;

  //     });
  //     parentDiv.innerHTML = innerText;
  //   }
  // }, [paymentDetails]);

  useEffect(() => {
    if (supabase.auth.session() != null) {


      supabase
        .from("user_profile")
        .select()
        .eq("user_id", supabase.auth.session().user.id)
        .then((data) => {
          setNameCheckr(data.data[0].first_name)
          if (data.data.first_name != null) {
            console.log('Test', data)
            setFirstName(data.data[0].first_name);
            setLastName(data.data[0].last_name);
            setsavefName(data.data[0].first_name);
            setsavelName(data.data[0].last_name);
          } else {
            console.log('no data')
          }
        });

      document.getElementById("first-name").value = firstName;
      document.getElementById("last-name").value = lastName;
      if (nameChecker != null) {
        document.querySelector(".user-name").innerText = nameChecker;
        // username-letters
        document.querySelector('.letter-avatar').innerText = nameChecker.slice(0, 1)
        document.querySelector('.username-letters-small').innerText = nameChecker.slice(0, 1)

      } else {
        document.querySelector(".user-name").innerText = auth.user.email.split("@")[0];
        document.querySelector('.letter-avatar').innerText = auth.user.email.split("")[0]
        document.querySelector('.username-letters-small').innerText = auth.user.email.split("")[0]
      }

    }
  }, [savefName, nameChecker, savelName]);



  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#favourite-tab").get(0)) {
      $("#profile-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#favourite-tab").css({ "background-color": "#f075c6", "color": "white" });
      $("#billing-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#settings-tab").css({ "background-color": "#c8d5c44d", "color": "black" });


      $("#prof-display").hide();
      $("#fav-display").show();
      $('#billing-display').hide();
      $("#setting-display").hide();

    }
    if (!!$el.closest("#profile-tab").get(0)) {



      supabase
        .from("user_profile")
        .select()
        .eq("user_id", supabase.auth.session().user.id)
        .then((data) => {
          setNameCheckr(data.data[0].first_name)
          if (data.data[0].first_name != null) {
            console.log('Test', data)
            document.getElementById("first-name").value = (data.data[0].first_name);
            document.getElementById("last-name").value = (data.data[0].last_name);

          } else {
            console.log('no data')
          }
        });







      $("#profile-tab").css({ "background-color": "#f075c6", "color": "white" });
      $("#favourite-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#billing-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#settings-tab").css({ "background-color": "#c8d5c44d", "color": "black" });

      $("#prof-display").show();
      $("#fav-display").hide();
      $('#billing-display').hide();
      $("#setting-display").hide();

    }
    if (!!$el.closest("#billing-tab").get(0)) {


      $('.plan-details .get-started').hide();



      $("#profile-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#favourite-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#billing-tab").css({ "background-color": "#f075c6", "color": "white" });
      $("#settings-tab").css({ "background-color": "#c8d5c44d", "color": "black" });

      $("#prof-display").hide();
      $("#fav-display").hide();
      $('#billing-display').show();
      $("#setting-display").hide();

    }
    if (!!$el.closest("#settings-tab").get(0)) {
      $("#profile-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#favourite-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#billing-tab").css({ "background-color": "#c8d5c44d", "color": "black" });
      $("#settings-tab").css({ "background-color": "#f075c6", "color": "white" });

      $("#prof-display").hide();
      $("#fav-display").hide();
      $('#billing-display').hide();
      $("#setting-display").show();

    }

    if (!!$el.closest("#subscribe").get(0)) {
      if (auth != null) {
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

    if (!!$el.closest(".life-time-acces-button").get(0)) {
      if (auth != null) {
        fetch("/api/subscrib-life-time", {
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

    if (auth != null) {

      if (user.subscription_details.status == 'inactive') {
        document.querySelector('.free-plan').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc89adf7c72277b802f87_Group%2020056.svg" alt="">`
        document.querySelector('.life-time-access').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc8c54899cf7c65a17e21_Group%2020060.svg" alt="">`

      }
      if (user.subscription_details.planType == "lifetime") {
        document.querySelector('.free-plan').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc8c54899cf7c65a17e21_Group%2020060.svg" alt="">`
        document.querySelector('.life-time-access').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc89adf7c72277b802f87_Group%2020056.svg" alt="">`
        console.log('289 => lifeTimeUser')
        document.querySelector('.life-time-acces-button').style.visibility = 'hidden';
        document.querySelector('#subscribe').style.visibility = "hidden"
        document.querySelector('.get-started').style.visibility = "hidden"
      }
      if (user.subscription_details.planType == "drawkitPro") {
        document.querySelector('.free-plan').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc8c54899cf7c65a17e21_Group%2020060.svg" alt="">`
        document.querySelector('.life-time-access').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc8c54899cf7c65a17e21_Group%2020060.svg" alt="">`
        document.querySelector('.premium-plan').innerHTML = `<img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62fdc89adf7c72277b802f87_Group%2020056.svg" alt="">`

        document.querySelector('#subscribe').style.visibility = "hidden"
        document.querySelector('.get-started').style.visibility = "hidden"
        console.log('289 => proUser')
      }
    }
    if (!!$el.closest("#save-changes").get(0)) {
      if (document.querySelector('#first-name').value == "") {
        alert("Please enter your first and last name");
      } else if (document.querySelector('#last-name').value == "") {
        alert("Please enter your last name");
      } else {

        if (
          !!firstName &&
          !!lastName &&
          (firstName != savefName || lastName != savelName)
        ) {
          supabase
            .from("user_profile")
            .upsert(
              {
                first_name: firstName,
                last_name: lastName,
                user_id: supabase.auth.session().user.id,
              },
              { onConflict: "user_id" }
            )
            .then(({ data, error }) => {
              if (error) {
                alert(error.message);
              } else {
                alert("Changes has been successfully updated");
                setsavefName(firstName);
                setsavelName(lastName);
              }
            });
        }
      }

    }

    if (!!$el.closest(".subscription-plan-button").get(0)) {
      $("#popup-open").addClass("popup-open");
    }

    if ($el.get(0).id == "cancel-popup") {
      $("#popup-open").removeClass("popup-open");
    }

    if (!!$el.closest("#cancel-yes").get(0)) {
      cancel();
      $("#popup-open").removeClass("popup-open");
    }
    if (!!$el.closest("#cancel-no").get(0)) {
      $("#popup-open").removeClass("popup-open");
    }
  }

  async function wrapChangeHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#first-name").get(0)) {
      setFirstName($el.closest("#first-name").val());
      //console.log(firstName);
    }
    if (!!$el.closest("#last-name").get(0)) {
      setLastName($el.closest("#last-name").val());
      //console.log(lastName);
    }
  }

  if (auth) {

    const closeButtons = document.querySelectorAll('.cancel-favourite-wrapper');
    const favourite_details = document.querySelectorAll('.favourite-details');

    closeButtons.forEach((ele, index1) => {

      ele.addEventListener('click', (e) => {
        favourite_details.forEach((ele, index2) => {
          if (index2 == index1) {
            let liked_illustrations = favraties;
            const wf_item_id = ele.children[0].children[0].innerText;

            liked_illustrations.splice(
              liked_illustrations.indexOf(wf_item_id),
              1
            );
            supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id).then(() => {
                ele.style.display = "none"
              })
          }
        })
      })
    })
  }

  return supabase.auth.session() != null ? (
    <>
      <Head>
        {parseHtml(props.globalStyles, parseOptions)}
        {parseHtml(props.headContent, parseOptions)}
      </Head>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.bodyContent, parseOptions)}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      </div>
      <div>
      </div>
    </>
  ) : (
    ""
  );
}

export const getStaticProps = async (paths) => {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res;

  res = await axios(`https://drawkit-v2.webflow.io/profile`).catch((err) => {
    console.error(err);
  });

  if (res) {
    const html = res.data;
    const $ = cheerio.load(html);
    const navBar = $(`.nav-access`).html();
    const bodyContent = $(`.main-wrapper`).html();
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
        bodyContent: bodyContent,
        headContent: headContent,
        navBar: navBar,
        supportScripts: supportScripts,
        footer: footer,
        globalStyles: globalStyles,
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