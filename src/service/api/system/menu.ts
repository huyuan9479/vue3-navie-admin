import { request } from "../../request";
// Get menu list
export function fetchGetMenuList(params: {
  pageNum: number;
  pageSize: number;
}) {
  return request({ url: "/system/menu/list", params });
}
