import axios, { AxiosError, AxiosResponse } from "axios";
import { Agent } from "https";
import * as path from "path";
import * as dotnet from "dotenv";

function readEnvironmentVariables() {
  const __dirname = path.resolve();
        dotnet.config({
            path : `${__dirname}/test/.env`
        });
        
        const baseUrl = process.env.baseurl === undefined ? handleError("baseurl") : process.env.baseurl;
        const customerbaseurl = process.env.customerbaseurl === undefined ? handleError("customerbaseurl") : process.env.customerbaseurl;
        const client_id = process.env.client_id === undefined ? handleError("client_id") : process.env.client_id;
        const client_secret = process.env.client_secret === undefined ? handleError("client_secret") : process.env.client_secret;
        const scope = process.env.scope === undefined ? handleError("scope") : process.env.scope;
        const grant_type = process.env.grant_type === undefined ? handleError("grant_type") : process.env.grant_type;
        const tokenurl = process.env.tokenurl === undefined ? handleError("tokenurl") : process.env.tokenurl;

        return {
            baseUrl, customerbaseurl, client_id, client_secret, scope, grant_type, tokenurl
        };
}

function handleError(envVariable : string) : void {
    throw new Error(`No such '${envVariable}' variable present in the env file`);
}

async function getToken() {
  console.log("I am into this main method");
        let token = await axios.post(readEnvironmentVariables().tokenurl!, null, {
            params : {
                "grant_type" : readEnvironmentVariables().grant_type!,
                "scope" : readEnvironmentVariables().scope!,
                "client_secret" : readEnvironmentVariables().client_secret!,
                "client_id" : readEnvironmentVariables().client_id!
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

const instance =  axios.create({
    headers : {
        Authorization : `Bearer ${await getToken()}`, //
        Accept : "application/json"
    },
    httpsAgent : new Agent({
        rejectUnauthorized: false
    })
});

instance.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const { data, status } = error.response!;
    switch (status) {
      case 400:
        console.error(data);
        break;

      case 401:
        console.error('unauthorised');
        break;

      case 404:
        console.error('/not-found');
        break;

      case 500:
        console.error('/server-error');
        break;
    }
    return Promise.reject(error);
  }
);

export default class BaseApi {
  
    responseBody = <T>(response: AxiosResponse<T>) => response.data;
    
    requests = {
        post : async (url : string, data : {}) => await instance.post(url, data).then(this.responseBody),
        delete : async (url : string) => await instance.delete(url).then(this.responseBody),
        patch : async <T>(url: string, data: {}) => await instance.patch<T>(url, data).then(this.responseBody),
        put : async (url : string, data : {}) => await instance.put(url, data).then(this.responseBody),
        getAll : async <T>(url: string) => await instance.get<T>(url).then(this.responseBody),
    }
}


