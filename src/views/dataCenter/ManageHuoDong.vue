<template>
    <div>
        <ManageGongyiHuodong></ManageGongyiHuodong>
        <ManageGongyiGuanggao></ManageGongyiGuanggao>
    </div>
</template>

<script>
import ManageGongyiHuodong from './ManageGongyiHuodong.vue'
import ManageGongyiGuanggao from './ManageGongyiGuanggao.vue'

export default{
    name:'ManageZhiYuan',
    components:{
        ManageGongyiHuodong,
        ManageGongyiGuanggao
    }
}

</script>