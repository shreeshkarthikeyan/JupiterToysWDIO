import axios from "axios";
import { Agent } from "https";

class Token {

    public async getToken() : Promise<string> {

        console.log("I am into this method");
        let token = await axios.post("https://dev-96443153.okta.com/oauth2/default/v1/token", null, {
            params : {
                "grant_type" : "client_credentials",
                "scope" : "mod_custom",
                "client_secret" : "5P2mWuJHiLBRdMdcmTP0Kp70Un2bApMxpfsI34yA",
                "client_id" : "0oa1iocup696VlCxl5d7"
            },
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            }, 
            httpsAgent : new Agent({  
                rejectUnauthorized: false
            })
        })
        .then(response => response.data.access_token)
        .catch(err => console.log(err));
        console.log("Token:"+ token);
        return token;
    }
}

export default new Token();