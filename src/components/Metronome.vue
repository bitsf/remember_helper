<template>
  <div class="metronome">
    <h2>节拍器</h2>
    <div>
      <label>节拍速度 (BPM):</label>
      <input type="number" v-model="bpm" @input="updateInterval" />
    </div>
    <button @click="toggleMetronome">{{ isPlaying ? '停止' : '开始' }} 节拍</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const bpm = ref(120);
const isPlaying = ref(false);
let intervalId = null;

const toggleMetronome = () => {
  if (isPlaying.value) {
    clearInterval(intervalId);
    isPlaying.value = false;
  } else {
    isPlaying.value = true;
    startMetronome();
  }
};

const startMetronome = () => {
  const interval = 60000 / bpm.value; // 计算间隔时间
  intervalId = setInterval(() => {
    // 播放节拍音效
    console.log('Tick'); // 这里可以替换为实际的音效播放
  }, interval);
};

const updateInterval = () => {
  if (isPlaying.value) {
    clearInterval(intervalId);
    startMetronome();
  }
};
</script>

<style scoped>
.metronome {
  text-align: center;
  margin-top: 20px;
}
</style> 