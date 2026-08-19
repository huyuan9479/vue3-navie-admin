<script lang="ts" setup>
import { ref, reactive, h } from 'vue';
import { BasicForm, useForm, type FormSchema } from '@/components/basic-form';
import {
  BasicTable,
  TableAction,
  type BasicColumn
} from '@/components/basic-table';
import { fetchGetMenuList } from '@/service/api/system';
import { NTag, NButton } from 'naive-ui';
import SvgIcon from '@/components/custom/SvgIcon.vue';

const actionRef = ref();
const currentEditKeyRef = ref('');
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
  }
];

const columns: BasicColumn[] = [
  {
    title: '菜单Id',
    key: 'id',
    width: 150,
    render(record: any) {
      return h(
        NTag,
        {
          type: 'primary',
          size: 'small'
        },
        record.id
      );
    }
  },
  {
    title: '菜单名称',
    key: 'menuName',
    width: 130,
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true
  },
  {
    title: '菜单类型',
    key: 'menuType',
    width: 120,
    render(record: any) {
      return record.menuType === '1' ? '目录' : '菜单';
    },
    editComponent: 'NSelect',
    editComponentProps: {
      options: [
        {
          label: '目录',
          value: '1'
        },
        {
          label: '菜单',
          value: '2'
        }
      ]
    },
    editRow: true,
    edit: true
  },
  {
    title: '父级ID',
    key: 'parentId'
  },
  {
    title: '路由名称',
    key: 'routeName',
    width: 120
  },
  {
    title: '路由路径',
    key: 'routePath',
    width: 140
  },
  {
    title: '图标',
    key: 'icon',
    width: 80,
    render(record: any) {
      return h(
        'div',
        {
          class: 'flex items-center justify-center text-18px'
        },
        h(SvgIcon, {
          icon: record.icon
        })
      );
    }
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
    title: '隐藏菜单',
    key: 'hideInMenu',
    render(record: any) {
      return record.hideInMenu ? '是' : '否';
    }
  },
  {
    title: '排序',
    key: 'order'
  }
];

const [register, { getFieldsValue }] = useForm({
  labelWidth: 60,
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
        ...createActions(record),
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
        }
      ]
    });
  }
});

function createActions(record: any) {
  if (!record.editable) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record)
      }
    ];
  } else {
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record)
      },
      {
        label: '取消',
        onClick: handleCancel.bind(null, record)
      }
    ];
  }
}

function handleSubmit(values: Recordable) {
  console.log(values);
  reloadTable();
}

function reloadTable() {
  actionRef.value.reload();
}

function handleReset(values: Recordable) {
  console.log(values);
}

async function loadDataTable(res: any) {
  const { data } = await fetchGetMenuList({ ...getFieldsValue(), ...res });
  return data;
}

function handleDelete(record: any) {
  console.log(record);
}

function onCheckedRow(keys: (string | number)[]) {
  console.log(keys);
}

async function handleSave(record: any) {
  const pass = await record.onEdit?.(false, true);
  if (pass) {
    currentEditKeyRef.value = '';
  }
}

function handleCancel(record: any) {
  currentEditKeyRef.value = '';
  record.onEdit?.(false, false);
}

function handleEdit(record: any) {
  currentEditKeyRef.value = record.key;
  record.onEdit?.(true);
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
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row: any) => row.id"
        :action-column="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #toolbar>
          <NButton type="primary" ghost>
            <icon-mdi-plus class="text-18px" />
            新增
          </NButton>
        </template>
      </BasicTable>
    </NCard>
  </div>
</template>
