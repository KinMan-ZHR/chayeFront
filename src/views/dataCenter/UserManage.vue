<template>
    <div class="container" style="display: flex;justify-content: center;">
        <div>
            <div style="line-height: 32px;margin-top: 24px;">管理用户</div>
            <div style="width: 1280px;margin-top: 12px;">
                <t-table
                ref="tableRef"
                row-key="id"
                :data="userList"
                :columns="columns"
                :editable-row-keys="editableRowKeys"

                table-layout="fixed"
                bordered
                resizable
                lazy-load
                @row-edit="onRowEdit"
                @row-validate="onRowValidate"
                @validate="onValidate"
                @page-change="onChangePage"
                >
                </t-table>
            </div>
        </div>
    </div>
</template>

<script lang="jsx">
import { MessagePlugin,Input, Select, DatePicker } from 'tdesign-vue-next';
// eslint-disable-next-line no-unused-vars
import {ref, computed, reactive, onMounted} from 'vue';
import { useUserManager } from '@/hooks/userManager';
export default {
    name: 'UserManage',
    setup() {
        //前端视图层数据
        const editableRowKeys = ref([]);
        const tableRef = ref();
        const currentSaveId = ref();
        const editMap = {};
        const pageSize = ref(5);
        const current = ref(1);
        const total = ref(0);

        //分页器
        const pagination = reactive({
          current,
          pageSize,
          total
        })

        //使用hook，此乃接口核心，返回的是一个对象，包含了增删改查的方法，可以直接把row传入
        let { userList, addUser, delUser, editUser,getUser }=useUserManager(pageSize,current,total);


        //雷打不动的选项
        const MARRY_OPTIONS=[
            { label: '已婚', value: '已婚' },
            { label: '未婚', value: '未婚' },
            { label: '单身', value: '单身' },
        ];

        const GENDER_OPTIONS=[
            { label: '男', value: '男' },
            { label: '女', value: '女' },
        ];

        const columns = computed(() =>[
            { align: 'left', colKey: 'username', title: '用户名', width: '120', fixed: 'left',
                // 编辑状态相关配置，全部集中在 edit
                edit: {
                    // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                    // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                    component: Input,
                    // props, 透传全部属性到 Input 组件
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                    },
                    // 校验规则，此处同 Form 表单
                    rules: [
                        { required: true, message: '不能为空' },
                        { max: 10, message: '字符数量不能超过 10', type: 'warning' },
                    ],
                    showEditIcon: false,
                },
            },

            { align: 'left', colKey: 'id', title: '用户编号', width: '120',
                // 编辑状态相关配置，全部集中在 edit
                edit: {
                    // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                    // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                    component: Input,
                    // props, 透传全部属性到 Input 组件
                    props: {
                        disabled:true
                    },
                    showEditIcon: false,
                },
            },

            { colKey: 'password', title: '密码', width: '170' ,
                edit: {
                        // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                        // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                        component: Input,
                        // props, 透传全部属性到 Input 组件
                        props: {
                            type:'password',
                            disabled:true
                        },
                        showEditIcon: false,
                    },
             },
            { colKey: 'icon', title: '头像', width: '120' },
            { colKey: 'sex', title: '性别', width: '100',
            edit: {
                component: Select,
                // props, 透传全部属性到 Select 组件
                props: {
                clearable: true,
                autoWidth: true,
                options: GENDER_OPTIONS,
                },
                // 校验规则，此处同 Form 表单
                rules: [{ required: true, message: '不能为空' }],
                showEditIcon: false,
                on: ({ updateEditedCellValue }) => ({
                onChange: () => {
                    /**
                     * change other columns edited cell value
                     * 更新本行其他编辑态单元格的数据(to update editedRow)
                     */
                    updateEditedCellValue({
                    isUpdateCurrentRow: true,
                    letters: [],
                    // 'user.firstName': '',
                    // createTime: dayjs().add(1, 'day').toDate(),
                    });
                    /**
                     * update edited row data with row unique value is qual to 2
                     * 更新行唯一标识值为 2 的编辑态数据
                     */
                    // updateEditedCellValue({ rowValue: 2, letters: [] });
                },
                }),
            },
             },
            { colKey: 'maritalStatus', title: '婚姻状态', width: '180', ellipsis: true ,
            edit: {
                component: Select,
                // props, 透传全部属性到 Select 组件
                props: {
                clearable: true,
                autoWidth: true,
                options: MARRY_OPTIONS,
                },
                showEditIcon: false,
                on: ({ updateEditedCellValue }) => ({
                onChange: () => {
                    /**
                     * change other columns edited cell value
                     * 更新本行其他编辑态单元格的数据(to update editedRow)
                     */
                    updateEditedCellValue({
                    isUpdateCurrentRow: true,
                    letters: [],
                    // 'user.firstName': '',
                    // createTime: dayjs().add(1, 'day').toDate(),
                    });
                    /**
                     * update edited row data with row unique value is qual to 2
                     * 更新行唯一标识值为 2 的编辑态数据
                     */
                    // updateEditedCellValue({ rowValue: 2, letters: [] });
                },
                }),
            }
            },
            { colKey: 'birthDate', title: '出生年月' ,width:'220px',
                edit: {
                    component: DatePicker,
                    // props, 透传全部属性到 DatePicker 组件
                    props: { allowInput: true ,},
                    showEditIcon: false,
                },
            },
            { colKey: 'email', title: '电子邮箱地址', width: '180', ellipsis: true,
                edit: {
                    // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                    // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                    component: Input,
                    // props, 透传全部属性到 Input 组件
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                    },
                    showEditIcon: false,
                },
            },
            { colKey: 'tel', title: '电话号码', width: '180', ellipsis: true,
                edit: {
                        // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                        // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                        component: Input,
                        // props, 透传全部属性到 Input 组件
                        props: {
                            clearable: true,
                            autofocus: true,
                            autoWidth: true,
                            type:'tel'
                        },
                        showEditIcon: false,
                },
            },
            { colKey: 'address', title: '详细地址', width: '180', ellipsis: true,
                edit: {
                        // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                        // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                        component: Input,
                        // props, 透传全部属性到 Input 组件
                        props: {
                            clearable: true,
                            autofocus: true,
                            autoWidth: true,
                        },
                        showEditIcon: false,
                },
            },
            { colKey: 'statement', title: '个人简介', width: '180', ellipsis: true ,
                edit: {
                    // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                    // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                    component: Input,
                    // props, 透传全部属性到 Input 组件
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                    },
                    showEditIcon: false,
                },
            },
            {
                colKey: 'operation',
                title: '操作',
                cell: (h, { row }) => {

                    //判断是否属于修改行，如果是则显示保存和取消按钮，否则显示编辑和删除按钮
                    const editable = editableRowKeys.value.includes(row.id);
                    return (
                    <t-space class="table-operations">
                        {!editable && (
                        <t-link theme="primary" hover="color" data-id={row.id} onClick={onEdit}>
                            编辑
                        </t-link>
                        )}
                        {editable && (
                        <t-link theme="primary" hover="color" data-id={row.id} onClick={onSave}>
                            保存
                        </t-link>
                        )}
                        {editable && (
                        <t-link theme="primary" hover="color" data-id={row.id} onClick={onCancel}>
                            取消
                        </t-link>
                        )}
                        {(
                        <t-popconfirm content="确认删除吗" data-id={row.id} onConfirm={() => onConfirmDelete(row)}>
                            <t-link theme="primary" hover="color" data-id={row.id}>
                                删除
                            </t-link>
                        </t-popconfirm>
                        )}
                    </t-space>
                    );
                },
                width: 150,
                fixed: 'right'
            },
        ])
      //console.log('userList:',userList.value);
        // TODO：伪造数据开始
        userList.value=[
            {
                username: '贾明',
                id:'16',
                password: '624978165',
                sex: '男',
                maritalStatus: '宣传物料制作费用',
                birthDate: '2022-01-01',
                email: 'w.cezkdudy@lhll.au',
                tel: '471923654912',
                address: '扭矩输出v的女',
                statement: '警方次哦安居房不好弄青蛙',
            },
            {
                username: '贾明2',
                id:'12',
                password: '624978165',
                sex: '男',
                maritalStatus: '宣传物料制作费用',
                birthDate: '2022-01-01',
                email: 'w.cezkdudy@lhll.au',
                tel: '471923654912',
                address: '扭矩输出v的女',
                statement: '警方次哦安居房不好弄青蛙',
            },
            {
                username: '贾明3',
                id:'124',
                password: '624978165',
                sex: '男',
                maritalStatus: '宣传物料制作费用',
                birthDate: '2022-01-01',
                email: 'w.cezkdudy@lhll.au',
                tel: '471923654912',
                address: '扭矩输出v的女',
                statement: '警方次哦安居房不好弄青蛙',
            },
            {
                username: '贾明4',
                id:'112',
                password: '624978165',
                sex: '男',
                maritalStatus: '宣传物料制作费用',
                birthDate: '2022-01-01',
                email: 'w.cezkdudy@lhll.au',
                tel: '471923654912',
                address: '扭矩输出v的女',
                statement: '警方次哦安居房不好弄青蛙',
            },
            {
                username: '贾明5',
                id:'15',
                password: '624978165',
                sex: '男',
                maritalStatus: '宣传物料制作费用',
                birthDate: '2022-01-01',
                email: 'w.cezkdudy@lhll.au',
                tel: '471923654912',
                address: '扭矩输出v的女',
                statement: '警方次哦安居房不好弄青蛙',
            },
        ];
        // TODO：伪造数据结束，请求相关开始
        const onConfirmDelete = async (row) =>{
            // const { id } = e.currentTarget.dataset;
            console.log("confirmdelete",row.id);
            // console.log('tableRef',tableRef.value);
            // 移除当前节点
            // tableRef.value.remove(row.id);
            // TODO：根据indexToDelete获取用户id，根据用户id删除数据库的用户根据current和pageSize再次获取当前页面的数据,同时更新total的值（使用之前定义的userNum）
            await delUser(row);
            // ISSUE：前端效果实现逻辑在下面，后续可能要删掉
            // 前端视图层删除元素，后端未必真删除
           // 找到要删除的元素索引
            const indexToDelete = userList.value.findIndex((item) => item.id === row.id);
            console.log('要删除的索引是：',indexToDelete);
            userList.value.splice(indexToDelete, 1);
            console.log('删除后',userList);
            MessagePlugin.success('删除成功');
        }

        const onEdit = (e) => {
            // Your onEdit logic...
            // console.log('onEdit:',e);
          console.log('useList',userList.value);
          console.log('editableRowKeys',editableRowKeys.value);
          //console.log('editable',editable);

            const { id } = e.currentTarget.dataset;
            console.log('onEdit_id:',id);
            // console.log('!editableRowKeys.value.includes(id):',!editableRowKeys.value.includes(id));
            if (!editableRowKeys.value.includes(id)) {
                editableRowKeys.value.push(id);
                console.log(editableRowKeys.value);
            }
        };
      // TODO：切换页面
      const onChangePage = (params) => {
          console.log('分页器',pagination);
        console.log('changePage',params);
        current.value = params.current;
        pageSize.value = params.pageSize
        // TODO: 根据 current 和 pageSize 从数据库中切换页面数据...
        getUser();
      }
      const onSave = async (e) => {
        // Your onSave logic...
        const { id } = e.currentTarget.dataset;
        currentSaveId.value = id;

        const current = editMap[currentSaveId.value];
        console.log('current:',current.editedRow);

        // 保存当前编辑行数据
        await editUser(current.editedRow);
        updateEditState(currentSaveId.value);
      };
      //todo 请求相关结束
      //有点像组织修改额定数据存放到editMap中
      const onRowEdit = (params) => {
        console.log('onrowedit',params);
        const { row, col, value } = params;
        const oldRowData = editMap[row.id]?.editedRow || row;
        const editedRow = { ...oldRowData, [col.colKey]: value };
        editMap[row.id] = {
          ...params,
          editedRow,
        };

        // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
        // const newData = [...data.value];
        // newData[rowIndex] = editedRow;
        // data.value = newData;
      };
      const onCancel = (e) => {
            // Your onCancel logic...
            const { id } = e.currentTarget.dataset;
            updateEditState(id);
            tableRef.value.clearValidateData();
        };

        const updateEditState = (id) => {
            // Your updateEditState logic...
            const index = editableRowKeys.value.findIndex((t) => t === id);
            editableRowKeys.value.splice(index, 1);
        };


        // 行校验反馈事件，tableRef.value.validateRowData 执行结束后触发
        const onRowValidate = (params) => {
            console.log('Event Table Row Validate:', params);
        };

        // 表格全量数据校验反馈事件，tableRef.value.validateTableData() 执行结束后触发
        function onValidate(params) {
            console.log('Event Table Data Validate:', params);
        }


        // onMounted(()=>{
        //     getUser().then((res)=>{
        //         console.log('userList:',res.value);
        //     })
        //
        // })

        return {
            editableRowKeys,
            columns,
            userList,
            editUser,
            delUser,
            addUser,
            total,
            tableRef,
            currentSaveId,
            editMap,
            onEdit,
            onCancel,
            updateEditState,
            onSave,
            onRowEdit,
            pagination,
            onRowValidate,
            onValidate,
            onConfirmDelete,
            onChangePage
        };
    },
}
</script>

<style scoped>
.container{
    width: 100%;
    height: calc(100vh - 74px);
    background-color: white;
}

</style>