<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href>Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href>Global Feed</a>
              </li>
            </ul>
          </div>

          <div :key="article.slug" v-for="article in articles" class="article-preview">
            <div class="article-meta">
              <nuxt-link
                :to="{
                name: 'profile',
                params: {username: article.author.username}
                }"
              >
                <img :src="article.author.image">
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                name: 'profile',
                params: {username: article.author.username}
                }"
                  class="author"
                >{{article.author.username}}</nuxt-link>
                <span class="date">{{article.createdAt}}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i>
                {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {slug: article.slug}
              }"
              class="preview-link"
            >
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                class="tag-default tag-pill"
                v-for="tag in tags"
                :key="tag"
                :to="{
                path: '/',
                query: {
                  tag
                }
              }"
              >{{tag}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul class="pagination">
          <li
            v-for="(num, i) in pages"
            :key="i"
            class="page-item"
            :class="{'active': currentPage == num}"
          >
            <nuxt-link
              class="page-link ng-binding"
              :to="{
              path: '/', query: {
                page: num,
                tag: $route.query.tag
              }
            }"
            >{{num}}</nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
import { getArticles, getTags } from "@/api/article";

export default {
  name: "Index",
  async asyncData(context) {
    const {
      route: { query }
    } = context;
    const { page = 1, tab, tag } = query;

    const limit = 10;
    const offset = limit * (Number(page) - 1);

    const params = {
      limit: 10,
      offset,
      tab,
      tag
    };
    const [articleRes, tagRes] = await Promise.all([
      getArticles(params),
      getTags()
    ]);

    const { articles, articlesCount } = articleRes;
    const pages = Math.ceil(articlesCount / params.limit);

    return {
      articles,
      articlesCount,
      pages,
      tags: tagRes.tags,
      tab,
      currentPage: page
    };
  },
  watchQuery: ["page"]
};
</script>

