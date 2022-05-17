import { request } from '@/api/service.js'

export function TYPE_PAGE(data) {
  // 接口请求
  return request({
    url: '/type/findPage',
    method: 'post',
    data
  })
}

export function TYPE_FIND_ALL() {
  // 接口请求
  return request({
    url: '/type/findAll',
    method: 'get'
  })
}

export function TYPE_BY_ID(data) {
  // 接口请求
  return request({
    url: `/type/findById/${data}`,
    method: 'get'
  })
}

export function TYPE_SAVE(data) {
  // 接口请求
  return request({
    url: '/type/save',
    method: 'post',
    data
  })
}

export function TYPE_DELETE(data) {
  // 接口请求
  return request({
    url: '/type/delete',
    method: 'post',
    data
  })
}
