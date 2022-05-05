import { request } from '@/api/service.js'

export function MENU_FIND_NAV_TREE(params) {
  // 接口请求
  return request({
    url: '/menu/findNavTree',
    method: 'get',
    data: params
  })
}
