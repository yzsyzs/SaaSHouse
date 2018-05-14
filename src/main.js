// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import store from './store'
import '../theme/index.css'
import '@/css/common.css'
// import 'static/echarts.js'
import ELEMENT from 'element-ui'
import JsEncrypt from 'jsencrypt/bin/jsencrypt'

// 根元素html字体大小随屏幕变化
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = 6 * (clientWidth / 640) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

// 权限校验
window.checkPermission = function (permission) {
  let pms = localStorage.getItem('lifeHousePermissions')
  let index = pms.indexOf('/' + permission)
  if (index > -1) {
    return true
  }
  return false
}

// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在请求发出之前进行一些操作
  // 设置请求头可以携带cookie之后，后台的验证可以通过头部的cookie去验证
  // 跨域携带cookie
  config.withCredentials = true
  if (localStorage.getItem('accessToken')) {
    config.headers.token = localStorage.getItem('accessToken')
  } else {
    // TODO 如果没有token需要返回登录页面
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(function (res) {
  // 在这里对返回的数据进行处理
  // 回到登陆页
  if (res.data.code === 3425) {
    localStorage.removeItem('accessToken')
    var errMsg = res.data.msg
    ELEMENT.Message.error(errMsg + ' 请重新登录')
    router.push('/login')
  }
  return res
}, function (err) {
  return Promise.reject(err)
})

// Vue.use(ELEMENT)
Vue.use(VueAxios, axios)

// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

// 将jsencrypt压入到Vue
Vue.prototype.$jsEncrypt = JsEncrypt

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
