import { request } from "@/plugins/request";

export const getArticles = params => {
  return request({
    url: "/api/articles",
    params
  });
};
