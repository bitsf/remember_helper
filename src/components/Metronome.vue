<template>
  <div class="metronome">
    <h2>节拍器</h2>
    <div>
      <label>节拍速度 (BPM):</label>
      <input type="number" v-model="bpm" @input="updateInterval" />
    </div>
    <div>
      <label>每小节音符数量:</label>
      <input type="number" v-model="beatsPerMeasure" @input="updateInterval" />
    </div>
    <button class="save-button" @click="saveSettings">保存设置</button>
    <button @click="toggleMetronome">{{ isPlaying ? '停止' : '开始' }} 节拍</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bpm = ref(80);
const beatsPerMeasure = ref(2); // 每小节音符数量，默认2
const isPlaying = ref(false);
let intervalId = null;

// 引入节拍音效
const metronomeSound = new Audio('/sounds/metronome-click.ogg'); // 确保路径正确
const accentSound = new Audio('/sounds/metronome-accent.ogg'); // 强音效，确保路径正确

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
  const interval = (60000 / bpm.value) / beatsPerMeasure.value; // 计算每个音符的间隔时间
  let count = 0; // 计数器

  intervalId = setInterval(() => {
    if (count % beatsPerMeasure.value === 0) {
      accentSound.currentTime = 0;
      accentSound.play(); // 播放强音效
    } else {
      metronomeSound.currentTime = 0;
      metronomeSound.play(); // 播放节拍音效
    }
    count++;
  }, interval);
};

const updateInterval = () => {
  if (isPlaying.value) {
    clearInterval(intervalId);
    startMetronome();
  }
};

// 保存设置到 localStorage
const saveSettings = () => {
  localStorage.setItem('metronomeBPM', bpm.value);
  localStorage.setItem('beatsPerMeasure', beatsPerMeasure.value);
};

// 读取设置
const loadSettings = () => {
  const savedBPM = localStorage.getItem('metronomeBPM');
  const savedBeatsPerMeasure = localStorage.getItem('beatsPerMeasure');

  if (savedBPM) bpm.value = parseInt(savedBPM);
  if (savedBeatsPerMeasure) beatsPerMeasure.value = parseInt(savedBeatsPerMeasure);
};

// 在组件加载时读取设置
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.metronome {
  text-align: center;
  margin-top: 20px;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
  }

.save-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style> 