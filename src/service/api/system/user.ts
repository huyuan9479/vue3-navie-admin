import { request } from '../../request';
// Get user list
export function fetchGetUserList(params: { pageNum: number; pageSize: number }) {
  return request({ url: '/system/user/list', params });
}
