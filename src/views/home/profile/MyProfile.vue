<template>
    <div style="padding: 24px 24px 0 32px; display: flex;">
        <ProfileMenu></ProfileMenu>
        <div style="width: 24px;"></div>
        <ProfileDetail></ProfileDetail>
    </div>
</template>

<script>
// import { Icon } from 'tdesign-icons-vue-next'
import ProfileMenu from './ProfileMenu.vue';
import ProfileDetail from './ProfileDetail.vue';

export default {
    components: {
        // Icon
        ProfileMenu,
        ProfileDetail
    },

    data() {
        return {

        }
    },
    methods: {

    }
}

</script>