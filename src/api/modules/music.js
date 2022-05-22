import { request } from '@/api/service.js'

export function MAIL_TEST() {
  // 接口请求
  return request({
    url: '/music/mail',
    method: 'post'
  })
}
// 分页查询
export function MUSIC_PAGE(data) {
  // 接口请求
  return request({
    url: '/music/getByPage',
    method: 'post',
    data
  })
}
// 保存
export function MUSIC_SAVE(params) {
  // 接口请求
  return request({
    url: '/music/save',
    method: 'post',
    data
  })
}
// 删除
export function MUSIC_BATCH_DELETE(data) {
  // 接口请求
  return request({
    url: '/music/delete',
    method: 'post',
    data
  })
}
// 前台查询
export function MUSIC_USER_PAGE(data) {
  // 接口请求
  return request({
    url: '/music/getByPage',
    method: 'post',
    data
  })
}
// 更新
export function MUSIC_UPDATE(data) {
  // 接口请求
  return request({
    url: '/music/update',
    method: 'put',
    data
  })
}
// 删除
export function MUSIC_DELETE_ID(data) {
  // 接口请求
  return request({
    url: `/music/delete/${data}`,
    method: 'delete'
  })
}
// 根据id查询
export function MUSIC_GET_ID(data) {
  // 接口请求
  return request({
    url: `/music/get/${id}`,
    method: 'get'
  })
}
// 启用
export function MUSIC_ENABLE(data) {
  // 接口请求
  return request({
    url: `/music/enable/${data}`,
    method: 'put'
  })
}
// 弃用
export function MUSIC_DISABLE(data) {
  // 接口请求
  return request({
    url: `/music/disable/${data}`,
    method: 'put'
  })
}
