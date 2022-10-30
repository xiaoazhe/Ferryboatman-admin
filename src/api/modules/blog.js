import { request } from '@/api/service.js'



// 保存
export function BLOG_SAVE(data) {
  // 接口请求
  return request({
    url: '/blog/save',
    method: 'post',
    data
  })
}

export function BLOG_PAGE(data) {
  // 接口请求
  return request({
    url: '/blog/findPage',
    method: 'post',
    data
  })
}

// 删除
export function BLOG_DELETE_BATCH(data) {
  // 接口请求
  return request({
    url: '/blog/delete',
    method: 'post',
    data
  })
}

// 删除
export function BLOG_DELETE_ID(data) {
  // 接口请求
  return request({
    url: `/blog/delete/${data}`,
    method: 'delete'
  })
}

// 按id查询
export function BLOG_GET_BY_ID(data) {
  // 接口请求
  return request({
    url: `/blog/select/${data}`,
    method: 'get'
  })
}

// 用户分页查询
export function BLOG_USER_PAGE(data) {
  // 接口请求
  return request({
    url: '/blog/user/findPage',
    method: 'post',
    data
  })
}

// 删除
export function BLOG_USER_DELETE_ID(data) {
  // 接口请求
  return request({
    url: `/blog/user/delete/${data}`,
    method: 'get'
  })
}

// 问题分页查询
export function PROBLEM_NEW_LIST(data) {
  // 接口请求
  return request({
    url: '/problem/newlist',
    method: 'post',
    data
  })
}

// 删除
export function PROBLEM_DELETE_BY_ID(data) {
  // 接口请求
  return request({
    url: `/Problem/deleteById/${data}`,
    method: 'get'
  })
}

// 标签分页查询
export function LABEL_PAGE(data) {
  // 接口请求
  return request({
    url: '/label/getByPage',
    method: 'post',
    data
  })
}

// 添加标签
export function LABEL_SAVE(data) {
  // 接口请求
  return request({
    url: '/label/saveLabel',
    method: 'post',
    data
  })
}

// 删除标签
export function LABEL_DELETE_BY_ID(data) {
  // 接口请求
  return request({
    url: `/label/deleteLabelById/${data}`,
    method: 'get'
  })
}

// 根据id查询标签
export function LABEL_GET_BY_ID(data) {
  // 接口请求
  return request({
    url: `/label/selectLabelById/${data}`,
    method: 'get'
  })
}

// 修改标签状态
export function LABEL_UPDATE_BY_ID(data) {
  // 接口请求
  return request({
    url: '/label/updateLabelState',
    method: 'post',
    data
  })
}

// 修改发布状态
export function BLOG_PUBLISH(data) {
  // 接口请求
  return request({
    url: `/blog/publishById/${data}`,
    method: 'get'
  })
}
