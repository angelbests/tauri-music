import { defineStore } from "pinia";
import { songurl,scrobble,userplaylist,likelist,songdetail, songmusicdetail,albumsublist, mysublist,downloadurl } from '../api';
import { BaseDirectory,exists,renameFile,createDir} from '@tauri-apps/api/fs';   //removeFile,
import { audioDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from "@tauri-apps/api/event"
// user
interface playlisttype {
    id: number;
    name: string;
    coverImgUrl: string
    resourceType: string
    description?:string
    playtime?: number;
    trackCount?: number,
    creator:{
      userId:number
      nickname:string,
    }
}

interface songtype {
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
    downloadstatus?:string
  }

export const userStore = defineStore('user',{
    state:()=>{
        return {
            cookie:'',

            nickname:'昵称',
            avatarUrl:'',   

            uid:'',
            viptype:0,
            type:0,
            username:'',
            status:-1,
            whitelistAuthority:0,

            level:0,
            listensongs:0,
            backgroundUrl:'',
            birthday:0,
            gender:0,
            playlistCount:0,
            playlistBeSubscribedCount:0,
            province:0,
            signature:'',
            profileVillageInfo:{
                imageUrl:'',
                targetUrl:'',
                title:''
            },
            userplaylists:[] as playlisttype[],
            likeplaylists:[] as playlisttype[],
            mylikes:[] as songtype[],
            ids:[] as number[],
            myalbums:[] as any[],
            mymvs:[] as any[]
        } 
    },
    actions:{
        async getmyalbum(){ 
            this.myalbums.length = 0
            let that = this
            let num1 = 0
            const getalbum =async function(){
                let res = await albumsublist(that.cookie,num1*100,100);
                console.log("myalbum",res.data)
                that.myalbums.push(...res.data.data)
                if(res.data.hasMore){
                    num1 = num1 + 1
                    getalbum()
                }
            }
            getalbum() 
        },
        async getmymv(){
            this.mymvs.length = 0
            let res = await mysublist(this.cookie);
            console.log("mymv",res.data)
            this.mymvs.push(...res.data.data)
        },
        async getuserplaylist(){
            let res = await userplaylist(this.uid,1,this.cookie)
            console.log("用户播放列表",res.data.playlist)
            this.userplaylists.length = 0
            this.likeplaylists.length = 0
            res.data.playlist.forEach((element:any) => {
                if(element.creator.userId == this.uid){
                    this.userplaylists.push(element)
                }else{
                    this.likeplaylists.push(element)
                }
            }); 
        },
        async getlikeallfunction(){
            let num = 0;
            let res = await likelist(this.uid,this.cookie)
            this.ids.length = 0
            this.ids.push(...res.data.ids);
            this.mylikes.length = 0;
            let that = this;
            const getsongdetail = async function(){
                let id = that.ids.slice(num*500,(num+1)*500)
                let res = await songdetail(id.join(',')); 
                num = num + 1;
                console.log("用户喜欢的音乐",res.data.songs)
                that.mylikes.push(...res.data.songs)
                if(that.ids.length != that.mylikes.length) {
                    getsongdetail()
                }else{
                    console.log('拉取完成')
                }
            }
            getsongdetail()
        }
    },
    persist:true
})

// playlist 

export const playlistStore = defineStore('playlist',{
    state:()=>{
        return {
            playlist:{
                id:0,
                type:"ALBUM" as "ALBUM"|"PLAYLIST",
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
                tracks:[] as songtype[]
            },
            index:0, // 正在播放的数组下标值 index
            playarr: [0], // 播放顺序列表
            downloads:[] as songtype[],
            downloadstatus:false,
            downloadindex:0
        }
    },
    actions:{
        // 初始化播放顺序列表
        initplayarr(){
            let playing = playingStore();
            // 0 顺序播放 1 单曲循环 2 列表循环 3 列表随机 
            if(playing.playmode == 0 || playing.playmode == 2 || playing.playmode == 1){
               this.playarr.splice(0,this.playarr.length)
                this.playarr.push(...Array.from(new Array(this.playlist.tracks.length).keys())) 
            }else if(playing.playmode == 3){
                this.playarr.splice(0,this.playarr.length)
                // 获取乱序数组
                this.playarr.push(...playing.shuffle(Array.from(new Array(this.playlist.tracks.length).keys()))) 
            }
            console.log(this.playarr,this.playlist)
        },
        startdownload(){
            if(this.downloadstatus && this.downloads[this.downloadindex] != undefined && (this.downloads[this.downloadindex].downloadstatus == "未下载" || this.downloads[this.downloadindex].downloadstatus == "下载中")){
                this.downloads[this.downloadindex].downloadstatus = "下载中";
                this.downloadmusicinvoke(this.downloads[this.downloadindex].id,this.downloads[this.downloadindex].name,this.downloads[this.downloadindex].al.name).then((musicid)=>{
                    console.log("下载返回",musicid)
                    if(musicid == this.downloads[this.downloadindex].id){
                        this.downloads[this.downloadindex].downloadstatus = "已完成";
                        this.downloadindex++;
                       this.startdownload()
                    }else{
                        this.downloads[this.downloadindex].downloadstatus = "下载失败";
                        this.downloadindex++;
                        this.startdownload()
                    }
                }).catch((e)=>{
                    this.downloads[this.downloadindex].downloadstatus = "下载失败";
                    this.downloadindex++;
                    this.startdownload()
                    console.log(e)
                })

            }else{
                console.log('暂停下载')
            }
        },
        pauseddownload(){
            this.downloadstatus = false
        },
        canceldownload(){
            this.downloads.length = 0;
            this.downloadindex = 0;
            this.downloadstatus = false
        },
        downloadmusicinvoke(id:number,name:string,dir:string=''){
            return new Promise(async (resolve,reject)=>{
                const user = userStore()
                dir = dir.replace( /[<>:"\/\\|?*]+/g, '' );
                name = name.replace( /[<>:"\/\\|?*]+/g, '' );
                await createDir(`skydeskmusic\\${dir}`,{dir:BaseDirectory.Audio,recursive:true})
                let fname = 'weweqeqwewqweewq'
                 
                 console.log( name.replace("/",''),'   ',name);
                let res = await downloadurl(id,user.cookie)
                if(!res.data.data.url){
                    return reject(1);
                }else{
                    console.log("歌曲下载信息",res.data)
                    let type = res.data.data.type;
                    let audioDirPath = await audioDir();
                    let path = audioDirPath+`skydeskmusic\\${dir}\\${fname}.${type}`;
                    let bool = await exists(`skydeskmusic\\${dir}\\${name}.${type}`,{dir:BaseDirectory.Audio}) 
                    if(bool){
                        // removeFile(path);
                        return resolve(Number(id))
                    }
                    await invoke('downloadmusic',{id:id,url:res.data.data.url,dir:path})
                    let unlisten =  await listen("download",async (e:any)=>{
                        if(e.payload){
                            let a = await renameFile(`skydeskmusic\\${dir}\\${fname}.${type}`,`skydeskmusic\\${dir}\\${name}.${type}`,{dir:BaseDirectory.Audio})
                            console.log("重命名",a);
                            unlisten();
                            return resolve(Number(e.payload))
                        }else{
                            reject(0)
                        }
                    }) 
                }
            })
        }
    },
    persist:true
})

// playing
export const playingStore = defineStore('playing',{
    state:()=>{
        return {
            songs:[{url:''}] as any[],
            song: {
                id:0,
                name:'曲名',
                al: {
                  id: 0,
                  name: '',
                  picUrl: '',
                },
                ar:[{
                  id:0,
                  name:'',
                }],
                fee: 0,
                dt: 0,
              },
            audio:new Audio(),
            playstatus:false,
            mutedbool:false,
            currenttimestr:'00:00:00',
            durationstr:'00:00:00',
            currenttime:0 as number,
            duration:0 as number,
            playmode:1,  // 0 顺序播放 1 单曲循环 2 列表循环 3 列表随机 
            musicdetail:'无损', //音质
            musicdetails:{
                db:{} as {}|null,
                h:{} as {}|null, // 高质量文件信息
                hr:{} as {}|null, // Hi-Res质量文件信息
                je:{} as {}|null,
                jm:{} as {}|null,
                l:{} as {}|null, // 低质量文件信息
                m:{} as {}|null, // 中质量文件信息
                sk:{} as {}|null,
                sq:{} as {}|null, // 无损质量文件信息
                songId:0
            },
            playshow:false,
            divlist:false,
            volume:0.5,
            blur:0,
            transparent:1,
            fontcolor:'black',
            background:''
         }
    },
    getters:{
    },
    actions:{
        play(url:string = ''){
            let that = this
            if(url){
                that.audio.src = url
                that.audio.oncanplaythrough = function(){
                    that.durationstr = that.timestr(that.audio.duration)
                    that.duration = Number(that.audio.duration.toFixed(0))
                    that.audio.play()
                    that.playstatus = !that.audio.paused
                }
            }else{
                that.audio.play()
                that.playstatus = !that.audio.paused
            }
            
            
            that.audio.ontimeupdate = function(){
                that.currenttimestr = that.timestr(that.audio.currentTime)
                that.currenttime = Number(that.audio.currentTime)
            }

            this.audio.removeEventListener('ended',this.playnext);
            that.audio.addEventListener('ended',this.playnext)
            this.getmusicdetail()
        }, 
        async playnext(){
            this.audio.removeEventListener('ended',this.playnext);
            let playlist = playlistStore()
            if(this.playmode == 2 || this.playmode == 3 || this.playmode == 0){
                if (playlist.index<(playlist.playarr.length-1)){
                    playlist.index = playlist.index + 1; // 下一首播放
                }else{
                    if(this.playmode == 0){
                        return // 停止播放
                    }else{
                        playlist.index = 0 // 播放最后一首 跳回第一首
                    }
                }
                document.getElementById("divlistsongdiv")?.scrollTo({
                    top: playlist.playarr[playlist.index] * 60,
                    behavior: "smooth",
                });
            } 
            let item = playlist.playlist.tracks[playlist.playarr[playlist.index]]
            let user = userStore()
            let res = await songurl(item.id,user.cookie)

            if(res.data.data[0].code != 404){
                this.song = item
                this.songs = res.data.data
                this.play(res.data.data[0].url)
                scrobble(item.id,item.al.id,user.cookie)
                console.log("播放歌曲",res.data)
              }else{
                alert('无资源')
              }
        },
        async playpre(){
            let playlist = playlistStore()
            if(playlist.index != 0){
                playlist.index = playlist.index - 1; // 上一首播放
            }else{
                playlist.index = playlist.playarr.length-1
            }
            document.getElementById("divlistsongdiv")?.scrollTo({
                top: playlist.playarr[playlist.index] * 60,
                behavior: "smooth",
            });
            let item = playlist.playlist.tracks[playlist.playarr[playlist.index]]
            let user = userStore()
            let res = await songurl(item.id.toString(),user.cookie)
            if(res.data.data[0].code != 404){
                this.song = item
                this.songs = res.data.data
                this.play(res.data.data[0].url)
                scrobble(item.id,item.al.id,user.cookie)
                }else{
                alert('无资源')
            }
        },
        pause(){
            this.audio.pause()
            this.playstatus = !this.audio.paused
            console.log(!this.audio.paused)
        },
        muted(){
            this.audio.muted = !this.mutedbool
            this.mutedbool = !this.mutedbool
        },
        initAudio(){
            let that = this
            if(this.songs.length>0&&this.songs[0].url != undefined){
                this.audio.src = this.songs[0].url
                 setTimeout(function(){

                        that.audio.currentTime = that.currenttime
                     // that.durationstr = that.timestr(that.audio.duration)
                     // that.duration = Number(that.audio.duration.toFixed(0))
                 },300)
            }
            this.playstatus = false
        },
        timestr(time:number){
            let s = (time%60)>=10?(time%60).toFixed(0):'0'+(time%60).toFixed(0)
            let i = (time/60)>=10?(time/60).toFixed(0):'0'+(time/60).toFixed(0)
            let h = (time/3600)>=10?(time/3600).toFixed(0):'0'+(time/3600).toFixed(0)
            return h+':'+i+':'+s
        },
        playmodechange(){
            if(this.playmode==3){
                this.playmode = 0
            }else{
                this.playmode = this.playmode + 1
            }
            // 0 顺序播放 1 单曲循环 2 列表循环 3 列表随机 
            let playlist = playlistStore();
            playlist.initplayarr()
        },
        shuffle(arr:number[]) {
            var len = arr.length;
            for (var i = 0; i < len - 1; i++) {
                var index = parseInt((Math.random() * (len - i)).toFixed(0));
                var temp = arr[index];
                arr[index] = arr[len - i - 1];
                arr[len - i - 1] = temp;
            }
            return arr;
        },
        async getmusicdetail(){
            const user = userStore()
            let res =await songmusicdetail(this.song.id,user.cookie)
            res.data.success?this.musicdetail = res.data.data:""
            console.log(res.data)
        },
        changevolume(e:any) {
            this.audio.volume = e;
        },
    }, 
    persist:{
       key:'playing',
       paths: ['songs','song','playstatus','loop','muted','src','currenttime','duration','currenttimestr','durationstr','playmode','playshow','divlist','volume','blur','transparent','fontcolor','background'],
       storage:localStorage,
    },
}) 

