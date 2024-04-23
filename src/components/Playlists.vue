<script lang="ts" setup>
const props = defineProps<{
  playlist: {
    id: number;
    name: string;
    coverImgUrl: string
    resourceType: string
    description?:string
    playtime?: number;
    trackCount?: number
    creator:{
      userId:number
      nickname:string,
    }
  }[];
}>();

import { computed,ref,onMounted } from 'vue'
const loading = ref(true)
onMounted(()=>{
  let timer = setInterval(function(){
    if(props.playlist.length>0){
      loading.value = false
      clearInterval(timer)
    }
  },500)
})
const playtimeshow = computed(()=>{
  return  props.playlist.length > 0 &&props.playlist[0]['playtime'] != undefined
})

const trackCount = computed(()=>{
  return props.playlist.length > 0 && props.playlist[0]['trackCount'] != undefined
})
</script>

<template>
  <div class="playlistdiv">
    <div style="color: gray; display: flex; font-size: 12px;width: 100%;">
      <div style="width: 5%; text-align: center; height: 100%">#</div>
      <div style="width: 55%">标题</div>
      <div style="width: 20%;">创建者</div>
      <div v-show="trackCount" style="width: 10%;">曲数</div>
      <div v-show="playtimeshow" style="width: 10%;">播放时间</div>
    </div>
    <div style="border-bottom: 1px solid gray;width: 100%;margin-top: 5px;"></div>
    <el-skeleton :loading="loading" animated style="margin-top: 5px;">
      <template #template >
              <el-skeleton-item v-for="item in 20" :key="item" style="width: 100%;height: 60px;margin: 5px 0px;border: 10px;"></el-skeleton-item>
      </template>
      <div v-for="(item, index) in playlist" class="playlist">
        <div class="playlistindex">
          {{ index + 1 }}
        </div>
        <div style="width: 55%;display: flex;align-items: center;">
          <div class="playlistpicdiv">
            <img :src="item.coverImgUrl" style="width: 60px; border-radius: 5px" />
          </div>
          <div class="playlistnamediv">
            <router-link style="text-decoration: none;color: black;" :to="{path:`/detaillist/${item.id}/PLAYLIST`}">{{ item.name }}</router-link>
          </div>
        </div>
        <div class="nickname">
            {{ item.creator.nickname }}
        </div>
        <div v-show="trackCount" class="trackcount">
          {{ item.trackCount }}
        </div>
        <div v-show="playtimeshow" class="playlistplaytime">
          {{ new Date(item.playtime as number).toLocaleTimeString() }}
        </div>
      </div>
    </el-skeleton>
  </div>
</template>

<style scoped>
.playlistdiv {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 5px 10px 5px 10px;
    box-sizing: border-box;
}
.playlist {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 0px);
  height: 60px;
  background: rgba(227, 239, 252);
  border-radius: 10px;
  margin-top: 10px;
}
.playlist:hover {
  box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.2);
  background: white;
  transition: all 0.2s linear;
}
.playlistindex {
  width: 5%;
  text-align: center;
  color: gray;
  font-size: 13px;
  cursor: pointer;
}
.playlistpicdiv {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background: rgba(123, 123, 123, 0.2);
  border: none;
  display: flex;
  align-items: center;
}
.playlistnamediv {
  width: 500px;
  margin-left: 20px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  cursor: pointer;
}
.nickname {
  width:20%;
  text-align: left;
  color: gray;
  font-size: 12px;
}
.trackcount {
  width:10%;
  text-align: left;
  color: gray;
  font-size: 12px;
}
.playlistplaytime {
  width:10%;
  text-align: left;
  color: gray;
  font-size: 12px;
}
</style>
