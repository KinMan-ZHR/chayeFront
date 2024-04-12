<template>
    <div class="container" style="display: flex;justify-content: center;">
        <div>
            <div style="display: flex;margin-top: 24px;">
                <div style="line-height: 32px;">管理头条</div>
                <div style="flex-grow: 1;"></div>
                <div>
                    <t-button theme="primary" @click="onClickCreateItem">
                        <template #icon><t-icon name="add" /></template>
                        新建
                    </t-button>
                </div>
            </div>
            <div style="width: 1280px;margin-top: 12px;">
                <t-table
                ref="tableRef"
                row-key="id"
                :data="headlineList"
                :columns="columns"
                :editable-row-keys="editableRowKeys"
                :pagination="pagination"
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
        <t-dialog v-model:visible="add_visible" width="1080px" :cancelBtn="null" :confirmBtn="null">
            <!-- 自定义header -->
            <template #header>
                <div style="display:flex">
                    <span style="display:flex;align-items:center"><t-icon name="add"></t-icon></span>
                    <span style="line-height:32px">新建头条新闻</span>
                </div>
            </template>
            <NewToutiao :add-method="addHeadline"/>
        </t-dialog>
    </div>
</template>

<script lang="jsx">
import { MessagePlugin,Input, DatePicker } from 'tdesign-vue-next';
// eslint-disable-next-line no-unused-vars
import {ref, computed, reactive, onMounted} from 'vue';
import { useHeadlineManager } from '@/hooks/headlineManager';
import NewToutiao from './core/NewToutiao.vue';
export default {
    name: 'ManageWenMingToutiao',
    components: {
        NewToutiao,
    },
    setup() {
        //前端视图层数据
        const editableRowKeys = ref([]);
        const tableRef = ref();
        const currentSaveId = ref();
        const editMap = {};
        const pageSize = ref(5);
        const current = ref(1);
        const total = ref(0);

        const add_visible= ref(false);

        //分页器
        const pagination = reactive({
          current,
          pageSize,
          total
        });

        //使用hook，此乃接口核心，返回的是一个对象，包含了增删改查的方法，可以直接把row传入
        let { headlineList, addHeadline, delHeadline, editHeadline,getHeadline }=useHeadlineManager(pageSize,current,total);


        const columns = computed(() =>[
            { align: 'left', colKey: 'id', title: '头条ID', width: '120', fixed: 'left',
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

            { align: 'left', colKey: 'title', title: '文章标题', width: '120',
                edit: {
                    component: Input,
                    props: {

                    },
                    rules: [
                        { max: 10, message: '字符数量不能超过 10', type: 'warning' },
                        { required: true, message: '不能为空'},
                    ],
                    showEditIcon: false,
                },
            },

            { colKey: 'image', title: '图片URL', width: '170' ,ellipsis:true,
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
                            { max: 500, message: '字符数量不能超过 500', type: 'warning' },
                        ],
                        showEditIcon: false,
                    },
            },
            { colKey: 'time', title: '发布时间' ,width:'220px',
                edit: {
                    component: DatePicker,
                    // props, 透传全部属性到 DatePicker 组件
                    props: { allowInput: true ,},
                    showEditIcon: false,
                },
            },
            { colKey: 'source', title: '文章来源', width: '180',
                edit: {
                    component: Input,
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                    },
                    rules: [
                        { max: 500, message: '字符数量不能超过 500', type: 'warning' },
                        { required: true, message: '不能为空'},
                    ],
                    showEditIcon: false,
                },
            },
            { colKey: 'text', title: '文章内容', width: '280', ellipsis: true,
                edit: {
                        component: Input,
                        props: {
                            clearable: true,
                            autofocus: true,
                            autoWidth: true,
                        },
                        rules:[
                            { max: 500, message: '字符数量不能超过 500', type: 'warning' },
                            { required: true, message: '不能为空'},
                        ],
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
        ]);
      //console.log('headlineList:',headlineList.value);
        // TODO：伪造数据开始
        headlineList.value=[
            {
                id:'1',
                title:'新闻标题1',
                image:'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0D/ChMkJ1eV_EiIckZnAAxoKo4d-a0AAT0gwJxjq4ADGhC893.jpg',
                time:'2022-01-01',
                source:'新华网',
                text:'这是一条新闻',
            },
            {
                id:'12',
                title:'新闻标题1',
                image:'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0D/ChMkJ1eV_EiIckZnAAxoKo4d-a0AAT0gwJxjq4ADGhC893.jpg',
                time:'2022-01-01',
                source:'新华网',
                text:'这是一条新闻',
            },
            {
                id:'6',
                title:'新闻标题1',
                image:'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0D/ChMkJ1eV_EiIckZnAAxoKo4d-a0AAT0gwJxjq4ADGhC893.jpg',
                time:'2022-01-01',
                source:'新华网',
                text:'这是一条新闻',
            },
            {
                id:'3',
                title:'新闻标题1',
                image:'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0D/ChMkJ1eV_EiIckZnAAxoKo4d-a0AAT0gwJxjq4ADGhC893.jpg',
                time:'2022-01-01',
                source:'新华网',
                text:'这是一条新闻',
            },
            {
                id:'4',
                title:'新闻标题1',
                image:'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0D/ChMkJ1eV_EiIckZnAAxoKo4d-a0AAT0gwJxjq4ADGhC893.jpg',
                time:'2022-01-01',
                source:'新华网',
                text:'这是一条新闻',
            },

        ];
        // TODO：伪造数据结束，请求相关开始
        const onConfirmDelete = async (row) =>{
            console.log("confirmdelete",row.id);
            await delHeadline(row)
            const indexToDelete = headlineList.value.findIndex((item) => item.id === row.id);
            console.log('要删除的索引是：',indexToDelete);
            headlineList.value.splice(indexToDelete, 1);
            console.log('删除后',headlineList);
            MessagePlugin.success('删除成功');
        }

        const onEdit = (e) => {
            // Your onEdit logic...
            // console.log('onEdit:',e);
          console.log('useList',headlineList.value);
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
        getHeadline();
      }
      const onSave = async (e) => {
        // Your onSave logic...
        const { id } = e.currentTarget.dataset;
        currentSaveId.value = id;
        const current = editMap[currentSaveId.value];
        console.log('current:',current.editedRow);

        // 保存当前编辑行数据
        await editHeadline(current.editedRow);

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


        const onClickCreateItem = () => {
            add_visible.value=true;
        };

        return {
            editableRowKeys,
            columns,
            headlineList,
            editHeadline,
            delHeadline,
            addHeadline,
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
            add_visible,
            onRowValidate,
            onValidate,
            onConfirmDelete,
            onChangePage,
            onClickCreateItem
        };
    },
}
</script>

<style scoped>
.container{
    width: 100%;
    background-color: white;
}

</style>