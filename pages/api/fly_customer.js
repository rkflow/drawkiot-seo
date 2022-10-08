
// var Intercom = require('intercom-client');
let axios = require('axios');

export default async function handler(req, res) {



    let userdetails = JSON.parse(req.body);

    console.log('.........', userdetails.reason);


    axios.post("https://hooks.zapier.com/hooks/catch/5747397/bce84zv/", {
        body: { "Person": { "timing": userdetails.timing, "name": userdetails.name, "email": userdetails.email, } }
    }).then((data) => {
        console.log(data);
    });
    res.status(200).json({ subscriptions: "dta" })

}
