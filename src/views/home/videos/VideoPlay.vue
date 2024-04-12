<template>
  <div class="container">
    <div style="padding: 24px 32px;">
      视频播放
    </div>
    <div style="display: flex;">
      <div style="width: 100%; padding: 0 32px;">
        <video width="100%" controls v-if="is_play" id="root" @ended="handleVideoEnded">
          <source :src="chosedVideo" type="video/mp4">
        </video>
      </div>
      <div style="position: absolute;right: 0;bottom: 50%;">
        <t-button theme="default" variant="outline" @click="handleClick" size="24px" shape="square">
          <t-icon name="chevron-left-rectangle" size="large"></t-icon>
        </t-button>
      </div>
    </div>


    <t-drawer
      :closeBtn="true"
      :footer="false"
      mode="overlay"
      v-model:visible="visible"
      header="播放列表"
      :show-in-attached-element="true"
    >
      <div>
        <t-table
          row-key="index"
          :columns="columns"
          :data="data"
          :loading="loading"
          drag-sort="row-handler"
          lazy-load
          activeRowType="single"
          @drag-sort="onDragSort"
          @active-change="onClickVideo"
        >
        </t-table>
      </div>
    </t-drawer>
  </div>
</template>

<script lang="jsx">
import { ref } from 'vue';
import {  MoveIcon } from 'tdesign-icons-vue-next';
import {changeVideoListAPI, getVideoListAPI} from "@/apis/videoHandler";
import {useUserStore} from "@/dataStore/userdata";
//todo 当没有视频列表时显示暂无视频源，而不是报错,加载时显示loading

export default{
  name:'VideoPlay',
  setup(){
    const visible = ref(false);
    const handleClick = () => {
      visible.value = true;
    };
    return{
      visible,
      handleClick,
    }
  },
  data(){
    return{
      videoList:[],
      is_play:{
          type:Boolean,
          default:true
      },
      chosedVideo:'',
      columns: [
        {
          colKey: 'drag',
          title: '排序',
          cell: (h) => {
            return h('span', [h(MoveIcon)]);
          },
          width: 15,
        },
        { colKey: 'video',
          title: '视频',
          width: '100' ,
          cell: (h, { row }) => {
            return(
              <t-card cover={this.videoList[row.video].cover} bordered footer={this.videoList[row.video].title} style="{ width: '260px', cursor: 'pointer' }" hoverShadow="true">
              </t-card>
            )
          }
        },
      ],
      loading: false,
      initialData: [],
      data:[]
    }
  },
  methods:{
    onDragSort(params) {
      console.log('交换行', params);
      this.data = params.newData;
      let currentId = this.videoList[params.currentIndex].id
      let targetId = this.videoList[params.targetIndex].id

      changeVideoListAPI(currentId,targetId);
    },

    handleVideoEnded(){
      // console.log('播放结束');
      // 获取当前播放视频的index
      let currentVideoIndex = this.videoList.findIndex(item => item.link === this.chosedVideo);
      let length = this.videoList.length;
      if(currentVideoIndex === length-1){
        this.chosedVideo = this.videoList[0].link;
      }else{
        this.chosedVideo = this.videoList[currentVideoIndex+1].link;
      }
      let player = document.querySelector('#root')
      player.src = this.chosedVideo
      player.play()
    },

    onClickVideo(e){
      if(e.length!==0){
        var rowid = e[0]-1
        this.chosedVideo = this.videoList[rowid].link;
        let player = document.querySelector('#root')
        player.src = this.chosedVideo
        player.play()
      }
    },

    async getVideoList(){
      // 获取videoList
      // this.videoList=[
      //   {
      //       title:'2014央视公益广告《筷子》',
      //       cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
      //       link:'https://a5462a0a00cdede2829495b47fe56c8d.v.smtcdns.com/om.tc.qq.com/Aa_KRUeGlCQVO8R2dxyK9y78R_5lY-wMqk0Znz4oG6bU/B_JxNyiJmktHRgresXhfyMepNBqUi0rNULHXmHzThTLbhct0S7J8ZEOLI9qBzc0jb7/svp_50001/szg_78308739_50001_3a304177e8224eecbf7f2bde40edcc26.f632.mp4?sdtfrom=v1010&guid=524690aa801f54d6&vkey=33B39EB894F0C6B147B9AFAF11939409A558F07C0E2BA57C0CAADE4E5BC0CC2D2D689A01F050EC0303CC7EC743FEC9FCBA2AF4D409BE9337BCB2DD63B9E666E0D0ACF4F04361683390532AB60FCB03782172E38A3B016CFC8C74D8F9E1C708C0657C1E0D29B94FD4D354FAE5C3DA722514BD2E5580B9D6982818701459F1EE28FE7A8D41567B807D6D8EBEA9583BAC2D9D2AB230187E98CD8D99BFC5204F98910292285CF6F5D07B',
      //       description:'2014央视公益广告《筷子》',
      //       date:'2018-12-05',
      //   },
      //   {
      //       title:'公益广告五分钟',
      //       cover:'https://tdesign.gtimg.com/site/source/card-demo.png',
      //       link:'https://apd-ugcvlive.apdcdn.tc.qq.com/om.tc.qq.com/AOxPyqZIzzHh521WwmMm3bJZefCoGzVKkQwRdr17m2Ew/B_JxNyiJmktHRgresXhfyMeo8fixGnaMJkCgsHKywTKlUvVsev9UdHRN_1kp6emuQq/svp_50200/njc_1000195_0bc3aicbgaaeluacjwmvvzrryawecmbaie2a.f2.mp4?sdtfrom=v1010&guid=e91979b79120cd89&vkey=63508C3A90D02AF43851A0631DBA911DE9486F2B8B2651CC44252CFE857481ACFD82D72C3E5B42E40C19F4BF0B4DBEA82ACDE69196019FA7771E5B619D0E173B266F81572C2E7CC6643D4D73DA106C15A1FEBE5BE384536AFDC73A01EB6322EC3B4E7A0CBD214CE948B808B311ED2FD363AB2D48ABC2A559042527EAEA1043FEC692AD39BB692195A6B8BEA1BF1AFC14F98662A37B9F0F24DD578979B44B372E41C3EC0791FF9214',
      //       description:'公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟公益广告五分钟',
      //       date:'2018-12-05',
      //   },
      // ]
      await getVideoListAPI(useUserStore().userInfo.id).then(res=>{
        this.videoList=res.data.coredata.videoList;
        if(this.chosedVideo.length!==0){
          this.chosedVideo = this.videoList[0].link;
          this.processVideoListToFitTable()
        }
      })
    },

    processVideoListToFitTable(){
      // 处理videoList
      for (let i = 0; i < this.videoList.length; i++) {
          this.initialData.push({
            index: i + 1,
            video: i,
          });
        }
      this.data = ref([...this.initialData]);
    },

    // beforeUnloadHandler() {
    //   // 在用户关闭页面前执行的操作
    //   // 可以在这里调用你的函数
    //   var video_id = [];

    //   for (let i = 0; i < this.data.length; i++) {
    //     var video = this.data[i].video
    //     video_id.push(this.videoList[video].id)
    //   }
    //   console.log('video_id', video_id);

    //   // TODO（交互）：上传到数据库



    // },

  },
  mounted(){
    // window.addEventListener('beforeunload', this.beforeUnloadHandler);

  },
  created(){
    // 获取播放列表的数据
    this.getVideoList()

  },

  // beforeUnmount() {
  //   window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  // }
}
</script>

<style scoped>
.container{
  /* display: flex; */
  width: 100%;
  height: calc(100vh - 74px);
  background-color: white;
  /* margin: 20px; */
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>