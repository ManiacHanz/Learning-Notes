<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link exact class="nav-link" to="/">Home</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Post
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
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
