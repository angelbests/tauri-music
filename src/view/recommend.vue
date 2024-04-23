<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import {
  songdetail,
  personalized,
  personalizednewsong,
  personalizednewest,
  personalizedbanner,
} from "../api";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { userStore } from "../stores";
const router = useRouter();
const user = userStore();
const newsong: any[] = reactive([]);
const playlist: any[] = reactive([]);
const newest: any[] = reactive([]);
const banners: any[] = reactive([]);
onMounted(async () => {
  setTimeout(async () => {
    let res = await personalizedbanner();
    banners.push(...res.data.banners);
    console.log(res);

    res = await personalizednewsong();
    newsong.push(...res.data.result);
    // console.log(newsong);

    res = await personalized();
    playlist.push(...res.data.result);
    // console.log(playlist)

    res = await personalizednewest();
    newest.push(...res.data.albums);
    }, 500);
});

const bannerhandle = async function (banner: any) {
  if (banner.targetType == 1) {
    let res = await songdetail(banner.targetId, user.cookie);
    router.push(`/detaillist/${res.data.songs[0].al.id}/ALBUM`);
    // 新歌首发
    console.log(banner.targetId);
  } else if (banner.targetType == 3000) {
    // 独家策划
    console.log(banner.url);
    let a = document.createElement("a");
    a.href = banner.url;
    a.target = "_blank";
    a.click();
  } else if (banner.targetType === 10) {
    // 新碟首发
    console.log(banner.targetId);
    router.push(`/detaillist/${banner.targetId}/ALBUM`);
  }
};

const leftlist = function (bool: boolean) {
  let div = document.getElementById("leftlist");
  if (div && bool) {
    // div.scrollLeft = div.scrollLeft + 240
    div.scrollTo({
      left: div.scrollLeft + 220,
      behavior: "smooth",
    });
  } else if (div && !bool) {
    div.scrollTo({
      left: div.scrollLeft - 220,
      behavior: "smooth",
    });
  }
};

const goplaylist = function (id: number) {
  router.push({ path: `/detaillist/${id}/PLAYLIST` });
};
</script>

<template>
  <div style="width: 100%; height: 100%; overflow: hidden; overflow: scroll">
    <el-carousel
      style="width: 100%; height: auto; border-radius: 10px"
      :interval="4000"
      arrow="always"
    >
      <el-carousel-item
        @click="bannerhandle(item)"
        v-for="item in banners"
        style="
          border-radius: 10px;
          width: 100%;
          cursor: pointer;
          display: flex;
          justify-content: center;
        "
      >
        <div
          style="
            width: 99%;
            text-align: center;
            position: relative;
            border-radius: 10px;
          "
        >
          <img
            style="width: 100%; object-fit: cover; border-radius: 10px"
            :src="item.imageUrl"
          />
          <div
            style="
              position: absolute;
              z-index: 20;
              top: 90%;
              left: 20px;
              font-size: 12px;
              color: black;
              background-color: rgba(223, 223, 223, 1);
              padding: 2px;
              border-radius: 10px;
            "
          >
            {{ item.typeTitle }}
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div style="width: 100%; height: 20px"></div>
    <div
      style="
        width: 100%;
        height: 300px;
        background-color: rgba(123, 123, 123, 0.1);
        border-radius: 10px;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          font-weight: bold;
          font-size: 20px;
          margin-left: 10px;
        "
      >
        推荐歌单
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
        "
      >
        <el-button
          text
          style="width: 20px; height: 250px"
          @click="leftlist(false)"
          :icon="ArrowLeft"
        />
        <div
          id="leftlist"
          style="
            display: flex;
            flex-direction: row;
            width: calc(100% - 50px);
            height: 250px;
            overflow: hidden;
            margin-left: 5px;
            margin-right: 5px;
            transition: all 0.3s linear;
          "
        >
          <div
            @click="goplaylist(item.id)"
            v-for="item in playlist"
            style="
              border-radius: 10px;
              background-color: white;
              margin: 0px 10px 0px 10px;
              cursor: pointer;
            "
          >
            <img
              :src="item.picUrl"
              style="width: 200px; height: 200px; border-radius: 10px"
            />
            <div
              style="
                width: 200px;
                height: 40px;
                font-size: 14px;
                color: black;
                text-overflow: ellipsis;
                overflow: hidden;
                text-wrap: nowrap;
                padding-left: 10px;
                padding-top: 10px;
                box-sizing: border-box;
              "
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <el-button
          text
          style="width: 20px; height: 250px"
          @click="leftlist(true)"
          :icon="ArrowRight"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
