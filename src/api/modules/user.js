import { request } from '@/api/service.js'

export function USER_FIND_PAGE(params) {
  // 接口请求
  return request({
    url: '/user/findPage',
    method: 'post',
    params
  })
}
