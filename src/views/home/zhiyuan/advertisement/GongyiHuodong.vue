<template>
    <div style="display: flex;">
        <div class="left">
            <div style="display: flex;">
                <div class="bar"></div>
                <p class="title">公益活动</p>
            </div>
            <div style="margin: 10px;">
                <t-list>
                    <t-list-item v-for="(item,index) in gongyi_activities" :key="index" style="cursor:pointer" @click="onClickToReadGongyiArticle(index)">
                        <div style="display: flex;">
                            <div class="circle"></div>
                            <p>{{ item.title }}</p>
                        </div>
                        <template #action>
                            <p theme="primary" hover="color" style="margin-left: 16px"> {{ item.time }} </p>
                        </template>
                    </t-list-item>
                </t-list>
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
                    pageSize="15"
                    @change="onChangePagination"
                />
            </div>
        </div>

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
import WenZhang from '../../../../components/WenZhang.vue';
import {getActivityListAPI} from "@/apis/activitiesHandler";
export default{
    name:'XinXiDongTai',
    components:{
        WenZhang
    },
    data(){
        return{
           total: 100,
           current: 1,
           pageSize: 10,
            prompt:'https://i.postimg.cc/jqZjDpQq/prompt.png',
            gongyi_activities:[],
            dongtai_chunked:[],
            current_page:[],
            article_visible:false,
            current_article:{
                title:'文章标题2',
                time:'2024-03-01',
                source:'新华社',
                text:'必须把坚持高质量发展作为新时代的硬道理”——习近平总书记在去年中央经济工作会议上深刻总结新时代做好经济工作的“五个必须”规律性认识，其中这个“硬道理”居于首位。\n今年是新中国成立75周年，是实现“十四五”规划目标任务的关键一年。在这个重要年份召开的全国两会，如何聚焦高质量发展这个硬道理，进一步擘画出推进高质量发展的路线图、施工图，备受各方关注。',
                image:'https://ts1.cn.mm.bing.net/th/id/R-C.171e8fe1aa1544a1868ab710eed82d82?rik=FLPxvVVL9C9bnQ&riu=http%3a%2f%2fwww.pp3.cn%2fuploads%2fallimg%2f200710%2f14-200G00Z321.jpg&ehk=Lb0IHCCZIdqYQOi28m%2borU8c1ARGbTEC%2f8WYzfwRuHo%3d&risl=&pid=ImgRaw&r=0'
            },
        }
    },
    methods:{
        // 分页变化时触发,分页大小固定12
        async onChangePagination(e){
            this.current = e.current

            await getActivityListAPI(this.pageSize,this.current).then((response) => {
            if (response.data.code === 200) {
              this.gongyi_activities = response.data.coredata.activityList;
              this.total = response.data.coredata.total;
            }
          });

        },



        async getGongyiActivities(){
            // 从服务器获取
          await getActivityListAPI(this.pageSize,this.current).then((response) => {
            if (response.data.code === 200) {
              this.gongyi_activities = response.data.coredata.activityList;
              this.total = response.data.coredata.total;
            }
          });
        },

        onClickToReadGongyiArticle(index){
            this.current_article=this.gongyi_activities[index]
            this.article_visible = true;
        }

    },
    mounted(){
        this.getGongyiActivities()
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
.left{
    background-color: white;
    border-radius: 8px;
    width: 100%;
    margin: 24px;
}
.circle{
    width: 5px;
    height: 5px;
    background-color: #EDBA66;
    margin: 10px;
    border-radius: 100px;
}
</style>