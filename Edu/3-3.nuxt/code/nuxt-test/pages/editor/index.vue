<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="submit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="tags" type="text" class="form-control" placeholder="Enter tags">
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit">Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { submitArticle, getArticle } from "@/api/article";
export default {
  name: "Editor",
  data() {
    return {
      title: "",
      description: "",
      body: "",
      tags: ""
    };
  },
  async mounted() {
    const { article } = await getArticle(this.$route.params.slug);
    this.title = article.title;
    this.description = article.description;
    this.body = article.body;
    this.tags = article.tagList.join(",");
  },
  methods: {
    async submit() {
      const params = {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tags.split(",")
      };

      try {
        const res = await submitArticle(params, this.$route.query.slug);
        this.$router.go(-1);
      } catch (er) {
        console.log(er);
      }
    }
  }
};
</script>