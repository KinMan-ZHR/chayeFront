<template>
    <div style="width: 100%; background-color: white; display: flex;justify-content: center;">
        <div style="width: 1280px;padding: 24px;">
            <!-- 标题区域 -->
            <div style="display: flex;">
                <div style="width: 1080px;">
                    <div style="line-height: 32px;">信息发布</div>
                    <div style="margin-top: 24px;">
                        <t-space :breakLine="true" size="13.33px">
                            <t-card v-for="(item,index) in userVideoList" :key="index" :cover="item.cover" bordered :style="{ width: '260px', cursor: 'pointer' }" :hoverShadow="true" @click="visible = true">
                                <template #footer>
                                    <div style="display: flex;"><p>{{ item.title }}</p></div>
                                    <div style="display: flex;justify-content: center;">
                                        <div style="position: absolute; top: calc(50% - 47px);">
                                            <t-icon name="play-circle" color="#ffffff" size="48px" @click="onClickToPlayUploadedVideo(index)"></t-icon>
                                        </div>
                                    </div>

                                    <!-- 气泡确认框 -->
                                    <t-popconfirm content="确认删除吗" @confirm="onConfirmDelete(index)">
                                        <div class="delete-btn-container">
                                            <t-icon name="delete" color="red" size="16px"></t-icon>
                                        </div>
                                    </t-popconfirm>

                                </template>
                            </t-card>
                        </t-space>

                        <div v-if="userVideoList.length == 0">
                            <EmptyBox></EmptyBox>
                        </div>
                    </div>
                </div>
                <div style="flex-grow: 1;"></div>
                <div>
                    <t-upload
                        :multiple="true"
                        accept="video/*"
                        :request-method="requestMethod"
                        :before-upload="beforeUpload"
                        @success="successUpload"
                    />
                    <div style="margin-top:12px">
                        <t-button variant="outline" theme="primary" @click="onClickToChoseCloudVideo">
                            <template #icon> <t-icon name="cloud-upload" /></template>
                            云端视频
                        </t-button>
                    </div>

                </div>
            </div>
            <!-- <t-table
                row-key="index"
                :columns="columns"
                :data="data"
                :loading="loading"
                drag-sort="row-handler"
                lazy-load
                @drag-sort="onDragSort"
            ></t-table> -->
        </div>

        <t-dialog
            v-model:visible="cloud_list_visible"
            width="1147px"
            :on-confirm="onConfirmVideo"
            >
            <!-- 自定义header -->
            <template #header>
                <div style="display:flex">
                    <span style="display:flex;align-items:center"><t-icon name="cloud"></t-icon></span>
                    <span style="line-height:32px">云端视频</span>
                    <div style="width:36px;"></div>
                    <span>
                        <t-input placeholder="输入以搜索" v-model="searchKey">
                            <template #suffixIcon>
                                <t-icon name="search" :style="{ cursor: 'pointer' }" size="16px" @click="searchProject"/>
                            </template>
                        </t-input>
                    </span>
                </div>
            </template>

            <div>
                <t-space :breakLine="true" size="13.33px">

                    <t-card v-for="(item,index) in cloud_video_list" :key="index" :cover="item.cover" bordered :style="{ width: '260px', cursor: 'pointer' }" hoverShadow="true" >
                        <template #footer>
                            <div style="display: flex;"><p>{{ item.title }}</p></div>
                            <div style="position:absolute;top: 6px;right: 0;"><t-checkbox :value="index" :key="index" :label="index" v-model:checked="item.is_choosed" @change="onCheckVideo(index)"></t-checkbox></div>
                            <div style="display: flex;justify-content: center;">
                                <div style="position: absolute; top: calc(50% - 47px);">
                                    <t-icon name="play-circle" color="#ffffff" size="48px" @click="onClickToPlayVideo(index)"></t-icon>
                                </div>
                            </div>
                        </template>
                    </t-card>

                </t-space>

                <t-pagination
                    v-model:pageSize="pageSize"
                    :total="totalNum"
                    size="small"
                    :showPageSize="false"
                    @change="onChangeCloudListPage"

                />
            </div>


        </t-dialog>
        <t-dialog
            :footer="false"
            header="视频播放"
            preventScrollThrough
            showOverlay
            placement="center"
            v-model:visible="play_visible"
            width="1080px"
            theme="info"
            >
            <WenZhangVideo :current_video="current_video" :is_play="play_visible"></WenZhangVideo>
        </t-dialog>
    </div>
</template>

<script>
// import DragVue from './DragVue.vue'
// import { MoveIcon } from 'tdesign-icons-vue-next';
import WenZhangVideo from '../../../components/WenZhangVideo.vue'
import {deleteVideoListAPI, getCloudVideoListAPI, getVideoListAPI, searchVideoListAPI, upLoadVideoAPI} from "@/apis/videoHandler";
// eslint-disable-next-line no-unused-vars
import UploadTest from "@/test/UploadTest.vue";
import {useUserStore} from "@/dataStore/userdata";
import EmptyBox from '../../../components/EmptyBox.vue';



export default{
    name:'InfomationPub',
    data(){
        return{
            userVideoList:[
            ],
            // 一定要给默认数据，为了防止报错。
            cloud_video_list:[
            {
                id:'111',
                title:'公益广告五分钟',
                cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
                link:'https://apd-ugcvlive.apdcdn.tc.qq.com/om.tc.qq.com/AOxPyqZIzzHh521WwmMm3bJZefCoGzVKkQwRdr17m2Ew/B_JxNyiJmktHRgresXhfyMeo8fixGnaMJkCgsHKywTKlUvVsev9UdHRN_1kp6emuQq/svp_50200/njc_1000195_0bc3aicbgaaeluacjwmvvzrryawecmbaie2a.f2.mp4?sdtfrom=v1010&guid=e91979b79120cd89&vkey=63508C3A90D02AF43851A0631DBA911DE9486F2B8B2651CC44252CFE857481ACFD82D72C3E5B42E40C19F4BF0B4DBEA82ACDE69196019FA7771E5B619D0E173B266F81572C2E7CC6643D4D73DA106C15A1FEBE5BE384536AFDC73A01EB6322EC3B4E7A0CBD214CE948B808B311ED2FD363AB2D48ABC2A559042527EAEA1043FEC692AD39BB692195A6B8BEA1BF1AFC14F98662A37B9F0F24DD578979B44B372E41C3EC0791FF9214',
                description:'公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟',
                date:'2018-12-05',
            },
            {
                id:'112',
                title:'公益广告五分钟',
                cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
                link:'https://apd-ugcvlive.apdcdn.tc.qq.com/om.tc.qq.com/AOxPyqZIzzHh521WwmMm3bJZefCoGzVKkQwRdr17m2Ew/B_JxNyiJmktHRgresXhfyMeo8fixGnaMJkCgsHKywTKlUvVsev9UdHRN_1kp6emuQq/svp_50200/njc_1000195_0bc3aicbgaaeluacjwmvvzrryawecmbaie2a.f2.mp4?sdtfrom=v1010&guid=e91979b79120cd89&vkey=63508C3A90D02AF43851A0631DBA911DE9486F2B8B2651CC44252CFE857481ACFD82D72C3E5B42E40C19F4BF0B4DBEA82ACDE69196019FA7771E5B619D0E173B266F81572C2E7CC6643D4D73DA106C15A1FEBE5BE384536AFDC73A01EB6322EC3B4E7A0CBD214CE948B808B311ED2FD363AB2D48ABC2A559042527EAEA1043FEC692AD39BB692195A6B8BEA1BF1AFC14F98662A37B9F0F24DD578979B44B372E41C3EC0791FF9214',
                description:'公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟',
                date:'2018-12-05',
            },
            ],

            cloud_list_visible:false,

            play_visible:false,

            current_video:{
                id:'111',
                title:'公益广告五分钟',
                cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
                link:'https://apd-ugcvlive.apdcdn.tc.qq.com/om.tc.qq.com/AOxPyqZIzzHh521WwmMm3bJZefCoGzVKkQwRdr17m2Ew/B_JxNyiJmktHRgresXhfyMeo8fixGnaMJkCgsHKywTKlUvVsev9UdHRN_1kp6emuQq/svp_50200/njc_1000195_0bc3aicbgaaeluacjwmvvzrryawecmbaie2a.f2.mp4?sdtfrom=v1010&guid=e91979b79120cd89&vkey=63508C3A90D02AF43851A0631DBA911DE9486F2B8B2651CC44252CFE857481ACFD82D72C3E5B42E40C19F4BF0B4DBEA82ACDE69196019FA7771E5B619D0E173B266F81572C2E7CC6643D4D73DA106C15A1FEBE5BE384536AFDC73A01EB6322EC3B4E7A0CBD214CE948B808B311ED2FD363AB2D48ABC2A559042527EAEA1043FEC692AD39BB692195A6B8BEA1BF1AFC14F98662A37B9F0F24DD578979B44B372E41C3EC0791FF9214',
                description:'公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟',
                date:'2018-12-05',
            },

            pageSize:12,

            totalNum:100,

            cloud_current:1,

            chosed_id:[],

            searchKey:'',

        }
    },
    components:{
        // DragVue
        WenZhangVideo,
        EmptyBox
    },
    methods:{
        async requestMethod(file){
            // console.log(file);

            const formData = new FormData();
            formData.append('file', file[0].raw);
            formData.append('id', useUserStore().userInfo.id);
        try {
            const response = await upLoadVideoAPI(formData);
            if (response.data.code === 200) {
            return {
                status: 'success',
                response: {
                    url: response.data.coredata.url,
                }
            };
            } else {
            return {status: 'fail', error: response.data.message, response};
            }
        } catch (error) {
            return {status: 'fail', error: error.message};
        }
        },

        beforeUpload(file){
            console.log(file);
            return true;
        },

        async getVideoList(){
            await getVideoListAPI(useUserStore().userInfo.id).then(res=>{
                if(res.data.code===200){
                    this.userVideoList=res.data.coredata.videoList;
                }
            })
        },

        // 获取云端视频列表
        async getCloudVideoList(){
          await getCloudVideoListAPI(this.pageSize,this.cloud_current).then(res=>{
            if(res.data.code===200){
              this.cloud_video_list=res.data.coredata.videoList;
              this.totalNum = res.data.coredata.total
            //   console.log("你好",this.cloud_video_list);
            }
          })
        },

        processCloudVideo(){
            // 为videoList的每个元素添加一个属性.
            for(var i = 0;i<this.cloud_video_list.length;i++){
                this.cloud_video_list[i].is_choosed = false
            }

            // 根据chosed_id，对cloud_video_list进行处理，若chosed_id为空不处理
            if(this.chosed_id.length === 0){
                return
            }

            for(var j = 0;i<this.cloud_video_list.length;i++){
                var id = this.cloud_video_list[j].id
                if(this.chosed_id.indexOf(id) !== -1){
                    this.cloud_video_list[j].is_choosed = true
                }
            }
        },

        onClickToChoseCloudVideo(){
            // 点击选择云端视频
            this.getCloudVideoList(this.cloud_current,this.pageSize)
            this.processCloudVideo()
            this.cloud_list_visible=true
        },

        onConfirmVideo(){
            var choosed_video_list = []
            choosed_video_list =  this.cloud_video_list.filter( item => item.is_choosed === true)
            // console.log(choosed_video_list);
            this.cloud_list_visible = false
            this.userVideoList = this.userVideoList.concat(choosed_video_list)
        },

        onConfirmDelete(index){
            // 确认删除视频
            console.log(index);
            var id = this.userVideoList[index].id
            this.userVideoList.splice(index,1)

            deleteVideoListAPI(id);
        },

        onClickToPlayVideo(index){
            // 点击播放视频
            this.current_video = this.cloud_video_list[index]
            this.play_visible = true
        },

        onClickToPlayUploadedVideo(index){
            // 点击播放已上传的视频
            // console.log(index);
            this.current_video = this.userVideoList[index]
            this.play_visible = true
        },

        onChangeCloudListPage(e){
            this.cloud_current = e.current
            // 根据current和pageSize动态获取云端视频列表
            this.getCloudVideoListByPage()

            // 获取列表后要根据用户已经选择的视频，对列表进行处理
            this.processCloudVideo()
        },


        // TODO（交互）：根据current和pageSize动态获取云端视频列表
        getCloudVideoListByPage(){
            this.getCloudVideoList();
        },


        onCheckVideo(index){
            // 选择视频
            var id = this.cloud_video_list[index].id
            if(this.cloud_video_list[index].is_choosed === true){
                // 用户选择了该视频
                this.chosed_id.push(id)
            }else{
                // 用户取消选择了该视频
                var index_temp = this.chosed_id.indexOf(id)
                this.chosed_id.splice(index_temp,1)
            }
        },

        // 上传视频成功
        successUpload(){
            console.log('上传成功');
            this.getVideoList();
        },

        // 搜索视频
        async searchProject(){
            this.cloud_current = 1
            await searchVideoListAPI(this.cloud_current,this.pageSize,this.searchKey).then((response) =>{
                if(response.data.code === 200){
                    this.cloud_video_list = response.data.coredata.videoList
                    this.totalNum = response.data.coredata.total
                }else{
                    console.log('搜索失败');

                }
            })

        }

    },
  mounted(){
    this.getVideoList()
  }



}

</script>

<style scoped>

.delete-btn-container{
    border-radius:8px;
    width:32px;
    height:32px;
    /* background-color:var(--td-gray-color-3); */
    display:flex;
    justify-content:center;
    align-items:center;
    position: absolute;
    top: 0;
    right: 0;

}

.delete-btn-container :hover{
    background-color: #e7e7e766;
    border-radius:4px;
    width:32px;
    height:32px;
    padding:0 8px;

}

</style>