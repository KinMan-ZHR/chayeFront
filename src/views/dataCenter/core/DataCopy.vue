<template>
    <div>
        <p style="font-size: 15px;line-height: 32px;">数据备份</p>
        <t-button variant="outline" theme="primary" @click="copyData">下载sql文件</t-button>
    </div>
</template>

<script>

import {getBeifenAPI} from '@/apis/exportHandler.js'
export default{
    name:'DataCopy',
    data(){
        return{

        }
    },
    methods:{
        async copyData(){
            await getBeifenAPI().then((e) => {
                // console.log(e);
                if(e.data.code == 200){
                    var fileURL = e.data.coredata.fileURL
                    console.log(fileURL);
                    window.open(fileURL)
                }
            })

        }
    }
}
</script>

<style scoped>

</style>