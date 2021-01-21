import { request } from "@/plugins/request";

export const getArticles = params => {
  params = JSON.parse(JSON.stringify(params));
  return request({
    url: "/api/articles",
    params
  });
};

export const getTags = params => {
  return request({
    url: "/api/tags"
  });
};
