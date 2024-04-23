<script lang="ts" setup>
import { appWindow } from "@tauri-apps/api/window";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { searchdefault, searchhotdetail, searchsuggest } from "../api";
import { userStore } from "../stores";
// import PhoneLogin from "./PhoneLogin.vue";
import QrLogin from "./QrLogin.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = userStore();
const search = ref("");
const timer = ref(0);
const timer2 = ref(0);
const placeholder = ref("请输入搜索内容");
const inputchangebool = ref(false);
const searchhot: {
  searchWord: string;
}[] = reactive([]);

const inputbool = ref(false);
onMounted(async () => {
  console.log(user.mymvs);
  document
    .getElementById("header")
    ?.addEventListener("selectstart", function (e) {
      e.preventDefault();
    });

  document.getElementById("mini")?.addEventListener("click", function () {
    appWindow.minimize();
  });

  document.getElementById("close")?.addEventListener("click", function () {
    appWindow.close();
  });

  // console.log(user.cookie)
  let res = await searchdefault();
  console.log(res.data);
  placeholder.value = res.data.data.showKeyword;
  timer.value = setInterval(async function () {
    let res = await searchdefault();
    console.log(res.data);
    placeholder.value = res.data.data.showKeyword;
  }, 300000);

  res = await searchhotdetail();
  console.log(res.data);
  searchhot.length = 0;
  searchhot.push(...res.data.data);
  timer2.value = setInterval(async function () {
    let res = await searchhotdetail();
    console.log(res.data);
    searchhot.length = 0;
    searchhot.push(...res.data.data);
  }, 300000);
});

const loginchangebool = ref(false);
const loginshowbool = ref(true);
const loginstatus = function (bool: boolean) {
  if (bool) {
    loginshowbool.value = false;
  } else {
  }
};

const blur = function () {
  setTimeout(() => {
    console.log(
      document.activeElement?.id == "suggest" ||
        document.activeElement?.id == "inputsuggest"
    );
    if (
      document.activeElement?.id == "suggest" ||
      document.activeElement?.id == "inputsuggest"
    ) {
      inputbool.value = true;
    } else {
      inputbool.value = false;
    }
  }, 20);
};

////////////////////////search suggest ///////////////////////////////////////

const suggestlist: {
  albums: {
    id: number;
    name: string;
    artists: {
      id: number;
      name: string;
      img1v1Url: string;
    };
  }[];
  artists: {
    id: number;
    name: string;
    img1v1Url: string;
    picUrl: string;
  }[];
  order: string[];
  playlists: {
    id: number;
    userId: number;
    playCount: number;
    trackCount: number;
    name: number;
    coverImgUrl: string;
    description: string;
  }[];
  songs: {
    id: number;
    name: string;
    artists: {
      id: number;
      name: string;
      img1v1Url: string;
    }[];
    album: {
      id: number;
      name: string;
    }[];
  }[];
} = reactive({
  albums: [],
  artists: [],
  order: [],
  playlists: [],
  songs: [],
});

const input = async function (e: any) {
  let res = await searchsuggest(e);
  if (e && res.data.result.order != undefined) {
    inputchangebool.value = true;
    inputbool.value = true;
  } else {
    inputchangebool.value = false;
    inputbool.value = false;
    return;
  }

  console.log(res);
  suggestlist.albums.length = 0;
  suggestlist.artists.length = 0;
  suggestlist.order.length = 0;
  suggestlist.playlists.length = 0;
  suggestlist.songs.length = 0;
  if (res.data.result.songs != undefined) {
    suggestlist.songs.push(...res.data.result.songs);
  }
  if (res.data.result.artists != undefined) {
    suggestlist.artists.push(...res.data.result.artists);
  }
  if (res.data.result.albums != undefined) {
    suggestlist.albums.push(...res.data.result.albums);
  }
  if (res.data.result.playlists != undefined) {
    suggestlist.playlists.push(...res.data.result.playlists);
  }
  if (res.data.result.order != undefined) {
    suggestlist.order.push(...res.data.result.order);
  }

  console.log(res.data.result);
};

/////////////////////////////////////////// 输入搜索  /////////////////////////////
const gosearch = function (searchword: string) {
  inputbool.value = false;
  if (searchword) {
    router.push({ path: `/searchmusic/${searchword}` });
  } else {
    router.push({ path: `/searchmusic/${placeholder.value}` });
  }
};

//////////////////////////// 搜索建议 搜索 /////////////////////////////////
const goinput = function (
  item: any,
  type: "PLAYLIST" | "ALBUM" | "SONG" | "ARTIST"
) {
  inputbool.value = false;
  if (type == "SONG") {
    router.push({ path: `/searchmusic/${item.name}` });
  } else if (type == "ALBUM") {
    router.push({ path: `/detaillist/${item.id}/${"ALBUM"}` });
  } else if (type == "ARTIST") {
  } else if (type == "PLAYLIST") {
    router.push({
      path: `/detaillist/${item.id}/${"PLAYLIST"}`,
    });
  }
  console.log(item, type);
};

onUnmounted(() => {
  clearInterval(timer.value);
  clearInterval(timer2.value);
});
</script>

<template>
  <div id="header" class="header" data-tauri-drag-region>
    <!-- 图标 名称 -->
    <div class="logodiv" data-tauri-drag-region>
      <img src="/img/music.png" class="logo" data-tauri-drag-region />
      <div class="logotext" data-tauri-drag-region>SkydeskMusic</div>
    </div>

    <!-- 搜索 -->
    <div class="search" data-tauri-drag-region>
      <el-button class="goback" @click="router.go(-1)">
        <template #icon>
          <i class="bi bi-chevron-left" style="font-size: 20px"></i>
        </template>
      </el-button>

      <!-- input -->
      <div class="inputdiv" data-tauri-drag-region>
        <el-input
          tabindex="0"
          id="inputsuggest"
          class="input"
          @blur="blur"
          v-model="search"
          @input="input"
          @focus="inputbool = true"
          clearable
          :placeholder="placeholder"
          @keydown.enter="gosearch(search)"
        >
          <template #prefix>
            <el-button
              style="width: 30px; height: 30px"
              link
              @click="gosearch(search)"
            >
              <i class="bi bi-search"></i>
            </el-button>
          </template>
        </el-input>
        <!-- 搜索建议 -->
        <div
          class="searchsuggest"
          tabindex="-1"
          @blur="blur"
          id="suggest"
          v-show="inputbool"
          :style="{ height: inputchangebool ? 'auto' : '400px' }"
        >
          <div v-show="inputchangebool">
            <div class="suggestdiv">
              <div
                class="searchword searchhotlist"
                style="padding-left: 10px; margin: 0; width: 100%"
                v-for="item in suggestlist.songs"
                @click="goinput(item, 'SONG')"
              >
                歌曲：{{ item.name }}
              </div>
              <div
                class="searchword searchhotlist"
                style="padding-left: 10px; margin: 0; width: 100%"
                v-for="item in suggestlist.artists"
                @click="goinput(item, 'ARTIST')"
              >
                歌手：{{ item.name }}
              </div>
              <div
                class="searchword searchhotlist"
                style="padding-left: 10px; margin: 0; width: 100%"
                v-for="item in suggestlist.albums"
                @click="goinput(item, 'ALBUM')"
              >
                专辑：{{ item.name }}
              </div>
              <div
                class="searchword searchhotlist"
                style="padding-left: 10px; margin: 0; width: 100%"
                v-for="item in suggestlist.playlists"
                @click="goinput(item, 'PLAYLIST')"
              >
                歌单：{{ item.name }}
              </div>
            </div>
          </div>

          <div class="suggestdiv" v-show="!inputchangebool">
            <div class="searchhottitle">热搜榜</div>
            <div
              @click="gosearch(item.searchWord)"
              v-for="(item, index) in searchhot"
              class="searchhotlist"
            >
              <div class="searchhotindex">
                {{ index + 1 }}
              </div>
              <div class="searchword">
                {{ item.searchWord }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户 登录 登出 -->
    <div class="user" data-tauri-drag-region>
      <img
        @click="loginshowbool = true"
        :src="user.avatarUrl !== '' ? user.avatarUrl : '/img/user.png'"
        class="userimg"
      />
      <div class="usertext" @click="loginshowbool = true">
        {{ user.nickname == "" ? "请登录" : user.nickname }}
      </div>
    </div>

    <!-- 最小化 最大化 关闭 -->
    <div class="windowright" data-tauri-drag-region>
      <i
        id="mini"
        class="bi bi-dash-lg windowrightmini"
        @click="appWindow.minimize()"
      ></i>
      <i
        id="maxi"
        class="bi bi-square windowrightmaxi"
        @click="appWindow.maximize()"
      ></i>
      <i
        id="close"
        class="bi bi-x-lg windowrightclose"
        @click="appWindow.close()"
      ></i>
    </div>
  </div>

  <div v-if="loginshowbool" class="logindiv">
    <div class="login">
      <div class="loginclose">
        <i @click="loginshowbool = false" class="bi bi-x-lg"></i>
      </div>
      <div class="loginlogo">
        <span style="font-size: 23px"> SkydeskMusic </span>
      </div>
      <!-- <div class="toggle">
        <div @click="loginchangebool = true" class="togglephone">
          手机号登录
        </div>
        <div @click="loginchangebool = false" class="toggleqr">二维码登录</div>
      </div> -->
      <div class="logincomponent">
        <qr-Login v-if="!loginchangebool" @login="loginstatus"></qr-Login>
        <!-- <phone-Login v-if="loginchangebool"></phone-Login> -->
      </div>
    </div>
  </div>
</template>

<style>
.header {
  background-color: rgba(255, 255, 255, 1);
  display: flex;
}

/* logo */

.logodiv {
  width: 200px;
  height: 70px;
  pointer-events: none;
  vertical-align: middle;
  box-sizing: border-box;
  padding-top: 10px;
  border: none;
}
.logo {
  display: inline-block;
  width: 50px;
  padding-left: 10px;
  border-radius: 50%;
  vertical-align: middle;
}
.logotext {
  display: inline-block;
  font-size: 18px;
  width: 130px;
  vertical-align: middle;
}

/* search input */
.search {
  width: calc(100% - 600px);
  height: 70px;
  box-sizing: border-box;
  padding: 0 0 0 20px;
  line-height: 70px;
}
.goback {
  display: inline-block;
  width: 20px;
  height: 35px;
}
.inputdiv {
  display: inline-block;
  width: 270px;
  height: 35px;
  margin-left: 10px;
  position: relative;
}
.input {
  width: 100%;
  height: 35px;
  outline: none;
}
.input .el-input__wrapper {
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid gray;
  box-shadow: none !important;
}
.input .el-input__prefix {
  background-color: transparent;
}

.searchsuggest {
  width: 100%;
  background-color: white;
  position: absolute;
  z-index: 99;
  top: 70px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 10px 10px rgba(123, 123, 123, 0.2);
  transition: all 0.1s linear;
  padding: 10px;
  box-sizing: border-box;
}

.suggestdiv {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}
.searchhottitle {
  color: gray;
  text-align: left;
  margin-left: 10px;
  font-size: 14px;
}
.searchhotlist {
  display: flex;
  margin: 4px;
  width: calc(100% - 20px);
  height: 25px;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
}
.searchhotlist:hover {
  background-color: rgb(248, 233, 233);
}
.searchhotindex {
  width: 30px;
  font-size: 12px;
  padding-left: 10px;
}
.searchword {
  color: gray;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
}

/* user */
.user {
  width: 200px;
  height: 70px;
  vertical-align: middle;
  box-sizing: border-box;
  padding-top: 20px;
}
.userimg {
  display: inline-block;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  vertical-align: middle;
}
.usertext {
  display: inline-block;
  width: 140px;
  font-size: 13px;
  margin-left: 10px;
  color: gray;
  cursor: pointer;
  vertical-align: middle;
}

/* button */

.windowright {
  width: 200px;
  height: 70px;
  box-sizing: border-box;
  vertical-align: middle;
  padding-top: 25px;
  box-sizing: border-box;
  text-align: right;
}

.windowrightmini {
  padding-right: 20px;
  font-size: 20px;
  cursor: pointer;
  color: black;
  vertical-align: middle;
}

.windowrightmaxi {
  padding-right: 20px;
  vertical-align: middle;
  font-size: 20px;
  cursor: pointer;
  color: black;
}
.windowrightclose {
  padding-right: 20px;
  vertical-align: middle;
  font-size: 20px;
  cursor: pointer;
  color: black;
}

.logindiv {
  width: 100vw;
  height: calc(100vh - 70px);
  position: absolute;
  z-index: 20;
  display: flex;
  justify-content: center;
  padding-top: 10%;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 300px;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 5px rgba(123, 123, 123, 0.2);
}
.loginclose {
  width: calc(100% - 10px);
  height: 40px;
  display: flex;
  justify-content: right;
  align-items: center;
}
.toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
}
.togglephone {
  cursor: pointer;
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toggleqr {
  cursor: pointer;
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logincomponent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
}

.loginlogo {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
