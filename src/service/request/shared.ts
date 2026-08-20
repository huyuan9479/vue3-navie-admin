import { useAuthStore } from "@/store/modules/auth";
import { localStg } from "@/utils/storage";
import { fetchRefreshToken } from "../api";
import type { RequestInstanceState } from "./type";

export function getAuthorization() {
  const token = JSON.parse(localStg.get("token") || "{}");
  const Authorization = token.access_token
    ? `${token.token_type} ${token.access_token}`
    : null;

  return Authorization;
}

/** refresh token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const token = JSON.parse(localStg.get("token") || "{}");
  const { error, data } = await fetchRefreshToken(token.refresh_token);
  if (!error) {
    localStg.set("token", JSON.stringify(data));
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken();
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter((msg) => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      },
    });
  }
}
