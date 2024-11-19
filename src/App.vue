<template>
  <div class="container">
    <h1>计时器应用</h1>
    
    <div class="input-group">
      <div class="input-field">
        <label>倒计时时间（秒）：</label>
        <input type="number" v-model="countdownTime" :disabled="isRunning">
      </div>
      
      <div class="input-field">
        <label>正计时时间（秒）：</label>
        <input type="number" v-model="countupTime" :disabled="isRunning">
      </div>
    </div>

    <div class="timer-display">
      {{ currentTime }}秒
    </div>

    <button @click="startTimer" :disabled="isRunning">开始计时</button>

    <div class="click-area-left" @click="handleScreenClick" v-if="isCountingUp"></div>
    <div class="click-area-right" @click="handleScreenClick" v-if="isCountingUp"></div>

    <div class="record-list">
      <h3>记录列表</h3>
      <ul>
        <li v-for="(record, index) in records" :key="index">{{ record }}秒</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const countdownTime = ref(3);
const countupTime = ref(30);
const currentTime = ref(0);
const isRunning = ref(false);
const isCountingUp = ref(false);
const timerInterval = ref(null);
const lastMinuteCheck = ref(0);
const records = ref([]);

// 音频文件
const sound1 = new Audio('/sounds/notification.mp3');
const sound2 = new Audio('/sounds/notification.mp3');
const sound3 = new Audio('/sounds/notification.mp3');

const startTimer = () => {
  isRunning.value = true;
  currentTime.value = countdownTime.value;
  isCountingUp.value = false;
  startCountdown();
};

const startCountdown = () => {
  timerInterval.value = setInterval(() => {
    currentTime.value--;
    
    if (currentTime.value <= 0) {
      clearInterval(timerInterval.value);
      sound1.play();
      setTimeout(() => {
        startCountup();
      }, 1000);
    }
  }, 1000);
};

const startCountup = () => {
  currentTime.value = 0;
  isCountingUp.value = true;
  lastMinuteCheck.value = 0;
  
  timerInterval.value = setInterval(() => {
    currentTime.value++;
    
    // 每60秒播放提示音
    if (Math.floor(currentTime.value / 60) > lastMinuteCheck.value) {
      lastMinuteCheck.value = Math.floor(currentTime.value / 60);
      sound3.play();
    }
    
    if (currentTime.value >= countupTime.value) {
      stopTimer();
      sound2.play();
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  isCountingUp.value = false;
};

const handleScreenClick = (event) => {
  if (isCountingUp.value) {
    if (event.clientX < window.innerWidth / 2) {  // 点击左侧
      records.value.unshift(currentTime.value);  // 记录当前秒数
    } else {  // 点击右侧
      stopTimer();
      sound2.play();
    }
  }
};

onUnmounted(() => {
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.input-group {
  margin: 20px 0;
}

.input-field {
  margin: 10px 0;
}

.timer-display {
  font-size: 48px;
  margin: 20px 0;
  font-weight: bold;
  position: relative;
  z-index: 10;
}

button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}

.click-area-right {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: red;
}

.click-area-left {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: green;
}

.record-list {
  position: fixed;
  top: 10px;
  left: 10px;
  text-align: left;  /* 左对齐 */
}

.record-list ul {
  list-style-type: none;  /* 去掉默认的列表样式 */
  padding: 0;  /* 去掉内边距 */
}
</style> 