import { request } from '@/api/service.js'

export function FRIEND_PAGE(data) {
  // 接口请求
  return request({
    url: '/friend/getByPage',
    method: 'post',
    data
  })
}
// 保存
export function FRIEND_SAVE(data) {
  // 接口请求
  return request({
    url: '/friend/save',
    method: 'post',
    data
  })
}
// 更新
export function FRIEND_UPDATE(data) {
  // 接口请求
  return request({
    url: '/friend/update',
    method: 'put',
    data
  })
}
// 删除
export function FRIEND_DELETE(params) {
  // 接口请求
  return request({
    url: `/friend/delete/${params}`,
    method: 'delete'
  })
}

// 根据id查询
export function FRIEND_GET_ID(id) {
  // 接口请求
  return request({
    url: `/friend/get/${id}`,
    method: 'get'
  })
}

// 启用
export function FRIEND_ENABLE(data) {
  // 接口请求
  return request({
    url: `/friend/enable/${data}`,
    method: 'put'
  })
}

// 弃用
export function FRIEND_DISABLE(data) {
  // 接口请求
  return request({
    url: `/friend/disable/${data}`,
    method: 'put'
  })
}

// 批量删除
export function FRIEND_BATCH_DELETE(data) {
  // 接口请求
  return request({
    url: '/friend/delete',
    method: 'post',
    data
  })
}
