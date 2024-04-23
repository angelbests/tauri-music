<script lang="ts" setup>
import { onMounted } from 'vue'
import { playlistStore } from '../stores';
import Songlist from '../components/Songlist.vue';
const playlist = playlistStore()
onMounted(async ()=>{
    
})

// const downloadFile = (title:string, url:string) => {
//   fetch(url)
//     .then((response) => response.blob())
//     .then((blob) => {
//       const blobUrl = URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = blobUrl
//       a.download = title
//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       URL.revokeObjectURL(blobUrl)
//     })
//     .catch((error) => {
//       console.error('Error downloading file:', error)
//     })
// }

const start = function(){
    if(!playlist.downloadstatus){
        playlist.downloadstatus=true
        playlist.startdownload();
    }else{

    }
}
</script>

<template>
    <div class="downloaddiv">
      <div style="width: 100%;height: 40px;">
        <el-button :disabled="playlist.downloadstatus" @click="start">开始下载</el-button>
        <el-button @click="playlist.pauseddownload">暂停下载</el-button>
        <el-button @click="playlist.canceldownload">取消下载</el-button>
      </div>
        <Songlist style="height: calc(100% - 40px);" :songs="playlist.downloads"></Songlist>
    </div>
</template>

<style> 
.downloaddiv{
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
}
</style>