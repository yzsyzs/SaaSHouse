/*
 * 所有的接口请求api地址
 */

// 【 ~ 】别名在webpack配置的路径为 src/config/apis-p
import base from '~/base'
import area from '~/area.js'
import pavilion from '~/pavilion'
import course from '~/course'
import schedule from '~/schedule'
import order from '~/order'
import distribution from '~/distribution'
import administrator from '~/administrator'
import vipCard from '~/vipCard'
import login from '~/login'
import upload from '~/upload'
import staff from '~/staff'
import lifehallView from '~/lifehallView'
import appointmentAndSign from '~/appointmentAndSign'
// 是否是beta环境
export let isBeta = window.location.hostname !== 'managelife.healthmall.cn'
// 乐视云播放uu
export const letvUu = isBeta ? 're0lc3ue7g' : '9oe0ifsxwh'
// 服务器地址
// export let BASEURL = 'http://betamanagelife2.healthmall.cn/' // 测试环境
// export let BASEURL = 'http://betaexpmanagelife.healthmall.cn/' // 新服务器环境
// export let BASEURL = 'http://10.0.2.48:8083/' // 开发环境
// export let BASEURL = 'http://192.168.50.84:9082/' // 小朱
// export let BASEURL = 'http://192.168.50.86:9082/' // 庆春
// export let BASEURL= 'http://192.168.50.83:8082/' // 海梦
// export let BASEURL = 'http://192.168.50.85:9082/' // 丽标
// export let BASEURL = 'http://192.168.50.86:9082/' // 庆春
export let BASEURL = 'http://192.168.50.65:9082/' // 颜波
// export let BASEURL = 'http://192.168.50.89:9082/' // 陈杰
BASEURL = isBeta ? BASEURL : 'http://managelife.healthmall.cn/'
export const api = {
  // 乐视Tv
  letvUu: letvUu,
  // 基础接口
  ...base(BASEURL),
  // 获取区域接口
  ...area(BASEURL),
  // 场馆相关
  ...pavilion(BASEURL),
  // 课程相关
  ...course(BASEURL),
  // 课程表相关
  ...schedule(BASEURL),
  // 订单管理
  ...order(BASEURL),
  // 分销
  ...distribution(BASEURL),
  // 场馆管理员
  ...administrator(BASEURL),
  // 特权卡相关
  ...vipCard(BASEURL),
  // 账号登录接口
  ...login(BASEURL),
  // 体育总局
  ...lifehallView(BASEURL),
  // 上传相关
  ...upload(BASEURL),
  // 员工相关
  ...staff(BASEURL),
  // 预约签到
  ...appointmentAndSign(BASEURL),
  // 登陆接口
  loginOld: BASEURL + 'api/login'
}
