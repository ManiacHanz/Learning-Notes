// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "Gridsome",
  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        typeName: "BlogPost",
        path: "./content/blog/**/*.md"
      }
    },
    {
      use: "@gridsome/source-strapi",
      options: {
        apiURL: "http://117.50.100.7:1337",
        queryLimit: 1000, // Defaults to 100
        contentTypes: ["post"],
        singleTypes: ["main"]
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        // loginData: {
        //   identifier: "",
        //   password: ""
        // }
      }
    }
  ]
};
