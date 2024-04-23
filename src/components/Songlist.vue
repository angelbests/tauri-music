<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { songurl, scrobble, like,songdetail } from "../api";
import { userStore, playingStore, playlistStore } from "../stores";
const playing = playingStore();
const playlist = playlistStore();
const user = userStore();
const props = defineProps<{
  songs: {
    id: number;
    name: string;
    al: {
      id: number;
      name: string;
      picUrl: string;
    };
    ar: {
      id: number;
      name: string;
    }[];
    fee: number;
    dt: number;
    playtime?: any;
    like?: boolean;
    downloadstatus?:string
  }[];
}>();

const emit = defineEmits<{
  scrollbottom: [bool: boolean];
  playsong: [bool: boolean];
  heart: [bool: boolean];
}>();

const loading = ref(true);
onMounted(() => {
  let timer = setInterval(function () {
    if (props.songs.length > 0) {
      loading.value = false;
      clearInterval(timer);
    }
  }, 500);
  let songsdiv = document.getElementById("songsdiv");
  if (!songsdiv) return;
  let scrollTop = songsdiv.scrollTop | 0;
  let offsetHeight = songsdiv.offsetHeight | 0;
  let scrollHeight = songsdiv.scrollHeight | 0;
  songsdiv?.addEventListener("scroll", function () {
    if (Math.ceil(scrollTop + offsetHeight) >= scrollHeight) {
      emit("scrollbottom", true);
    } else {
      emit("scrollbottom", false);
    }
  });
});

const playtimeshow = computed(() => {
  return props.songs.length > 0 && props.songs[0].playtime !== undefined;
});

const downloadshow = computed(()=>{
  return props.songs.length>0 && props.songs[0].downloadstatus !== undefined;
})

// 点击歌名播放音乐
const playmusic = async function (item: any, index: number) {
  emit("playsong", false);
  let res = await songurl(item.id, user.cookie);
  if (res.data.data[0].code != 404) {
    playing.song = item;
    playing.songs = res.data.data;
    playing.play(res.data.data[0].url);
    playlist.index = index;
    res = await scrobble(item.id, item.al.id, user.cookie);
    console.log("播放歌曲", res.data);
  } else {
    alert("无资源");
  }
};

const likehandle = async function (id: number, bool: boolean) {
  emit("heart", true);
  let res = await like(id, bool, user.cookie);
  console.log(res);
  if (res.data.code == 200) {
    if (bool) {
      user.ids.push(id);
      let res = await songdetail(id.toString(),user.cookie)
      user.mylikes.unshift(res.data.songs[0]);
      console.log(res.data.songs[0]);
    } else {
      user.ids.splice(user.ids.indexOf(id), 1);
      user.mylikes.filter((item, index) => {
        console.log(item);
        if (item.id == id) {
          user.mylikes.splice(index, 1);
        }
        return false;
      });
    }
  }
};
</script>

<template>
  <div id="songsdiv" class="songsdiv">
    <div style="color: gray; display: flex; font-size: 12px">
      <div style="width: 5%; text-align: center; height: 100%">#</div>
      <div style="width: 39%">标题</div>
      <div style="width: 35%">专辑</div>
      <div style="width: 7%; text-align: left" v-if="!downloadshow">喜欢</div>
      <div style="width: 7%">时长</div>
      <div style="width: 7%" v-if="playtimeshow">播放时间</div>
      <div style="width: 7%" v-if="downloadshow">下载状态</div>
    </div>
    <div
      style="border-bottom: 1px solid gray; width: 100%; margin-top: 5px"
    ></div>
    <el-skeleton :loading="loading" animated style="margin-top: 5px">
      <template #template>
        <el-skeleton-item
          v-for="item in 20"
          :key="item"
          style="width: 100%; height: 60px; margin: 5px 0px; border: 10px"
        ></el-skeleton-item>
      </template>
      <div
        class="songs"
        id="songs"
        v-for="(item, index) in songs"
        :key="item.id"
        @dblclick="playmusic(item, index)"
      >
        <!-- 序号 -->
        <div class="songindex">
          {{ index + 1 }}
        </div>
        <!-- 图片 -->
        <div style="display: flex; width: 39%; align-items: center">
          <div class="songpicdiv">
            <img
              :src="item.al.picUrl+'?param=60y60'"
              style="width: 60px; border-radius: 5px"
            />
          </div>
          <!-- 歌名 -->
          <div class="songnamediv">
            <div class="songname" @click="playmusic(item, index)">
              {{ item.name }}
            </div>
            <!-- 歌手 -->
            <div class="songarname">
              <span v-for="(ar, arindex) in item.ar" :key="ar.id">
                {{ arindex > 0 ? "," : "" }}
                <span>
                  {{ ar.name }}
                </span>
              </span>
            </div>
          </div>
        </div>
        <!-- 专辑 or  歌单 -->
        <div class="songalname">
          <div class="songalnamewidth">
            <router-link
              :to="{
                path: `/detaillist/${item.al.id}/ALBUM`,
              }"
              style="text-decoration: none; color: gray"
            >
              {{ item.al.name }}
            </router-link>
          </div>
        </div>
        <!-- 喜欢 -->
        <div
          v-if="!downloadshow"
          class="songtime"
          style="text-align: left; padding-left: 2px; box-sizing: border-box"
        >
          <i
            v-show="!(user.ids.indexOf(item.id) >= 0)"
            style="font-size: 18px; cursor: pointer"
            class="bi bi-heart"
            @click="likehandle(item.id, true)"
          ></i>
          <i
            v-show="user.ids.indexOf(item.id) >= 0"
            style="font-size: 18px; color: red"
            class="bi bi-heart-fill"
            @click="likehandle(item.id, false)"
          ></i>
        </div>
        <!-- 时长 -->
        <div class="songtime">
          {{
            new Date(item.dt).toLocaleTimeString().toString().substring(3, 20)
          }}
        </div>
        <!-- 最近播放时间 -->
        <div v-if="playtimeshow" class="songplaytime">
          {{ new Date(item.playtime).toLocaleTimeString() }}
        </div>
        <!-- downloadshow -->
        <div v-if="downloadshow" class="songplaytime">
          {{ item.downloadstatus }}
        </div>
      </div>
    </el-skeleton>
  </div>
</template>

<style>
.songsdiv {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 5px 10px 5px 10px;
  box-sizing: border-box;
}
.songs {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60px;
  background: rgba(227, 239, 252);
  border-radius: 10px;
  margin-top: 10px;
}
.songs:hover {
  box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.2);
  background: white;
  transition: all 0.2s linear;
}
.songindex {
  width: 5%;
  text-align: center;
  color: gray;
  font-size: 13px;
}
.songpicdiv {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background: rgba(123, 123, 123, 0.2);
  border: none;
  display: flex;
  align-items: center;
}
.songnamediv {
  width: calc(100% - 70px);
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.songname {
  width: calc(100% - 20px);
  text-overflow: ellipsis;
  text-wrap: nowrap;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}
.songarname {
  width: calc(100% - 20px);
  font-size: 12px;
  cursor: pointer;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
}
.songalname {
  display: flex;
  width: 35%;
}
.songalnamewidth {
  width: calc(100% - 20px);
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  cursor: pointer;
  color: gray;
}
.songtime {
  width: 7%;
  text-align: left;
  color: gray;
  font-size: 12px;
}
.songplaytime {
  width: 7%;
  text-align: left;
  color: gray;
  font-size: 12px;
}
</style>
