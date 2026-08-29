<script lang="ts" setup>
import { ref, reactive, h } from 'vue';
import { BasicForm, useForm, type FormSchema } from '@/components/basic-form';
import {
  BasicTable,
  TableAction,
  type BasicColumn
} from '@/components/basic-table';
import { fetchGetUserList } from '@/service/api';
import { NTag, NButton } from 'naive-ui';
import AddUser from './components/AddUser.vue';

const actionRef = ref();
const addUserRef = ref();

const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'NInput',
    label: '用户Id',
    componentProps: {
      placeholder: '请输入用户Id'
    }
  },
  {
    field: 'name',
    component: 'NInput',
    label: '用户名',
    componentProps: {
      placeholder: '请输入用户名',
      onInput: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'email',
    component: 'NInput',
    label: '邮箱',
    componentProps: {
      placeholder: '请输入邮箱'
    }
  },
  {
    field: 'status',
    label: '状态',
    //插槽
    component: 'NSelect',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ]
    }
  }
];

const columns: BasicColumn[] = [
  {
    type: 'selection',
    key: 'selection',
    width: 40
  },
  {
    title: '用户Id',
    key: 'id'
  },
  {
    title: '用户名',
    key: 'name',
    width: 160,
    editComponent: 'NInput',
    // 默认必填校验
    editRule: true,
    edit: true
  },
  {
    title: '角色',
    key: 'role'
  },
  {
    title: '邮箱',
    key: 'email',
    width: 160
  },
  {
    title: '性别',
    key: 'gender'
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(record: any) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'success' : 'error',
          size: 'small'
        },
        record.status === 1 ? '启用' : '禁用'
      );
    }
  },
  {
    title: '备注',
    key: 'remark',
    ellipsis: true,
    width: 150
  },
  {
    title: '创建时间',
    key: 'createTime'
  }
];

const [register, { getFieldsValue }] = useForm({
  labelWidth: 80,
  schemas
});

const actionColumn = reactive({
  width: 180,
  title: '操作',
  key: 'action',
  fixed: 'right' as const,
  render(record: any) {
    return h(TableAction as any, {
      style: 'text',
      actions: [
        {
          label: '删除',
          type: 'error',
          icon: 'material-symbols:delete-rounded',
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          }
          // 根据权限控制是否显示: 有权限，会显示，支持多个
        },
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          }
          // auth: ['basic_list']
        }
      ],
      dropDownActions: [
        {
          label: '启用',
          key: 'enabled',
          type: 'success',
          icon: 'material-symbols:open-in-new-rounded',
          // 根据业务控制是否显示: 非enable状态的不显示启用按钮
          ifShow: () => {
            return true;
          }
        },
        {
          label: '禁用',
          key: 'disabled',
          type: 'error',
          icon: 'material-symbols:do-not-disturb-on-outline-rounded',
          ifShow: () => {
            return true;
          }
        }
      ],
      select: ({ key }: { key: string }) => {
        window['$message']?.info(`您点击了，${key} 按钮`);
      }
    });
  }
});

function handleSubmit(values: Recordable) {
  console.log(values);
  reloadTable();
}

function reloadTable() {
  actionRef.value.reload();
}

function handleReset() {
  reloadTable();
}

async function loadDataTable(res: any) {
  const { data } = await fetchGetUserList({ ...getFieldsValue(), ...res });
  return data;
}

function handleDelete(record: any) {
  console.log(record);
}

function handleEdit(record: any) {
  console.log(record);
}

function onCheckedRow(keys: (string | number)[], rows: Recordable[]) {
  console.log(keys, rows);
}
// 新增用户
function handleAddUser() {
  addUserRef.value.handleOpenModal();
}
</script>

<template>
  <div>
    <NCard :bordered="false" size="small">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      >
        <template #statusSlot="{ model, field }">
          <NInput v-model:value="model[field]" />
        </template>
      </BasicForm>
    </NCard>
    <NCard :bordered="false" class="mt-10px" size="small">
      <BasicTable
        ref="actionRef"
        title="用户列表"
        title-tooltip="这是一个提示，可以用来说明"
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row: any) => row.id"
        :action-column="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #toolbar>
          <NButton type="primary" ghost @click="handleAddUser">
            <icon-mdi-plus class="text-18px" />
            新增
          </NButton>
        </template>
      </BasicTable>
    </NCard>

    <AddUser ref="addUserRef" />
  </div>
</template>
