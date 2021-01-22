<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <nuxt-link exact class="nav-link" to="/">Home</nuxt-link>
          </li>
          <li v-if="user" class="nav-item">
            <nuxt-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Post
            </nuxt-link>
          </li>
          <li v-if="user" class="nav-item">
            <nuxt-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li v-if="!user" class="nav-item">
            <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
          </li>
          <li v-if="!user" class="nav-item">
            <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
          </li>

          <li v-if="user" class="nav-item">
            <nuxt-link
              class="nav-link ng-binding"
              :to="{name: 'profile', params: {username: user.username}}"
            >
              <img
                ng-src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fww1.sinaimg.cn%2Fmw690%2F0071ogI5gy1gj7s0sfweoj30u00u0jt1.jpg&amp;refer=http%3A%2F%2Fwww.sina.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=jpeg?sec=1613820891&amp;t=c0e98fab70dbe83313db2e75b152c238"
                class="user-pic"
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fww1.sinaimg.cn%2Fmw690%2F0071ogI5gy1gj7s0sfweoj30u00u0jt1.jpg&amp;refer=http%3A%2F%2Fwww.sina.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=jpeg?sec=1613820891&amp;t=c0e98fab70dbe83313db2e75b152c238"
              >
              {{user.username}}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>

    <nuxt-child :key="$route.fullPath"/>
    <!-- <nuxt-child/> -->

    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user"])
  }
};
</script>