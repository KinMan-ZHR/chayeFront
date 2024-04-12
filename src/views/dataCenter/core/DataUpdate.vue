<template>
    <div>
        <p style="font-size: 15px;line-height: 32px;">数据更新</p>
        <t-tabs v-model="value">
            <t-tab-panel :value="1" label="文明四川" :destroy-on-hide="false">
                <ManageWenMing />
            </t-tab-panel>
            <t-tab-panel :value="2" label="志愿四川" :destroy-on-hide="false">
                <template #panel>
                <ManageZhiYuan />
                </template>
            </t-tab-panel>
            <t-tab-panel :value="3" label="活动广告" :destroy-on-hide="false">
                <ManageHuoDong />
            </t-tab-panel>
            <t-tab-panel :value="4" label="信息发布" :destroy-on-hide="false">
                <ManageXinXi />
            </t-tab-panel>
        </t-tabs>
    </div>
</template>

<script>
import { ref } from "vue";
import ManageZhiYuan from '../ManageZhiYuan.vue';
import ManageWenMing from '../ManageWenMing.vue';
import ManageHuoDong from '../ManageHuoDong.vue';
import ManageXinXi from '../ManageXinXi.vue';

export default{
    name:'DataUpdate',
    components:{
        ManageZhiYuan,
        ManageWenMing,
        ManageHuoDong,
        ManageXinXi,
    },
    data(){
        return{
            value: ref(1),
        }
    }
}
</script>

<style scoped>

</style>