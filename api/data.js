import axios from './axios'

//关于图片的请求
export const getImages = (param) => {
  return axios.request({
    url: '/api/images/do/',
    method: 'post',
    data: param
  })
}

//关于用户的请求
export const getUser = (param) => {
  return axios.request({
    url: '/api/user/do/',
    method: 'post',
    data: param
  })
}


//关于用户注册的请求
export const register = (param) => {
  return axios.request({
    url: '/api/user/register/',
    method: 'post',
    data: param
  })
}

//关于用户登录的请求
export const login = (param) => {
  return axios.request({
    url: '/api/user/login/',
    method: 'post',
    data: param
  })
}

//关于用户退出的请求
export const logout = (param) => {
  return axios.request({
    url: '/api/user/logout/',
    method: 'post',
    data: param
  })
}