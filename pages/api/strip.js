
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);
  console.log(userdetails);

  let response = await supabase
    .from("stripe_users")
    .select("*")
    .eq("user_id", userdetails.user_id);
  let stripeUser = response.body[0];
  console.log(stripeUser);
  let price = "price_1LmDCyFrgbA3kZrFp827Ri04";//"price_1KYEiyFrgbA3kZrFUztTyUKR";
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    status: "active",
    price: price,
    customer: stripeUser.stripe_user_id, //userdetails.customer,
  });

  let session;
  if (subscriptions.data.length <= 0) {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      // discounts: [
      //   {
      //     coupon: "drawkitcoupon",
      //   },
      // ],
      allow_promotion_codes:true,
      customer: stripeUser.stripe_user_id, // userdetails.customer,
      //For Vercel Url
      success_url: "https://www.drawkit.com/payment-successful",
      cancel_url: "https://www.drawkit.com/plans",
      //For local host
      // success_url: "http://localhost:80/payment-successful",
      // cancel_url: "http://localhost:80/plans",
    });
  } else {
    session = { message: "Already a subscribed customer" };
  }

  res.status(200).json({ session });
}
