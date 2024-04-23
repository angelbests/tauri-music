<script lang="ts" setup>
import { playingStore, playlistStore } from "./../stores/index";
import { appWindow } from "@tauri-apps/api/window";
import { } from "@tauri-apps/api/fs"
import { open } from "@tauri-apps/api/dialog"
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const playing = playingStore();
const playlist = playlistStore();
const { currenttime, volume,fontcolor,blur,transparent } = storeToRefs(playing);
const playnext = function () {
  if (playing.playmode != 1) {
  } else {
    if (playlist.index == playlist.playarr.length - 1) {
      playlist.index = 0;
    } else {
      playlist.index = playlist.index + 1;
    }
  }
  playing.playnext();
};

const rangeinput = function (e: number) {
  playing.audio.currentTime = e;
};

const divlistfn = function () {
  playing.divlist = !playing.divlist;
  if (playing.divlist) {
    document.getElementById("divlistsongdiv")?.scrollTo({
      top: playlist.playarr[playlist.index] * 60,
      behavior: "smooth",
    });
  }
};

const settingbool = ref(false);
const openimgage = async function(){
  let selected = await open({
    multiple: false,
    filters: [{
      name: 'Image',
      extensions: ['png', 'jpeg','jpg','bmp']
    }]
  })

  if (selected !== null) {
      playing.background = selected as string
  }
}
</script>

<template>
  <div
    :style="{
      bottom: playing.playshow ? '0' : '-100vh',
      color: fontcolor,
      background: `url(${
        playing.background ? convertFileSrc(playing.background) : '/img/img.jpg'
      })`,
      backgroundSize: 'cover',
    }"
    class="playbg"
  >
    <div
      class="playpage"
      :style="{ backdropFilter: `blur(${blur}px)`, opacity: transparent }"
    >
      <!-- 头部 -->
      <div
        style="
          width: 100%;
          height: 80px;
          background-color: transparent;
          display: flex;
          align-items: center;
        "
        data-tauri-drag-region
      >
        <div
          style="
            display: flex;
            justify-content: left;
            align-items: center;
            width: 50%;
            box-sizing: border-box;
            padding-left: 25px;
          "
        >
          <div style="padding: 10px">
            <i @click="playing.playshow = false" class="bi bi-chevron-down"></i>
          </div>
          <div style="padding: 10px">
            <i @click="settingbool = !settingbool" class="bi bi-gear"></i>
          </div>
        </div>
        <div
          style="
            display: flex;
            justify-content: right;
            align-items: center;
            width: 50%;
            height: 80px;
            box-sizing: border-box;
            padding-right: 25px;
          "
          data-tauri-drag-region
        >
          <div style="padding: 10px">
            <i
              @click="appWindow.minimize()"
              style="font-size: 18px"
              class="bi bi-dash-lg"
            ></i>
          </div>
          <div style="padding: 10px">
            <i
              @click="appWindow.toggleMaximize()"
              style="font-size: 15px"
              class="bi bi-square"
            ></i>
          </div>
          <div style="padding: 10px">
            <i
              @click="appWindow.close()"
              style="font-size: 18px"
              class="bi bi-x-lg"
            ></i>
          </div>
        </div>
      </div>
      <!-- 中部 -->
      <div
        style="
          width: 100%;
          height: calc(100% - 160px);
          padding: 3% 0%;
          display: flex;
          flex-direction: row;
        "
      >
        <div
          style="
            width: 40%;
            text-align: center;
            padding: 5% 0% 0 10%;
            box-sizing: border-box;
          "
        >
          <img
            class="playimg"
            :style="{
              animationPlayState: playing.playstatus ? 'running' : 'paused',
            }"
            :src="playing.song.al.picUrl"
          />
        </div>
        <div style="width: 60%; text-align: center">
          <div style="font-size: 25px">
            {{ playing.song.name }}
          </div>
          <div style="margin: 10px">
            {{ playing.song.al.name }}
          </div>
          <div style="margin: 10px">
            {{ playing.song.ar[0].name }}
          </div>
        </div>
      </div>
      <!-- 底部播放 -->
      <div
        style="
          position: absolute;
          width: 100%;
          height: 80px;
          bottom: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          box-shadow: 0px 0px 400px 5px black;
          position: absolute;
        "
      >
        <!-- 进度条 -->
        <div style="position: absolute; top: -15px; width: 100%">
          <el-slider
            class="playslider"
            v-model="currenttime"
            :min="0"
            :max="playing.duration"
            :step="0.001"
            :show-tooltip="false"
            @change="rangeinput"
          >
          </el-slider>
        </div>
        <!-- 控制区 -->
        <div
          style="
            height: 80px;
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
          "
        >
          <div style="font-size: 15px; width: 30%; text-align: center">
            {{ playing.currenttimestr }}/{{ playing.durationstr }}
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              width: 10%;
              align-items: center;
              justify-content: right;
            "
          >
            <div style="font-size: 20px">
              <i
                @click="playing.playmodechange()"
                v-show="playing.playmode == 0"
                class="bi bi-list"
              ></i>
              <i
                @click="playing.playmodechange()"
                v-show="playing.playmode == 1"
                class="bi bi-repeat-1"
              ></i>
              <i
                @click="playing.playmodechange()"
                v-show="playing.playmode == 2"
                class="bi bi-repeat"
              ></i>
              <i
                @click="playing.playmodechange()"
                v-show="playing.playmode == 3"
                class="bi bi-shuffle"
              ></i>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              width: 20%;
              align-items: center;
              justify-content: space-evenly;
            "
          >
            <div style="font-size: 50px">
              <i @click="playing.playpre()" class="bi bi-skip-start-fill"></i>
            </div>
            <div style="font-size: 60px">
              <i
                v-show="playing.playstatus"
                @click="playing.pause()"
                class="bi bi-pause"
              ></i>
              <i
                v-show="!playing.playstatus"
                @click="playing.play()"
                class="bi bi-play-fill"
              ></i>
            </div>
            <div style="font-size: 50px">
              <i @click="playnext" class="bi bi-skip-end-fill"></i>
            </div>
          </div>
          <div
            style="
              width: 10%;
              display: flex;
              justify-content: left;
              align-items: center;
            "
          >
            <i class="bi bi-list playrightlist" @click="divlistfn"></i>
          </div>
          <div
            style="
              width: 30%;
              height: 80px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="playrightmuteddiv">
              <div class="muteddiv">
                <i
                  @click="playing.muted()"
                  v-show="!playing.mutedbool"
                  class="playrightmuted bi bi-volume-down-fill"
                ></i>
                <i
                  @click="playing.muted()"
                  v-show="playing.mutedbool"
                  class="playrightmuted bi bi-volume-mute-fill"
                ></i>
              </div>
              <el-slider
                style="width: 60%"
                :show-tooltip="false"
                class="sound"
                :min="0"
                :max="1"
                :step="0.001"
                v-model="volume"
                @input="playing.changevolume"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- setting -->
    <div v-if="settingbool" class="setting">
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        "
      >
        <el-button
          @click="openimgage"
          size="small"
          text
          bg
          class="settingbutton"
          >更换背景</el-button
        >
        <el-input
          style="width: 150px; border: none"
          type="text"
          :value="playing.background"
        ></el-input>
      </div>

      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        "
      >
        <el-button size="small" text bg class="settingbutton"
          >字体颜色</el-button
        >
        <input v-model="fontcolor" type="color" id="fontcolor" />
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        "
      >
        <el-button size="small" text bg class="settingbutton"
          >背景虚化</el-button
        >
        <el-slider
          style="width: 150px"
          :min="0"
          :max="30"
          :step="1"
          v-model="blur"
        ></el-slider>
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        "
      >
        <el-button size="small" text bg class="settingbutton">透明度</el-button>
        <el-slider
          style="width: 150px"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="transparent"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<style>
.playbg {
  width: 100vw;
  height: 100vh;
  left: 0;
  position: absolute;
  bottom: 0;
  transition: bottom 0.3s linear;
  /* background: url("/img/img.jpg"); */

  opacity: 1;
  z-index: 199;
  display: flex;
  justify-content: center;
  align-items: center;
}
.playpage {
  width: 100vw;
  height: 100vh;
  /* background: linear-gradient(rgba(170,120,170,1),rgba(100,100,70,1)); */
  /* background: rgba(121, 123, 107, 0.3); */
  position: absolute;
  z-index: 200;
  backdrop-filter: blur(10px);
}

@keyframes imganimate {
  100% {
    transform: rotate(360deg);
  }
}

.playimg {
  animation: 10s normal 0s infinite linear imganimate;
  border-radius: 50%;
  width: 70%;
  border: 5vh solid rgba(10, 10, 10, 1);
}

.playslider .el-slider__runway {
  background: linear-gradient(rgba(170, 120, 170, 1), rgba(100, 100, 70, 0.1));
  box-shadow: 5px 5px 5px rgba(10, 10, 10, 0.1);
}
.playslider .el-slider__bar {
  background: gray;
  opacity: 1;
  border: none;
}

.playslider .el-slider__button {
  border: none;
  background: gray;
}

.sound {
  width: 100px;
}

.sound .el-slider__runway {
  height: 4px;
  background: rgba(228, 231, 237, 0.2);
}

.sound .el-slider__bar {
  height: 4px;
}

.sound .el-slider__button {
  opacity: 1;
  cursor: pointer;
  width: 10px;
  height: 10px;
  background: black;
  border: none;
}

.sound .el-slider__button-wrapper {
  cursor: pointer;
}

.sound .el-slider__bar:hover {
  cursor: pointer;
}

.sound .el-slider__button:hover {
  cursor: pointer;
}

.sound .el-slider__button-wrapper:hover {
  cursor: pointer;
}

.setting {
  position: absolute;
  width: 300px;
  height: 300px;
  z-index: 250;
  background: rgba(10, 10, 10, 0.1);
  left: 70px;
  top: 60px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  transition: all 0.3s linear;
  box-shadow: 0px 0px 30px 1px black;
  backdrop-filter: blur(20px);
}
.settingbutton {
  width: 80px;
  height: 40px !important;
  border: none;
  color: white !important;
  margin-left: 0 !important;
  background: rgba(10, 10, 10, 0.1) !important;
  font-size: 14px !important;
}

#fontcolor {
  width: 150px;
  padding: 0;
  background: transparent;
  border: none;
  margin: 0;
}
</style>
