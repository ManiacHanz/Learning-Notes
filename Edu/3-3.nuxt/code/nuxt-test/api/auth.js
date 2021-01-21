import { request } from "@/plugins/request";

export const login = data => {
  return request.post({
    url: "/api/users/login",
    data
  });
};

export const register = data => {
  return request.post({
    url: "/api/users",
    data
  });
};

export const updateUser = data => {
  return request({
    method: "PUT",
    url: "/api/user",
    data
  });
};

export const getUser = () => {
  return request({
    url: "/api/user"
  });
};
