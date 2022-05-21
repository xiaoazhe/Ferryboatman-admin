import { request } from '@/api/service.js'

export function COMMENT_PAGE(data) {
  // 接口请求
  return request({
    url: '/comment/findPage',
    method: 'post',
    data
  })
}

export function COMMENT_DELETE(data) {
  // 接口请求
  return request({
    url: `/comment/delete/${data}`,
    method: 'delete'
  })
}
// 删除父子评论
export function COMMENT_DELETE_ALL(data) {
  // 接口请求
  return request({
    url: `/comment/deleteAll/${data}`,
    method: 'delete'
  })
}
// 查看父子评论
export function COMMENT_FIND_ID(data) {
  // 接口请求
  return request({
    url: `/comment/findById/${data}`,
    method: 'get'
  })
}


