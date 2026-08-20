<script setup lang="ts">
import { computed } from "vue";
import type { VNode } from "vue";
import { useAuthStore } from "@/store/modules/auth";
import { useRouterPush } from "@/hooks/common/router";
import { useSvgIcon } from "@/hooks/common/icon";
import { $t } from "@/locales";

defineOptions({
  name: "UserAvatar",
});

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = "logout";

type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: () => VNode;
    }
  | {
      type: "divider";
      key: string;
    };

const options = computed(() => {
  const opts: DropdownOption[] = [
    // {
    //   label: $t("common.userCenter"),
    //   key: "userCenter",
    //   icon: SvgIconVNode({ icon: "ant-design:user", fontSize: 18 }),
    // },
    {
      label: $t("common.logout"),
      key: "logout",
      icon: SvgIconVNode({ icon: "ant-design:logout-outlined", fontSize: 18 }),
    },
  ];

  return opts;
});

function logout() {
  window.$dialog?.info({
    title: $t("common.tip"),
    content: $t("common.logoutConfirm"),
    positiveText: $t("common.confirm"),
    negativeText: $t("common.cancel"),
    onPositiveClick: () => {
      authStore.resetStore();
    },
  });
}

function handleDropdown(key: DropdownKey) {
  if (key === "logout") {
    logout();
  } else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key);
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t("page.login.common.loginOrRegister") }}
  </NButton>
  <NDropdown
    v-else
    placement="bottom"
    trigger="click"
    :options="options"
    @select="handleDropdown"
  >
    <div>
      <ButtonIcon>
        <img
          src="@/assets/imgs/avatar.png"
          class="w-26px h-26px rounded-full object-cover"
        />
        <span class="text-16px font-medium">{{
          authStore.userInfo.userName
        }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
