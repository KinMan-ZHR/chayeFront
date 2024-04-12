<template>
    <div>
        <ManageWenMingToutiao></ManageWenMingToutiao>
        <ManageWenMingHaoren></ManageWenMingHaoren>
        <ManageWenMingMofan></ManageWenMingMofan>
    </div>
</template>

<script>
import ManageWenMingToutiao from './ManageWenMingToutiao.vue'
import ManageWenMingHaoren from './ManageWenMingHaoren.vue'
import ManageWenMingMofan from './ManageWenMingMofan.vue'

export default{
    name:'ManageWenMing',
    components:{
        ManageWenMingToutiao,
        ManageWenMingHaoren,
        ManageWenMingMofan
    }
}

</script>