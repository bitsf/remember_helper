<template>
  <div id="app">
    <router-view />
    <nav>
      <router-link to="/">计时器</router-link>
      <router-link to="/metronome">节拍器</router-link>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使容器占满整个视口高度 */
}

nav {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #f0f0f0;
  margin-top: auto; /* 将导航栏推到底部 */
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 10px;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #007bff;
}
</style> 