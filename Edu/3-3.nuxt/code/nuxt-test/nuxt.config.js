module.exports = {
  router: {
    extendRoutes(routes, resolve) {
      routes = [];
      // routes.splice(0);
      routes.push({
        linkActiveClass: "active",
        path: "/",
        component: resolve(__dirname, "pages/layouts/index.vue"),
        children: [
          {
            name: "home",
            path: "",
            component: resolve(__dirname, "pages/index/index.vue")
          },
          {
            name: "login",
            path: "/login",
            component: resolve(__dirname, "pages/login/index.vue")
          },
          {
            name: "register",
            path: "/register",
            component: resolve(__dirname, "pages/login/index.vue")
          },
          {
            name: "profile",
            path: "/profile/:username",
            component: resolve(__dirname, "pages/profile/index.vue")
          },
          {
            name: "article",
            path: "/article/:slug",
            component: resolve(__dirname, "pages/article/")
          },
          {
            name: "settings",
            path: "/settings",
            component: resolve(__dirname, "pages/settings/")
          }
        ]
      });
      return routes;
    }
  },
  server: {
    port: 3000 // default: 3000
  },
  plugins: ["@/plugins/request.js"]
};
