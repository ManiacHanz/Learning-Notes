<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{article.title}}</h1>
        <ArticleMeta :article="article" :user="user"/>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="contextBody"></div>
      </div>

      <hr>

      <div class="article-actions">
        <ArticleMeta :article="article" :user="user"/>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
                v-model="input"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img">
              <button class="btn btn-sm btn-primary" @click="submitComment">Post Comment</button>
            </div>
          </form>

          <div :key="item.id" v-for="item in comments" class="card">
            <div class="card-block">
              <p class="card-text">{{item.body}}</p>
            </div>
            <div class="card-footer">
              <a
                :to="{name: 'profile', params: {username: item.author.username}}"
                class="comment-author"
              >
                <img :src="item.author.image" class="comment-author-img">
              </a>
              &nbsp;
              <a href class="comment-author">{{item.author.username}}</a>
              <span class="date-posted">{{item.createdAt}}</span>
              <span v-if="item.author.username === user.username" class="mod-options">
                <i class="ion-edit"></i>
                <i class="ion-trash-a"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getArticle, getComment, addComment } from "@/api/article";
import { mapState } from "vuex";
import ArticleMeta from "./components/meta";
const MarkdownIt = require("markdown-it");

export default {
  name: "ArticleDetail",
  components: { ArticleMeta },
  async asyncData({ route }) {
    const {
      params: { slug }
    } = route;
    const [ArticleRes, commentsRes] = await Promise.all([
      getArticle(slug),
      getComment(slug)
    ]);
    const { article } = ArticleRes;
    const { comments } = commentsRes;
    const md = new MarkdownIt();
    const contextBody = md.render(article.body);
    return { article, comments, slug, contextBody };
  },
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      input: ""
    };
  },
  methods: {
    async submitComment() {
      try {
        await addComment(this.slug, this.input);
        await getComments();
      } catch (e) {
        console.log(e);
      }
    },
    async getComments() {
      const { comments } = await getComment(this.slug);
      this.comments = comments;
    }
  }
};
</script>
