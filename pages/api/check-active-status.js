import { supabase } from "../../utils/supabaseClient";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);
  // console.log(userdetails.customer);
  // let response = await supabase
  //   .from("stripe_users")
  //   .select("*")
  //   .eq("user_id", userdetails.customer);
  // let stripeUser = response.body[0];

  const paymentIntent = await stripe.paymentIntents.search({
    query: `status:\'succeeded\' AND customer:\'${userdetails.customer}\'`,
    limit: 100,
  });

  if (
    !(paymentIntent.data.some((payment) => {
      return payment.status === 'succeeded' && (payment.amount == 23600 || payment.amount == 29500) && payment.charges.data[0].amount_refunded == 0;
    }))
  ) {


    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
      status: "active",
      price: "price_1LmDCyFrgbA3kZrFp827Ri04",
      customer: userdetails.customer,
    });


    if (!subscriptions.data[0]) {
      res.status(200).json({ status: "inactive" });
    }
    else {
      res.status(200).json({ status: "active", planType: "drawkitPro" });
    }
  }
  else {
    res.status(200).json({ status: "active", planType: "lifetime" });
  }
}
