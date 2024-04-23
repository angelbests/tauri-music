<script lang="ts" setup>
import Tabs from "../components/Tabs.vue";
import Songlist from "../components/Songlist.vue";
import Playlists from "../components/Playlists.vue";
import Albumlist from "../components/Albumlist.vue";
import { search } from "./../api/index";
import { onMounted, reactive, ref } from "vue";
import Artistcard from "../components/Artistcard.vue";
const props = defineProps<{
  search?:string
}>()

onMounted(async () => {
  searchsong();
  searchalbum();
  searchartist();
  searchplaylist();
  searchmv();
});

const tabindex = ref(0);
const activetab = function (index: number) {
  tabindex.value = index;
};

const songs: any[] = reactive([]);
const searchsong = async function () {
  let res = await search(props.search, 1);
  songs.push(...res.data.result.songs);
  console.log(res);
};

const albums: any[] = reactive([]);
const searchalbum = async function () {
  let res = await search(props.search, 10);
  albums.push(...res.data.result.albums);
  console.log(res);
};

const artists: any[] = reactive([]);
const searchartist = async function () {
  let res = await search(props.search, 100);
  artists.push(...res.data.result.artists);
  console.log(res);
};

const playlists: any[] = reactive([]);
const searchplaylist = async function () {
  let res = await search(props.search, 1000);
  playlists.push(...res.data.result.playlists);
  console.log(res);
};

const mvs: any[] = reactive([]);
const searchmv = async function () {
  let res = await search(props.search, 1006);
  mvs.push(...res.data.result.songs);
  console.log(res);
};
</script>

<template>
  <tabs
    :tabs="['单曲', '歌单', '歌手', '专辑', 'MV']"
    @activetab="activetab"
  ></tabs>
  <div
    style="
      width: 100%;
      height: calc(100% - 40px);
      overflow: hidden;
      overflow-y: scroll;
    "
  >
    <Songlist v-show="tabindex === 0" :songs="songs"></Songlist>
    <Playlists v-show="tabindex === 1" :playlist="playlists"></Playlists>
    <Albumlist v-show="tabindex === 3" :albumlist="albums"></Albumlist>
    <Artistcard v-show="tabindex === 2" :artists="artists"></Artistcard>
  </div>
</template>

<style scoped>

</style>
