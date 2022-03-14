import axios from "axios";

export const server_base_url = "https://api.roswel-th.com";

export const api_path = "/api/v1/";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  withCredentials: true,
  baseURL: server_base_url + api_path, // it's not recommended to have this info here.
});

// implement a method to execute all the request from here.
const apiRequest = ( method, url: string, request: null | object = null, extraHeader: any = null) => {
  let headers = {
    // authorization: ""
  };
  if (extraHeader !== null && typeof extraHeader === "object") {
    headers = {
      ...headers,
      ...extraHeader,
    };
  }
  //using the axios instance to perform the request that received from each http method
  let axios_param: any = {
    method,
    url,
    headers,
  };

  if (request !== null) {
    axios_param.data = request;
  }

  return axiosAPI(axios_param)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// function to execute the http get request
const get = (url, request = null) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url, request = null) => apiRequest("delete", url, request);

// function to execute the http post request
const post = (url, request = null, extraHeader = null) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url, request = null) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url, request = null) => apiRequest("patch", url, request);

// expose your method to other services or actions
const API = {
  get,
  delete: deleteRequest,
  post,
  put,
  patch,
};

export default API;
