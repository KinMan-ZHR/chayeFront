<template>
    <div class="container" style="display: flex;justify-content: center;">
        <div>
            <div style="display: flex;margin-top: 24px;">
                <div style="line-height: 32px;">管理志愿活动</div>
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
                :data="mapList"
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
                    <span style="line-height:32px">新建志愿活动</span>
                </div>
            </template>
            <NewZhiyuanProject :add-method="addMap"/>
        </t-dialog>
    </div>
</template>

<script lang="jsx">
import { MessagePlugin,Input, DatePicker, Select, RangeInput,DateRangePicker } from 'tdesign-vue-next';
// eslint-disable-next-line no-unused-vars
import {ref, computed, reactive, onMounted} from 'vue';
import { useMapManager } from '@/hooks/mapManager';
import NewZhiyuanProject from '../../components/NewZhiyuanProject.vue';
export default {
    name: 'ManageZhiYuanProject',
    components:{
        NewZhiyuanProject
    },
    setup() {
        //前端视图层数据
        const editableRowKeys = ref([]);
        const tableRef = ref();
        const currentSaveId = ref();
        const pageSize = ref(5);
        const current = ref(1);
        const total = ref(0);

        // 选项
        const REGION_OPTIONS = [
            { label: '全部', value: 1 },
            { label: '成都市', value: 2 },
            { label: '自贡市', value: 3 },
            { label: '攀枝花市', value: 4 },
            { label: '泸州市', value: 5 },
            { label: '德阳市', value: 6 },
            { label: '绵阳市', value: 7 },
            { label: '广元市', value: 8 },
            { label: '遂宁市', value: 9 },
            { label: '内江市', value: 10 },
            { label: '乐山市', value: 11 },
            { label: '南充市', value: 12 },
            { label: '眉山市', value: 13 },
            { label: '宜宾市', value: 14 },
            { label: '广安市', value: 15 },
            { label: '达州市', value: 16 },
            { label: '雅安市', value: 17 },
            { label: '巴中市', value: 18 },
            { label: '资阳市', value: 19 },
            { label: '阿坝藏族羌族自治州', value: 20 },
            { label: '甘孜藏族自治州', value: 21 },
            { label: '凉山彝族自治州', value: 22 },
        ]

        const TYPE_OPTIONS = [
            { label: '全部', value: 1 },
            { label: '社区服务', value: 2 },
            { label: '扶贫减贫', value: 4 },
            { label: '支教助学', value: 5 },
            { label: '卫生健康', value: 6 },
            { label: '法律服务', value: 7 },
            { label: '环境保护', value: 8 },
            { label: '科技科普', value: 9 },
            { label: '文化艺术', value: 10 },
            { label: '平安综治', value: 11 },
            { label: '文明风尚', value: 12 },
            { label: '交通引导', value: 13 },
            { label: '志愿消防', value: 14 },
            { label: '应急救援', value: 15 },
            { label: '禁毒宣传', value: 16 },
            { label: '体育健身', value: 17 },
            { label: '旅游服务', value: 18 },
            { label: '关爱特殊群体', value: 19 },
            { label: '大型活动', value: 20 },
            { label: '海外志愿服务', value: 21 },
            { label: '税收服务', value: 22 },
            { label: '疫情防控', value: 23 },
            { label: '其他', value: 3 }
        ]

        const TARGET_OPTIONS =  [
            { label: '全部', value: 1 },
            { label: '儿童', value: 2 },
            { label: '妇女', value: 3 },
            { label: '老年人', value: 4 },
            { label: '残障人士', value: 5 },
            { label: '优抚对象', value: 6 },
            { label: '贫困家庭', value: 7 },
            { label: '特殊群体', value: 8 },
            { label: '病患者', value: 9 },
            { label: '农村居民', value: 10 },
            { label: '城镇居民', value: 11 },
            { label: '社会公众', value: 12 },
            { label: '纳税人缴费人', value: 13 },
            { label: '其他', value: 14 },
        ]

        const SCALE_OPTIONS =  [
            { label: '全部', value: 1 },
            { label: '公开招募', value: 2 },
            { label: '指定支援队伍招募', value: 3 },
            { label: '设定免审密码招募', value: 4}
        ]

        const SIZE_OPTIONS = [
            { label: '全部', value: 1},
            { label: '1-100', value: 2 },
            { label: '101-200', value: 3 },
            { label: '201-500', value: 4 },
            { label: '501-1000', value: 5 },
            { label: '1000以上', value: 6 },
        ]

        const STATE_OPTIONS = [
            { label: '全部', value: 1},
            { label: '待启动', value: 2 },
            { label: '运行中', value: 3 },
            { label: '已结项', value: 4 },
        ]

        const add_visible= ref(false);

        //分页器
        const pagination = reactive({
          current,
          pageSize,
          total
        });

        //使用hook，此乃接口核心，返回的是一个对象，包含了增删改查的方法，可以直接把row传入
        let { mapList, addMap, delMap, editMap, getMap }=useMapManager(pageSize,current,total);


        const columns = computed(() =>[
            { align: 'left', colKey: 'id', title: '项目ID', width: '120', fixed: 'left',
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

            { align: 'left', colKey: 'name', title: '名称', width: '120',
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

            { colKey: 'location', title: '地点', width: '280' ,ellipsis:true,
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
            { colKey: 'pub_date', title: '发布日期' ,width:'200',
                edit: {
                    component: DatePicker,
                    // props, 透传全部属性到 DatePicker 组件
                    props: { allowInput: true , autoWidth: true,},
                    showEditIcon: false,
                },
            },
            { colKey: 'time_range', title: '持续时间', width: '300',
                edit: {
                    component: DateRangePicker,
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
                cell: (h,{row}) => {
                    return (
                        <div>{row.time_range[0]},{row.time_range[1]}</div>
                    )
                }

            },
            { colKey: 'region', title: '地区', width: '120', ellipsis: true,
                edit: {
                    component: Select,
                    props: {
                        autofocus: true,
                        autoWidth: true,
                        multiple:true,
                        minCollapsedNum: 1,
                        max:2,
                        options:REGION_OPTIONS
                    },
                    rules:[
                        { max: 500, message: '字符数量不能超过 500', type: 'warning' },
                        { required: true, message: '不能为空'},
                    ],
                    showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const valuesToFind = row.region;
                    const labels = REGION_OPTIONS.filter(option => valuesToFind.includes(option.value)).map(option => option.label).join(', ');
                    return(
                        <div>{labels}</div>
                    )

                }
            },
            { colKey: 'type', title: '类型', width: '140', ellipsis: true,
                edit: {
                        component: Select,
                        props: {
                            autofocus: true,
                            autoWidth: true,
                            multiple:true,
                            minCollapsedNum: 1,
                            options: TYPE_OPTIONS
                        },
                        rules:[
                            { max: 500, message: '字符数量不能超过 500', type: 'warning' },
                            { required: true, message: '不能为空'},
                        ],
                        showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const valuesToFind = row.type;
                    const labels = TYPE_OPTIONS.filter(option => valuesToFind.includes(option.value)).map(option => option.label).join(', ');
                    return(
                        <div>{labels}</div>
                    )

                }
            },
            { colKey: 'target', title: '靶向', width: '140', ellipsis: true,
                edit: {
                        component: Select,
                        props: {
                            autofocus: true,
                            autoWidth: true,
                            multiple:true,
                            minCollapsedNum: 1,
                            options:TARGET_OPTIONS
                        },
                        rules:[
                            { required: true, message: '不能为空'},
                        ],
                        showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const valuesToFind = row.region;
                    const labels = TARGET_OPTIONS.filter(option => valuesToFind.includes(option.value)).map(option => option.label).join(', ');
                    return(
                        <div>{labels}</div>
                    )

                }
            },
            { colKey: 'state', title: '状态', width: '130', ellipsis: true,
                edit: {
                        component: Input,
                        props: {
                            disabled:true,
                        },
                        showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const row_state = row.state[0]
                    const row_state_str = STATE_OPTIONS.find(option => option.value === row_state)?.label;
                    // console.log(row_state_str);
                    return(
                        <div>{row_state_str}</div>
                    )
                }
            },
            { colKey: 'scale', title: '范围', width: '190', ellipsis: true,
                edit: {
                    component: Select,
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                        multiple:true,
                        minCollapsedNum: 1,
                        max:2,
                        options:SCALE_OPTIONS
                    },
                    rules:[
                        { required: true, message: '不能为空'},
                    ],
                    showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const valuesToFind = row.region;
                    const labels = SCALE_OPTIONS.filter(option => valuesToFind.includes(option.value)).map(option => option.label).join(', ');
                    return(
                        <div>{labels}</div>
                    )

                }
            },
            { colKey: 'size', title: '团队大小', width: '140', ellipsis: true,
                edit: {
                        component: Select,
                        props: {
                            autofocus: true,
                            autoWidth: true,
                            multiple:true,
                            minCollapsedNum: 1,
                            max:2,
                            options: SIZE_OPTIONS
                        },
                        rules:[
                            { required: true, message: '不能为空'},
                        ],
                        showEditIcon: false,
                },
                cell:(h,{row}) => {
                    const valuesToFind = row.region;
                    const labels = SIZE_OPTIONS.filter(option => valuesToFind.includes(option.value)).map(option => option.label).join(', ');
                    return(
                        <div>{labels}</div>
                    )

                }
            },
            { colKey: 'cover', title: '封面', width: '280', ellipsis: true,
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
            { colKey: 'description', title: '描述', width: '280', ellipsis: true,
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
            { colKey: 'address', title: '网站链接', width: '280', ellipsis: true,
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
            { colKey: 'marker', title: '纬度-经度', width: '280', ellipsis: true,
                edit: {
                    component: RangeInput,
                    props: {
                        clearable: true,
                        autofocus: true,
                        autoWidth: true,
                    },
                    rules:[
                        { max: 20, message: '字符数量不能超过 20', type: 'warning' },
                        { required: true, message: '不能为空'},
                    ],
                    showEditIcon: false,
                },
                cell: (h,{row}) => {
                    return (
                        <div>{row.marker[0]},{row.marker[1]}</div>
                    )
                }
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

        const onConfirmDelete = async (row) =>{
            // 移除当前节点
            // tableRef.value.remove(row.id);
            // TODO：根据indexToDelete获取用户id，根据用户id删除数据库的用户根据current和pageSize再次获取当前页面的数据,同时更新total的值（使用之前定义的mapNum）
            await delMap(row);
            // ISSUE：前端效果实现逻辑在下面，后续可能要删掉
            // 前端视图层删除元素，后端未必真删除
           // 找到要删除的元素索引
            const indexToDelete = mapList.value.findIndex((item) => item.id === row.id);
            console.log('要删除的索引是：',indexToDelete);
            mapList.value.splice(indexToDelete, 1);
            console.log('删除后',mapList);
            MessagePlugin.success('删除成功');
        }

        const onEdit = (e) => {
            // Your onEdit logic...
            // console.log('onEdit:',e);
          console.log('useList',mapList.value);
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
        getMap();
      }
      const onSave = async (e) => {
        // Your onSave logic...
        const { id } = e.currentTarget.dataset;
        currentSaveId.value = id;
        const current = editMap[currentSaveId.value];
        console.log('current:',current.editedRow);

        // 保存当前编辑行数据
        await editMap(current.editedRow);

        updateEditState(currentSaveId.value);

        // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
        // tableRef.value.validateRowData(id).then(async (params) => {
        //     console.log('Event Table Promise Validate:', params);
        //     if (params.result.length) {
        //         // const r = params.result[0];
        //         MessagePlugin.error('error');
        //         return;
        //     }
        //     // 如果是 table 的父组件主动触发校验
        //     if (params.trigger === 'parent' && !params.result.length) {
        //         const current = editMap[currentSaveId.value];
        //         if (current) {
        //         //   mapList.value.splice(current.rowIndex, 1, current.editedRow);
        //             mapList.value[current.rowIndex]=current.editedRow
        //         }

        //         // updateEditState(currentSaveId.value);
        //     }
        // });
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

        const onClickCreateItem = () => {
            add_visible.value=true;
        };

        // 表格全量数据校验反馈事件，tableRef.value.validateTableData() 执行结束后触发
        function onValidate(params) {
            console.log('Event Table Data Validate:', params);
        }


        // onMounted(()=>{
        //     getMap().then((res)=>{
        //         console.log('mapList:',res.value);
        //     })
        //
        // })

        return {
            editableRowKeys,
            columns,
            mapList,
            editMap,
            delMap,
            addMap,
            total,
            tableRef,
            currentSaveId,
            onEdit,
            onCancel,
            updateEditState,
            onSave,
            onRowEdit,
            pagination,
            onRowValidate,
            onValidate,
            onConfirmDelete,
            onChangePage,
            add_visible,
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