<template>
    <div>
        <ManageZhiYuanProject></ManageZhiYuanProject>
        <ManageXinxiDongtai></ManageXinxiDongtai>
    </div>
</template>

<script>
import ManageZhiYuanProject from './ManageZhiYuanProject.vue'
import ManageXinxiDongtai from './ManageXinxiDongtai.vue'

export default{
    name:'ManageZhiYuan',
    components:{
        ManageZhiYuanProject,
        ManageXinxiDongtai
    }
}

</script>