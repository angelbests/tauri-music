<script lang="ts" setup>
import { userStore,playingStore } from "../stores";
import { ref,onMounted} from "vue";
import Tabs from "../components/Tabs.vue";
import { useRouter } from "vue-router";
const router = useRouter()
const user = userStore();
const playing = playingStore()
const activetabnum = ref(0)
const activetab = function(index:number){
    activetabnum.value = index
}

const godetaillist = function(id:number){
  router.push({path:`/detaillist/${id}/ALBUM`})
}
const mvbool = ref(false)
onMounted(async ()=>{
  await user.getmymv()
  await user.getmyalbum()
  let timer = setInterval(function(){
    if(user.mymvs.length>0){
      mvbool.value = true
      clearInterval(timer)
    }
  },500)
})
</script>

<template>
  <div class="albumlistdiv">
    <tabs class="tabs" :tabs="['专辑', 'MV']" @activetab="activetab"></tabs>
    <div v-show="activetabnum === 0" class="albumlist">
      <div @click="godetaillist(item.id)" class="album" v-for="item in user.myalbums">
        <img
          class="albumimg"
          :src="item.picUrl+'?param=200y200'"
        />
        <div class="albumtitle">
          <div class="albumname">
            {{ item.name }}
          </div>
          <div class="albumartist">
            {{ item.artists[0].name }}
          </div>
        </div>
      </div>
    </div>

    <div v-show="activetabnum === 1" class="mvlist">
        <div v-if="mvbool" class="mv" v-for="item in user.mymvs">
            <div class="mvimgdiv">
              <img class="mvimg" :src="item.coverUrl+'?param=200y200'" >
            </div>
            <div class="mvtext">
                <div class="mvtitle">{{ item.title }}</div>
                <div class="playtime">{{ playing.timestr(item.durationms/1000) }}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.albumlistdiv {
  width: 100%;
  height: 100%;
}
.tabs {
  height: 40px;
}
.albumlist {
  height: calc(100% - 40px);
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-content: start;
  border-radius: 20px; 
}
.album {
  width: 180px;
  height: 240px;
  margin: 10px;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}
.album:hover{
    box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.4);
    background-color: rgba(250, 150, 150, 0.3);
    transition: all 0.2s linear;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
}
.albumimg {
  width: 180px;
  height: 180px;
  border-radius: 20px;
}
.albumimg:hover{
    border-radius: 100px;
    box-shadow: 4px 4px 4px 4px rgba(123, 123, 123, 0.2);
    transition: all 0.2s linear;
}
.albumtitle {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 5px 10px;
  box-sizing: border-box;
}
.albumname {
  width: 100%;
  font-size: 14px;
  color: black;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  white-space: nowrap;
}
.albumartist {
  font-size: 12px;
  color: gray;
}

.mvlist{
    height: calc(100% - 40px);
    width: 100%;
    overflow: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-content: start;
}
.mv{
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 230px;
  margin: 10px;
  border-radius: 20px;
  cursor: pointer;
}
.mv:hover{
    box-shadow: 2px 2px 2px 2px rgba(123, 123, 123, 0.4);
    background-color: rgba(250, 150, 150, 0.3);
    transition: all 0.2s linear;
}
.mvimgdiv{
  width: 240px;
  height: 180px;
  overflow: hidden;
  border-radius: 20px;
}
.mvimg{
  width: 300px;
  border-radius: 20px;
}
.mvimg:hover{
    /* border-radius: 100px; */
    box-shadow: 4px 4px 4px 4px rgba(123, 123, 123, 0.2);
    transition: all 0.2s linear;
}
.mvtext{
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    box-sizing: border-box;
}
.mvtitle{
    width: 100%;
    font-size: 14px;
    color: black;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
    white-space: nowrap;
}
.playtime{
    font-size: 12px;
    color: gray;
}
</style>
