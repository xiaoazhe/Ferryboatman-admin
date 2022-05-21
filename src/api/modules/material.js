import { request } from '@/api/service.js'

export function MATERIAL_PAGE(data) {
  // 接口请求
  return request({
    url: '/material/findPage',
    method: 'post',
    data
  })
}

export function MATERIAL_SAVE(data) {
  // 接口请求
  return request({
    url: '/material/save',
    method: 'post',
    data
  })
}

export function MATERIAL_UPDATE(data) {
  // 接口请求
  return request({
    url: '/material/update',
    method: 'post',
    data
  })
}

export function MATERIAL_DELETE(data) {
  // 接口请求
  return request({
    url: `/material/delete/${data}`,
    method: 'get'
  })
}

// id查询
export function MATERIAL_BY_ID(data) {
  // 接口请求
  return request({
    url: `/material/getById/${data}`,
    method: 'get'
  })
}

// 审核
export function MATERIAL_AUDIT(data) {
  // 接口请求
  return request({
    url: `/material/audit/${data}`,
    method: 'get'
  })
}
