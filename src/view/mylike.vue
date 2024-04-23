<script lang="ts" setup>
import Songlist from '../components/Songlist.vue';
import { userStore } from '../stores';
const user = userStore()
</script> 

<template>
    <Songlist style="width: 100%;height:100%" :songs="user.mylikes"></Songlist>
</template>

<style>

</style> 