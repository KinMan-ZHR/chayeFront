<template>
    <div style="width: 100%; background-color: white; display: flex;justify-content: center;">
        <div style="width: 1280px;padding: 24px;">
            <div style="width: 100%;">
                <p style="font-size: 20px;line-height: 32px;">数据管理</p>
                <div style="width: 100%;height: 20px;"></div>
                <DataCopy></DataCopy>
                <div style="width: 100%;"></div>
                <DataUpdate></DataUpdate>
            </div>
        </div>
    </div>
</template>

<script>
import DataCopy from './DataCopy.vue'
import DataUpdate from './DataUpdate.vue'
export default{
    name:'DataManage',
    components:{
        DataCopy,
        DataUpdate
    },
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>

<style scoped>

</style>