<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-11-29 11:05:15
 */-->
<template>
    <el-main>
      <header>
        <el-row>
          <el-col :span="18" style="text-align: left;">
            <div class="row">
              <span>生活馆 :</span>
              <el-select :disabled="houseList.length==1" filterable v-model="lifeId" placeholder="请选择场馆" @change="lifeValueChange">
                <el-option
                  v-for="(item,index) in houseList"
                  :key="item.index"
                  :label="item.lifeName"
                  :value="item.lifeId">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-button type="primary" icon="el-icon-plus" v-if="isSuper" round @click="isVisible = true">新增角色</el-button>
          </el-col>
        </el-row>
        <el-dialog title="新增角色" :visible.sync="isVisible">
          <el-form :model="accessForm" :rules="rules" label-position="left" class="demo-ruleForm">
            <el-form-item label="名称" label-width="120px" prop="roleName">
              <el-input v-model="accessForm.roleName" auto-complete="off" :maxlength=6 placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
            <el-button type="primary" round @click="AddUserDialog">確 定</el-button>
            <el-button type="default" round @click="isVisible=false">取 消</el-button>
          </div>
        </el-dialog>
      </header>
      <section>
        <div class="access_section_top">
          <div class="access_section">
            <span style="display: inline-block;">角色 :</span>
            <ul>
              <li v-for="(item,index) in userList" :key="index">
                <a :class="{bgActiveOne:index===bgActiveOne}" @click="userListAccessConfig(item,index)">{{item.name}}</a>
              </li>
            </ul>
          </div>
          <div class="access_section">
            <span style="display: inline-block;">角色工作人员 :</span>
            <ul>
              <li v-for="(item,index) in authUserLDTO" :key="index">
                <a>{{item.name}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="access_section_main">
          <el-row style="border: 1px solid #ccc">
            <el-col :span="8">
              <h3>一级模块</h3>
              <!-- :style="{height: oneHeight + 'px'}"-->
              <ul>
                <li v-for="(item,index) in oneAccess" :key="index" @click="oneAccessConfig(item,index)">
                  <a :class="[index===bgActiveTwo?'bgActiveTwo':'oneBg']">{{item.navName}}</a>
                </li>
              </ul>
            </el-col>
            <el-col :span="8">
              <h3>二级模块</h3>
              <ul>
                <li v-for="(item,index) in twoAccessArr" :key="index" @click="twoAccessConfig(item,index)">
                  <a :style="{height: (item['subNav'].length===0?30:item['subNav'].length*30)+'px',lineHeight: (item['subNav'].length===0?30:item['subNav'].length *30)+'px',paddingBottom:item['subNav'].length*1 + 'px'}" class="access_section_main_two" ref="AccessHeight" :class="{twoStyle:threeAccessArr.length===0}">{{item.navName}}</a>
                </li>
              </ul>
            </el-col>
            <el-col :span="8">
              <h3>权限</h3>
              <div id="three_permissions">
                <el-checkbox-group v-model="threeAccessId" @change="threeAccessChange">
                  <el-checkbox class="change_permissions" v-for="(item,index) in threeAccessArr" :label="item" :key="item.id" @change="threeSingleCheck(item, $event)">{{item.navName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="isSuper" class="access_section_footer" style="text-align: left;">
          <div class="row">
            编辑角色 :
          </div>
          <div class="row" style="padding: 20px 5px;">
            <span>角色名 :</span>
            <div style="display: inline-block">
              <el-input v-model="user.name" :disabled="!isTrue" placeholder="请输入内容"></el-input>
            </div>
            <el-button v-if="isTrue" type="warning" round @click="updateAccessConfigUser">修改</el-button>
            <el-button v-if="isTrue" type="danger" round @click="deleteAccessConfigUser">删除</el-button>
          </div>
        </div>
      </section>
      <footer>
        <el-button type="primary" round @click="saveAccessConfig">保 存</el-button>
      </footer>
    </el-main>
</template>

<script>
  import { api } from '@/config/api'
  import axios from 'axios'
  import { restful } from '@/servers/server'
  import { responeCode } from '@/config/config'
  export default {

    // 组件的名称
    name: 'accessConfiguration',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {
      isDisabled: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      isTrue () {
        return this.bgActiveOne > 5 ? this.isDisabled : !this.isDisabled
      },
      isSuper () {
        return this.isTypeSuper === 'SUPER_ADMIN' ? 0 : 1
      }
    },
    // 数据绑定
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空'))
        }
      }
      return {
        // 判断登录用户是否是SaaS管理员
        isTypeSuper: null,
        isLoading: false,
        // 权限模块
        oneHeight: null,
        oneAccess: [],
        twoAccessArr: [],
        threeAccessArr: [],
        threeAccessId: [],
        tempArrIds: [],
        excludeIds: [],
        // 结束
        // 场馆关联
        houseList: [],
        lifeId: '',
        userList: [],
        bgActiveOne: 0,
        bgActiveTwo: 0,
        authUserLDTO: [],
        user: {
          id: null,
          name: null
        },
        // 结束
        // 新增角色
        accessForm: {
          roleName: ''
        },
        rules: {
          roleName: [
            {validator: checkName, trigger: 'blur'}
          ]
        },
        isVisible: false
        // 结束
      }
    },
    // 组件
    components: {
    },

    // 方法
    methods: {
      /**
       * 三级选中权限方法
       */
      threeSingleCheck (...args) {
        let self = this
        let target = args[0]
        let b = args[1]
        let isExist = false
        // 未 选中的 数组 excludeIds 中的 item === 选中权限的id , 为true的时候 splice(index, 1)
        self.excludeIds.forEach((item, index) => {
          if (item === target.id) {
            isExist = true
            if (b) self.excludeIds.splice(index, 1)
          }
        })
        if (!isExist && !b) self.excludeIds.push(target.id)
      },
      // TODO 列表联动模块部分
      // 一级联动数据方法
      oneAccessConfig (item, index) {
        let self = this
        let threeArr = []
        self.twoAccessArr = item['subNav']
        self.twoAccessArr.forEach((item) => {
          if (item['subNav'].length !== 0) {
            threeArr.push(item['subNav'])
          }
        })
        self.threeAccessArr = [].concat.apply([], threeArr)
        // 遍历，每一个一级模块下的 三级权限数组
        self.threeAccessArr.forEach((item) => {
          if (item.checked) {
            let s = true
            // 选择出一级模块下的三级权限的 item.checked 为 true 的 id 和 目标数组中的对象 id 对比， 找到了，不添加，否则push进去，
            for (let i = 0, len = self.tempArrIds.length; i < len; i++) {
              if (item.id === self.tempArrIds[i].id) s = false
            }
            // 如果 当前的id 和 未选中的 excludeIds 数组中的id 相等 s 为false
            for (let j = 0, len = self.excludeIds.length; j < len; j++) {
              if (item.id === self.excludeIds[j]) s = false
            }
            if (s) self.tempArrIds.push(item)
          }
        })
        // v-model绑定的 threeAccessId 数组
        self.threeAccessId = self.tempArrIds
        self.bgActiveTwo = index
      },
      // 一层高度方法
//      _sumOneAccess () {
//        console.log(this.$refs.AccessHeight)
//        let sum = []
//        this.$refs.AccessHeight.forEach((item) => {
//          sum.push(item.style.height)
//          sum.push(item.style.padding)
//        })
//        console.log(sum)
//        let arr = sum.map(x => x.slice(0,x.length - 2))
//        console.log(arr)
//        this.oneHeight = arr.reduce((sum, val) => {
//          return parseFloat(sum) + parseFloat(val)
//        })
//        console.log(this.oneHeight)
//      },
      // 二级联动数据方法
      twoAccessConfig (item, index) {
      },
      // 三级联动权限选中方法
      threeAccessChange (value) {
        let self = this
        self.tempArrIds = value || []
      },
      // 保存整个 权限页面记录
      saveAccessConfig () {
        let self = this
        let arrId = []
        if (self.threeAccessId.length > 0) {
          self.threeAccessId.forEach((item) => {
            arrId.push(item.id)
          })
        }
        let param = {
          lifeId: self.lifeId,
          resources: arrId,
          roleId: self.user.id
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method:'post',
          //请求地址
          url: api.distributeResource,
          //请求体参数
          param:param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg:"",
          //当前请求的缓冲字段名称
          loading:"isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr:['allChina']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            self.$message({
              type: 'success',
              message: res.data
            })
          }
        })
      },
      // TODO 列表联动结束
      // TODO 场馆角色联动模块部分
      // 生活馆得值改变方法
      lifeValueChange (val) {
        let self = this
        self.lifeId = val
        let param = {
          lifeId: self.lifeId,
          origin: 0
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.rolesAndUsers,
          //请求体参数
          param: param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: '',
          //当前请求的缓冲字段名称
          loading: 'isLoading',
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['allChina']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            // 清空视图数据
            self.authUserLDTO = []
            self.threeAccessArr = []
            self.oneAccess = []
            self.twoAccessArr = []
            self.threeAccessId = []
            self.tempArrIds = []
            if (res.data.data.length === 0) {
              self.userList = []
              return false
            } else {
              self.userList = res.data.data
              self.authUserLDTO = self.userList[0].authUserLDTO
              self.user.id = self.userList[0].id
              self.user.name = self.userList[0].name
              // 公共资源 三个模块 最后是权限方法
              self.publicAccess()
            }
          }
        })
      },
      // 点击角色方法
      userListAccessConfig (item, index) {
        let self = this
        self.bgActiveOne = index
        self.user.id = item.id
        self.user.name = item.name
        if (self.userList.length !== 0) {
          self.authUserLDTO = item['authUserLDTO']
        }
        // 清空视图数据
        self.threeAccessArr = []
        self.oneAccess = []
        self.twoAccessArr = []
        self.threeAccessId = []
        self.bgActiveTwo = 0
        self.tempArrIds = []
        // TODO 联动id 参数 /${item.id}
        // 公共资源 三个模块 最后是权限方法
        self.publicAccess()
      },
      // 新增角色確定方法
      AddUserDialog () {
        let self = this
        if (self.accessForm.roleName.replace(/\s+/g, '') === '') {
          self.$message({
            type: 'error',
            message: '角色名称不能为空'
          })
        } else {
          let param = {
            lifeId: self.lifeId,
            roleName: self.accessForm.roleName
          }
          //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
          let config = {
            //请求方式
            method:'post',
            //请求地址
            url: api.addRole,
            //请求体参数
            param:param,
            //成功时的处理消息 错误信息由后台控制打印
            okMsg:"",
            //当前请求的缓冲字段名称
            loading:"isLoading",
            //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
            changeKeyArr:['allChina']
          }
          /**
           * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
           * @config  {Object} 请求的参数主体
           * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
           * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
           */

          restful.sendMyData(config, self, (res) => {
            if (res.code === 2000 && res.success === true && res.msg === 'OK') {
              self.isVisible = false
              self.accessForm.roleName = ''
              // 公共角色方法
              self.publicRole()
            }
          })
        }
      },
      // 公共资源 三个模块 最后是权限方法
      publicAccess () {
        let self = this
        let param = {
          roleId: self.user.id
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method:'post',
          //请求地址
          url: api.roleResource,
          //请求体参数
          param:param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg:"",
          //当前请求的缓冲字段名称
          loading:"isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr:['allChina']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */
//        self.$nextTick(() => {
          // DOM 现在更新了
        let threeArr = []
        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            if (res.data === null) {
              return false
            } else {
              self.oneAccess = res.data
              self.oneAccess.forEach((item) => {
                item['subNav'].forEach((obj) => {
                  obj['subNav'].forEach((val) => {
                    if (val.checked) {
                      self.tempArrIds.push(val)
                    }
                  })
                })
              })
              self.twoAccessArr = self.oneAccess[0]['subNav']
              self.twoAccessArr.forEach((item) => {
                threeArr.push(item['subNav'])
              })
              self.threeAccessArr = [].concat.apply([], threeArr)
              // 遍历，每一个一级模块下的 三级权限数组
              self.threeAccessArr.forEach((item) => {
                if (item.checked) {
                  let s = true
                  // 选择出一级模块下的三级权限的 item.checked 为 true 的 id 和 目标数组中的对象 id 对比， 找到了，不添加，否则push进去，
                  for (let i = 0, len = self.tempArrIds.length; i < len; i++) {
                    if (item.id === self.tempArrIds[i].id) s = false
                  }
                  if (s) self.tempArrIds.push(item)
                }
              })
              // v-model绑定的 threeAccessId 数组
              self.threeAccessId = self.tempArrIds
            }
          }
        })
//        })
      },
      // 公共角色方法
      publicRole () {
        let self = this
        let param = {
          lifeId: self.lifeId,
          origin: 0
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.rolesAndUsers,
          //请求体参数
          param: param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg: '',
          //当前请求的缓冲字段名称
          loading: 'isLoading',
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr: ['allChina']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            if (res.data.data.length === 0) {
              self.userList = []
              self.bgActiveOne = 0
              return false
            } else {
              self.userList = res.data.data
              self.bgActiveOne = 0
              self.authUserLDTO = self.userList[0].authUserLDTO
              self.user.id = self.userList[0].id
              self.user.name = self.userList[0].name
            }
          }
        })
      },
      // 修改按钮方法
      updateAccessConfigUser () {
        let self = this
        let param = {
          lifeId: self.lifeId,
          roleId: self.user.id,
          roleName: self.user.name
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method:'post',
          //请求地址
          url: api.editRole,
          //请求体参数
          param:param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg:"",
          //当前请求的缓冲字段名称
          loading:"isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr:['allChina']
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            // 公共角色方法
            self.publicRole()
          }
        })
      },
      // 删除角色确定方法
      deleteAccessConfigUser () {
        let self = this
        let param = {
          roleId: self.user.id
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method:'post',
          //请求地址
          url: api.deleteRole,
          //请求体参数
          param:param,
          //成功时的处理消息 错误信息由后台控制打印
          okMsg:"",
          //当前请求的缓冲字段名称
          loading:"isLoading",
          //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
          changeKeyArr:['allChina']
        }
        this.$confirm('确定删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // TODO 此处请求接口成功后执行，否则失败 ${this.user.id}
//          this._deleteUser(`static/lifehall.json/${this.user.id}`)
          /**
           * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
           * @config  {Object} 请求的参数主体
           * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
           * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
           */
          restful.sendMyData(config, self, (res) => {
            if (res.code === 2000 && res.success === true && res.msg === 'OK') {
              self.userList.splice(this.bgActiveOne, 1)
              self.bgActiveOne = 0
              let param = {
                lifeId: self.lifeId,
                origin: 0
              }
              //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
              let config = {
                //请求方式
                method: 'post',
                //请求地址
                url: api.rolesAndUsers,
                //请求体参数
                param: param,
                //成功时的处理消息 错误信息由后台控制打印
                okMsg: '',
                //当前请求的缓冲字段名称
                loading: 'isLoading',
                //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
                changeKeyArr: ['allChina']
              }
              /**
               * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
               * @config  {Object} 请求的参数主体
               * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
               * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
               */
              restful.sendMyData(config, self, (res) => {
                if (res.code === 2000 && res.success === true && res.msg === 'OK') {
                  if (res.data.data.length === 0) {
                    self.userList = []
                    return false
                  } else {
                    self.tempArrIds = []
                    self.userList = res.data.data
                    self.authUserLDTO = self.userList[0].authUserLDTO
                    self.user.id = self.userList[0].id
                    self.user.name = self.userList[0].name
                    // 公共资源 三个模块 最后是权限方法
                    self.publicAccess()
                  }
                }
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      },
      /*
     *  获取场馆列表
     */
      getLifeHouse () {
        let self = this
        let getLifeUrl = api.getLifeNameList
        self.sendReq(getLifeUrl, {method: 'POST'}, (res) => {
          self.houseList = res
          // 默认生活馆lifeId
          self.lifeId = self.houseList[0].lifeId
          self.houseList.forEach((item, index) => {
            if (self.lifeId === item.lifeId) self.lifeName = item.lifeName
          })
          let param = {
            lifeId: self.lifeId,
            origin: 0
          }
          //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
          let config = {
            //请求方式
            method:'post',
            //请求地址
            url: api.rolesAndUsers,
            //请求体参数
            param:param,
            //成功时的处理消息 错误信息由后台控制打印
            okMsg:"",
            //当前请求的缓冲字段名称
            loading:"isLoading",
            //需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined
            changeKeyArr:['allChina']
          }
          /**
           * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
           * @config  {Object} 请求的参数主体
           * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
           * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
           */

          restful.sendMyData(config, self, (res) => {
            if (res.code === 2000 && res.success === true && res.msg === 'OK') {
              if (res.data.data.length === 0) {
                self.userList = []
                return false
              } else {
                self.tempArrIds = []
                self.userList = res.data.data
                self.authUserLDTO = self.userList[0].authUserLDTO
                self.user.id = self.userList[0].id
                self.user.name = self.userList[0].name
                // 公共资源 三个模块 最后是权限方法
                self.publicAccess()
              }
            } else {
              return false
            }
          })
        })
      },
      /*
     * 发送请求
     */
      sendReq (url, params, callback) {
        let self = this;
        axios({
          method: params.method || 'POST',
          url: url,
          data: params.data || {}
        }).then((res) => {
          this.loading = false
          if (res && res.data && res.data.code === responeCode.OK) {
            if (res.data.page_info) self.page_info = res.data.page_info
            callback && callback(res.data.data);
          } else {
            this.$message.error('失败提示: ' + (res.data && res.data.msg || '返回数据异常'))
            console.warn("groupCurriculum sendReq res ", res)
          }
        }, (error) => {
          this.loading = false
          this.$message.error('出现错误 ' + error)
          console.warn("groupCurriculum sendReq error ", error)
        })
      }
      // TODO 场馆角色联动结束
    },
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created () {
      this.isTypeSuper = JSON.parse(localStorage.getItem('loginData')).type
      // 获取生活馆数据
//      let lifeData = localStorage.getItem('loginData')
      this.getLifeHouse()
    },

    // 完成挂载，相当于dom ready
    mounted(){
    },
    // 销毁，可以做一些定时器的消费等操作
    destored(){}
  }
</script>

<style lang="scss" scoped>
  footer {
    padding: 20px;
  }
  .row {
    padding: 5px;
  }
  .row span {
    padding-right: 10px;
    display: inline-block;
  }
  .access_section_top,.access_section_footer {
    height: 100%;
    padding: 10px 0;
  }
  .access_section_top .access_section {
    text-align: left;
    height: 100%;
    padding: 10px 3px;
  }
  .access_section_top .access_section ul {
    display: inline-block;
  }
  .access_section_top .access_section ul li {
    display: inline-block;
    margin-right: 10px;
  }
  .access_section_top .access_section ul li a{
    padding: 10px;
    font-size: 20px;
    border-radius: 20px;
  }
  .bgActiveOne {
    border: 1px solid #00B99E;
  }
  .bgActiveTwo{
    background: #00B99E;
    color: #fff;
  }
  .oneBg {
    background: #eee;
  }
  .access_section_main ul {
    height: 100%;
    /*border: 2px solid #aaa;*/
    border-radius: 2px;
    li {
      padding: 5px;
    }
  }
  .access_section_main ul li a {
    display: block;
    height:30px;
    line-height: 30px;
    /*border-bottom: 1px solid #ccc;*/
  }
  .el-checkbox + .el-checkbox {
    margin: 0 !important;
  }
  .access_section_main h3 {
    padding: 10px;
  }
  .access_section_main_two {
    background: #efefef;
    color: #000;
  }
  .access_section_main_two:hover {
    cursor: default;
  }
  /* 权限样式*/
  .change_permissions {
    display: block;
    height: 30px;
    line-height: 30px;
    text-align: left;
    padding: 1px 10px;
  }
  #three_permissions {
    height: 100%;
    border-radius: 2px;
    padding: 5px;
  }
  #three_permissions label:nth-child(odd) {
    background: #efefef;
  }
  .twoStyle {
    background: #efefef;
    height: 30px !important;
    line-height: 30px !important;
  }
</style>
