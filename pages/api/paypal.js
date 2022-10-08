
const paypal = require('paypal-rest-sdk');
export default function handler(req, res) {


    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AcrH1ajNsTHzDRfGRmuWlTMTbVFcTBTMyjhI3l8jjmVTbbZ4RWVNjJNLA1LLQy8Gi3l1t8cGTB4uSwTR',
        'client_secret': 'ENvEILGYORDbnWVY4V5FNZai2-K0vnZqK7jpPsdwwyiAIuTgpozAzX8yP69b6r0I_NBdEWSU1G-QhZKf'
      })
    
    
    
      var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
     
     
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.status(200).json({ name: error })   
            throw error;
        } else {
                console.log("Create Payment Response");
            console.log(payment);
    res.status(200).json({ name: payment })

        }
    });


  }
  
  
  


