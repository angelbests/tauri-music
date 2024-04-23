<script lang="ts" setup>
import { onMounted,reactive,ref } from 'vue'
import { recordrecentsong, recordrecentplaylist,recordrecentalbum } from '../api';
import { userStore } from '../stores';
import Tabs from '../components/Tabs.vue';
import Songlist from '../components/Songlist.vue';
import Playlists from '../components/Playlists.vue';
import Albumlist from '../components/Albumlist.vue'
const user = userStore()
const lastsong:any[] = reactive([])
const lastplaylist:any[] = reactive([]);
const lastalbum:any[] = reactive([])
onMounted(async ()=>{
    let res =await recordrecentsong(user.cookie)
    res.data.data.list.forEach((element:any) => {
        element.data['playtime'] = element.playTime
        lastsong.push(element.data) 
    });
})
const tabnum = ref<number>(0)
const activetab =async function(index:number){
    tabnum.value = index
    if(index==1){
        let res = await recordrecentplaylist(user.cookie)
        res.data.data.list.forEach((element:any) => {
            element.data['playtime'] = element.playTime
            lastplaylist.push(element.data) 
        });
        console.log(res);
    }else if(index == 2){
        let res = await recordrecentalbum(user.cookie)
        res.data.data.list.forEach((element:any) => {
            element.data['playtime'] = element.playTime
            lastalbum.push(element.data)
        });
        console.log(res);
    }
}

</script>

<template>
    <div style="width: 100%;height: 100%;">
        <tabs style="height: 40px;" :tabs="['音乐','歌单','专辑']" @activetab="activetab"></tabs>
        <songlist style="width: 100%;height: calc(100% - 40px);" v-show="tabnum === 0" :songs="lastsong"></songlist>
        <albumlist style="width: 100%;height: calc(100% - 40px);" v-show="tabnum === 2" :albumlist="lastalbum"></albumlist>
        <playlists style="width: 100%;height: calc(100% - 40px);" v-show="tabnum === 1" :playlist="lastplaylist"></playlists>
    </div>
</template>

<style>

</style>