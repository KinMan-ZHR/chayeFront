// 用于配置路由规则
import {createRouter, createWebHashHistory} from 'vue-router'

// const login = () => import('@/views/login/Login.vue')
// const app_page = () => import('@/App.vue')
import WenmingSichuan from '@/components/WenmingSichuan.vue'
import ZhiyuanSichuan from '@/components/ZhiyuanSichuan.vue'
import ActivitiesAndAd from '@/views/home/zhiyuan/advertisement/ActivitiesAndAd.vue'
import LoginView from "@/views/login/Login.vue"
import HomeView from '@/views/home/Home.vue'
import VideoPlay from '@/views/home/videos/VideoPlay.vue'
import InformationPub from '@/views/home/videos/InformationPub.vue'
import MyProfile from '@/views/home/profile/MyProfile.vue'
import ZhiyuanProject from '@/components/ZhiyuanProject.vue'
import XinxiDongtai from '@/components/XinxiDongtai.vue'
import XuanchuanVideo from '@/components/XuanchuanVideo.vue'
import HuodongMap from '@/components/HuodongMap.vue'
import GongyiHuodong from '@/views/home/zhiyuan/advertisement/GongyiHuodong.vue'
import GongyiGuanggao from '@/views/home/zhiyuan/advertisement/GongyiGuanggao.vue'
import UserManage from '@/views/dataCenter/UserManage.vue'
import DataManage from '@/views/dataCenter/core/DataManage.vue'
import SystemInformation from '@/components/SystemInformation.vue'

// import TestVueVue from '@/views/home/Testview.vue'


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/home',
        name:'home',
        component: HomeView ,
        // path: '/testview',
        // username:'testview',
        // component: TestVueVue ,
        children:[
            {
                path: '/',
                redirect: '/wenming'
            },
            {
                path: '/wenming',
                component: WenmingSichuan,
                children:[
                    {
                        path: '/wenming',
                        component:WenmingSichuan
                    }
                ]
            },
            {
                path: '/zhiyuan',
                component: ZhiyuanSichuan,
                children:[
                    {
                        path: '/zhiyuan',
                        redirect:'/zhiyuan/zyprojectshall'
                    },
                    {
                        path: '/zhiyuan/zyprojectshall',
                        name: 'zyprojectshall',
                        component:ZhiyuanProject,
                    },
                    {
                        path: '/zhiyuan/zyinformation',
                        name: 'zyinformation',
                        component:XinxiDongtai,
                    },
                    {
                        path: '/zhiyuan/zyvideo',
                        name: 'zyvideo',
                        component:XuanchuanVideo
                    },
                    {
                        path: '/zhiyuan/zyactivitiesmap',
                        name: 'zyactivitiesmap',
                        component:HuodongMap
                    }
                ]
            },
            {
                path: '/activities',
                component: ActivitiesAndAd,
                children:[
                    {
                        path: '/activities',
                        redirect:'/activities/gyactivities'
                    },
                    {
                        path: '/activities/gyactivities',
                        name:'gyactivities',
                        component: GongyiHuodong,
                    },
                    {
                        path: '/activities/gyadvertisement',
                        name:'gyadvertisement',
                        component: GongyiGuanggao
                    }
                ]
            },
            {
                path: '/videoplay',
                component: VideoPlay,
                children:[
                    {
                        path: '/videoplay',
                        component: VideoPlay,
                    }

                ]
            },
            {
                path: '/informationpub',
                component: InformationPub,
                children:[
                    {
                        path: '/informationpub',
                        component: InformationPub,
                    }

                ]
            },
            {
                path: '/myprofile',
                component: MyProfile,
                children:[
                    {
                        path: '/myprofile',
                        name: 'myprofile',
                        component: MyProfile,
                    }

                ]
            },
            {
                path:'/usermanage',
                component:UserManage,
                children:[
                    {
                        path:'/usermanage',
                        component:UserManage,
                    }
                ]
            },
            {
                path:'/datamanage',
                component:DataManage,
                children:[
                    {
                        path:'/datamanage',
                        component:DataManage,
                    }
                ]
            },
            {
                path:'/systeminfo',
                component:SystemInformation,
                children:[
                    {
                        path:'/systeminfo',
                        component:SystemInformation,
                    }
                ]
            }
        ]
    }


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

