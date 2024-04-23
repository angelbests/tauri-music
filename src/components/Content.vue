<script lang="ts" setup>
import { reactive, ref,onMounted } from "vue";
import { userStore } from "../stores";
const menus: any[] = reactive([
  {
    name: "为我推荐",
    path: "/recommend",
    icon: "bi bi-vinyl-fill",
  },
  {
    name: "我喜欢的音乐",
    path: "/mylike",
    icon: "bi bi-heart-fill",
  },
  {
    name: "我的收藏",
    path: "/mycollection",
    icon: "bi bi-star-fill",
  },
  {
    name: "最近播放",
    path: "/lastplayed",
    icon: "bi bi-clock-fill",
  },
  {
    name: "下载管理",
    path: "/download",
    icon: "bi bi-save-fill",
  },
  // {
  //   name: "本地音乐",
  //   path: "/localmusic",
  //   icon: "bi bi-folder-fill",
  // }
]);
const selected = ref(100);
const user = userStore();
const menuClick = async function (index: number) {
  selected.value = index;
};

onMounted(()=>{
  document.getElementById("menus")?.addEventListener("selectstart",function(e){
    e.preventDefault();
  })
})
</script>

<template>
  <div class="content">
    <div id="menus" class="menus">
      <router-link
        :class="{ menu: true, selected: selected === index }"
        @click="menuClick(index)"
        v-for="(item, index) in menus"
        :to="{ path: item.path }"
      >
        <div class="routerlink">
          <i :class="item.icon"></i>
          {{ item.name }}
        </div>
      </router-link>
      <div class="menu leftlist" style="height: auto">
        <el-collapse style="width: 140px; margin-left: 30px; height: auto">
          <el-collapse-item>
            <template #title>
              <span style="font-size: 14px">我创建的歌单</span
              ><span style="font-size: 10px; margin-left: 5px; color: gray">{{
                user.userplaylists.length
              }}</span>
            </template>
            <router-link
              style="text-decoration: none; color: black"
              v-for="item in user.userplaylists"
              :to="{
                path: `/detaillist/${item.id}/PLAYLIST`,
                query: { id: item.id, type: 'PLAYLIST' },
              }"
            >
              <div class="userplaylist">
                <img :src="item.coverImgUrl" class="userplaylistimg" />
                <div
                  style="
                    width: calc(100% - 40px);
                    margin-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    line-clamp: 2;
                    box-orient: vertical;
                    font-size: 12px;
                  "
                >
                  {{ item.name }}
                </div>
              </div>
            </router-link>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="menu leftlist" style="height: auto">
        <el-collapse style="width: 140px; margin-left: 30px; height: auto">
          <el-collapse-item>
            <template #title>
              <span style="font-size: 14px">我收藏的歌单</span
              ><span style="font-size: 10px; margin-left: 5px; color: gray">{{
                user.likeplaylists.length
              }}</span>
            </template>
            <router-link
              style="text-decoration: none; color: black"
              v-for="item in user.likeplaylists"
              :to="{
                path: `/detaillist/${item.id}/PLAYLIST`,
                query: { id: item.id, type: 'PLAYLIST' },
              }"
            >
              <div class="userplaylist">
                <img :src="item.coverImgUrl" class="userplaylistimg" />
                <div
                  style="
                    width: calc(100% - 40px);
                    margin-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    line-clamp: 2;
                    box-orient: vertical;
                    font-size: 12px;
                  "
                >
                  {{ item.name }}
                </div>
              </div>
            </router-link>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="view">
      <!-- <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>http://localhost:3000/#/detaillist?type=ALBUM&id=49801
            </router-view> -->
      <router-view :key="$route.path"></router-view>
    </div>
  </div>
</template>

<style>
.leftlist .el-collapse {
  border: none !important;
}

.leftlist .el-collapse-item__header {
  font-size: 15px;
  background: transparent !important;
  border: none !important;
  color: black !important;
}

.leftlist .el-collapse-item__wrap {
  background: transparent !important;
  border: none !important;
}

.leftlist .el-collapse-item__content {
  background: transparent !important;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
}

.menus {
  width: 200px;
  height: 100%;
  background-color: rgba(240, 243, 246, 255);
  overflow: hidden;
  overflow-y: scroll;
}
.menu {
  width: 180px;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 10px;
  border-radius: 10px;
  text-decoration: none;
  color: gray;
}
.menu:hover {
  transition: all 0.1s linear;
  background-color: rgba(228, 232, 236, 255);
}
.selected {
  background-color: rgba(234, 62, 62, 255) !important;
  color: white !important;
}
.routerlink {
  letter-spacing: 2px;
  font-size: 15px;
  margin-left: 30px;
}
.view {
  width: calc(100vw - 200px);
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background-color: rgba(247, 249, 252, 255);
}
::-webkit-scrollbar {
  display: none;
}

.userplaylist {
  display: flex;
  margin: 10px 0px;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
}
.userplaylist:hover {
  transition: all 0.3s linear;
  background: rgba(123, 123, 123, 0.2);
}
.userplaylistimg {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.userplaylisttext {
  width: calc(100% - 40px);
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  box-orient: vertical;
  font-size: 12px;
}

html,
body {
  overflow: hidden;
}
</style>
