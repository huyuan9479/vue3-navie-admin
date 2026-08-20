import { localStg } from "@/utils/storage";

/** Get token */
export function getToken(): Api.Auth.LoginToken {
  return JSON.parse(localStg.get("token") || "{}");
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove("token");
}
