import { createRouter,createWebHashHistory} from "vue-router";
const routes = [
    {
        path:'/',
        redirect:'/recommend'
    },
    {
        path:'/mycollection',
        component:()=>import('./../view/mycollection.vue'),
    },
    {
        path:'/download',
        component:()=>import('./../view/download.vue'),
    },
    {
        path:'/lastplayed',
        component:()=>import('./../view/lastplayed.vue'),
    },
    {
        path:'/localmusic',
        component:()=>import('./../view/localmusic.vue'),
    },
    {
        path:'/mylike',
        component:()=>import('./../view/mylike.vue'),
    }, 
    {
        path:'/recommend',
        component:()=>import('./../view/recommend.vue'),
    },
    {
        path:'/musicplay',
        component:()=>import('./../view/musicplay.vue'),
    },
    {
        path:'/searchmusic/:search',
        component:()=>import('./../view/searchmusic.vue'),
        props: (route:any) =>({ search:route.params.search }),
    },
    {
        path:'/detaillist/:id/:type',
        component:()=>import('./../view/detaillist.vue'),
    },

]

const router = createRouter({
    routes:routes,
    history:createWebHashHistory()
})

export default router;