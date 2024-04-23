
import axios from "axios";

const request = axios.create({
    baseURL:'http://127.0.0.1:55555/',
    timeout:10000,
    withCredentials:true
})
 
request.interceptors.request.use(
    function(config){
        return config
    },function(error){
        return Promise.reject(error)
    }  
)
 
request.interceptors.response.use(
    function(config:any){

        if(config.code === 301){
            console.log('登录')
        }
        // console.log('响应',config,document)
        return config
    },function(error){
        if(error.code === "ECONNABORTED"){
            console.log('网络超时')
        }
        return Promise.reject(error)
    }  
)

// 发送验证码
export const captchasent = function(phone:string,ctcode:string = '86'){
    return request.post(`/captcha/sent?timestamp=${Date.now()}`,{
        ctcode,phone
    })
}

// 验证验证码
export const captchaverify = function(phone:string,captcha:string|number){
    return request.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`)
}

// 获取二维码key
export const qrkey =function(){
    return request.get(`/login/qr/key?timestamp=${Date.now()}`)
}

// 获取二维码
export const qr =function(unikey:string){
    return request.post(`/login/qr/create?key=${unikey}&qrimg=true&timestamp=${Date.now()}`)
}

// 检查二维码状态
export const checkqr = function(unikey:string){
    return request.post(`/login/qr/check?key=${unikey}&timestamp=${Date.now()}`)
}

// 刷新登录状态
export const loginrefresh = function(cookie:string = ''){
    return request.post(`/login/refresh?timestamp=${Date.now()}`,{
        cookie
    })
}

// 退出登录
export const logout = function(cookie:string = ''){
    return request.post(`/logout?timestamp=${Date.now()}`,{
        cookie
    })
}

// 获取登录状态
export const loginstatus =function(cookie:string = ''){
    return request.post(`/login/status?timestamp=${Date.now()}`,{
        cookie
    })
}

// 获取用户详情
export const userdetail = function(uid:string){
    return request.get(`/user/detail?uid=${uid}`)
}

// 获取账号信息
export const useraccount = function(cookie:string = ''){
    return request.get(`/user/account?cookie=${encodeURIComponent(cookie)}`)
}

// 获取用户歌单 收藏 MV dj 数量
export const usersubcount = function(){
    return request.get(`/user/subcount`)
}

// 获取用户等级信息
export const userlevel = function(){
    return request.get(`/user/level`)
}

// 获取用户绑定信息
export const userbinding = function(uid:string){
    return request.get(`/user/binding?uid=${uid}`)
}

// 获取用户歌单
export const userplaylist = function(uid:string,offset:number = 0,cookie:string = ''){
    return request.get(`/user/playlist?uid=${uid}&offset=${offset}&cookie=${encodeURIComponent(cookie)}`)
}

/////////////////////////////////////////////////////////////////////////////////

// 最近播放-歌曲
export const recordrecentsong = function(cookie:string = ''){
    return request.post(`/record/recent/song?cookie=${encodeURIComponent(cookie)}`)
}

// 最近播放-专辑
export const recordrecentalbum = function(cookie:string = ''){
    return request.post(`/record/recent/album?cookie=${encodeURIComponent(cookie)}`)
}

// 最近播放-歌单
export const recordrecentplaylist = function(cookie:string = ''){
    return request.get(`/record/recent/playlist?cookie=${encodeURIComponent(cookie)}`)
}

/////////////////////////////////////////////////////////////////////////////////

// 推荐歌单
export const personalized = function(){
    return request.get(`/personalized`)
}
// 推荐新音乐
export const personalizednewsong = function(){
    return request.get(`/personalized/newsong`)
}

// 新碟

export const personalizednewest = function(){
    return request.get(`/album/newest`)
}

// banner 
export const personalizedbanner = function(){
    return request.get(`/banner`)
}

/////////////////////////////////////////////////////////////////////////////////

// 喜欢的音乐列表
export const likelist = function(uid:string,cookie:string = ''){
    return request.get(`/likelist?uid=${uid}&cookie=${encodeURIComponent(cookie)}`)
}

// 获取歌曲详情
export const songdetail = function(ids:string,cookie:string = ''){
    return request.get(`/song/detail?ids=${ids}&cookie=${encodeURIComponent(cookie)}`)
}

// 获取歌曲url 1
export const songurl = function(id:string|number,cookie:string = '',br:number = 999000){
    return request.get(`/song/url?id=${id}&br=${br}&cookie=${encodeURIComponent(cookie)}`)
}

// 获取歌曲url v1
export const songurlv1 = function(id:string|number,cookie:string = '',level:"standard"|'higher'|"exhigh"|'lossless'|'hires'|'jyeffect'|"sky"|'jymaster' = 'lossless'){
    return request.get(`/song/url/v1?id=${id}&level=${level}&cookie=${encodeURIComponent(cookie)}`)
}

// 获取歌曲音质
export const songmusicdetail = function(id:string|number,cookie:string=''){
    return request.post(`/song/music/detail?id=${id}&cookie=${encodeURIComponent(cookie)}`)
}

// 喜欢音乐  将喜欢的音乐添加到喜欢列表, like 为true则为喜欢 false 则为取消喜欢
export const like = function(id:string|number,like:boolean = true,cookie:string = ''){
    return request.get(`/like?id=${id}&like=${like}&cookie=${encodeURIComponent(cookie)}`)
}
  
//

////////////////////////////////////////////////////////////////////////////////////

// 收藏的MV
export const mysublist = function(cookie:string = ''){
    return request.get(`/mv/sublist?cookie=${encodeURIComponent(cookie)}`)
} 

// 收藏的专辑
export const albumsublist = function(cookie:string = '',offset:number,limit:number){
    return request.get(`/album/sublist?limit=${limit}&offset=${offset}&cookie=${encodeURIComponent(cookie)}`)
}

// 收藏专辑
// /album/sub?t=1    : 1 为收藏,其他为取消收藏 专辑id：id
export const albumsub = function(id:number|string,cookie:string='',t:number = 1){
    return request.get(`/album/sub?id=${id}&t=${t}&cookie=${encodeURIComponent(cookie)}`)
}

// 收藏歌单
// /playlist/subscribe  t : 类型,1:收藏,2:取消收藏 id : 歌单 id
export const playlistsubscribe = function(id:number|string,cookie:string='',t:number = 1){
    return request.get(`/playlist/subscribe?id=${id}&t=${t}&cookie=${encodeURIComponent(cookie)}`)
}

// 检查歌曲是否可用
// 

////////////////////////////////////////////////////////////////////////////////

// 搜索
export const search = function(keywords:string = '',type:1|10|100|1000|1002|1004|1006|1009|1014|1018|2000 = 1,limit:number = 30){
    return request.get(`/cloudsearch?keywords=${keywords}&limit=${limit}&type=${type}`)
}
  
//可获取默认搜索关键词
export const searchdefault = function(){ 
    return request.get(`/search/default`)
}

//可获取热门搜索列表
export const searchhot = function(){
    return request.get(`/search/hot`)
}

//可获取热门搜索列表（详细）
export const searchhotdetail = function(){
    return request.get(`/search/hot/detail`)
}

//传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息
export const searchsuggest = function(keywords:string = ''){
    return request.get(`/search/suggest?keywords=${keywords}`)
}

//传入搜索关键词可获得搜索结果
export const searchmultimatch = function(keywords:string = ''){
    return request.get(`/search/multimatch?keywords=${keywords}`)
}

///////////////////////////////////////////////////////////////////////////////

// 获取歌单详情
export const playlistdetail = function(id:string|number){
    return request.get(`/playlist/detail?id=${id}`)
}

// 获取歌单列表
export const playlisttrackall = function(id:string|number){
    return request.get(`/playlist/track/all?id=${id}`)
}

// 获取专辑内容
export const albumdetail = function(id:string|number){
    return request.get(`/album?id=${id}`)
}

///////////////////////////////////////////////////////////////////////
 
export const datarecord = function(){
    return request.get(`/openapi/music/basic/play/data/record?timestamp=${Date.now()}`);
}


// 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
// 必选参数 : id: 歌曲 id, sourceid: 歌单或专辑 id
// 可选参数 : time: 歌曲播放时间,单位为秒
// 接口地址 : /scrobble
// 调用例子 : /scrobble?id=518066366&sourceid=36780169&time=291

export const scrobble = function(id:number|string,sourceid:number|string,cookie:string = ''){
    return request.get(`/scrobble?id=${id}&sourceid=${sourceid}&timestamp=${Date.now()}&cookie=${encodeURIComponent(cookie)}`)
}

// /song/download/url
export const downloadurl = function(id:string|number,cookie:string = '',br:number = 999000){
    return request.get(`/song/download/url?id=${id}&cookie=${encodeURIComponent(cookie)}&br=${br}`)
}