import axios from "axios";
import { Agent } from "https";
import ReadProperties from "../config/ReadProperties.js";

class Token {

    public async getToken() : Promise<string> {

        console.log("I am into this method");
        let token = await axios.post(ReadProperties.readEnvironmentVariables().tokenurl!, null, {
            params : {
                "grant_type" : ReadProperties.readEnvironmentVariables().grant_type!,
                "scope" : ReadProperties.readEnvironmentVariables().scope!,
                "client_secret" : ReadProperties.readEnvironmentVariables().client_secret!,
                "client_id" : ReadProperties.readEnvironmentVariables().client_id!
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