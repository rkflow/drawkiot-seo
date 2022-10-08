
// var Intercom = require('intercom-client');
let axios = require('axios');

export default async function handler(req, res) {
    
    let userdetails = JSON.parse(req.body);
    
    await axios.post("https://hooks.zapier.com/hooks/catch/5747397/bcwdlll/",{
        body:{"Person" : {"reason":userdetails.reason,"name" : userdetails.name,"email":userdetails.email,"Messsage":userdetails.message} }
    }).then((data)=>{
        
    });
    res.status(200).json({ subscriptions: "dta" })

}
