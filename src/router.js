import { createRouter, createWebHistory } from 'vue-router';
import Timer from './components/Timer.vue';  // 计时器组件
import Metronome from './components/Metronome.vue';  // 节拍器组件
import CountdownTimer from './components/CountdownTimer.vue'; // 倒计时器组件

const routes = [
  { path: '/', component: Timer, name: 'Timer' },
  { path: '/metronome', component: Metronome, name: 'Metronome' },
  { path: '/countdown', component: CountdownTimer, name: 'CountdownTimer' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 