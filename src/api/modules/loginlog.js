import { request } from '@/api/service.js'


export function LOGIN_LOG_DELETE(params) {
  // 接口请求
  return request({
    url: '/loginlog/delete',
    method: 'post',
    params
  })
}

export function LOGIN_LOG_PAGE(data) {
  // 接口请求
  return request({
    url: '/loginlog/findPage',
    method: 'post',
    data
  })
}
