import { createRouter, createWebHistory } from 'vue-router';
import Timer from './components/Timer.vue';  // 计时器组件
import Metronome from './components/Metronome.vue';  // 节拍器组件

const routes = [
  { path: '/', component: Timer, name: 'Timer' },
  { path: '/metronome', component: Metronome, name: 'Metronome' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 