import { request } from '../../request';
// Get role list
export function fetchGetRoleList(params: {
  pageNum: number;
  pageSize: number;
}) {
  return request({ url: '/system/role/list', params });
}
