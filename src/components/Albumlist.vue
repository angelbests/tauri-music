<script lang="ts" setup>
const props = defineProps<{
    albumlist:{
        id:number
        name:string
        picUrl:string
        playtime?:any
        size:number
        publishTime:any
        artist:{
            id:number
            name:string
            picUrl:string
        }
    }[]
}>()

import { computed,ref,onMounted } from 'vue'
const loading = ref(true)
const playtimeshow = computed(()=>{
    return props.albumlist.length>0 && props.albumlist[0]['playtime']!=undefined
})

onMounted(()=>{
  let timer = setInterval(function(){
    if(props.albumlist.length>1){
      loading.value = false,
      clearInterval(timer)
    } 
  },500)
})
</script>

<template>
    <div class="albumlistdiv">
        <div style="color: gray; display: flex; font-size: 12px;">
            <div style="width: 5%; text-align: center; height: 100%">#</div>
            <div style="width: 55%">标题</div>
            <div style="width: 16%">作者</div>
            <div style="width: 12%;">曲数</div>
            <div style="width: 12%;">{{playtimeshow?'播放时间':'发行日期'}}</div>
        </div>
        <div style="border-bottom: 1px solid gray;width: 100%;margin-top: 5px;"></div>
        <el-skeleton :loading="loading" animated style="margin-top: 5px;">
            <template #template >
                    <el-skeleton-item v-for="item in 20" :key="item" style="width: 100%;height: 60px;margin: 5px 0px;border: 10px;"></el-skeleton-item>
            </template>
            <div class="albumlist" v-for="(item, index) in albumlist">
                <div class="albumindex">
                    {{ index + 1 }}
                </div>
                <div style="width: 55%;display: flex;align-items: center;">
                    <div class="albumpicdiv">
                        <img :src="item.picUrl+'?param=200y200'" style="width: 60px; border-radius: 5px" />
                    </div>
                    <div class="albumname">
                        <router-link style="text-decoration: none;color: black;" :to="{path:`/detaillist/${item.id}/ALBUM`}">
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
                <div class="albumartist">
                    {{ item.artist.name }}
                </div>
                <div class="albumsongs">
                    {{ item.size }}
                </div>
                <div  class="albumplaytime">
                    {{ playtimeshow?new Date(item.playtime).toLocaleTimeString():new Date(item.publishTime).toLocaleDateString() }}
                </div>
            </div>
        </el-skeleton>
    </div>
</template>

<style>
.albumlistdiv {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 5px 10px 5px 10px;
  box-sizing: border-box;
}
.albumlist {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60px;
  background: rgba(227, 239, 252);
  border-radius: 10px;
  margin-top: 10px;
}
.albumlist:hover {
  box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.2);
  background: white;
  transition: all 0.2s linear;
}
.albumindex {
  width: 5%;
  text-align: center;
  color: gray;
  font-size: 13px;
}
.albumpicdiv {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background: rgba(123, 123, 123, 0.2);
  border: none;
  display: flex;
  align-items: center;
}
.albumname {
  width: calc(100% - 100px);
  padding-left: 10px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}
.albumartist{
    width: 16%;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    color: gray;
}
.albumsongs{
    width: 12%;
    text-align: left;
    color: gray;
    font-size: 12px;
}
.albumplaytime{
    width: 12%;
    text-align: left;
    color: gray;
    font-size: 12px;
}
</style>