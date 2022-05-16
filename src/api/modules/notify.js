import { request } from '@/api/service.js'
/*
 * 消息通知模块
 */

// 保存
export function NOTIFY_SAVE(data) {
  // 接口请求
  return request({
    url: '/notify/save',
    method: 'post',
    data
  })
}

// 删除
export function NOTIFY_DELETE(data) {
  // 接口请求
  return request({
    url: `/notify/delete/${data}`,
    method: 'get'
  })
}

// 根据id查询
export function NOTIFY_GET_BY_ID(id) {
  // 接口请求
  return request({
    url: `/notify/get/${id}`,
    method: 'get'
  })
}

// 未读个人通知列表
export function NOTIFY_GET_LIST() {
  // 接口请求
  return request({
    url: `/notify/getListByUserId`,
    method: 'get'
  })
}

// 分页查询
export function NOTIFY_PAGE(data) {
  // 接口请求
  return request({
    url: '/notify/findPage',
    method: 'post',
    data
  })
}

// 用户列表
export function NOTIFY_GET_USER_LIST() {
  // 接口请求
  return request({
    url: `/notify/getUserList`,
    method: 'get'
  })
}

// 修改已读
export function NOTIFY_UPDATE_READ(id) {
  // 接口请求
  return request({
    url: `/notify/readNotify/${id}`,
    method: 'get'
  })
}
