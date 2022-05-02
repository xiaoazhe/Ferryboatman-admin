import { request } from '@/api/service.js'
export function ADMIN_LOGIN (account, password) {
  // 接口请求
  return request({
    url: '/login',
    method: 'post',
    data: { account, password }
  })
}
