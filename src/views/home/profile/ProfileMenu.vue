<template>
    <div class="menu-container">

      <!-- 头像上传组件 -->

        <div style="text-align: center; padding: 32px 0px 0px 0px;width: 100%;">
          <t-upload
              :request-method="requestMethod1"
              :before-upload="beforeUpload"
              v-model="file1"
              theme="custom"
              accept="image/*"
          >
            <img v-if="userinfo.avatar" :src="userinfo.avatar" style="object-fit: cover;border-radius: 999px;width: 96px;height: 96px;"  alt="头像"/>
            <div v-else style="border-radius: 999px;width: 96px;height: 96px;background-color: #ffe6ce;"  alt="头像"></div>
          </t-upload>
          <div class="edit-container">
            <t-icon name="camera" color="rgba(133, 142, 189, 1)"/>
          </div>
        </div>
        <div class="username">
            {{ userinfo.username }}
        </div>

        <div class="note" style="text-align: center;">最后更新 {{ userinfo.lastUpdate }}</div>

        <div style="margin-top: 16px; padding: 0px 24px;">
            <div class="menu-item-container">
                <div style="display:flex ;">
                    <div class="menu-icon-container" style="">
                        <t-icon name="user" color="white" size="24px"/>
                    </div>
                    <div style="margin-left: 16px;font-size: 14px;display: flex;align-items: center;" >个人信息</div>
                </div>
            </div>
        </div>

        <div style="margin-top: 16px; padding: 0px 24px;">
            <div class="menu-item-container" style="cursor: pointer;" @click="onClickChangePassword">
                <div style="display:flex ;">
                    <div class="menu-icon-container" >
                        <t-icon name="user-password" size="24px" color="white"/>
                    </div>
                    <div style="margin-left: 16px;font-size: 14px;display: flex;align-items: center;" >修改密码</div>
                </div>
            </div>
        </div>


        <t-dialog
        v-model:visible="modifyPassword_visible"
        header="密码修改"
        width="40%"
        :on-confirm="onConfirmModify"
      >
        <t-space direction="vertical" style="width: 100%">
          <t-form>
            <t-form-item label="原密码" name="original_password">
              <t-input  placeholder="请输入原密码" type="password" v-model:value="password_fromData.original_password"/>
            </t-form-item>
            <t-form-item label="新密码" name="new_password">
              <t-input :status="isOriginalPasswordSameAsNewPassword || isNotInputNewPassword? 'warning' : 'success'" :tips="isOriginalPasswordSameAsNewPassword || isNotInputNewPassword? '新密码与原密码相同or未输入新密码' : ''" placeholder="请输入新密码" type="password" v-model:value="password_fromData.new_password"/>
            </t-form-item>
            <t-form-item label="确认新密码" name="new_password_confirm">
              <t-input :status="isNewPasswordSameAsConfirmPassword && !isNotInputNewPassword? 'success' : 'warning'" :tips="isNewPasswordSameAsConfirmPassword && !isNotInputNewPassword? '' : '两次输入的新密码不同or未输入新密码'" placeholder="请确认新密码" type="password" v-model:value="password_fromData.new_password_confirm"/>
            </t-form-item>
          </t-form>
        </t-space>
      </t-dialog>

    </div>
</template>


<script  setup>
import '../../../assets/css/index.css'
import {useUserStore} from "@/dataStore/userdata";
import {MessagePlugin} from "tdesign-vue-next";
// eslint-disable-next-line no-unused-vars
import {editAvatarAPI, editPasswordAPI} from "@/apis/usersHandler";
// eslint-disable-next-line no-unused-vars
import {reactive, ref} from "vue";
import { computed, watch } from 'vue';
//todo 没有头像时，显示默认头像
const modifyPassword_visible = ref(false)
const password_fromData = reactive({
  original_password:'',
  new_password:'',
  new_password_confirm:''

})
const file1 = ref([]);
// eslint-disable-next-line no-unused-vars
const userinfo =useUserStore().userInfo;
// eslint-disable-next-line no-unused-vars
const beforeUpload = async(file) => {
  console.log('file', file);
  if (file.size > 5 * 1024 * 1024) {
    await MessagePlugin.warning('上传的图片不能大于5M');
    return false;
  }
  return true;
};
//todo 上传头像和id
// eslint-disable-next-line no-unused-vars
const requestMethod1 = async (file) => {
  console.log('file',file);
  const formData = new FormData();
  formData.append('id', userinfo.id);
  formData.append('avatar', file.raw);
  try {
    const response = await editAvatarAPI(formData);
    if (response.data.code === 200) {
      userinfo.avatar = response.data.coredata.url;
      userinfo.lastUpdate=response.data.coredata.user.lastUpdate;
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

};

const onClickChangePassword = () => {
  modifyPassword_visible.value = true
}


// 校验是否未输入新密码
const isNotInputNewPassword = computed(() => {
  return password_fromData.new_password === ''
})

// 校验原密码和新密码是否相同
const isOriginalPasswordSameAsNewPassword = computed(() => {
  return password_fromData.original_password === password_fromData.new_password
})

// 校验两次输入的新密码是否相同
const isNewPasswordSameAsConfirmPassword = computed(() => {
  return password_fromData.new_password === password_fromData.new_password_confirm
})

// 校验表单是否有效
const isFormValid = computed(() => {
  return !isOriginalPasswordSameAsNewPassword.value && isNewPasswordSameAsConfirmPassword.value && !isNotInputNewPassword.value
})

// 监听表单输入的变化，实时更新校验结果
watch(password_fromData, () => {
  isOriginalPasswordSameAsNewPassword.value
  isNewPasswordSameAsConfirmPassword.value
  isNotInputNewPassword.value
  isFormValid.value
})

const onConfirmModify = async () =>{
  if(isFormValid.value){

    await editPasswordAPI(userinfo.id,password_fromData.original_password,password_fromData.new_password).then((response) => {
      if (response.data.code === 200) {
        modifyPassword_visible.value = false
      }
    });
  }else{
    console.log('提交失败');
  }
}

</script>

<style scoped>
.menu-container{
    background-color: white;
    border-radius: 8px;
    width: 320px;
    padding-bottom: 32px;
}
.username{
    text-align: center;
    font-size: 18px;
    line-height: 24px;
}
.edit-container{
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color:white;
    box-shadow: 0px 4px 16px  rgba(179, 192, 231, 0.32);
    position: relative;
    top: -29px;
    left: 179px;
    z-index: 999;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-item-container{
    width: 262px;
    border-radius: 8px;
    background-color: white;
    padding: 8px;
    box-shadow: 0px 4px 16px  rgba(179, 192, 231, 0.32);
}

.menu-item{

}

.menu-icon-container{
    width: 40px; height: 40px; border-radius: 8px;
    display: flex;justify-content: center;align-items: center;
    background-color: var(--td-brand-color-4);
}




</style>