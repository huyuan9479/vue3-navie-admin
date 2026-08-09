<script lang="ts" setup>
import { ref, reactive, h } from 'vue';
import { BasicForm, useForm, type FormSchema } from '@/components/basic-form';
import { BasicTable, TableAction, type BasicColumn } from '@/components/basic-table';

const actionRef = ref();
const schemas: FormSchema[] = [
  {
    field: 'name',
    labelMessage: '这是一个提示',
    component: 'NInput',
    label: '姓名',
    componentProps: {
      placeholder: '请输入姓名',
      onInput: (e: any) => {
        console.log(e);
      }
    },
    rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }]
  },
  {
    field: 'mobile',
    component: 'NInputNumber',
    label: '手机',
    componentProps: {
      placeholder: '请输入手机号码',
      showButton: false,
      onInput: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'type',
    component: 'NSelect',
    label: '类型',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        {
          label: '舒适性',
          value: 1
        },
        {
          label: '经济性',
          value: 2
        }
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'makeDate',
    component: 'NDatePicker',
    label: '预约时间',
    defaultValue: 1183135260000,
    componentProps: {
      type: 'date',
      clearable: true,
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'makeTime',
    component: 'NTimePicker',
    label: '停留时间',
    componentProps: {
      clearable: true,
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'status',
    label: '状态',
    //插槽
    slot: 'statusSlot'
  },
  {
    field: 'makeProject',
    component: 'NCheckbox',
    label: '预约项目',
    componentProps: {
      placeholder: '请选择预约项目',
      options: [
        {
          label: '种牙',
          value: 1
        },
        {
          label: '补牙',
          value: 2
        },
        {
          label: '根管',
          value: 3
        }
      ],
      onUpdateChecked: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: 'makeSource',
    component: 'NRadioGroup',
    label: '来源',
    componentProps: {
      options: [
        {
          label: '网上',
          value: 1
        },
        {
          label: '门店',
          value: 2
        }
      ],
      onUpdateChecked: (e: any) => {
        console.log(e);
      }
    }
  }
];

const columns: BasicColumn[] = [
  {
    title: 'id',
    key: 'id'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '头像',
    key: 'avatar'
  },
  {
    title: '性别',
    key: 'sex'
  },
  {
    title: '邮箱',
    key: 'email',
    width: 220
  },
  {
    title: '城市',
    key: 'city'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '创建时间',
    key: 'createDate'
  }
];

const [register] = useForm({
  labelWidth: 80,
  schemas
});

const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    render(record: any) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key: string) => {
          window['$message']?.info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

function handleSubmit(values: Recordable) {
  console.log(values);
  // reloadTable();
}

function handleReset(values: Recordable) {
  console.log(values);
}

function loadDataTable() {
  console.log('loadDataTable');
}

function handleDelete(record: any) {
  console.log(record);
}

function handleEdit(record: any) {
  console.log(record);
}

function onCheckedRow(keys: any[]) {
  console.log(keys);
}
</script>

<template>
  <div>
    <NCard :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #statusSlot="{ model, field }">
          <NInput v-model:value="model[field]" />
        </template>
      </BasicForm>
    </NCard>
    <NCard :bordered="false" class="mt-10px">
      <BasicTable
        ref="actionRef"
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row: any) => row.id"
        :action-column="actionColumn"
        :scroll-x="1090"
        @update:checked-row-keys="onCheckedRow"
      >
      </basictable>
    </NCard>
  </div>
</template>
