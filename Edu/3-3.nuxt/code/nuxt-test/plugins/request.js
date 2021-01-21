import axios from "axios";

export const request = axios.create({
  baseURL: "https://conduit.productionready.io"
});

["post", "put"].forEach(method => {
  request[method] = props =>
    request({
      method: String.prototype.toUpperCase.call(method),
      ...props
    });
});

export default ({ store, ...props }) => {
  // Add a request interceptor
  request.interceptors.request.use(
    function(config) {
      const { user } = store.state;
      if (user) {
        const { token } = user;
        if (token) {
          Object.assign(config.headers, { Authorization: `Token ${token}` });
        }
      }

      // Do something before request is sent
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  request.interceptors.response.use(
    function(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data

      return response.data;
    },
    function(error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const e = error?.response?.data || error;
      return Promise.reject(e);
    }
  );
};
