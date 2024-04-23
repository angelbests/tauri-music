<script lang="ts" setup>
defineProps<{
    artists:any[]
}>()

</script>

<template>
    <div class="artists">
        <div class="artist" v-for="item in artists">
        <img :src="item.img1v1Url" class="img" />
        <div style="width: 150px">
            <div class="name">
            {{ item.name }}
            </div>
            <div class="size">专辑：{{ item.albumSize }}</div>
        </div>
        </div>
    </div>
</template>

<style>
.artists {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: start;
  align-content: start;
}
.artist {
  width: 150px;
  height: 180px;
  margin: 20px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}
.artist:hover {
  box-shadow: 2px 2px 2px 2px rgba(123, 123, 23, 0.1);
  background-color: rgba(250, 150, 150, 0.3);
  transition: all 0.2s linear;
}
.img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
}
.name {
  width: 150px;
  text-align: center;
  font-size: 14px;
}
.size {
  width: 150px;
  text-align: center;
  font-size: 12px;
  color: gray;
}
</style>