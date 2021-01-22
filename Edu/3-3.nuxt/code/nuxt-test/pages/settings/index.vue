<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="handleSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                >
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout">Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser, getUser } from "@/api/auth";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  name: "Settings",
  data() {
    return {
      user: {
        email: "",
        bio: "",
        image: "",
        username: "",
        password: ""
      }
    };
  },
  async mounted() {
    const res = await getUser();
    this.user = res.user;
  },
  methods: {
    async handleSubmit() {
      try {
        const res = await updateUser(this.user);
        this.$router.push("/");
      } catch (err) {
        alert("更新失败");
        // console.log(err);
      }
    },
    logout() {
      Cookie.remove("user");
      this.$store.commit("setUser", null);
      this.$router.redirect("/");
    }
  }
};
</script>

