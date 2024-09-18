import axios, { AxiosError, AxiosResponse } from "axios";
import { Agent } from "https";
import { envs } from "../../wdio.conf.js";

async function getToken() {
  console.log("I am into this main method");
        let token = await axios.post(envs.tokenurl!, null, {
            params : {
                "grant_type" : envs.grant_type!,
                "scope" : envs.scope!,
                "client_secret" : envs.client_secret!,
                "client_id" : envs.client_id!
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


