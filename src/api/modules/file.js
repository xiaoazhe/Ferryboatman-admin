import { request } from '@/api/service.js'

export function FDFS_UPLOAD(params) {
  // 接口请求
  return request({
    url: '/file/fdfsUploadImage',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function FDFS_DELETE(params) {
  // 接口请求
  return request({
    url: '/file/deletefdfsImage',
    method: 'post',
    data: params
  })
}

export function FILE_CONFIG(params) {
  // 接口请求
  return request({
    url: '/file/fileConfig',
    method: 'post',
    data: params
  })
}

export function GET_FILE_CONFIG(params) {
  // 接口请求
  return request({
    url: '/file/getFileConfig',
    method: 'get'
  })
}
