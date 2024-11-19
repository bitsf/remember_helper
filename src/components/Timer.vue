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
  
        <div class="input-field">
          <label>提示音间隔（秒）：</label>
          <input type="number" v-model="notificationInterval" :disabled="isRunning">
        </div>
      </div>
  
      <button class="save-button" @click="saveSettings">保存设置</button>
  
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
  import { ref, onUnmounted, onMounted } from 'vue';
  
  const countdownTime = ref(3);
  const countupTime = ref(30);
  const currentTime = ref(0);
  const isRunning = ref(false);
  const isCountingUp = ref(false);
  const timerInterval = ref(null);
  const lastMinuteCheck = ref(0);
  const records = ref([]);
  const notificationInterval = ref(60);
  
  // 音频文件
  const countdownSound = new Audio('/sounds/notification.mp3'); // 倒计时音效
  const countupSound = new Audio('/sounds/notification.mp3'); // 正计时音效
  const notificationSound = new Audio('/sounds/metronome-accent.ogg'); // 提示音效
  const snapshotSound = new Audio('/sounds/metronome-click.ogg'); // 提示音效
  
  // 读取设置
  const loadSettings = () => {
    const savedCountdownTime = localStorage.getItem('countdownTime');
    const savedCountupTime = localStorage.getItem('countupTime');
    const savedNotificationInterval = localStorage.getItem('notificationInterval');
  
    if (savedCountdownTime) countdownTime.value = parseInt(savedCountdownTime);
    if (savedCountupTime) countupTime.value = parseInt(savedCountupTime);
    if (savedNotificationInterval) notificationInterval.value = parseInt(savedNotificationInterval);
  };
  
  // 保存设置
  const saveSettings = () => {
    localStorage.setItem('countdownTime', countdownTime.value);
    localStorage.setItem('countupTime', countupTime.value);
    localStorage.setItem('notificationInterval', notificationInterval.value);
  };
  
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
        countdownSound.play(); // 播放倒计时音效
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
      
      if (currentTime.value % notificationInterval.value === 0 && currentTime.value > 0) {
        notificationSound.play(); // 播放提示音效
      }
      
      if (currentTime.value >= countupTime.value) {
        stopTimer();
        countupSound.play(); // 播放正计时音效
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
        snapshotSound.play(); // 播放快照音效
      } else {  // 点击右侧
        stopTimer();
        countupSound.play(); // 播放正计时音效
      }
    }
  };
  
  // 在组件加载时读取设置
  onMounted(() => {
    loadSettings();
  });
  
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
  
  .save-button {
    position: absolute;
    top: 20px;
    right: 20px;
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
    top: 20px;
    left: 20px;
    text-align: left;
  }
  
  .record-list ul {
    list-style-type: none;
    padding: 0;
  }
  </style> 