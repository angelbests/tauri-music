<script lang="ts" setup>
import { onMounted } from "vue";
import sheader from "./components/Header.vue";
import scontent from "./components/Content.vue";
import sfooter from "./components/Footer.vue";
import { playingStore,userStore} from "./stores/index";
import { } from "./stores/index";
import { BaseDirectory,createDir } from '@tauri-apps/api/fs'
import { appWindow } from '@tauri-apps/api/window'
const playing = playingStore();
const user = userStore()
onMounted(async () => {
  document.addEventListener("selectstart",function(e){
    e.preventDefault()
  })

  document.addEventListener("contextmenu",function(e){
    e.preventDefault();
  })
  
  appWindow.setAlwaysOnTop(false)
  await createDir('skydeskmusic',{ dir:BaseDirectory.Audio,recursive:true }).then((res)=>{
    console.log(res);
  });
  playing.initAudio();
    if(user.uid && user.cookie){
      await user.getmymv()
      await user.getmyalbum()
      await user.getuserplaylist()
      await user.getlikeallfunction()
      
    }
}); 
</script>

<template>
    <sheader class="sheader"></sheader>
    <scontent class="scontent"></scontent>
    <sfooter class="footer"></sfooter>
</template>

<style>
html,
body {
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: 0;
}
.sheader{
  width: 100%; height: 70px
}
.scontent{
  width: 100%; height: calc(100vh - 150px)
}
.footer{
  width: 100%; height: 80px
}
</style>
