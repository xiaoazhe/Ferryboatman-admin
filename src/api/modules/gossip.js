import { request } from '@/api/service.js'

export function GOSSIP_PAGE(page, size, name) {
  // 接口请求
  return request({
    url: `/gossip/findPage`,
    method: 'post',
    data: {
      pageNum: page,
      pageSize: size,
      name: name
    }
  })
}

export function GOSSIP_DELETE(id) {
  // 接口请求
  return request({
    url: `/gossip/${id}`,
    method: 'DELETE'
  })
}

export function GOSSIP_FIND_ID(id) {
  // 接口请求
  return request({
    url: `/gossip/${id}`,
    method: 'get'
  })
}

