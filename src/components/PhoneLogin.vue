<script lang="ts" setup>
import { captchasent,captchaverify } from './../api/index'
import { ref, onMounted,reactive} from 'vue';

const form:{
    phone:string,
    code:string
} = reactive({
    phone:'',
    code:''
})
onMounted(()=>{

})

const sentcode = ref(false)
const sent =async function(){
    let regu = /^1[3-9][0-9]{9}$/;
    if(regu.test(form.phone)){
        let res:any = await captchasent(form.phone)
        console.log(res.data)
        if(res.data.data){
            sentcode.value = true
        }
    }else{

    }
}

const verify = async function(){
    let regNum= /\d{4}$/
    let regu = /^1[3-9][0-9]{9}$/;
    console.log(regNum.test(form.code)&&form.code.length == 4&&regu.test(form.phone))
    if(regNum.test(form.code)&&form.code.length == 4&&regu.test(form.phone)){
        let res:any = await captchaverify(form.phone,form.code)
        console.log(res.data)
    }
}
</script>

<template>
    <div class="phoneLogin">
        <el-form :model="form">
            <el-form-item >
                <el-input v-model="form.phone" type="text">
                    <template #prepend>
                        <div style="width: 30px;">
                            +86
                        </div>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="number" v-model="form.code">
                    <template #append>
                        <el-button @click="sent">
                            发送
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item >
                <el-button @click="verify" style="width: 100%;">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
.phoneLogin{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: start;
    justify-content: center;
    margin-top: 50px;
}
</style>