<script lang="ts" setup></script>

<template>
  <NGrid cols="1" responsive="screen" class="-mt-4">
    <NGridItem>
      <NList>
        <NListItem>
          <template #suffix>
            <NButton type="primary" text>修改</NButton>
          </template>
          <NThing title="修改密码">
            <template #description>
              <span class="text-gray-400">定时修改密码，帐号更安全</span>
            </template>
          </NThing>
        </NListItem>
        <NListItem>
          <template #suffix>
            <NButton type="primary" text>修改</NButton>
          </template>
          <NThing title="绑定手机">
            <template #description>
              <span class="text-gray-400">已绑定手机号：189****6832</span>
            </template>
          </NThing>
        </NListItem>
        <NListItem>
          <template #suffix>
            <NButton type="primary" text>设置</NButton>
          </template>
          <NThing title="绑定邮箱">
            <template #description>
              <span class="text-gray-400">
                邮箱未绑定，建议绑定邮箱，邮箱可有效保护账户安全
              </span>
            </template>
          </NThing>
        </NListItem>
        <NListItem>
          <template #suffix>
            <NButton type="primary" text>设置</NButton>
          </template>
          <NThing title="密保问题">
            <template #description>
              <span class="text-gray-400">
                未设置密保问题，密保问题可有效保护账户安全
              </span>
            </template>
          </NThing>
        </NListItem>
      </NList>
    </NGridItem>
  </NGrid>
</template>
