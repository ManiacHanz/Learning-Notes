<template>
  <Layout>
    <div class="container">
      <div class="hero">
        <h1 class="hero-title">{{main.title}}</h1>
        <h2 class="hero-subtitle">{{main.subtitle}}</h2>
      </div>
      <div class="projects">
        <div class="project" v-for="post in posts" :key="post.node.id">
          <a href="/projects/chelsea-landmark/" class="project-link">
            <img
              alt="Banana"
              :src="post.node.cover.url | img-url"
              width="2560"
              :data-srcset="post.node.cover.url | img-url"
              data-sizes="(max-width: 2560px) 100vw, 2560px"
              class="thumbnail g-image g-image--lazy g-image--loaded"
              sizes="(max-width: 2560px) 100vw, 2560px"
            >
            <noscript>
              <img
                :src="post.node.cover.url | img-url"
                class="thumbnail g-image g-image--loaded"
                width="2560"
                alt="Banana"
              >
            </noscript>
            <h3 class="project-title">{{post.node.title}}</h3>
            <div class="categories">
              <span class="category">{{post.node.category}}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query {
  posts: allStrapiPost {
    edges {
      node {
        id
        title
        category
        cover {
          url
        }
      }
    }
  }
  main: allStrapiMain {
    edges {
      node {
        title
        subtitle
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: "Hello, world!"
  },
  computed: {
    main() {
      return this.$page.main.edges[0].node;
    },
    posts() {
      return this.$page.posts.edges;
    }
  }
};
</script>


<style scoped>
@media (min-width: 920px) {
  .project {
    grid-column: auto/span 1 !important;
  }
  .project:nth-child(3n + 1) {
    grid-column: auto/span 2 !important;
  }
}
img {
  max-width: 100%;
}
.hero {
  text-align: center;
  width: 480px;
  max-width: 100%;
  margin: 0 auto;
  padding: 4rem 0 8rem;
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  padding: 0;
  margin: 0 0 2rem;
}
.hero-subtitle {
  font-size: 1.15em;
  font-weight: 400;
  line-height: 1.68;
  opacity: 0.6;
}
.projects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4rem;
}

.project {
  grid-column: auto/span 2;
  text-align: center;
}
.thumbnail {
  height: 560px;
  -o-object-fit: cover;
  object-fit: cover;
  transition: all 0.15s ease;
  box-shadow: 0 0 40px -20px rgba(0, 0, 0, 0.25);
}
.project-title {
  font-size: 1rem;
  color: var(--color-contrast);
  margin: 2rem 0 1rem;
}
.categories {
  font-size: 0.8rem;
  color: var(--color-contrast-1);
}
</style>
