<template>
    <div class="container">
        <h1>计时器</h1>

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
        <div class="click-area-top-right" @click="handleScreenClick" v-if="isCountingUp"></div>
        <div class="click-area-bottom-right" @touchstart="startRecording" @touchend="stopRecording" @mousedown="startRecording" @mouseup="stopRecording" v-if="isCountingUp"></div>
        <div class="recording-list">
            <h3>录音列表</h3>
            <ul>
                <li v-for="(record, index) in recordings" :key="index" @click="!isRunning ? playRecording(record.url) : null">{{ record.time }} 秒 {{ (record.duration / 1000).toFixed(1) }} 秒</li>
            </ul>
        </div>

        <div class="record-list">
            <h3>记录列表</h3>
            <ul>
                <li v-for="(record, index) in records" :key="index">{{ record }}秒</li>
            </ul>
        </div>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; pointer-events: none; font-size: 48px;" v-if="isRecording">
            🎤
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue';

const countdownTime = ref(10);
const countupTime = ref(300);
const notificationInterval = ref(60);
const currentTime = ref(0);
const isRunning = ref(false);
const isCountingUp = ref(false);
const timerInterval = ref(null);
const lastMinuteCheck = ref(0);
const records = ref([]);
const recordings = ref([]);
const isRecording = ref(false);

// 音频文件
const countdownSound = new Audio('/sounds/notification.ogg'); // 倒计时音效
const countupSound = new Audio('/sounds/notification.ogg'); // 正计时音效
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
    records.value = [];
    recordings.value = [];
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
        } else {  // 点击右上
            if (event.clientY < window.innerHeight / 2) {
                stopTimer();
                countupSound.play(); // 播放正计时音效
            }
        }
    }
};

let mediaRecorder;
let stream;
const startRecording = async (event) => {
    try {
        if (!navigator) {
            alert("no navigator");
            return;
        }
        if (!navigator.mediaDevices){
            alert("no mediaDevices");
            return;
        }
        if (!navigator.mediaDevices.getUserMedia){
            alert("no getUserMedia");
            return;
        }

        if (isRecording.value) return; // 如果已经在录音，直接返回
        isRecording.value = true; // 设置为正在录音

        console.log("startRecording");
        // 请求麦克风权限
        if (!stream || !stream.active){
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        if (!isRecording.value){
            console.log("recording too short");
            stream.getTracks().forEach(track => track.stop());
            return;
        } 
        
        mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        let startTime;
        mediaRecorder.onstart = () => {
            startTime = Date.now(); // 记录开始时间
            console.log("开始录音");
        };

        mediaRecorder.onstop = () => {
            if (audioChunks && audioChunks[0].size >0){
                const endTime = Date.now(); // 记录结束时间
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                recordings.value.unshift({"time": currentTime.value, "url": audioUrl, "duration": endTime - startTime});
            }else{
                console.log("recorded too short");
            }
            isRecording.value=false;
        };

        mediaRecorder.start();
        console.log("recording");
    } catch (error) {
        console.log("录音失败:", error);
        alert(error.message);
    }
};

const stopRecording = () => {
    isRecording.value=false;
    console.log("stopRecording");
    if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === "recording") {
        // mediaRecorder.stop(); // 停止录音
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        console.log("recording stopped");
    } else {
        console.log("mediaRecorder is not defined or not recording");
    }
};

const audio = new Audio();
function playRecording(audioUrl){
    console.log(`playing ${audioUrl}`);
    audio.src = audioUrl;
    audio.play(); // 播放录音
}

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
    pointer-events: none;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
}

.save-button {
    position: absolute;
    top: 20px;
    right: 60px;
}

.click-area-top-right {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 50%;
    cursor: pointer;
    background-color: red;
}

.click-area-bottom-right {
    position: fixed;
    top: 50%;
    right: 0;
    width: 50%;
    height: 50%;
    cursor: pointer;
    background-color: blue;
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


.recording-list {
    position: fixed;
    top: 20px;
    left: 150px;
    text-align: left;
}

.recording-list ul {
    list-style-type: none;
    padding: 0;
}
</style>