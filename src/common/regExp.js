// 正则配置
export default {
	// 手机号
	phone: /^1\d{10}$/,
	// 身份证号
	idCard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
	// 手机号码和固话
	// TEL: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[34578]\d{9})$)/,
	tel: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1\d{10})$)/,
	// 正整数
	int: /^[1-9][0-9]*$/,
  // 整数
  roundNmuber: /^[0-9]*$/,
  // 小数点后两位
  float2: /^\d+(\.\d{1,2})?$/,
  // 登录账号验证
  loginPhone: /^[1][3,4,5,7,8][0-9]{9}$/
}
