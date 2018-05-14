import { BASEURL } from '@/config/api'
import c from './members/c.js'
const checkPermission = (permission) => {
  let pms = localStorage.getItem('lifeHousePermissions')
  let index = pms.indexOf('/' + permission.split(BASEURL)[1])
  return (index > 1)
}

/**
 * 权限状态树
 * 因为权限这块的数据是根据后台返回来的数据进行获取而已，所以这里设置到的主要操作就是 getter
 */
const state = {
  ...c(checkPermission)
}
export default state
