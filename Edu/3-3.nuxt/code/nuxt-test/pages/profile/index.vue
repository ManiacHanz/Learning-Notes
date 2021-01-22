<template>
  <div>
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img :src="profile.image" class="user-img">
              <h4>{{profile.username}}</h4>
              <p>{{profile.bio}}</p>
              <button
                v-if="profile.username !== user.username"
                class="btn btn-sm btn-outline-secondary action-btn"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                Follow {{profile.username}}
              </button>
              <nuxt-link v-else class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
                <i class="ion-gear-a"></i> Edit Profile Settings
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <a class="nav-link active" href>My Articles</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href>Favorited Articles</a>
                </li>
              </ul>
            </div>

            <div :key="item.slug" v-for="item in articles" class="article-preview">
              <div class="article-meta">
                <nuxt-link :to="{name: 'profile', params: {username: item.author.username}}">
                  <img :src="item.author.image">
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    :to="{name: 'profile', params: {username: item.author.username}}"
                  >{{item.author.username}}</nuxt-link>
                  <span class="date">{{item.createAt | date}}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                  <i class="ion-heart"></i>
                  {{item.favoritesCount}}
                </button>
              </div>
              <nuxt-link :to="{name: 'article',params: {slug: item.slug}}" class="preview-link">
                <h1>{{item.title}}</h1>
                <p>{{item.description}}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li
                    :key="tag"
                    v-for="tag in item.tagList"
                    class="tag-default tag-pill tag-outline"
                  >{{tag}}</li>
                </ul>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProfile } from "@/api/profile";
import { getArticles } from "@/api/article";
export default {
  name: "Profile",
  middleware: ["auth"],
  computed: {
    ...mapState(["user"])
  },
  async asyncData({ route }) {
    const { params } = route;
    const { username } = params;
    const [{ profile }, { articles }] = await Promise.all([
      getProfile(username),
      getArticles({
        limit: 10,
        author: username
      })
    ]);

    return {
      profile,
      articles
    };
  }
};
</script>


