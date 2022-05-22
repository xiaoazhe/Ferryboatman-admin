import { request } from '@/api/service.js'


export function LOG_DELETE(params) {
  // 接口请求
  return request({
    url: '/log/delete',
    method: 'post',
    params
  })
}

export function LOG_PAGE(data) {
  // 接口请求
  return request({
    url: '/log/findPage',
    method: 'post',
    data
  })
}
