<!--/*
 * @Author: yzs
 * @Date:   2017-12-06 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-12-06 11:05:15
 */-->
<template>
	<el-main>
		<!--<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">-->
		<!--<el-form-item label="原密码" prop="originalPass">-->
		<!--<div>-->
		<!--<el-input :type="classTrue1 ? typeH: typeV " v-model="ruleForm.originalPass" auto-complete="off"></el-input><i :class="[classTrue1 ? activeClass: errorClass ]" @click="classTrue1=!classTrue1"></i>-->
		<!--</div>-->
		<!--</el-form-item>-->
		<!--<el-form-item label="新密码" prop="pass">-->
		<!--<div>-->
		<!--<el-input :type="classTrue2 ? typeH: typeV " v-model="ruleForm.pass" auto-complete="off"></el-input><i :class="[classTrue2 ? activeClass: errorClass ]" @click="classTrue2=!classTrue2"></i>-->
		<!--</div>-->
		<!--</el-form-item>-->
		<!--<el-form-item label="确认密码" prop="checkPass">-->
		<!--<div>-->
		<!--<el-input :type="classTrue3 ? typeH: typeV " v-model="ruleForm.checkPass" auto-complete="off"></el-input><i :class="[classTrue3 ? activeClass: errorClass ]" @click="classTrue3=!classTrue3"></i>-->
		<!--</div>-->
		<!--</el-form-item>-->
		<!--<el-form-item>-->
		<!--<el-button type="warning" round @click="resetForm('ruleForm')">重 置</el-button>-->
		<!--<el-button type="primary" round @click="submitForm('ruleForm')">确 定</el-button>-->
		<!--<el-button round>取 消</el-button>-->
		<!--</el-form-item>-->
		<!--</el-form>-->
		<div class="login_main" style="padding: 30px 30px 0px 30px;">
			<h4 style="font-size: 24px;padding-bottom: 30px;">修改密码</h4>
			<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="0px" class="demo-ruleForm">
				<el-form-item label="">
					<div style="text-align: left;">
						当前登录账号 : {{userInfo.mobile}}
					</div>
				</el-form-item>
				<el-form-item label="" prop="newPassword">
					<div style="position: relative;">
						<el-input :type="classTrue1?typeH:typeV" v-model="ruleForm2.newPassword" auto-complete="off" placeholder="请输入密码"></el-input><i :class="[classTrue1 ? activeClass: errorClass ]" @click="classTrue1=!classTrue1"></i>
					</div>
				</el-form-item>
				<el-form-item label="">
					<div class="fl" style="margin-right: 10px;">
						<el-input type="text" v-model="code2" auto-complete="off" placeholder="验证码"></el-input>
						<h6 v-if="codeText2" :style="codeColor2">{{codeValid2}}</h6>
					</div>
					<p class="fr" style="padding:0;">

						<button class="btn_code" type="button" :disabled="verDisable2" :style="{backgroundColor:verCodeBacColor2,color: verCodeColor2}" @click="getVerCode2('ruleForm2')" v-html="verCodeContent2"></button>
					</p>
				</el-form-item>
				<el-form-item>
					<el-button :loading="loading" type="primary" style="width:100%;" @click="submitForm2('ruleForm2')">确 定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-main>
</template>

<script>
	import { publicKey } from '@/config/config'
	// import JSEncrypt from '@/common/jsencrypt'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	export default {

		// 组件的名称
		name: 'changePassword',

		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			//      var validatePass = (rule, value, callback) => {
			//        let reg = /^[0-9a-zA-Z]{6,20}$/g
			//        if (!reg.exec(value)) {
			//          callback(new Error('请输入20个以内字符，由数字、字母组成'))
			//          this.ruleForm.pass = ''
			//        } else {
			//          if (this.ruleForm.checkPass !== '') {
			//            this.$refs.ruleForm.validateField('checkPass')
			//          }
			//          callback()
			//        }
			//      }
			//      var validatePass2 = (rule, value, callback) => {
			//        if (value === '') {
			//          callback(new Error('请再次输入密码'))
			//        } else if (value !== this.ruleForm.pass) {
			//          callback(new Error('两次输入密码不一致!'))
			//        } else {
			//          callback()
			//        }
			//      }
			//      var validatePass3 = (rule, value, callback) => {
			//        if (value === '') {
			//          callback(new Error('请输入原密码'))
			//        } else if (value !== this.ruleForm.originalPass) {
			//          callback(new Error('原密码错误!'))
			//        } else {
			//          callback()
			//        }
			//      }
			var validatePass4 = (rule, value, callback) => {
				let reg = /^[0-9a-zA-Z]{6,20}$/g
				if(!reg.exec(value)) {
					callback(new Error('请输入20个以内字符，由数字、字母组成'))
					this.ruleForm2.newPassword = ''
				} else {
					callback()
				}
			}
			return {
				userInfo: {},
				// 旧密码 start
				classTrue1: true,
				//          classTrue2: true,
				//          classTrue3: true,
				activeClass: 'eye-open',
				errorClass: 'eye-down',
				typeV: 'text',
				typeH: 'password',
				//          ruleForm: {
				//            pass: '',
				//            checkPass: '',
				//            originalPass: ''
				//          },
				//          rules: {
				//            pass: [
				//              { validator: validatePass, trigger: 'blur' }
				//            ],
				//            checkPass: [
				//              { validator: validatePass2, trigger: 'blur' }
				//            ],
				//            originalPass: [
				//              { validator: validatePass3, trigger: 'blur' }
				//            ]
				//          }
				//  end
				// 重置密码
				ruleForm2: {
					newPassword: ''
				},
				code2: '',
				verCodeContent2: '获取验证码',
				time2: 0,
				interval2: null,
				codeValid2: null,
				codeText2: false,
				codeColor2: null,
				rules2: {
					newPassword: [{
						validator: validatePass4,
						trigger: 'blur'
					}]
				},
				loading:false
			}
		},
		computed:{
			//改变获取验证码背景颜色和是否可用
			verCodeBacColor2() {
				if(this.time2 <= 60 && this.time2 !== 0) {
					this.verCodeColor2 = '#00B99E'
					this.verDisable2 = true
					return '#ddd'
				}
				this.verCodeColor2 = '#00B99E'
				this.verDisable2 = false
				return '#fff'
			}
		},
		created() {
			this.userInfo = localStorage.loginData && JSON.parse(localStorage.loginData) || {
				headImgUrl: '',
				mobile: ''
			}
		},
		watch: {},
		// 组件
		components: {},

		// 方法
		methods: {
			
			// 倒计时方法
			_coutdown2() {
				clearInterval(this.interval2)
				this.time2 = 60
				this.interval2 = setInterval(() => {
					this.verCodeContent2 = '获取验证码(' + this.time2 + 's)'
					this.time2--
						this.verDisable2 = false
					if(this.time2 <= 0) {
						this.time2 = 0
						clearInterval(this.interval2)
						this.verDisable2 = true
						this.verCodeContent2 = '重新获取验证码'
					}
				}, 1000)
				this.codeText2 = true
				this.codeColor2 = {
					color: '#03C11C'
				}
				this.codeValid2 = '验证码已下发，请查收'
			},
			// 获取验证码
			getVerCode2(formName) {
				let self = this
				self.code2 = ''
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.sendCode,
					//请求体参数
					param: {
						userName: self.userInfo.mobile,
						sendType: 1
					},
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */
				restful.sendMyData(config, self, (res) => {
					if(res.code === 2000 && res.success === true) {
						this._coutdown2()
					} else {
						self.$message({
							type: 'error',
							message: res.msg
						})
						return false
					}
				})
				/*self.$refs[formName].validate((valid) => {
				  if (valid) {
				    restful.sendMyData(config, self, (res) => {
				      if (res.code === 2000 && res.success === true) {
				        this._coutdown2()
				      } else {
				        self.$message({
				          type: 'error',
				          message: res.msg
				        })
				        return false
				      }
				    })
				  } else {
				    return false
				  }
				})*/
			},
			// 修改密码确认
			submitForm2(formName) {
				let self = this
				let encrypt = new self.$jsEncrypt.JSEncrypt()
				encrypt.setPublicKey(publicKey)
				let pass = encrypt.encrypt(self.ruleForm2.newPassword)
				let params = {
					phone: self.userInfo.mobile,
					newPassword: pass,
					messageCode: self.code2
				}
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.forgetOrUpdate,
					//请求体参数
					param: params
				}
				self.$refs[formName].validate((valid) => {
					if(valid) {
						if(self.code2.replace(/\s+/g, '') === '') {
							self.codeText2 = true
							self.codeColor2 = {
								color: '#f00'
							}
							self.codeValid2 = '请输入验证码'
						} else {
							self.loading = true
							restful.sendMyData(config, self, (res) => {
								if(res.code === 2000 && res.success === true) {
									self.verDisable2 = false
									self.codeText2 = false
									clearInterval(self.interval2)
									self.ruleForm2.newPassword = ''
									self.code2 = ''
									self.verCodeContent2 = '获取验证码'
									self.time2 = 0
									self.$message.success("修改密码成功")
								} else {
									self.verCodeContent2 = '重新获取验证码'
									self.verDisable2 = false
									self.codeText2 = true
									self.codeColor2 = {
										color: '#f00'
									}
									self.codeValid2 = res.msg
									clearInterval(self.interval2)
									self.$message({
										type: 'error',
										message: res.msg
									})
								}
								self.loading = false
							})
						}
					} else {
						return false
					}
				})
			}
		}
	}
</script>

<style scoped>
	.el-form-item div {
		position: relative;
	}
	
	.el-form-item div>i {
		font-size: 20px;
		position: absolute;
		right: 2px;
		top: 2px;
		padding-right: 20px;
	}
	
	.btn_code:hover {
		cursor: pointer;
	}
	
	.btn_code {
		padding: 10px 5px;
		border-radius: 3px;
		border: 1px solid #00B99E;
	}
	
	.login_main {
		/*justify-content: center;*/
		/*align-items: center;*/
		/*position: absolute;*/
		/*top: 50%;*/
		/*left: 75%;*/
		/*-webkit-transform: translate(-50%, -50%);*/
		/*-moz-transform: translate(-50%, -50%);*/
		/*-o-transform: translate(-50%, -50%);*/
		background: #fff;
		padding: 10px 25px 30px 25px;
		height: 400px;
		width: 340px;
		border-radius: 3px;
	}
	
	.eye-open {
		background: url('../../assets/images/icon_xs.png') no-repeat;
		background-size: 50% 50%;
		background-position: 20px 10px;
		width: 40px;
		height: 30px;
		background-color: #fff;
	}
	
	.eye-down {
		background: url('../../assets/images/icon_yc.png') no-repeat;
		background-size: 50% 50%;
		background-position: 20px 12px;
		width: 40px;
		height: 30px;
		background-color: #fff;
	}
</style>