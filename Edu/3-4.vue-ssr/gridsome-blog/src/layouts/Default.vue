<template>
  <div class="layout sticky-header">
    <header class="header sticky">
      <div class="container">
        <div class="left">
          <g-link to="/" aria-current="page" class="home-link active--exact active">
            <img
              src="https://gridsome-forestry.netlify.app/assets/img/logo.332701b7.svg"
              class="logo"
            >
          </g-link>
        </div>
        <nav class="nav right">
          <g-link to="/" class="nav__link">Journal</g-link>
          <g-link to="/about" class="nav__link">Say Hi!</g-link>
        </nav>
      </div>
    </header>
    <slot/>

    <footer class="footer">
      <div class="container">
        <span>Copyright © 2021</span>
      </div>
    </footer>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>



<style scoped>
.layout.sticky-header {
  padding: 6rem 0 0;
}
.header.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.header {
  height: 6rem;
  z-index: 10;
}
.header > .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.header .home-link {
  text-decoration: none;
}
.nav .nav__link {
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 4px;
  margin-right: 3rem;
  padding-bottom: 4px;
  border-bottom: 1px solid;
  border-color: transparent;
  transition: border 0.15s;
}
.logo {
  height: 1.5rem;
}
.footer {
  font-size: 0.8rem;
  padding: 6rem 0;
}
</style>
