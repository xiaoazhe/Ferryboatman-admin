import { request } from '@/api/service.js'



// 保存
export function DEPT_SAVE(data) {
  // 接口请求
  return request({
    url: '/dept/save',
    method: 'post',
    data
  })
}

// 删除
export function DEPT_DELETE(data) {
  // 接口请求
  return request({
    url: '/dept/delete',
    method: 'post',
    data
  })
}

// 查询
export function DEPT_FIND_TREE() {
  // 接口请求
  return request({
    url: '/dept/findTree',
    method: 'get'
  })
}

