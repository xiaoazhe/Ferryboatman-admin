import { request } from '@/api/service.js'

// 查询信息
export function USER_FIND_INTRO() {
  // 接口请求
  return request({
    url: '/user/findIntro',
    method: 'get'
  })
}

// 保存
export function USER_SAVE(data) {
  // 接口请求
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

// 修改
export function USER_UPDATE(data) {
  // 接口请求
  return request({
    url: '/user/userUpdate',
    method: 'post',
    data
  })
}

// 获取登陆用户
export function GET_LOGIN_USER() {
  // 接口请求
  return request({
    url: '/user/getLoginUser',
    method: 'get'
  })
}

// 删除
export function BATCH_DELETE(data) {
  // 接口请求
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function DELETE_FACE(data) {
  // 接口请求
  return request({
    url: `/user/deleteFace/${data}`,
    method: 'get'
  })
}

// 分页查询
export function USER_FIND_PAGE(data) {
  // 接口请求
  return request({
    url: '/user/findPage',
    method: 'post',
    data
  })
}
// 查找用户的菜单权限标识集合
export function FIND_PERMISSIONS(params) {
    // 接口请求
    return request({
        url: '/user/findPermissions',
        method: 'get',
        params
    })
}

// 根据用户名查找
export function FIND_BY_NAME(params) {
  // 接口请求
  return request({
    url: '/user/findByName',
    method: 'get',
    params
  })
}

// 更新用户密码
export function UPDATE_PWD(data) {
  // 接口请求
  return request({
    url: '/user/updatePassword',
    method: 'get',
    data
  })
}

// 导出Excel用户信息
export function EXPORT_USER_EXCEL(data) {
  // 接口请求
  return request({
    url: '/user/exportUserExcelFile',
    method: 'post',
    data
  })
}

