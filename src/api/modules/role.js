import { request } from '@/api/service.js'



// 保存
export function ROLE_SAVE(data) {
  // 接口请求
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

// 删除
export function ROLE_DELETE(data) {
  // 接口请求
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

// 分页查询
export function ROLE_FIND_PAGE(data) {
  // 接口请求
  return request({
    url: '/role/findPage',
    method: 'post',
    data
  })
}

// 查询全部
export function ROLE_FIN_ALL(data) {
  // 接口请求
  return request({
    url: '/role/findAll',
    method: 'get'
  })
}

// 查询角色菜单集合
export function ROLE_FIND_MENUS(params) {
  // 接口请求
  return request({
    url: '/role/findRoleMenus',
    method: 'get',
    params
  })
}

// 保存角色菜单集合
export function ROLE_SAVE_MENUS(data) {
  // 接口请求
  return request({
    url: '/role/saveRoleMenus',
    method: 'post',
    data
  })
}

