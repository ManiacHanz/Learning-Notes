<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
              path: '/profile', 
              params: {username: article.author.username}
            }"
    >
      <img :src="article.author.image">
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
              path: '/profile', 
              params: {username: article.author.username}
            }"
        class="author"
      >{{article.author.username}}</nuxt-link>
      <span class="date">{{article.createdAt}}</span>
    </div>
    <button class="btn btn-sm btn-outline-secondary">
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow {{article.author.username}}
      <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <button v-if="!article.favorited" class="btn btn-sm btn-outline-primary">
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post
      <span class="counter">({{article.favoritesCount}})</span>
    </button>

    <button v-else class="btn btn-sm btn-primary">
      <i class="ion-heart"></i>
      <span class="ng-binding ng-scope">Unfavorite Article</span>
      <span class="counter">({{article.favoritesCount}})</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "Article-meta",
  props: {
    article: {
      type: Object,
      required: true
    }
  }
};
</script>