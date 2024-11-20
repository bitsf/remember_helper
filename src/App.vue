<template>
  <div id="app">
    <button @click="toggleFullScreen" class="fullscreen-button">{{ isFullScreen ? '恢复' : '全屏' }}</button>
    <router-view />
    <nav>
      <router-link to="/">计时器</router-link>
      <router-link to="/metronome">节拍器</router-link>
      <router-link to="/countdown">倒计时器</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullScreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullScreen.value = false;
    }
  }
};

watch(() => document.fullscreenElement, (newValue) => {
  isFullScreen.value = !!newValue;
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使容器占满整个视口高度 */
  width: 100vw; /* 使容器占满整个视口宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.fullscreen-button {
  position: absolute; /* 绝对定位 */
  top: 10px; /* 距离顶部10px */
  right: 10px; /* 距离右侧10px */
  padding: 5px 10px; /* 按钮内边距 */
  background-color: #007bff; /* 按钮背景色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标指针样式 */
}

.fullscreen-button:hover {
  background-color: #0056b3; /* 悬停时按钮颜色 */
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