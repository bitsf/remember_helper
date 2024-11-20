<template>
    <div class="countdown-timer">
        <h2>倒计时器</h2>
        <div class="input-group">
            <div class="input-field">
                <label>倒计时时间（秒）：</label>
                <input type="number" v-model="countdownTime" />
            </div>
            <div class="input-field">
                <label>提醒时间（秒）(0为不提醒)：</label>
                <input type="number" v-model="reminderTime" />
            </div>
        </div>
        <button @click="startCountdown" :disabled="isRunning">开始倒计时</button>
        <div class="timer-display">
            {{ currentTime }}秒
        </div>

        <div class="click-area-right" @click="handleScreenClick" v-if="isRunning"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const countdownTime = ref(60); // 默认倒计时时间
const reminderTime = ref(10); // 默认提醒时间
const currentTime = ref(0);
let intervalId = null;
const isRunning = ref(false); // 新增的状态变量，用于控制计时器状态

// 音频文件
const countdownSound = new Audio('/sounds/notification.ogg'); // 倒计时结束音效
const reminderSound = new Audio('/sounds/metronome-click.ogg'); // 提醒音效

const startCountdown = () => {
    currentTime.value = countdownTime.value;
    clearInterval(intervalId); // 清除之前的计时器
    isRunning.value = true; // 开始计时，设置为运行状态

    intervalId = setInterval(() => {
        currentTime.value--;

        // 播放提醒音效
        if (reminderTime.value > 0 && currentTime.value % reminderTime.value === 0 && currentTime.value > 0) {
            reminderSound.currentTime = 0; // 重置播放位置
            reminderSound.play();
        }

        // 倒计时结束
        if (currentTime.value <= 0) {
            stopCountdown();
        }
    }, 1000);
};

const stopCountdown = () => {
    clearInterval(intervalId); // 停止计时
    isRunning.value = false; // 设置为非运行状态
    countdownSound.currentTime = 0; // 重置播放位置
    countdownSound.play(); // 播放倒计时结束音效
}

// 点击事件处理函数
const handleScreenClick = (event) => {
    if (event.clientX > window.innerWidth / 2) { // 点击右侧
        stopCountdown();
    }
};
</script>

<style scoped>
.countdown-timer {
    text-align: center;
    margin-top: 20px;
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
    pointer-events: none;
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

.debug-box {
    margin-top: 20px;
    font-size: 18px;
    color: #555;
}
</style>