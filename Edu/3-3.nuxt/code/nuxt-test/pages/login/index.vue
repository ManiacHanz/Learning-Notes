<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{title}}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="!isLogin" to="/login">Have an account?</nuxt-link>
            <nuxt-link v-else to="/register">Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <li :key="msg" v-for="msg in errmsg">{{msg}}</li>
          </ul>

          <form @submit.prevent="handleSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="user.email"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                minlength="8"
              >
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">{{title}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/auth";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Login",
  middleware: "notAuth",
  // async asyncData(context) {
  //   // console.log(context);
  //   const { route } = context;
  //   const isLogin = route.path === "/login";

  //   return {
  //     isLogin
  //   };
  // }
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
      errmsg: []
    };
  },
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
    title() {
      return this.$route.name === "login" ? "Sign In" : "Sign Up";
    }
  },
  methods: {
    async handleSubmit() {
      const data = {
        user: this.user
      };
      const submitHandler = this.isLogin ? login : register;
      debugger;
      try {
        const res = await submitHandler(data);

        this.$store.commit("setUser", res.user);
        Cookie.set("user", res.user); // saving token in cookie for server rendering
        // this.$router.push("/");
      } catch (error) {
        console.log(error);
        const { errors } = error;
        if (errors) {
          this.errmsg = Object.keys(errors).reduce((pre, key) => {
            errors[key].forEach(desc => {
              pre.push(`${key} ${desc}`);
            });
            return pre;
          }, []);
        }
      }
    }
  }
};
</script>
