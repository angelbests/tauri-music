<script lang="ts" setup>
import { ref } from 'vue'
defineProps<{
    tabs:string[]
}>()

const emit = defineEmits<{
    activetab:[index:number]
}>()

const clicknum = ref(0);
const activetab = function(index:number){
    clicknum.value = index
    emit('activetab',index)
}
</script>

<template>
<div class="stabs">
    <div v-for="(item,index) in tabs" :class="{stab:true}" @click="activetab(index)">
        <div style="height: 30px;" :class="{stab:true,clicktab:clicknum === index}">
            {{ item }}
            <div v-show="clicknum === index" style="width: 100%;border-bottom: 3px solid black;"></div>
        </div>
    </div>
    
</div>
</template>

<style scoped>
.stabs{
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    /* background-color: red; */
}
.stab{
    color: gray;
    margin: 10px 10px;
    cursor: pointer;
    
}
.clicktab {
    font-weight: bold;
    color: black;
}
</style>