import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
    let price ="price_1LoZMPFrgbA3kZrFjQbkyhTD";// "price_1LkLfJFrgbA3kZrFzmMFszSA";
    let userdetails = JSON.parse(req.body);
    let response = await supabase
    .from("stripe_users")
    .select("*")
    .eq("user_id", userdetails.user_id);
  let stripeUser = response.body[0];
  console.log(stripeUser);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.search({
        query: `status:\'succeeded\' AND customer:\'${stripeUser.stripe_user_id}\'`,
        limit: 100,
    });
    
    let session;
    if (!(paymentIntent.data.some((payment) => {
        return payment.status === 'succeeded' && (payment.amount == 23600 || payment.amount == 29500) && payment.charges.data[0].amount_refunded==0;
    }))) {
        session = await stripe.checkout.sessions.create({
            mode: "payment",
            
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            // customer_creation: 'always',
            // customer_email: 'ravi@designstripe.com',
            allow_promotion_codes: true,
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

    res.status(200).json({ session: session });
}
