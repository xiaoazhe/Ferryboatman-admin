import { request } from '@/api/service.js'
export function ADMIN_LOGIN (account, password) {
  // 接口请求
  return request({
    url: '/login',
    method: 'post',
    data: { account, password }
  })
}

export function FACE_QR_CODE (account, password) {
  // 接口请求
  return request({
    url: '/qrcode',
    method: 'get'
  })
}


export function CHECK_QR_CODE (params) {
  // 接口请求
  return request({
    url: `/qrcode/${params.code}`,
    method: 'get'
  })
}

export function CHECK_FACE (data) {
  // 接口请求
  let config = {}
  config.data = data
  config.headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'multipart/form-data'
  }
  config.transformRequest = data
  return request({
    method: 'post',
    url: '/checkFace',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function FACE_LOGIN (data, code) {
  let config = {}
  config.data = data
  config.headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'multipart/form-data'
  }
  config.transformRequest = data
  // 接口请求
  return request({
    method: 'post',
    url: `/faceLogin/${code}`,
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
