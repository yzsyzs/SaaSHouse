<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-11-29 11:05:15
 */-->
<template>
  <div id="login_bg">
    <div class="login_head">
      <el-row>
        <el-col :span="4">
          <div style="border-right: 2px solid #000;text-align: right;padding-right: 20px;">
            <img src="../../assets/images/logo_healthmal.png" style="width: 50%;height: 50%;" alt="">
          </div>
        </el-col>
        <el-col :span="20" style="text-align: left;">
          <div style="padding-left: 20px;">
            <h2 style="font-size: 1.4rem;">运动生活馆馆务SaaS系统</h2>
            <h4 style="font-size: .8rem;">Health Mall Management SaaS System</h4>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="login_main" v-if="forgetPass">
      <div class="login_main_wrapper">
        <div v-if="loginName" style="padding: 30px 0;">
          <i v-if="isLifehallMore&&lifehallNameVisible" @click="backButton" class="el-icon-back fl" style="line-height: 2"></i><h4 style="font-size: 24px;padding-bottom: 30px;">账号登录</h4>
          <div v-if="verCode">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="0px" class="demo-ruleForm">
              <el-form-item label="" prop="userName">
                <div>
                  <el-input v-model="ruleForm.userName" auto-complete="off" autofocus="autofocus" @keyup.enter.native="submitForm('ruleForm')" placeholder="用户名/手机号"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="" prop="password">
                <div>
                  <el-input type="password" v-model="ruleForm.password" auto-complete="off" @keyup.enter.native="submitForm('ruleForm')" placeholder="请输入密码"></el-input>
                </div>
              </el-form-item>
              <!--<el-form-item label="">-->
              <!--<div class="fl" style="margin-right: 10px;">-->
              <!--<el-input type="text" v-model="code" auto-complete="off" placeholder="验证码"></el-input>-->
              <!--<h6 v-if="codeText" :style="codeColor">{{codeValid}}</h6>-->
              <!--</div>-->
              <!--<p class="fr">-->
              <!--<button class="btn_code" type="button" :disabled="verDisable"-->
              <!--:style="{backgroundColor:verCodeBacColor,color: verCodeColor}" @click="getVerCode('ruleForm')"-->
              <!--v-html="verCodeContent"></button>-->
              <!--</p>-->
              <!--</el-form-item>-->
              <el-form-item style="padding: 10px 0;">
                <el-button type="primary" style="width:100%;font-size: 18px;" :loading="isLoading" @click="submitForm('ruleForm')">确 定</el-button>
              </el-form-item>
            </el-form>
            <div class="forget_pass" style="text-align: right;padding-top: 60px;">
              <a v-if="loginName" @click="forgetPass=!forgetPass">忘记密码?</a>
            </div>
          </div>
          <div v-else style="text-align: left;">
            <div style="padding: 10px 0;">当前账号: {{ruleForm.userName}}</div>
            <div v-if="isLifehallMore">
              <p v-if="lifehallNameVisible" style="padding: 10px 0;font-size: 16px;">已选生活馆: {{lifeObj.lifeName}}</p>
              <div style="padding: 30px 0;">
                <div class="fl" style="margin-right: 10px;">
                  <el-input type="text" v-model="code" auto-complete="off" @keyup.enter.native="enterLifehall" :maxlength="6" placeholder="验证码"></el-input>
                  <h6 v-if="codeText" :style="codeColor">{{codeValid}}</h6>
                </div>
                <p class="fr">
                  <button class="btn_code" type="button" :disabled="verDisable"
                          :style="{backgroundColor:verCodeBacColor,color: verCodeColor}" @click="getVerCode('ruleForm')"
                          v-html="verCodeContent"></button>
                </p>
                <div style="clear:both;"></div>
              </div>
              <el-button type="primary" style="width:100%;" :loading="isLoading" round @click="enterLifehall">进入生活馆</el-button>
            </div>
            <div style="padding: 20px 0 0 0;" v-else>
              <p style="padding: 10px 0;">选择要进入的生活馆 :</p>
              <ul style="border:1px solid #eee;overflow: auto;height:100px;padding: 10px 0;">
                <li v-for="(item,index) in lifeNameList" :key="index" style="border: 1px solid #eee;padding: 10px; ">
                  <a @click="lifehallClick(item)" class="life_hover">{{item.lifeName}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else style="padding: 30px;">
          <h4 style="font-size: 24px;padding-bottom:20px;" v-if="isUserMore">扫码登录</h4>
          <div class="twoCode">
            <div v-if="imageVisble">
              <!-- foreground: '#0275d8', background: '#000', 二维码颜色-->
              <div v-if="val.url!==''" :loading="isLoading">
                <VueQrcode :value="val.url" :options="{ size: 200 }"></VueQrcode>
                <p style="padding: 10px 0;">打开 <span style="color:#00B99E;">{{ healthApp }}</span> 扫一扫登录</p>
              </div>
              <div v-else>
                加载中...
              </div>
            </div>
            <div v-else>
              <div v-if="isUserMore">
                <img :src="codeImg" alt="" style="width: 30%;height:50%;">
                <h4 style="padding-top: 10px;">{{ msg?msg:isChange }}</h4>
                <h5 @click="backTwoCode">返回二维码登录</h5>
              </div>
              <div v-else>
                <h4 style="font-size: 24px;padding-bottom: 30px;">请选择场馆</h4>
                <p style="padding: 10px 0;">选择要进入的生活馆 :</p>
                <ul style="border:1px solid #eee;overflow: auto;height:100px;padding: 10px 0;">
                  <li v-for="(item,index) in lifeNameList" :key="index" style="border: 1px solid #eee;padding: 20px 10px; ">
                    <a @click="lifehallCodeClick(item)" class="life_hover">{{item.lifeName}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height:70px; width:70px;overflow: hidden;position: absolute;top:0;right:0;">
        <i style="position: absolute;top:0;right:0;padding-right: 20px" :class="[loginName ? activeClass: errorClass ]" @click="twoCodeClick"></i>
      </div>
    </div>
    <div class="login_main" v-else style="padding: 10px 25px 16px 25px;">
      <h4 style="font-size: 24px;padding: 30px 0;">重置密码</h4>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" status-icon label-width="0px" class="demo-ruleForm">
        <el-form-item label="" prop="phone">
          <div>
            <el-input v-model="ruleForm2.phone" @keyup.enter.native="submitForm2('ruleForm2')" autofocus="autofocus" auto-complete="off" placeholder="用户名/手机号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="" prop="newPassword">
          <div>
            <el-input type="password" v-model="ruleForm2.newPassword" @keyup.enter.native="submitForm2('ruleForm2')" auto-complete="off" placeholder="请输入密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="fl" style="margin-right: 10px;">
            <el-input type="text" v-model="code2" auto-complete="off" @keyup.enter.native="submitForm2('ruleForm2')" placeholder="验证码"></el-input>
            <h6 v-if="codeText2" :style="codeColor2">{{codeValid2}}</h6>
          </div>
          <p class="fr">

            <button class="btn_code" type="button" :disabled="verDisable2"
                    :style="{backgroundColor:verCodeBacColor2,color: verCodeColor2}" @click="getVerCode2('ruleForm2')"
                    v-html="verCodeContent2"></button>
          </p>
        </el-form-item>
        <el-form-item style="padding: 10px 0;">
          <el-button type="primary" :loading="isLoading" @keyup.enter.native="submitForm2('ruleForm2')" @click="submitForm2('ruleForm2')">确 定</el-button>
          <el-button type="default" @click="forgetPass=true">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <footer>
      @健康猫 www.healthmall.cn All rights reserved 粤ICP备15036336号-4
    </footer>
  </div>
</template>

<script>
  import regExp from '@/common/regExp'
  import { responeCode, publicKey } from '@/config/config'
  import { api } from '@/config/api'
  import { restful } from '@/servers/server'
  import VueQrcode from '@xkeshi/vue-qrcode'
  export default {
    name: 'loginBg',
    data () {
      var validatePass = (rule, value, callback) => {
        if (!/^[0-9a-zA-Z]{6,20}$/g.exec(value)) {
          callback(new Error('请输入20个以内字符，由数字、字母组成'))
          this.ruleForm.password = ''
        } else {
          callback()
        }
      }
      var validatePass3 = (rule, value, callback) => {
        if (value.replace(/\s+/g, '') === '') {
          callback(new Error('请输入账号'))
        } else if (!regExp.loginPhone.exec(value)) {
          callback(new Error('该用户名不存在'))
        } else {
          callback()
        }
      }
      var validatePass4 = (rule, value, callback) => {
        if (!/^[0-9a-zA-Z]{6,20}$/g.exec(value)) {
          callback(new Error('请输入20个以内字符，由数字、字母组成'))
          this.ruleForm2.newPassword = ''
        } else {
          callback()
        }
      }
      var validatePass6 = (rule, value, callback) => {
        if (value.replace(/\s+/g, '') === '') {
          callback(new Error('请输入账号'))
        } else if (!regExp.loginPhone.exec(value)) {
          callback(new Error('该用户名不存在'))
        } else {
          callback()
        }
      }
      return {
        // 交互的控制
        msg: null,
        loginName: true,
        forgetPass: true,
        verCode: true,
        imageVisble: true,
        isUserMore: true,
        isLifehallMore: false,
        isCodeV: true,
        isAdmin: false,
        lifeObj: {
          lifeName: null,
          lifeId: null
        },
        isLoading: false,
        lifehallNameVisible: true,
        lifeNameList: [],
        // end
        healthApp: '健康猫APP',
        interval: null,
        codeValid: null,
        codeText: false,
        codeColor: null,
        // 账号登录
        activeClass: 'desktop',
        errorClass: 'two_code',
        ruleForm: {
          password: '',
          userName: ''
        },
        code: '',
        verCodeContent: '获取验证码',
        time: 0,
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          userName: [
            { validator: validatePass3, trigger: 'blur' }
          ]
        },
        // 结束
        // 重置密码
        ruleForm2: {
          newPassword: '',
          phone: ''
        },
        code2: '',
        verCodeContent2: '获取验证码',
        time2: 0,
        interval2: null,
        codeValid2: null,
        codeText2: false,
        codeColor2: null,
        rules2: {
          newPassword: [
            { validator: validatePass4, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePass6, trigger: 'blur' }
          ]
        },
        // 二维码
        val: {
          url: '',
          identifier: ''
        },
        // 轮询定时器
        timer: null
        // end
      }
    },
    components: {
      VueQrcode
    },
    watch: {
    },
    created () {
    },
    destroyed () {
      clearTimeout(this.timer)
    },
    computed: {
      // 验证码样式
      verCodeBacColor () {
        if (this.time <= 60 && this.time !== 0) {
          this.verCodeColor = '#00B99E'
          this.verDisable = true
          return '#ddd'
        } else {
          this.verCodeColor = '#00B99E'
          this.verDisable = false
          return '#fff'
        }
      },
      verCodeBacColor2 () {
        if (this.time2 <= 60 && this.time2 !== 0) {
          this.verCodeColor2 = '#00B99E'
          this.verDisable2 = true
          return '#ddd'
        } else {
          this.verCodeColor2 = '#00B99E'
          this.verDisable2 = false
          return '#fff'
        }
      },
      // 结束
      // 汉字改变
      isChange () {
        return this.isCodeV ? '请在手机上确认登录' : `二维码已失效`
      },
      // 图片改变
      codeImg () {
        return this.isCodeV ? require('../../assets/images/icon_chenggong@2x.png') : require('../../assets/images/icon_shibai@2x.png')
      }
      // 结束
    },
    methods: {
      // 返回选择生活馆
      backButton () {
        this.isLifehallMore = !this.isLifehallMore
        this.code = ''
        this.verCodeContent = '获取验证码'
        this.codeText = false
      },
      // 二维码 点击选中场馆 直接进入后台
      lifehallCodeClick (item) {
        let self = this
        let param = {
          userName: JSON.parse(localStorage.getItem('loginData')).userName,
          lifeId: self.isAdmin ? '*' : item.lifeId
        }
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.scanAccess,
          //请求体参数
          param: param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "",
          //当前请求的缓冲字段名称
          loading: ""
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
        }
        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true) {
            localStorage.setItem('loginData', JSON.stringify(res.data))
            localStorage.setItem('accessToken', res.data && res.data.token)
            localStorage.setItem('lifeId', res.data && res.data.lifeId)
            localStorage.setItem('lifeHousePermissions', JSON.stringify(res.data && res.data.resources))
            self.$emit('validateLogin', true)
            self.$message.success({
              message: res.msg
            })
            self.$router.push({path: '/'})
          }
        })
      },
      // 账号，二维码 切换登录方法
      twoCodeClick () {
        let self = this
        self.loginName = !self.loginName
        if (self.loginName) {
          // 注销二维码
          self._cancelTwoCode()
        }
        // 重新获取二维码 url 以及轮询 对接状态
        self._getTwoUrl()
        self.imageVisble = true
      },
      // 定时器封装函数
      _timeOut () {
        let self = this
        // 3 秒刷新界面
        // 计数的
        let count = 0
        const time = () => {
          self.timer = setTimeout(() => {
            // 请求接口等待返回状态， 控制 图片的显示，以及是否跳到 首页，
            let param = {
              identifier: self.val.identifier
            }
            //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
            let config = {
              //请求方式
              method: 'post',
              //请求地址
              url: api.validateIdentifier,
              //请求体参数
              param: param,
              //成功时的处理消息 错误信息由后台控制打印
              okMsg: "获取验证码成功",
              //当前请求的缓冲字段名称
              loading: "isLoading",
              //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
              changeKeyArr: ['signRecordList']
            }
            /**
             * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
             * @config  {Object} 请求的参数主体
             * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
             * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
             */
            restful.sendMyData(config, self, (res) => {
              if (res.code === 2000 && res.success === true && res.msg === 'OK') {
                if (res.data.state === 0) {
                  self.imageVisble = false
                  self.isCodeV = false
                  self.isUserMore = true
                  self.msg = res.data.msg ? res.data.msg : null
                  clearTimeout(self.timer)
                } else if (res.data.state === 1) {
                  self.imageVisble = true
                } else if (res.data.state === 2) {
                  self.imageVisble = false
                  self.isCodeV = true
                } else {
                  // 清除定时器
                  self.imageVisble = false
                  clearTimeout(self.timer)
                  count = 0
                  // 手机端已经确实 Login 了
                  self.lifeNameList = res.data.lifeNameList
                  self.isAdmin = res.data.isAdmin
                  localStorage.setItem('loginData', JSON.stringify(res.data))
                  localStorage.setItem('accessToken', res.data && res.data.token)
                  localStorage.setItem('lifeId', res.data && res.data.lifeId)
                  localStorage.setItem('lifeHousePermissions', JSON.stringify(res.data && res.data.resources))
                  self.$emit('validateLogin', true)
                  // 是超级管理员的时候直接 跳转到进入生活馆 方法，
                  if (res.data.isAdmin === true) {
                    self.$router.push({path: '/'})
                  } else {
                    // 否则 false, 且判断 生活馆列表是否为null
                    if (res.data.lifeNameList === null) {
                      self.$message({
                        type: 'warning',
                        message: '您还没有生活馆 !'
                      })
                      return false
                    } else {
                      // 判断生活馆列表数据的个数 是否是一个，
                      if (res.data.lifeNameList.length === 1) {
                        self.$router.push({path: '/'})
                      } else {
                        // 否则 是多个场馆，  列表数据展示出来， 为true
                        self.isUserMore = false
                      }
                    }
                  }
                }
                count += 3
                if (count > 300) {
                  clearTimeout(self.timer)
                  count = 0
                  time()
                }
              } else {
                clearTimeout(self.timer)
                count = 0
                time()
              }
            })
            time()
          }, 3000)
        }
        time()
      },
      // 进入生活馆方法
      enterLifehall () {
        let self = this
        let encrypt = new self.$jsEncrypt.JSEncrypt()
        encrypt.setPublicKey(publicKey)
        let pass = encrypt.encrypt(self.ruleForm.password)
        let params = {
          userName: self.ruleForm.userName,
          password: pass
        }
        let param = {
          code: self.code,
          lifeId: self.isAdmin ? '*' : self.lifeObj.lifeId
        }
        let data = Object.assign({}, param, params)
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.enterLife,
          //请求体参数
          param: data,
        }
        if (this.code.replace(/\s+/g, '') === '') {
          this.codeText = true
          this.codeColor = {color: '#f00'}
          this.codeValid = '请输入验证码'
        } else {
          /**
           * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
           * @config  {Object} 请求的参数主体
           * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
           * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
           */
          restful.sendMyData(config, self, (res) => {
            if (res.code === 2000 && res.success === true) {
              localStorage.setItem('loginData', JSON.stringify(res.data))
              localStorage.setItem('accessToken', res.data && res.data.token)
              localStorage.setItem('lifeId', res.data && res.data.lifeId)
              localStorage.setItem('lifeHousePermissions', JSON.stringify(res.data && res.data.resources))
              self.$emit('validateLogin', true)
              if(res.data.menus&&res.data.menus.length>0&&res.data.menus[0].subNav&&res.data.menus[0].subNav.length>0){
              	self.$router.push({path: res.data.menus[0].subNav[0].route})
              	self.verDisable = false
              	clearInterval(self.interval)
              }else{
              	self.$message.error("没有可以使用的菜单权限，请联系管理员获取菜单权限")
              }
              
            } else {
              self.verCodeContent = '重新获取验证码'
              self.verDisable = false
              self.codeText = true
              self.codeValid = res.msg
              self.codeColor = {color: '#f00'}
              clearInterval(self.interval)
              return false
            }
          })
        }
      },
      // 选择生活馆赋值方法
      lifehallClick (item) {
        this.lifeObj = item
        this.isLifehallMore = true
      },
      // 注销二维码 方法
      _cancelTwoCode () {
        let self = this
        let param = {
          identifier: self.val.identifier
        }
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.removeIdentifier,
          //请求体参数
          param: param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "",
          //当前请求的缓冲字段名称
          loading: ""
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
        }
        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true) {
            self.msg = null
//            self.$message.success({
//              message: res.msg
//            })
          }
        })
      },
      // 请求接口 取 二维码url封装
      _getTwoUrl () {
        let self = this
        //  为假的时候 显示 二维码登录界面， 请求接口拿到url 赋值给val,  否则账号登录，下面请求以及轮询 不执行
        if (self.loginName === false) {
          // 传什么参数待定后端接口
          let param
          //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
          let config = {
            //请求方式
            method: 'post',
            //请求地址
            url: api.generateQrCodeUrl,
            //请求体参数
            param: param,
            //成功时的处理消息 错误信息由后台控制打印
            okMsg: "",
            //当前请求的缓冲字段名称
            loading: ""
            //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
//            changeKeyArr: ['signRecordList']
          }
          /**
           * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
           * @config  {Object} 请求的参数主体
           * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
           * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
           */

          restful.sendMyData(config, self, (res) => {
            if (res.code === 2000 && res.success === true && res.msg === 'OK') {
              // 请求接口 拿到url赋值给self.val
              self.val = res.data
              self.imageVisble = true
              self._timeOut()
            } else {
              return false
            }
          })
        } else {
          clearTimeout(self.timer)
        }
      },
      // 返回二维码 方法
      backTwoCode () {
        let self = this
//        this.isCodeV = true
        if (self.timer) {
          clearTimeout(self.timer)
        }
        // 注销二维码登录
        self._cancelTwoCode()
        // 重新获取二维码 url 以及轮询 对接状态
        self._getTwoUrl()
      },
      // 倒计时
      _coutdown () {
        clearInterval(this.interval)
        this.time = 60
        this.interval = setInterval(() => {
          this.verCodeContent = '获取验证码(' + this.time + 's)'
          this.time--
          this.verDisable = false
          if (this.time <= 0) {
            this.time = 0
            clearInterval(this.interval)
            this.verDisable = true
            this.verCodeContent = '重新获取验证码'
          }
        }, 1000)
        this.codeText = true
        this.codeColor = { color: '#03C11C' }
        this.codeValid = '验证码已下发，请查收'
      },
      _coutdown2 () {
        clearInterval(this.interval2)
        this.time2 = 60
        this.interval2 = setInterval(() => {
          this.verCodeContent2 = '获取验证码(' + this.time2 + 's)'
          this.time2--
          this.verDisable2 = false
          if (this.time2 <= 0) {
            this.time2 = 0
            clearInterval(this.interval2)
            this.verDisable2 = true
            this.verCodeContent2 = '重新获取验证码'
          }
        }, 1000)
        this.codeText2 = true
        this.codeColor2 = { color: '#03C11C' }
        this.codeValid2 = '验证码已下发，请查收'
      },
      //  获取验证码
      getVerCode (formName) {
        let self = this
        self.code = ''
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.sendCode,
          //请求体参数
          param: {userName: self.ruleForm.userName, sendType: 0},
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "获取验证码成功",
          //当前请求的缓冲字段名称
          loading: "",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['signRecordList']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true) {
            this._coutdown()
          } else {
            self.$message({
              type: 'error',
              message: res.msg
            })
            return false
          }
        })
      },
      getVerCode2 (formName) {
        let self = this
        self.code2 = ''
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.sendCode,
          //请求体参数
          param: {userName: self.ruleForm2.phone, sendType: 1},
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "获取验证码成功",
          //当前请求的缓冲字段名称
          loading: "",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['signRecordList']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */
        self.$refs[formName].validate((valid) => {
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
        })
      },
      // 重置密码
      submitForm2 (formName) {
        let self = this
        let encrypt = new self.$jsEncrypt.JSEncrypt()
        encrypt.setPublicKey(publicKey)
        let pass = encrypt.encrypt(self.ruleForm2.newPassword)
        let params = {
          phone: self.ruleForm2.phone,
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
          param: params,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "账号验证成功",
          //当前请求的缓冲字段名称
          loading: "isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['signRecordList']
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            if (self.code2.replace(/\s+/g, '') === '') {
              self.codeText2 = true
              self.codeColor2 = {color: '#f00'}
              self.codeValid2 = '请输入验证码'
            } else {
              restful.sendMyData(config, self, (res) => {
                if (res.code === 2000 && res.success === true) {
                  self.verDisable2 = false
                  self.codeText2 = false
                  clearInterval(self.interval2)
                  self.forgetPass = true
                  self.ruleForm2 = {
                    newPassword: '',
                    phone: ''
                  }
                  self.code2 = ''
                } else {
                  self.verCodeContent2 = '重新获取验证码'
                  self.verDisable2 = false
                  self.codeText2 = true
                  self.codeColor2 = {color: '#f00'}
                  self.codeValid2 = res.msg
                  clearInterval(self.interval2)
                  self.$message({
                    type: 'error',
                    message: res.msg
                  })
                  return false
                }
              })
            }
          } else {
            return false
          }
        })
      },
      //  账号登录 确认方法
      submitForm (formName) {
        let self = this
        let encrypt = new self.$jsEncrypt.JSEncrypt()
        encrypt.setPublicKey(publicKey)
        let pass = encrypt.encrypt(self.ruleForm.password)
        let params = {
          userName: self.ruleForm.userName,
          password: pass
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.login,
          //请求体参数
          param: params,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: "账号验证成功",
          //当前请求的缓冲字段名称
          loading: "isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['signRecordList']
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            /**
             * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
             * @config  {Object} 请求的参数主体
             * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
             * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
             */
            restful.sendMyData(config, self, (res) => {
              //  判断 是否成功
              if (res.code === 2000 && res.success === true && res.data.lifeNameList.length > 0) {
                self.isAdmin = res.data.isAdmin
                self.verCode = false
                // 判断是 超级管理员,  直接进入验证码，进入生活馆
                if (res.data.isAdmin === true) {
                  self.lifehallNameVisible = false
                  self.isLifehallMore = true
                } else {
                  // 否则 是一般用户 多个生活馆的，显示出多个生活馆列表，选择一个后进入验证码，进入生活馆
                  if (res.data.lifeNameList.length > 1) {
                    self.isLifehallMore = false
                    self.lifeNameList = res.data.lifeNameList
                    // 否则是一般用户 一个生活馆的，直接进入验证码，进入生活馆
                  } else if (res.data.lifeNameList.length === 1) {
                    self.isLifehallMore = true
                    self.lifehallNameVisible = false
                    self.lifeObj = res.data.lifeNameList[0]
                  }
                }
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
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #login_bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 999;
    background: url('../../assets/images/bg_dibu@2x.png') no-repeat;
    /*background-size: 100% 100%;*/
    width: 100%;
    height: 900px;
    min-width: 1200px;
  }
  .login_head {
    width: 100%;
    height: 50px;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    padding: 20px;
  }
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
  }
  .login_main {
    position: absolute;
    top: 50%;
    right: 10%;
    background: #fff;
    padding: 10px 25px 16px 25px;
    height: 400px;
    width: 340px;
    border-radius: 3px;
    margin-top: -200px;
  }
  .login_main_wrapper {
    position: relative;
  }
  .login_main h4 {
    padding-bottom: 20px;
  }
  .login_main h6 {
    padding: 5px 0 0 10px;
    line-height: 1;
    text-align: left;
  }
  .login_main h5 {
    color: #f00;
  }
  .login_main h5:hover {
    cursor: pointer;
  }
  .el-form-item div {
    position: relative;
  }
  .el-form-item div>i {
    font-size: 20px;
    position: absolute;
    right: 0;
    top: 10px;
    padding-right: 20px;
  }
  .forget_pass a {
    font-size: 16px;
  }
  .forget_pass a:hover {
    cursor: pointer;
  }
  .btn_code:hover {
    cursor: pointer;
  }
  .btn_code {
    padding: 10px;
    border-radius: 3px;
    border: 1px solid #00B99E;
  }
  .desktop {
    background: url('../../assets/images/icon_ewmdn.png') no-repeat;
    background-size: 100% 100%;
    background-position: 50px 0px;
    transition: linear .2s;
    -moz-transition: linear .2s;
    -webkit-transition: linear .2s;
    -o-transition: linear .2s;
    width: 100px;
    height: 100px;
    background-color: #fff;
  }
  .two_code {
    background: url('../../assets/images/icon_ewmdn.png') no-repeat;
    background-size: 100% 100%;
    background-position: 0px -42px;
    transition: linear .2s;
    -moz-transition: linear .2s;
    -webkit-transition: linear .2s;
    -o-transition: linear .2s;
    width: 100px;
    height: 100px;
    background-color: #fff;
  }
  .twoCode {
    padding-bottom: 20px;
  }
  .life_hover:hover {
    cursor: pointer;
    color: #00B99E;
  }
  .life_hover {
    font-size: 16px;
    color: #444A49;
  }
</style>
