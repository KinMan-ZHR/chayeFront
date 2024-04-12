<template>
        <!-- 表单区域 -->
  <div class="profile-detail-container">
    <!-- 标题区域 -->
    <div style="display: flex;">
      <p style="font-size: 16px; line-height: 32px;">个人信息</p>
      <div style="flex-grow: 1;"></div>
      <div>
        <t-button theme="primary" shape="round" variant="base" @click="save">保存</t-button>
      </div>
    </div>
    <div style="margin-top: 17px;">
      <div class="form-row-container">
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">名字</p>
          <t-input v-model="formData.username" :error="errors.username" disabled></t-input>
        </div>
        <div style="width: 24px; height: 15px;"></div>
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">性别</p>
          <t-select showArrow valueType="value" v-model="formData.sex" :error="errors.sex">
            <t-option key="male" label="男" value="男"/>
            <t-option key="female" label="女" value="女"/>
          </t-select>
        </div>
      </div>

      <div class="form-row-container" style="margin-top: 15px;">
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">婚姻状态</p>
          <t-select showArrow valueType="value" v-model:value="formData.maritalStatus" :error="errors.maritalStatus">
            <t-option key="married" label="已婚" value="已婚"/>
            <t-option key="unmarried" label="未婚" value="未婚"/>
            <t-option key="single" label="单身" value="单身"/>
          </t-select>
        </div>
        <div style="width: 24px;height: 15px;"></div>
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">出生年月</p>
          <t-date-picker v-model:value="formData.birthdate" :error="errors.birthdate" />
        </div>
      </div>

      <div class="form-row-container" style="margin-top: 15px;">
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">电子邮件地址</p>

            <t-input placeholder="请输入内容" v-model="formData.email" :error="errors.email" />
            <p class="error-message" :class="{ active: errors.email!=='' }">{{ errors.email }}</p>

        </div>
        <div style="width: 24px;height: 15px;"></div>
        <div class="form-row-item">
          <p class="font-normal" style="margin-bottom: 5px;">电话号码</p>
          <t-input type="tel" v-model="formData.tel" :error="errors.tel"/>
          <p class="error-message" :class="{ active: errors.tel!=='' }">{{ errors.tel }}</p>
        </div>
      </div>
    </div>


        <div style="font-size: 16px; line-height: 32px;margin-top: 23px;">个人地址</div>

        <div style="margin-top: 17px;">
            <div class="form-row-container" style="margin-top: 15px;">
                <div class="form-row-item">
                    <p class="font-normal" style="margin-bottom: 5px;">详细地址</p>
                    <t-input v-model="formData.address"></t-input>
                </div>
                <div style="width: 24px;height: 15px;"></div>
            </div>
        </div>

        <div style="font-size: 16px; line-height: 32px;margin-top: 23px;">个人简介</div>

        <div style="margin-top: 17px;">
            <div class="form-row-container" style="margin-top: 15px;">
                <div class="form-row-item" style="width:100%;">
                    <p class="font-normal" style="margin-bottom: 5px;">说明</p>
                    <t-textarea
                        placeholder="请输入文案，高度可自适应，最小5行，最大7行；autosize={minRows: 5, maxRows: 7}"
                        name="description"
                        :autosize="{ minRows: 5, maxRows: 7 }"
                        v-model="formData.statement"
                    />
                </div>
                <div style="width: 24px;height: 15px;"></div>
            </div>
        </div>



    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {ref, reactive, onMounted, watch} from 'vue';
// eslint-disable-next-line no-unused-vars
import { MessagePlugin } from 'tdesign-vue-next';
import {useUserStore} from "@/dataStore/userdata";
// eslint-disable-next-line no-unused-vars
import dayjs from 'dayjs';
import {editUserAPI} from "@/apis/usersHandler";
// 定义规则
export default {
  name: 'ProfileDetail',
  setup() {
    const formData = reactive({
      username: '',
      password: '',
      sex: '男',
      maritalStatus: '',
      birthdate: '',
      email: '',
      tel: '',
      address: '',
      statement: ''
    });
    const errors = ref({
      username: '',
      sex: '',
      maritalStatus: '',
      birthdate: '',
      email: '',
      tel: ''
    });

    const validationRules = {
      username: val => val ? '' : '名字不能为空',
      sex: val => val ? '' : '性别不能为空',
      maritalStatus: val => val ? '' : '婚姻状态不能为空',
      birthdate: val => val ? '' : '出生年月不能为空',
      email: val => /^\S+@\S+\.\S+$/.test(val) ? '' : '电子邮件地址格式不正确',
      tel: val => /^1[34578]\d{9}$/.test(val) ? '' : '电话号码格式不正确'
    };

    for (const key in validationRules) {
      watch(() => formData[key], (val) => {
        errors.value[key] = validationRules[key](val);
      });
    }


    const save = () => {
      console.log(errors)
      // 提交表单
      console.log('保存成功', formData);
      formData.id = userStore.userInfo.id;
      editUserAPI(formData).then((response) => {
            if (response.data.code === 200) {
                userStore.setUserInfo(response.data.coredata.user);
                initialFormData();
            }
          }
      );
    }
    const userStore = useUserStore();
    const initialFormData =()=>{
        console.log('初始化数据');
        console.log(userStore.userInfo);//userInfo是proxy对象
      // 从 store 中获取数据
      const data = userStore.userInfo;
      // 如果 store 中的数据不为空，则将其赋值给 formData
      if (data) {
        formData.username = data.username? data.username : 'unknown';
        formData.sex = data.sex ? data.sex : '女';
        formData.maritalStatus = data.maritalStatus ? data.maritalStatus: '未婚';
        formData.birthdate = data.birthdate ? dayjs(data.birthdate).format('YYYY-MM-DD') : '2024-03-01';
        formData.email = data.email ? data.email : 'example@qq.com';
        formData.tel = data.tel ? data.tel : '';
        formData.address = data.address ? data.address : '';
        formData.statement = data.statement ? data.statement : '';
      }


    }


    onMounted(() => {
      initialFormData()
    });
    return {
      formData,
      errors,
      save,
    };
  }
};

</script>
<style scoped>
.profile-detail-container{
    background-color: white;
    border-radius: 8px;
    flex-grow: 1;
    padding: 24px;
}


.form-row-container{
    display: flex;
    flex-direction: row;
}
.form-row-item{
    width: calc(50% - 12px);
}
.error-message {
  color: orange;
  font-style: italic;
  font-size: 0.8em;
  height: 1em;
  line-height: 1em;
  visibility: hidden;
}

.error-message.active {
  visibility: visible;
}



/* 当屏幕宽度小于 768px 时，切换为一列布局 */
@media (max-width: 1080px) {
  .form-row-container{
    flex-direction: column;
  }
  .form-row-item{
    width: 100%;
  }
}


</style>