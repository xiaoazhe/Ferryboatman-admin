import { request } from '@/api/service.js'
/*
 * 爬取推送
 */

// 推送百度
export function REPTILE_PUSH_BAIDU(id) {
  // 接口请求
  return request({
    url: `/reptile/pushToBaidu/${id}`,
    method: 'post'
  })
}

// 单个网站爬取
export function REPTILE_SINGLE(data) {
  // 接口请求
  return request({
    url: '/reptile/single',
    method: 'post',
    data
  })
}

// 批量列表获取
export function REPTILE_BRING_BACK_LIST(data) {
  // 接口请求
  return request({
    url: '/reptile/bringBackList',
    method: 'post',
    data
  })
}
