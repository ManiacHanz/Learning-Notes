import { request } from "@/plugins/request";

export const getProfile = username => {
  return request({
    url: `/api/profiles/${username}`
  });
};
