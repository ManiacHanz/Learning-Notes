import { request } from "@/plugins/request";

export const getArticles = params => {
  params = JSON.parse(JSON.stringify(params));

  const url =
    params.tab === "personal" ? "/api/articles/feed" : "/api/articles";

  return request({
    url,
    params
  });
};

export const getArticle = slug => {
  return request({
    url: `/api/articles/${slug}`
  });
};

export const getTags = params => {
  return request({
    url: "/api/tags"
  });
};

export const postFavArt = slug => {
  return request.post({
    url: `/api/articles/${slug}/favorite`
  });
};

export const postUnFavArt = slug => {
  return request.delete({
    url: `/api/articles/${slug}/favorite`
  });
};
