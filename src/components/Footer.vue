<script lang="ts" setup>
import { onMounted } from "vue";
import { playingStore, playlistStore } from "./../stores/index";
import { storeToRefs } from "pinia";
import { songurl, scrobble } from "../api";
import { userStore } from "./../stores/index";
import sPlay from "./Play.vue";
const playing = playingStore();
onMounted(async () => {
  document.getElementById("footer")?.addEventListener("selectstart",function(e){
    e.preventDefault();
  })
}); 

const rangeinput = function (e: any) {
  playing.audio.currentTime = e;
};
const { currenttime,volume } = storeToRefs(playing);
const playlist = playlistStore();
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

const user = userStore();
const playsong = async function (item: any, index: number) {
  playlist.index = index;
  let res = await songurl(item.id.toString(), user.cookie);
  if (res.data.data[0].code != 404) {
    playing.song = item;
    playing.songs = res.data.data;
    playing.play(res.data.data[0].url);
    await scrobble(item.id, item.al.id, user.cookie);
  
  } else {
    alert("无资源");
  }
};

const divlistfn = function () {
  playing.divlist= !playing.divlist;
  if (playing.divlist) {
    document.getElementById("divlistsongdiv")?.scrollTo({
      top: playlist.playarr[playlist.index] * 60,
      behavior: "smooth",
    });
  }
};


</script>

<template>
  <div id="footer" class="divcontainer">
    <div class="playleft" @click="playing.playshow = true">
      <!-- 控制动画 启停 -->
      <img
        :style="{
          animationPlayState: playing.playstatus ? 'running' : 'paused',
        }"
        :src="playing.song.al.picUrl?playing.song.al.picUrl:'/img/dog.png'"
        class="playleftimg"
      />
      <div class="playlefttext">
        <div
          style="
            width: 100%;
            cursor: pointer;
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ playing.song.name }}
        </div>
      </div>
    </div>
    <div class="playmiddle">
      <div class="playmiddlebutton">
        <div class="playmiddlebuttonmode">
          <i
            @click="playing.playmodechange()"
            v-show="playing.playmode == 0"
            class="bi bi-list playmiddlebuttonmodeicon"
          ></i>
          <i
            @click="playing.playmodechange()"
            v-show="playing.playmode == 1"
            class="bi bi-repeat-1 playmiddlebuttonmodeicon"
          ></i>
          <i
            @click="playing.playmodechange()"
            v-show="playing.playmode == 2"
            class="bi bi-repeat playmiddlebuttonmodeicon"
          ></i>
          <i
            @click="playing.playmodechange()"
            v-show="playing.playmode == 3"
            class="bi bi-shuffle playmiddlebuttonmodeicon"
          ></i>
        </div>
        <div class="playmiddlebuttondiv">
          <i
            @click="playing.playpre()"
            style=""
            class="bi bi-skip-start-fill playmiddlebuttonpreicon"
          ></i>
        </div>
        <div class="playmiddlebuttondiv">
          <i
            v-show="playing.playstatus"
            @click="playing.pause()"
            class="bi bi-pause playmiddlebuttonplayicon"
          ></i>
          <i
            v-show="!playing.playstatus"
            @click="playing.play()"
            class="bi bi-play-fill playmiddlebuttonplayicon"
          ></i>
        </div>
        <div class="playmiddlebuttondiv">
          <i
            @click="playnext"
            class="bi bi-skip-end-fill playmiddlebuttonpreicon"
          ></i>
        </div>
        <div style="width: calc((100% - 180px) / 2)"></div>
      </div>
      <div class="playrange">
        <div class="playrangeleft">
          {{ playing.currenttimestr }}
        </div>
        <div class="playrangemiddle">
          <div style="width: 90%">
            <el-slider
              v-model="currenttime"
              :min="0"
              :max="playing.duration"
              :step="0.001"
              class="songslider"
              :show-tooltip="false"
              @change="rangeinput"
            >
            </el-slider>
          </div>
        </div>
        <div class="playrangeright">
          {{ playing.durationstr }}
        </div>
      </div>
    </div>
    <div class="playright">
      <div class="playrighttunediv">
        <!-- 懒得写了= = ！ -->
        <!-- <span class="playrighttune"> 无损 </span> -->
      </div>
      <div class="playrightlistdiv">
        <i class="bi bi-list playrightlist" @click="divlistfn"></i>
      </div>
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

    <div :style="{ right: playing.divlist ? '0px' : '-400px',  boxShadow:playing.divlist?' 5px 5px 10px 10px rgba(123, 123, 123, 0.2)':'' }" class="divlist">
      <div class="divlisttitle">
        播放{{ playlist.playlist.type=="ALBUM"?"专辑":"歌单" }}：
        <span>
            <router-link @click.native="playing.divlist = false" style="text-decoration: none;color: black;" :to="{path:`/detaillist/${playlist.playlist.id}/${playlist.playlist.type}`}">{{ playlist.playlist.name }}</router-link>
        </span>
      </div>
      <div id="divlistsongdiv" class="divlistsongdiv">
        <div
          @click="playsong(item, index)"
          v-for="(item, index) in playlist.playlist.tracks"
          class="divlistsong"
        >
          <div class="divlistsongimgdiv" id="divsonglist">
            <img :src="item.al.picUrl" class="divlistsongimg" />
          </div>
          <div class="divlistsongtextdiv">
            <span class="divlistsongtitle">
              {{ item.name }}
            </span>
            <span class="divlistsongartist">
              {{ item.ar[0].name }}
            </span>
          </div>
          <div
            style="
              position: absolute;
              width: 40px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              padding: 5px;
            "
          >
            <!-- <i 
              style="font-size: 40px; color: white"
              class="bi bi-play-fill"
              v-show="playlist.playlist.tracks[playlist.index].id != item.id"
            ></i> -->
            <i
              style="font-size: 40px; color: white"
              class="bi bi-pause-fill"
              v-if="playlist.playlist.tracks[playlist.playarr[playlist.index]].id == item.id"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <sPlay></sPlay>
  </div>



</template>

<style>
.divcontainer {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  background-color: white;
}
.playleft {
  width: 25%;
  height: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  background-color: white;
}
.playleftimg {
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 10px solid rgba(12, 21, 12, 1);
  margin: 10px 20px;
  animation: 10s normal 0s infinite linear imganime;
}

@keyframes imganime {
  100% {
    transform: rotate(360deg);
  }
}

.playlefttext {
  width: calc(100% - 100px);
  height: 100%;
  font-size: 14px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.playmiddle {
  height: 80px;
  width: 50%;
  display: flex;
  flex-direction: column;
}

.playmiddlebutton {
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.playmiddlebuttonmode {
  width: calc((100% - 180px) / 2);
  text-align: right;
}
.playmiddlebuttonmodeicon {
  font-size: 20px;
  cursor: pointer;
}
.playmiddlebuttondiv {
  width: 60px;
  text-align: center;
}
.playmiddlebuttonpreicon {
  font-size: 40px;
  cursor: pointer;
}
.playmiddlebuttonplayicon {
  font-size: 50px;
  cursor: pointer;
}

.playrange {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20px;
  font-size: 12px;
  color: black;
}
.playrangeleft {
  width: 15%;
  text-align: center;
  display: flex;
  justify-content: end;
}
.playrangemiddle {
  width: 70%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.songslider {
  width: 100%;
}
.songslider .el-slider__bar {
  background: black;
}
.songslider .el-slider__button {
  border: none;
  background-color: black;
  width: 15px;
  height: 15px;
}

.songslider .el-slider__bar:hover{
  cursor: pointer;
}

.songslider .el-slider__button:hover{
  cursor: pointer;
}

.songslider .el-slider__button-wrapper:hover{
  cursor: pointer;
}

.playrangeright {
  width: 15%;
  text-align: center;
  display: flex;
}
.progress {
  width: 95%;
  height: 4px;
  border-radius: 12px;
  position: relative;
}

.playright {
  width: 25%;
  height: 80px;
  background-color: white;
  display: flex;
  align-items: center;
  padding-right: 20px;
  justify-content: right;
}

.playrighttunediv {
  width: 40px;
  height: 70px;
  display: flex;
  align-items: center;
}

.playrighttune {
  font-size: 10px;
  border: 1px solid gray;
  color: gray;
  padding: 2px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.playrightlistdiv {
  width: 40px;
  height: 70px;
  text-align: center;
  display: flex;
  align-items: center;
}

.playrightlist {
  font-size: 25px;
  cursor: pointer;
}

.playrightmuteddiv {
  width: 140px;
  display: flex;
  align-items: center;
}

.playrightmuted {
  height: 70px;
  font-size: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.muteddiv {
  width: 40px;
}

.sound {
  width: 100px;
}

.sound .el-slider__runway {
  height: 4px;
}

.sound .el-slider__bar {
  background: black;
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

.sound .el-slider__button-wrapper{
  cursor: pointer;
}

.sound .el-slider__bar:hover{
  cursor: pointer;
}

.sound .el-slider__button:hover{
  cursor: pointer;
}

.sound .el-slider__button-wrapper:hover{
  cursor: pointer;
}

.divlist {
  width: 400px;
  height: calc(100vh - 200px);
  position: absolute;
  z-index: 300;
  background: white;
  top: 90px;
  transition: all 0.3s linear;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.divlisttitle {
  font-weight: bold;
  margin: 10px 0px 10px 20px;
  width: calc(100% - 40px);
  height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  display: inline-block;
}

.divlistsongdiv {
  overflow: hidden;
  overflow-y: scroll;
  width: 100%;
  height: calc(100% - 50px);
  border-radius: 10px;
  margin: 5px;
  position: relative;
}
.divlistsong {
  display: flex;
  box-sizing: border-box;
  background: rgba(250, 230, 245, 1);
  margin: 10px;
  border-radius: 5px;
  width: 90%;
}
.divlistsong:hover {
  box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.2);
  background: white;
  transition: all 0.2s linear;
}
.divlistsongimgdiv {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 5px;
}
.divlistsongimg {
  width: 40px;
  border-radius: 5px;
  cursor: pointer;
}

.divlistsongtextdiv {
  width: calc(100% - 50px);
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.divlistsongtitle {
  font-size: 14px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  height: 30px;
}
.divlistsongartist {
  display: inline-block;
  font-size: 12px;
  color: gray;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  height: 20px;
}
</style>
