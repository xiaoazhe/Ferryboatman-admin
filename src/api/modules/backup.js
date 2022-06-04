import { request } from '@/api/service.js'



// 查找
export function BACKUP_FIND() {
  // 接口请求
  return request({
    url: '/backup/findRecords',
    method: 'get'
  })
}

// 备份
export function BACK_UP() {
  // 接口请求
  return request({
    url: '/backup/backup',
    method: 'get'
  })
}


// 数据还原
export function BACKUP_RESTORE() {
  // 接口请求
  return request({
    url: '/backup/restore',
    method: 'get'
  })
}


// 删除备份
export function BACKUP_DELETE(params) {
  // 接口请求
  return request({
    url: '/backup/delete',
    method: 'get',
    params
  })
}
