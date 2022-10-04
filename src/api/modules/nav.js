import { request } from '@/api/service.js'

export function NAV_TYPE_LIST() {
  // 接口请求
  return request({
    url: `/navType/queryList`,
    method: 'get'
  })
}

// 查找导航分頁
export function NAV_TYPE_PAGE(data) {
  // 接口请求
  return request({
    url: '/navType/findPage',
    method: 'post',
    data
  })
}

export function NAV_INFO_PAGE(data) {
  // 接口请求
  return request({
    url: '/navInfo/findPage',
    method: 'post',
    data
  })
}

// 根据id查询
export function NAV_TYPE_FIND_BY_ID(id) {
  // 接口请求
  return request({
    url: `/navType/get/${id}`,
    method: 'get'
  })
}

export function NAV_INFO_FIND_BY_ID(id) {
  // 接口请求
  return request({
    url: `/navInfo/get/${id}`,
    method: 'get'
  })
}

// 删除
export function NAV_TYPE_DELETE_BY_ID(id) {
  // 接口请求
  return request({
    url: `/navType/delete`,
    method: 'post',
    data: [ {
      id: id
    }]
  })
}


export function NAV_INFO_DELETE_BY_ID(id) {
  // 接口请求
  return request({
    url: `/navInfo/delete`,
    method: 'post',
    data: [ {
      id: id
    }]
  })
}

// 保存
export function NAV_TYPE_SAVE(data) {
  // 接口请求
  return request({
    url: '/navType/save',
    method: 'post',
    data
  })
}

export function NAV_INFO_SAVE(data) {
  // 接口请求
  return request({
    url: '/navInfo/save',
    method: 'post',
    data
  })
}

// 修改
export function NAV_TYPE_UPDATE(data) {
  // 接口请求
  return request({
    url: '/navType/update',
    method: 'put',
    data
  })
}

export function NAV_INFO_UPDATE(data) {
  // 接口请求
  return request({
    url: '/navInfo/update',
    method: 'put',
    data
  })
}
