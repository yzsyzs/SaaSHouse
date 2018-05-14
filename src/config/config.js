/*
 * 配置文件
 */
import axios from 'axios'
// 分页设置
export const paginationConfig = {
	// 默认当前页数
	pageIndex: '1',
	// 每页显示多少条
	pageSize: '20',
	// 最多显示的分页按钮数
	maxSize: '10'
}
// 是否是beta环境
export let isBeta = window.location.hostname !== "managelife.healthmall.cn"
// 正则配置
export const patternConfig = {
	// 手机号
	phone: /^1\d{10}$/,
	// 身份证号
	idCard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
	// 手机号码和固话
	// TEL: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[34578]\d{9})$)/,
	tel: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1\d{10})$)/,
	// 正整数
	int: /^[1-9][0-9]*$/,
}
//乐视云播放uu
export const letvUu = isBeta ? "re0lc3ue7g" : "9oe0ifsxwh"
// 服务器地址
export let BASEURL = "http://betamanagelife2.healthmall.cn/" // 测试环境
BASEURL = isBeta ? BASEURL : "http://managelife.healthmall.cn/"//正式环境
// 后台返回的code字段
export const responeCode = {
	OK: 2000
}
export const eventBus = {
	LOGIN_SUCCESS: 'LOGIN_SUCCESS'
}
export const BmapAk = 'RaGTyrbG7s6F6aHrAdjd4AWr8hA9wtpH'

// 公钥
export const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRaZtsA1/IOtVhgcoNQo4G/CJ8lurFJjhE/P3zw7y/Vh2t6bqGgb2lp8EmZTLyDgH1i1RY5PMEPHvWRB4jRxGih3jTt9ao4b2Y5swXNovaVAW+Y+Jxe/9AwRWY6Pbcm38lc3MWL5f0hOwboAEdjwcdSfEW/X7S2qjHYq1uitGpzwIDAQAB"
