<script lang="ts" setup>
import { onMounted,reactive,ref } from 'vue';
import { playlistdetail,albumdetail, albumsub,playlistsubscribe,songdetail } from './../api/index'
import Songlist from '../components/Songlist.vue';
import { useRoute } from 'vue-router';
import { playingStore, playlistStore,userStore } from '../stores';
const route = useRoute()
const playliststore = playlistStore()
const query:{
    id:string|number,
    type:'PLAYLIST'|'ALBUM'
} = reactive({
    id:0,
    type:'PLAYLIST'
})

const playlist:{
    id:number,
    userId:number
    name:string
    coverImgUrl:string
    createTime:any,
    description:string,
    creator:{
        id:number
        name:string
        nickname:string
        avatarUrl:string,
        picUrl:string
    },
    trackIds:any[]
    tracks:any[]
} = reactive({
    id:0,
    userId:0,
    name:'名称',
    coverImgUrl:'/img/img.jpg',
    createTime:0,
    description:'',
    creator:{
        id:0,
        name:'名字',
        nickname:'昵称',
        avatarUrl:'/img/dog.png',
        picUrl:'/img/dog.png'
    },
    trackIds:[],
    tracks:[]
})
const loading =ref(true)
onMounted(async ()=>{
    query.id =  route.params.id as string|number
    query.type = route.params.type as 'PLAYLIST'|'ALBUM'

    if(query.type === 'ALBUM'){
        getalbum(query.id)
    }else if(query.type === 'PLAYLIST'){
        await getplaylistdetail(query.id)
    }

    let timer = setInterval(function(){
        if(playlist.tracks.length>0){
            loading.value = false
            clearInterval(timer)
        }
    },500)
    checkstar()
})  


const checkstar =function(){
    if(query.type == "ALBUM"){
        user.myalbums.forEach((item)=>{
            if(item.id == query.id){
                isstar.value = true
            }
        })
    }else if(query.type == "PLAYLIST"){
        [...user.likeplaylists,...user.userplaylists].forEach((item)=>{
            if(item.id == query.id){
                isstar.value = true
            }
        })
    }
}

// 获取专辑列表
const getalbum =async function(id:string|number){
    let res = await albumdetail(id);
    playlist.id = res.data.album.id
    playlist.name = res.data.album.name
    playlist.coverImgUrl = res.data.album.picUrl
    playlist.createTime = res.data.album.publishTime
    playlist.description = res.data.album.description
    playlist.tracks = res.data.songs
    playlist.creator = res.data.album.artist
    console.log(res.data)

    for (let [index] of playlist.tracks.entries()) {
        playlist.tracks[index].al["picUrl"] = playlist.coverImgUrl
    }

}

// 获取歌单列表
const getplaylistdetail =async function(id:string|number){
    let res = await playlistdetail(id);
    let num = 0
    let ids:number[] = []
    res.data.playlist.trackIds.forEach((element:any) => {
        ids.push(element.id)
    });
    const getsongdetail = async function(){
        let id = ids.slice(num*1000,(num+1)*1000)
        let res2 = await songdetail(id.join(',')); 
        num = num + 1;
        console.log(res2)
        playlist.tracks.push(...res2.data.songs)
        if(res.data.playlist.trackIds.length != playlist.tracks.length) {
            getsongdetail()
        }else{
            console.log('拉取完成')
        }
    }
    getsongdetail()

    playlist.id = res.data.playlist.id
    playlist.name = res.data.playlist.name
    playlist.coverImgUrl = res.data.playlist.coverImgUrl
    playlist.createTime = res.data.playlist.createTime
    playlist.description = res.data.playlist.description
    playlist.userId = res.data.playlist.userId
    playlist.creator = res.data.playlist.creator
    console.log(res.data.playlist,playlist)
}

const playing = playingStore()
// 播放
const playsong = function(bool:boolean = false){
    playliststore.playlist.id = playlist.id
    playliststore.playlist.name = playlist.name
    playliststore.playlist.coverImgUrl = playlist.coverImgUrl
    playliststore.playlist.createTime = playlist.createTime
    playliststore.playlist.description = playlist.description
    playliststore.playlist.tracks = playlist.tracks
    playliststore.playlist.userId = playlist.userId
    playliststore.playlist.creator = playlist.creator
    playliststore.playlist.type = query.type
    playliststore.initplayarr()
    if(bool){
        playing.currenttime = 0;
        playing.currenttimestr = "00:00:00"
        if(playing.playmode == 1){
            playliststore.index = 0
        }else{
            playliststore.index = -1
        }
        playing.playnext()
    }
}

// const getplaylisttrackall = async function(id:string|number) {
//     let res = await playlisttrackall(id);
//     console.log(res)
// }
const user = userStore()
const isstar = ref(false)
// 收藏 
const favorite =async function(){
    if(isstar.value){ // 取消收藏
        if(query.type == 'ALBUM'){
            let res = await albumsub(query.id,user.cookie,0)
            user.getmyalbum()
            console.log(res.data)
        }else if(query.type =='PLAYLIST'){
            let res = await playlistsubscribe(query.id,user.cookie,0)
            user.getuserplaylist()
            console.log(res.data)
        }
        isstar.value = false
    }else{ // 收藏
        if(query.type == 'ALBUM'){
            let res = await albumsub(query.id,user.cookie,1)
            user.getmyalbum()
            console.log(res.data)
        }else if(query.type =='PLAYLIST'){
            let res = await playlistsubscribe(query.id,user.cookie,1)
            user.getuserplaylist()
            console.log(res.data)
        }
        isstar.value = true
    }
}


const download = function(){
    let arr:any[] = [];
    for (let i=0;i<playlist.tracks.length;i++) {
        // 解引用
        arr.push({...playlist.tracks[i]})
        arr[i]['downloadstatus'] = '未下载'
    }
    playliststore.downloads.filter((item1)=>{
        arr.filter((item2,index2)=>{
            if(item1.id === item2.id){
                arr.splice(index2,1)
            }
            return false
        })
        return false
    })

    playliststore.downloads.push(...arr)
    if(!playliststore.downloadstatus){
        playliststore.downloadstatus=true
        playliststore.startdownload();
    }
    console.log(playliststore.downloads)
}
</script>

<template>
    <div style="width: 100%;height: 100%;">
        <div style="width: 100%;height: 240px;display: flex;">
            <div style="width: 240px;height: 240px;display: flex;align-items: start;justify-content: center;margin:20px 20px 0px 0px;">
                <el-skeleton :loading="loading" animated style="width: 200px;height: 200px;" >
                    <template #template>
                            <el-skeleton-item style="width: 200px;height: 200px;border-radius: 10px;"></el-skeleton-item>
                    </template>
                    <img :src="playlist.coverImgUrl" style="width: 200px;height: 200px;border-radius: 10px;">
                </el-skeleton>
            </div>
            <div style="width: calc(100% - 240px);height: 240px;margin:20px 20px 0px 0px;">
                <el-skeleton :loading="loading" animated>
                    <template #template>       
                        <el-skeleton-item style="width: 100%;height: 40px;border-radius: 10x;"></el-skeleton-item>    
                    </template>
                    <div style="width: 100%;height: 40px;font-size: 25px;font-weight: bold;text-overflow: ellipsis;overflow: hidden;text-wrap: nowrap;">
                        {{ playlist.name }}
                    </div>
                </el-skeleton>
                <el-skeleton :loading="loading" animated>
                    <template #template>       
                        <el-skeleton-item style="width: 100%;height: 50px;border-radius: 10x;"></el-skeleton-item>    
                    </template>
                    <p style="overflow: hidden;;text-overflow: ellipsis;
                        width: 100%;height:50px;font-size: 12px;color: gray;
                    ">
                        {{ playlist.description }}
                    </p>
                </el-skeleton>
                <div style="display: flex;align-items: center;height: 30px;width: 100%;padding:10px 0px;">
                    <el-skeleton :loading="loading" animated style="width: 30px;height: 30px;">
                        <template #template>       
                            <el-skeleton-item style="width: 30px;height: 30px;border-radius: 50%;"></el-skeleton-item>    
                        </template>
                        <img :src="query.type ==='PLAYLIST'?playlist.creator.avatarUrl:playlist.creator.picUrl" style="width: 30px;height: 30px;border-radius: 50%;">
                    </el-skeleton>

                    <el-skeleton :loading="loading" animated >
                        <template #template>       
                            <el-skeleton-item style="width: 200px;height: 30px;margin-left: 10px;"></el-skeleton-item>    
                        </template>
                        <span style="width: 100%;margin-left: 10px;font-size: 12px;color: gray;">
                            {{ query.type ==='PLAYLIST'?playlist.creator.nickname:playlist.creator.name }} 
                        </span>
                    </el-skeleton>
                </div>
                <div style="height: 40px;width: 100%;display: flex;align-items: center;">
                    <el-button :disabled="loading" style="width: 80px;border: none;background: rgba(234,237,241,255);" @click="playsong(true)">
                        <template #icon>
                            <i style="font-size: 20px;" v-if="playliststore.playlist.id == playlist.id" class="bi bi-pause-fill"></i>
                            <i style="font-size: 20px;" v-if="playliststore.playlist.id != playlist.id" class="bi bi-play-fill"></i>
                        </template>
                        播放
                    </el-button>
                    <el-button :disabled="loading" style="width: 80px;border: none;background: rgba(234,237,241,255)" @click="favorite">
                        <template #icon>
                            <i v-if="!isstar" class="bi bi-star"></i>
                            <i v-if="isstar" class="bi bi-star-fill"></i>
                        </template>
                        收藏
                    </el-button>
                    <el-button @click="download" :disabled="loading" style="width: 80px;border: none;background: rgba(234,237,241,255)">
                        <template #icon>
                            <i class="bi bi-save-fill"></i>
                        </template>
                        下载
                    </el-button>
                </div>
            </div> 
        </div>
        <Songlist @playsong="playsong" :songs="playlist.tracks" style="width: 100%;height: calc(100% - 240px);"></Songlist>
    </div>
</template>

<style>

</style>