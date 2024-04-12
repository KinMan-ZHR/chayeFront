<template>
    <div class="all" >
        <div class="center">
            <div style="display: flex;">
                <div class="bar"></div>
                <p class="title">公益广告</p>
                <div class="tab">
                    <t-space>
                    <t-radio-group v-model="theme" variant="default-filled" @change="onChangeRatio">
                        <t-radio-button value="video">视频</t-radio-button>
                        <t-radio-button value="image">图片</t-radio-button>
                    </t-radio-group>
                    </t-space>
                </div>
            </div>
            <!-- 视频型广告 -->
            <div v-if="theme == 'video'">
                <div style="margin: 10px;">
                    <t-space :breakLine="true" size="26.66px">
                        <t-card v-for="(item,index) in current_page" :key="index" :cover="item.cover" bordered :style="{ width: '400px', cursor: 'pointer' }" hoverShadow="true" @click="onClickVideo(index)">
                            <template #footer>
                                <div style="display: flex;"><p>{{ item.title }}</p></div>
                                <div style="display: flex;justify-content: center;">
                                    <div style="position: absolute; top: calc(50% - 47px);">
                                        <t-icon name="play-circle" color="#ffffff" size="48px"></t-icon>
                                    </div>
                                </div>
                            </template>
                        </t-card>
                    </t-space>
                </div>
                <!-- <div style="margin-left: 25px;margin-right: 15px;padding-bottom: 10px;">
                    <t-pagination
                        :total="video_advertisement.length"
                        showJumper
                        showFirstAndLastPageBtn
                        :showPageSize="false"
                        showPreviousAndNextBtn
                        totalContent
                        pageSize="9"
                        @change="onChangeVideoPagination"
                    />
                </div> -->
            </div>
            <!-- 图片型的广告 -->
            <div v-if="theme == 'image'">
                <div style="margin: 10px;">
                    <t-space :breakLine="true" size="26.66px">
                        <t-card v-for="(item,index) in current_page" :key="index" :cover="item.image" bordered :style="{ width: '400px', cursor: 'pointer' }" hoverShadow="true" @click="onClickToReadImageAd(index)">
                            <template #footer>
                                <p class="biaoti">{{ item.title }}</p>
                            </template>
                        </t-card>
                    </t-space>
                </div>
            </div>
            <div style="margin-left: 25px;margin-right: 15px;padding-bottom: 10px;">
                <t-pagination
                    v-model="current"
                    v-model:pageSize="pageSize"
                    :total="total"
                    showJumper
                    showFirstAndLastPageBtn
                    :showPageSize="false"
                    showPreviousAndNextBtn
                    totalContent
                    @change="onChangePagination"
                />
            </div>
            <div style="height: 50px;width: 100%;"></div>
        </div>
        <t-dialog
            :footer="false"
            preventScrollThrough
            showOverlay
            placement="center"
            v-model:visible="visible"
            width="1080px"
            header="视频播放"
            theme="info"
            >
            <WenZhangVideo :current_video="current_video" :is_play="visible"></WenZhangVideo>
        </t-dialog>

        <t-dialog
            v-model:visible="article_visible"
            header="文章详情"
            body="对话框内容"
            :cancel-btn="null"
            width="90%"
            top="50px"
            :confirm-btn="null"
        >
        <template #header>
            <t-icon name="component-space"></t-icon>
            <p>文章详情</p>
        </template>
            <WenZhang :current_article="current_article"></WenZhang>
        </t-dialog>
    </div>
</template>

<script>
import { ref } from 'vue';
import WenZhangVideo from '../../../../components/WenZhangVideo.vue';
import WenZhang from '../../../../components/WenZhang.vue';
import {getCharityVideoListAPI} from "@/apis/videoHandler";
import {getAdPicListAPI} from "@/apis/adPicHandler";
//已解决todo 将视频广告与图片广告合并简化代码，取消chunkArray函数,因为后端只返回相应的列表



export default{
    name:'GongYiGuangGao',
    components:{
        WenZhangVideo,
        WenZhang
    },
    data(){
        return{
          total: 100,
          current: 1,
          pageSize: 12,

            theme : ref('video'),

            current_page:[],
            visible:false,

            current_video_index:0,

            article_visible:false,

            current_article:{
                title:'文章标题1',
                time:'2024-03-01',
                source:'新华社',
                text:'必须把坚持高质量发展作为新时代的硬道理”——习近平总书记在去年中央经济工作会议上深刻总结新时代做好经济工作的“五个必须”规律性认识，其中这个“硬道理”居于首位。\n今年是新中国成立75周年，是实现“十四五”规划目标任务的关键一年。在这个重要年份召开的全国两会，如何聚焦高质量发展这个硬道理，进一步擘画出推进高质量发展的路线图、施工图，备受各方关注。',
                image:'https://tdesign.gtimg.com/site/source/card-demo.png'
            },

            current_video:{
                title:'2014央视公益广告《筷子》',
                cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
                link:'https://a5462a0a00cdede2829495b47fe56c8d.v.smtcdns.com/om.tc.qq.com/Aa_KRUeGlCQVO8R2dxyK9y78R_5lY-wMqk0Znz4oG6bU/B_JxNyiJmktHRgresXhfyMepNBqUi0rNULHXmHzThTLbhct0S7J8ZEOLI9qBzc0jb7/svp_50001/szg_78308739_50001_3a304177e8224eecbf7f2bde40edcc26.f632.mp4?sdtfrom=v1010&guid=524690aa801f54d6&vkey=33B39EB894F0C6B147B9AFAF11939409A558F07C0E2BA57C0CAADE4E5BC0CC2D2D689A01F050EC0303CC7EC743FEC9FCBA2AF4D409BE9337BCB2DD63B9E666E0D0ACF4F04361683390532AB60FCB03782172E38A3B016CFC8C74D8F9E1C708C0657C1E0D29B94FD4D354FAE5C3DA722514BD2E5580B9D6982818701459F1EE28FE7A8D41567B807D6D8EBEA9583BAC2D9D2AB230187E98CD8D99BFC5204F98910292285CF6F5D07B',
                description:'2014央视公益广告《筷子》',
                date:'2018-12-05'
            },

            current_theme:'video',
        }
    },
    methods:{

        // 分页变化时触发,分页大小固定12
        async onChangePagination(e){
            this.current = e.current
            if(this.current_theme === 'video'){
                await getCharityVideoListAPI(this.pageSize,this.current).then(res=>{
                    if(res.status === 200){
                        this.current_page = res.data.coredata.videoList
                        this.total = res.data.coredata.total
                    }
                })
            }else{
                await getAdPicListAPI(this.pageSize,this.current).then(res=>{
                    if(res.status === 200){
                        this.current_page = res.data.coredata.adPicList
                        this.total = res.data.coredata.total
                    }
                })
            }
        },


        onClickVideo(index){
            this.current_video = this.current_page[index],
            this.visible = true
        },

        onClickToReadImageAd(index){
            this.current_article = this.current_page[index]
            this.article_visible = true
        },

        async getCurrentList(pageSize,current,theme){
            console.log(pageSize,current);
            this.current_theme = theme
            if(theme === 'video'){
                this.current =1
              await getCharityVideoListAPI(this.pageSize,this.current).then(res=>{
                if(res.status === 200){
                    this.current_page = res.data.coredata.videoList
                    this.total = res.data.coredata.total
                }
              })
            }
            if(theme === 'image'){
                this.current =1
              await getAdPicListAPI(this.pageSize,this.current).then(res=>{
                if(res.status === 200){
                    this.current_page = res.data.coredata.adPicList
                    this.total = res.data.coredata.total
                }
              })

            }

        },

        onChangeRatio(e){
            this.theme = e
            this.getCurrentList(this.pageSize,this.current,this.theme)
        }

    },
    mounted(){
        this.getCurrentList(this.pageSize,this.current,this.theme)
    }
}
</script>

<style scoped>
.bar{
    height: 25px;
    width: 5px;
    background-color: red;
    margin-top: 27px;
    margin-left: 25px;
}
.title{
    font-size: 20px;
    font-weight: bold;
    margin-top: 25px;
    margin-left: 10px;
}
.tab{
    margin-top: 25px;
    margin-left: 79%;
}
.all{
    background-color: white;
    height: calc(100vh - 74px);
    width: 100%;
    justify-content: center;
    display: flex;
}
.center{
    background-color: white;
    width: 1280px;
    justify-content: center;
    align-items: center;
}
.biaoti{
    font-size: 15px;
    font-weight: bold;
}
</style>