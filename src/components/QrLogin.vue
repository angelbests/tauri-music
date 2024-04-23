<script lang="ts" setup>
import { qrkey,qr,checkqr,userdetail,useraccount,loginstatus } from './../api/index'
import { ref, onMounted,onUnmounted } from 'vue';
// stores
import { userStore } from './../stores';
const user = userStore();

const img = ref('');
const timer = ref(0);
onMounted(()=>{
    getqrkey()

    document.getElementById('qr')?.addEventListener('click',function(){
        clearInterval(timer.value)
        getqrkey()
    })

})

const emit = defineEmits<{
    login:[bool:boolean]
}>();

// 获取二维码
const getqrkey =async function(){
    let res = await qrkey();
    let unikey = res.data.data.unikey
    res = await qr(unikey)
    img.value = res.data.data.qrimg
    await checkstatus(unikey);
}

// 检查扫码状态
const checkstatus =async function(unikey:string){
    timer.value = setInterval(async function(){
        const res = await checkqr(unikey)
        if(res.data.code === 800){
            clearInterval(timer.value)
            timer.value ===0
            console.log("二维码过期")
        }else if(res.data.code === 801){
            console.log("等待扫码")
        }else if(res.data.code === 802){
            console.log("待确认",res.data)
            user.nickname = res.data.nickname
            user.avatarUrl = res.data.avatarUrl
        }else if(res.data.code === 803){
            console.log('授权登录成功')
            clearInterval(timer.value)
            timer.value === 0
            user.cookie = res.data.cookie
            let statusdata = await loginstatus(res.data.cookie)
            
            if(statusdata.data.data.account.status<0){
                console.log('未登录')
                emit('login',false)
            }else{
                console.log('已登录')
                emit('login',true)
                let data =await useraccount(res.data.cookie);
                user.uid = data.data.account.id
                user.viptype = data.data.account.vipType
                user.type = data.data.account.type
                user.username = data.data.account.userName
                user.status = data.data.account.status
                user.whitelistAuthority = data.data.account.whitelistAuthority

                data = await userdetail(user.uid)
                user.level = data.data.level
                user.listensongs = data.data.listenSongs
                user.backgroundUrl = data.data.profile.listenSongs
                user.birthday = data.data.profile.birthday
                user.gender = data.data.profile.gender
                user.playlistCount = data.data.profile.playlistCount
                user.playlistBeSubscribedCount = data.data.profile.playlistBeSubscribedCount
                user.province = data.data.profile.province
                user.signature = data.data.profile.signature
                // user.profileVillageInfo.imageUrl = data.data.profile.profileVillageInfo.imageUrl
                // user.profileVillageInfo.targetUrl = data.data.profile.profileVillageInfo.targetUrl
                // user.profileVillageInfo.title = data.data.profile.profileVillageInfo.title

                if(user.uid && user.cookie){
                    user.getmyalbum()
                    user.getuserplaylist()
                    user.getlikeallfunction()
                    user.getmymv()
                }
            }
        }
    },2000)
}

onUnmounted(()=>{
    if(timer.value !== 0 ){
        clearInterval(timer.value);
    }
})

  
</script>

<template> 
    <div class="qrLogin">
        <div class="qrLogin-div">
            <img id="qr" :src="img" alt="">  
        </div>
        <div class="qrtip">
            扫码登录
        </div>
    </div>

</template>

<style>
.qrLogin{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.qrLogin-div{
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.qrtip{
    width: 100%;
    height: 20%;
    text-align: center;
}
</style>