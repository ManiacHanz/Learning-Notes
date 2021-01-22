<template>
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

    <button
      v-if="user.username !== article.author.username"
      class="btn btn-sm btn-outline-secondary"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow {{article.author.username}}
      <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <button
      v-if="!article.favorited && user.username !== article.author.username"
      class="btn btn-sm btn-outline-primary"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post
      <span class="counter">({{article.favoritesCount}})</span>
    </button>

    <button
      v-else-if="article.favorited && user.username !== article.author.username"
      class="btn btn-sm btn-primary"
    >
      <i class="ion-heart"></i>
      <span class="ng-binding ng-scope">Unfavorite Article</span>
      <span class="counter">({{article.favoritesCount}})</span>
    </button>

    <span v-if="user.username === article.author.username">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {slug: article.slug}
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" @click="delArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
  </div>
</template>

<script>
import { delArticle } from "@/api/article";
export default {
  name: "Article-meta",
  props: {
    article: {
      type: Object,
      required: true
    },
    user: {
      type: Object
    }
  },
  methods: {
    async delArticle() {
      const {
        params: { slug }
      } = this.$route;
      await delArticle(slug);
      this.$router.go(-1);
    }
  }
};
</script>