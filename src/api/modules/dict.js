import { request } from '@/api/service.js'

export function DICT_SAVE(data) {
  // 接口请求
  return request({
    url: '/dict/save',
    method: 'post',
    data
  })
}

export function DICT_DELETE(params) {
  // 接口请求
  return request({
    url: '/dict/delete',
    method: 'post',
    params
  })
}

export function DICT_PAGE(data) {
  // 接口请求
  return request({
    url: '/dict/findPage',
    method: 'post',
    data
  })
}
