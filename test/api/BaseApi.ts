import axios, { AxiosError } from "axios";
import { Agent } from "https";
import Token from "./Token.js";

const instance =  axios.create({
    headers : {
        Authorization : `Bearer ${await Token.getToken()}`,
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

    requests = {
        post : async (url : string, data : {}) => await instance.post(url, data).then(response => response.data),
        delete : async (url : string) => await instance.delete(url).then(response => response.data),
        patch : async <T>(url: string, data: {}) => await instance.patch<T>(url, data).then(response => response.data),
        put : async (url : string, data : {}) => await instance.put(url, data).then(response => response.data),
        getAll : async <T>(url: string) => await instance.get<T>(url).then(response => response.data),
    }
}
