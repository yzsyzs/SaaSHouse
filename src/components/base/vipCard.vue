<!--
  特权卡组件
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-show="vipCardDetail">
  
      <el-row>
  
        <el-row>
  
          <p class="title">特权卡信息</p>
  
        </el-row>
  
        <el-row>
  
          <el-form-item class="fl pdl40" label="特权卡名称" prop="name">
  
            <el-input v-model="ruleForm.name" placeholder="请输入场馆名称"></el-input>
  
          </el-form-item>
  
        </el-row>
  
        <el-row>
  
          <el-form-item class="fl pdl40" label="特权卡类型" prop="cardType">
  
            <el-select clearable v-model="ruleForm.cardType" placeholder="请选择特权卡类型" @change="handleCardTypeChange">
  
              <el-option v-for="item in cardTypeArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
  
            </el-select>
  
          </el-form-item>
  
        </el-row>
  
        <el-row>
  
          <div class="help-tip">
  
            <p>当前特权卡将会在选中的生活馆销售和使用。</p>
  
          </div>
  
  
  
          <el-form-item class="fl pdl40" label="适用场馆：" prop="lifeId">
  
            <el-select filterable clearable v-model="ruleForm.lifeId" placeholder="请选择使用场馆" @change='setLifeHouse'>
  
              <el-option v-for="item in lifeList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId">
  
              </el-option>
  
            </el-select>
  
          </el-form-item>
  
        </el-row>
  
      </el-row>
  
  
  
      <el-row>
  
        <p class="title">设置价格</p>
  
        <el-row v-if='ruleForm.cardType == 0'>
  
          <el-form-item class="fl" label="团课" prop="groupCount">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.groupCount" placeholder="请输入"></el-input>
  
            <span class="pdl10">节</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="私教课" prop="personalCount">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.personalCount" placeholder="请输入"></el-input>
  
            <span class="pdl10">节</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="原价" prop="originPrice">
  
            <el-input type="number" style="width:100px" v-model="ruleForm.originPrice" placeholder="请输入"></el-input>
  
            <span class="pdl10">元</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="售价" prop="sellPrice">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.sellPrice" placeholder="请输入"></el-input>
  
            <span class="pdl10">元</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="有效期" prop="validPeriod">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.validPeriod" placeholder="不限"></el-input>
  
            <span class="pdl10">天</span>
  
          </el-form-item>
  
        </el-row>
  
  
  
        <el-row v-if='ruleForm.cardType == 1'>
  
          <el-form-item class="fl" label="期限天数" prop="validPeriod2">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.validPeriod2" placeholder="请输入"></el-input>
  
            <span class="pdl10">天</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="原价" prop="originPrice">
  
            <el-input type="number" style="width:100px" v-model="ruleForm.originPrice" placeholder="请输入"></el-input>
  
            <span class="pdl10">元</span>
  
          </el-form-item>
  
  
  
          <el-form-item class="fl" label="售价" prop="sellPrice">
  
            <el-input style="width:100px" type="number" v-model="ruleForm.sellPrice" placeholder="请输入"></el-input>
  
            <span class="pdl10">元</span>
  
          </el-form-item>
  
  
  
          <div style="position: relative; display: inline-block;padding-left: 20px;" class="fl">
  
            <div class="help-tip">
  
              <p>输入数字表示赠送可预约团课的次数</p>
  
            </div>
  
            <el-form-item label="赠送团课" prop="groupCount2">
  
              <el-input style="width:100px" type="number" v-model="ruleForm.groupCount2" placeholder=""></el-input>
  
              <span class="pdl10">节</span>
  
            </el-form-item>
  
          </div>
  
  
  
          <div style="position: relative; display: inline-block;padding-left: 30px;" class="fl">
  
            <div class="help-tip">
  
              <p>输入数字表示赠送可预约私教课的次数</p>
  
            </div>
  
            <el-form-item label="赠送私教课" prop="personalCount2">
  
              <el-input style="width:100px" type="number" v-model="ruleForm.personalCount2" placeholder=""></el-input>
  
              <span class="pdl10">节</span>
  
            </el-form-item>
  
          </div>
  
  
  
        </el-row>
  
      </el-row>
  
  
  
      <el-row v-if='ruleForm.lifeId'>
  
        <p class="title" style="padding-bottom: 20px;">可预约的团课（已选：{{ruleForm.groupCourseIds.length}}）</p>
  
        <el-collapse v-model="collapseActiveGroupClassName">
  
          <el-collapse-item name="open">
  
            <el-table ref="canBookGroupClassTable" :data="canBookGroupClassData" tooltip-effect="dark" style="width: 100%; background: #fff;" @selection-change="handleSelectGroupClass">
  
              <el-table-column type="selection" width="55">
  
              </el-table-column>
  
              <el-table-column label="全选" show-overflow-tooltip>
  
              </el-table-column>
  
              <el-table-column prop="lifeName" label="生活馆" show-overflow-tooltip>
  
              </el-table-column>
  
              <el-table-column prop="courseName" label="课程名称" show-overflow-tooltip>
  
              </el-table-column>
  
            </el-table>
  
          </el-collapse-item>
  
        </el-collapse>
  
      </el-row>
  
  
  
      <el-row v-if='ruleForm.lifeId'>
  
        <p class="title">可预约的私教课（已选：{{ruleForm.personalCourseIds.length}}）</p>
  
        <el-collapse v-model="collapseActivePrivateClassName">
  
          <el-collapse-item name="open">
  
            <el-table ref="canBookPrivateClassTable" :data="canBookPrivateClassData" tooltip-effect="dark" style="width: 100%; background: #fff;" @selection-change="handleSelectPrivateClass">
  
              <el-table-column type="selection" width="55">
  
              </el-table-column>
  
              <el-table-column label="全选" show-overflow-tooltip>
  
              </el-table-column>
  
              <el-table-column prop="lifeName" label="生活馆" show-overflow-tooltip>
  
              </el-table-column>
  
              <el-table-column prop="courseName" label="课程名称" show-overflow-tooltip>
  
              </el-table-column>
  
  
  
              <el-table-column prop="coachName" label="导师" show-overflow-tooltip>
  
              </el-table-column>
  
            </el-table>
  
          </el-collapse-item>
  
        </el-collapse>
  
      </el-row>
  
  
  
      <el-row>
  
        <p class="title">高级设置</p>
  
        <el-row>
  
          <div class="help-tip">
  
            <p>排序指展示给会员时的先后顺序，数字大的排在前面。</p>
  
          </div>
  
          <el-form-item width="100%" class="fl pdl40" label="展示排序：" prop="sortNo">
  
            <el-input type="number" v-model="ruleForm.sortNo" placeholder="请输入"></el-input>
  
          </el-form-item>
  
        </el-row>
  
  
  
        <el-row>
  
          <div class="help-tip">
  
            <p>每个会员一共可以买多少张这种特权卡。</p>
  
          </div>
  
          <el-form-item class="fl pdl40" label="每名会员最多购买：" label-width="160px" prop="allowBuyCount">
  
            <el-input type='number' v-model="ruleForm.allowBuyCount" placeholder="请输入"></el-input>
  
          </el-form-item>
  
        </el-row>
  
  
  
        <el-row>
  
          <div class="help-tip">
  
            <p>指从会员特权卡生效日期。</p>
  
          </div>
  
          <el-form-item class="fl" label="特权卡激活时间：" label-width="180px" prop="activateType">
  
            <el-radio-group v-model="ruleForm.activateType" @change='setActiveType'>
  
              <el-radio :label="0">支付成功</el-radio>
  
              <el-radio :label="1">用户手动激活卡片</el-radio>
  
            </el-radio-group>
  
          </el-form-item>
  
          <el-form-item class='fl' label-width="10px" prop='autoActivateTime'>
  
            <span>
  
                （ 若用户不激活，自购买日计算
  
                  <el-input
  
                    type='number'
  
                    :disabled='ruleForm.activateType !== 1'
  
                    style="width:100px;"
  
                    v-model="ruleForm.autoActivateTime"
  
                    placeholder="请输入"
  
                  ></el-input>
  
                天自动激活 ）
  
              </span>
  
          </el-form-item>
  
        </el-row>
  
  
  
        <el-row>
  
          <div class="help-tip">
  
            <p>场馆可设置特权卡面背景，设置好后可在手机的特权卡页面中展示。</p>
  
          </div>
  
          <el-form-item class="fl pdl40" label="会员卡背景：" label-width="120px" prop="imgId">
  
            <div class="vipCard_img-div">
  
              <label v-for="item in countCardArr" :key="item.imgId">
  
                  <input type="radio" style="display:none">
  
                  <img
  
                    ref="cardImgRef"
  
                    :key="item.imgId"
  
                    :id="item.imgId"
  
                    :src="item.imgUrl"
  
                    @click="handleCardBImgChange"
  
                  />
  
                </label>
  
            </div>
  
          </el-form-item>
  
        </el-row>
  
        <el-row>
  
          <el-form-item class="fl pdl40" label="简介：" label-width="120px" prop="remark">
  
            <el-input

              style="width: 400px" 

              :rows="4" 

              type="textarea" 

              v-model="ruleForm.remark"

              :maxlength="500" 

              placeholder="显示在会员卡购买页，500字内"

            />
  
          </el-form-item>
  
        </el-row>
  
      </el-row>
  
      <el-form-item>
  
        <el-button v-if="vipCardSave" type="primary" @click="submitForm('ruleForm')" :loading='isLoading'>确定</el-button>
  
        <el-button @click="resetForm('ruleForm')">取消</el-button>
  
      </el-form-item>
  
    </el-form>
  
  </el-main>
</template>

<script>

  import { mapGetters } from 'vuex'

  import {
  
    responeCode
  
  } from '@/config/config'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import regExp from '@/common/regExp'
  
  import {
  
    restful
  
  } from '@/servers/server'
  
  export default {
  
    // 组件的名称
  
    name: 'vipCard',
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {
  
      vipCard: {
  
        type: Object,
  
        default: () => {}
  
      },
  
      isEdit: {
  
        type: Boolean,
  
        default: false
  
      }
  
    },

    computed: {

      ...mapGetters([
        
        'vipCardSave',

        'vipCardDetail'
    
      ])
    
    },
  
    // 数据绑定
  
    data() {
  
      let validateActivateType = (rule, value, callback) => {
  
          if ((!value && value !== 0) && !this.ruleForm.autoActivateTime) return callback(new Error('请选择特权卡激活方式或者输入自动激活天数'))
  
          // 这里的必须要执行callback,不然表单验证通过的时候不会执行
  
          return callback()
  
        },
  
        validateName = (rule, value, callback) => {
  
          if (value && value.length > 6) return callback(new Error('特权卡名称最多输入6个字符'))
  
          return callback()
  
        },
  
        validateC = (rule, value, callback) => {
  
          if (value < 0) return callback(new Error('必须大于等于0'))
  
          if (value > 0 && !regExp.roundNmuber.test(value)) return callback(new Error('节数必须为整数'))
  
          return callback()
  
        },
  
        validateV = (rule, value, callback) => {
  
          if (value < 1) return callback(new Error('必须大于等于1'))
  
          if (value > 1 && !regExp.roundNmuber.test(value)) return callback(new Error('节数必须为整数'))
  
          return callback()
  
        },
  
        validateP = (rule, value, callback) => {
  
          if (value < 0) return callback(new Error('价格必须大于等于0'))
  
          if (value > 0 && !regExp.float2.test(value)) return callback(new Error('价格只能有两位小数'))
  
          return callback()
  
        },
  
        validateRN = (rule, value, callback) => {
  
          if (value && (!regExp.roundNmuber.test(value) || value < 0)) return callback(new Error('请输入大于等于0的整数'))
  
          return callback()
  
        },
  
        validateRemark = (rule, value, callback) => {
  
          if (value && value.length > 500) return callback(new Error('最多输入500个字符'))
  
          return callback()
  
        }
  
      return {
  
        isLoading: false,
  
        // 生活馆列表
  
        lifeList: [],
  
        cardTypeArr: [{
  
          name: '计次卡',
  
          id: 0
  
        }, {
  
          name: '期限卡',
  
          id: 1
  
        }],
  
        suitableHouseArr: [{
  
          name: '健康猫生活馆1号馆',
  
          id: 0
  
        }, {
  
          name: '健康猫生活馆2号馆',
  
          id: 1
  
        }, {
  
          name: '健康猫生活馆3号馆',
  
          id: 2
  
        }],
  
        // 可预约团课列表数据
  
        canBookGroupClassData: [],
  
        // 可预约私教课列表数据
  
        canBookPrivateClassData: [],
  
        // collapseActiveName变量的作用是初始化的可预约团课跟私教课的折叠面板展开
  
        collapseActiveGroupClassName: ["open"],
  
        collapseActivePrivateClassName: ['open'],
  
        countCardArr: [],
  
        ruleForm: {
  
          // 特权卡类型, 默认选择期限卡
  
          cardType: 1,
  
          // 如果是引用类型的话这里需要做初始化
  
          // 团课id
  
          groupCourseIds: [],
  
          // 私教课id
  
          personalCourseIds: [],
  
          // 激活类型
  
          activateType: '',
  
          // 允许最多购买
  
          allowBuyCount: '',
  
          // 自动激活时间
  
          autoActivateTime: '',
  
          // 私教课购买节数
  
          personalCount: 0,
  
          // 团课购买节数
  
          groupCount: 0,
  
          // 特权卡id
  
          id: "",
  
          // 卡背景图片id
  
          imgId: "",
  
          // 卡背景图url
  
          imgUrl: "",
  
          // 生活馆id
  
          lifeId: "",
  
          // 特权卡名称
  
          name: "",
  
          // 原价
  
          originPrice: '',
  
          // 售价
  
          sellPrice: '',
  
          // 有效期
  
          validPeriod: '',
  
          // 简介
  
          remark: "",
  
          // 展示排序
  
          sortNo: ''
  
        },
  
        rules: {
  
          name: [{
  
            required: true,
  
            message: "请输入特权卡名称"
  
          }, {
  
            validator: validateName
  
          }],
  
          cardType: [{
  
            type: 'number',
  
            required: true,
  
            message: "请选择特权卡类型",
  
            trigger: 'change'
  
          }],
  
          lifeId: [{
  
            required: true,
  
            message: '请选择使用场馆',
  
            trigger: 'change'
  
          }],
  
          groupCount: [{
  
            required: true,
  
            message: "请输入团课次数"
  
          }, {
  
            validator: validateC
  
          }],
  
          personalCount: [{
  
            required: true,
  
            message: "请输入私教课次数"
  
          }, {
  
            validator: validateC
  
          }],
  
          groupCount2: [{
  
            validator: validateC,
  
            trigger: 'blur'
  
          }],
  
          personalCount2: [{
  
            validator: validateC,
  
            trigger: 'blur'
  
          }],
  
          originPrice: [{
  
            required: true,
  
            message: "请输入原价"
  
          }, {
  
            validator: validateP
  
          }],
  
          sellPrice: [{
  
            validator: validateP
  
          }],
  
          validPeriod: [{
  
            required: true,
  
            message: "请输入有效期"
  
          }, {
  
            validator: validateV
  
          }],
  
          validPeriod2: [{
  
            required: true,
  
            message: "请输入天数"
  
          }, {
  
            validator: validateV
  
          }],
  
          sortNo: [{
  
            required: true,
  
            message: "请输入展示排序"
  
          }],
  
          activateType: [{
  
            validator: validateActivateType
  
          }],
  
          allowBuyCount: [{
  
            validator: validateRN
  
          }],
  
          autoActivateTime: [{
  
            validator: validateRN
  
          }],
  
          imgId: [{
  
            required: true,
  
            message: "请选择特权卡背景"
  
          }],
  
          remark: [{
  
            required: true,
  
            message: "请输入简介"
  
          }, {
  
            validator: validateRemark
  
          }]
  
        }
  
      }
  
    },
  
  
  
    // 组件
  
    components: {},
  
    // 方法
  
    methods: {
  
  
  
      /*
  
       * 刷新函数,当别的组件穿过来的属性是异步的时候,需要在本组件设置相应的刷新方法来更新数据
  
       */
  
      refresh(newVipCard) {
  
        let self = this
  
        self.ruleForm = { ...newVipCard
  
        }
  
        // 获取特权卡背景图片列表
  
        self.getCardImageList()
  
        // TODO 这里的地方后续可能需要优化一下
  
        if (self.ruleForm.cardType === 1) {
  
          self.ruleForm.groupCount2 = self.ruleForm.groupCount || 0
  
          self.ruleForm.personalCount2 = self.ruleForm.personalCount || 0
  
          self.ruleForm.validPeriod2 = self.ruleForm.validPeriod
  
        }
  
        let timer = setTimeout(() => {
  
          clearTimeout(timer)
  
          // 初始化选中团课
  
          self.initHadSelectedInTable(
  
            self.canBookGroupClassData,
  
            self.$refs['canBookGroupClassTable'],
  
            self.ruleForm.groupCourseIds
  
          )
  
          // 初始化选中私教课
  
          self.initHadSelectedInTable(
  
            self.canBookPrivateClassData,
  
            self.$refs['canBookPrivateClassTable'],
  
            self.ruleForm.personalCourseIds
  
          )
  
        }, 200)
  
      },
  
  
  
      /*
  
       * 根据生活馆id获取团课列表
  
       */
  
      getGroupCourseList() {
  
        let self = this,
  
          getGroupCourseList = api.getGroupCourseList
  
        self.sendReq(getGroupCourseList, {
  
          lifeId: self.ruleForm.lifeId,
  
          page: 0,
  
          count: 1
  
        }, (res) => {
  
          if (res && res.length > 0) {
  
            let groupCourses = res[0].groupCourses
  
            if (groupCourses && groupCourses.length > 0) {
  
              groupCourses = groupCourses.map((item, index) => {
  
                item.lifeName = res[0].lifeName
  
                return item
  
              })
  
              // console.log('获取团课列表 ', groupCourses)
  
              self.canBookGroupClassData = groupCourses
  
            }
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 根据生活馆id获取私教课列表
  
       */
  
      getCourseList() {
  
        let self = this,
  
          getCourseList = api.getCourseList
  
        self.sendReq(getCourseList, {
  
          lifeId: self.ruleForm.lifeId,
  
          page: 0,
  
          count: 1
  
        }, (res) => {
  
          if (res && res.length > 0) {
  
            let courses = res[0].courses
  
            if (courses && courses.length > 0) {
  
              courses = courses.map((item, index) => {
  
                item.lifeName = res[0].lifeName
  
                return item
  
              })
  
              // console.log('获取私教课列表 ', courses)
  
              self.canBookPrivateClassData = courses
  
            }
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 根据卡的类型获取特权卡的背景
  
       */
  
      getCardImageList() {
  
        let self = this,
  
          url = api.getCardImageList,
  
          params = {
  
            cardType: self.ruleForm.cardType
  
          }
  
        self.sendReq(url, params, (res) => {
  
          self.countCardArr = []
  
          self.countCardArr = res
  
          let timer = setTimeout(() => {
  
            clearTimeout(timer)
  
            // 初始化选中背景图
  
            self.initCardBImg({}, self.ruleForm.imgId, self.ruleForm.imgUrl)
  
          }, 20)
  
        })
  
      },
  
  
  
      /*
  
       * 初始化表格中原先选中的行并勾选上, 如果是一部加载数据的话这里需要设置在延时函数中
  
       */
  
      initHadSelectedInTable(tableData, tableRef, ids) {
  
        let idsLen = ids.length,
  
          tableDataLen = tableData.length
  
        for (let i = 0; i < idsLen; i++) {
  
          for (let j = 0; j < tableDataLen; j++) {
  
            if (ids[i] == tableData[j].courseId) {
  
              tableRef.toggleRowSelection(tableData[j], true);
  
              break;
  
            }
  
          }
  
        }
  
      },
  
  
  
      /*
  
       * 卡类型变化的处理函数
  
       */
  
      handleCardTypeChange(val) {
  
        let self = this,
  
          cardImgRef = this.$refs['cardImgRef']
  
        if (!cardImgRef) return false
  
        cardImgRef.map((item, index) => {
  
          item.style.border = 'none'
  
        })
  
        // 卡类型变化的时候会员卡背景应该做相应的变化,需要重新获取特权卡的背景图片
  
        // TODO 这里最好做缓存优化, 如果原来选中之后切换回来之后需要再选中吗
  
        self.getCardImageList()
  
      },
  
  
  
      /*
  
       * 卡背景图片变化的处理函数
  
       */
  
      handleCardBImgChange(...args) {
  
        let self = this,
  
          targetEl = args[0].target
  
        self.initCardBImg(targetEl)
  
      },
  
  
  
      /*
  
       * 初始化背景图片
  
       */
  
      initCardBImg(targetSelectedEl, hadSelectedBImgId, hadSelectedBImgUrl) {
  
        let self = this
  
        if (hadSelectedBImgId) targetSelectedEl.id = hadSelectedBImgId
  
        if (hadSelectedBImgUrl) targetSelectedEl.src = hadSelectedBImgUrl
  
        self.ruleForm.imgId = self.ruleForm.imgUrl = null
  
        self.$set(self.ruleForm, 'imgId', targetSelectedEl.id)
  
        self.$set(self.ruleForm, 'imgUrl', targetSelectedEl.src)
  
        self.$refs['cardImgRef'] && self.$refs['cardImgRef'].map((item, index) => {
  
          item.style.border = item.id === targetSelectedEl.id ? '2px solid #00a78e' : 'none'
  
        })
  
      },
  
  
  
      /*
  
       * 选中团课之后的处理
  
       */
  
      handleSelectGroupClass(val) {
  
        this.ruleForm.groupCourseIds = this.handleSelectClass(val)
  
      },
  
  
  
      /*
  
       * 选中私教课之后的处理
  
       */
  
      handleSelectPrivateClass(val) {
  
        this.ruleForm.personalCourseIds = this.handleSelectClass(val)
  
      },
  
  
  
      /*
  
       * 点击保存按钮
  
       */
  
      submitForm(formName) {
  
        let self = this
  
        self.$refs[formName].validate((valid) => {
  
          let gc = self.ruleForm.cardType === 1 ? self.ruleForm.groupCount2 : self.ruleForm.groupCount
  
          let pc = self.ruleForm.cardType === 1 ? self.ruleForm.personalCount2 : self.ruleForm.groupCount
  
          if (gc > 0 && self.ruleForm.groupCourseIds.length === 0) return self.$alert('请选择团课')
  
          if (pc > 0 && self.ruleForm.personalCourseIds.length === 0) return self.$alert('请选择私教课')
  
          if (valid) {
  
            self.save()
  
          } else {
  
            self.isLoading = false
  
            console.log('error submit!!')
  
            return false
  
          }
  
        });
  
      },
  
  
  
      /*
  
       * 重置
  
       */
  
      resetForm(formName) {
  
        let self = this
  
        self.$confirm('取消将丢失已经输入的内容,你要继续吗?', '提示', {
  
            confirmButtonText: '确定',
  
            cancelButtonText: '取消',
  
            type: 'warning',
  
            center: 'true'
  
          })
  
          .then(() => {
  
            self.$refs[formName].resetFields();
  
            self.$router.push({
  
              path: '/vipCardList'
  
            })
  
          })
  
          .catch(() => {})
  
      },
  
  
  
      /*
  
       * 保存
  
       */
  
      save() {
  
        let self = this,
  
          url = api.saveCard
  
        // 需要做一个团课私教课节数的处理
  
        if (self.ruleForm.cardType === 1) {
  
          self.ruleForm.groupCount = self.ruleForm.groupCount2
  
          self.ruleForm.personalCount = self.ruleForm.personalCount2

          self.ruleForm.validPeriod = self.ruleForm.validPeriod2
        }
  
        let params = { ...self.ruleForm }
  
        delete params.groupCount2
  
        delete params.personalCount2
  
        delete params.validPeriod2

        // 去除简介首尾的换行
        if (params.remark && params.remark.length > 0) params.remark = params.remark.trim()
  
        self.sendReq(url, params, (res) => {
  
          self.$message({
  
            showClose: true,
  
            message: res,
  
            type: 'success'
  
          })
  
          self.$router.push({
  
            path: '/vipCardList'
  
          })
  
        })
  
      },
  
  
  
      /*
  
       * 处理选择了的课程
  
       */
  
      handleSelectClass(val) {
  
        let setVal = val
  
        if (setVal.length === 0) {
  
          return setVal
  
        }
  
        return (
  
          setVal.map((item) => {
  
            return item.courseId
  
          })
  
        )
  
      },
  
  
  
      /*
  
       * 设置特权卡激活时间
  
       */
  
      setActiveType(val) {
  
        this.ruleForm.autoActivateTime = null
  
      },
  
  
  
      /*
  
       * 设置生活馆
  
       */
  
      setLifeHouse(val) {
  
        let self = this
  
        if (!val) return false
  
        // 获取团课列表
  
        self.getGroupCourseList()
  
        // 获取私教课列表
  
        self.getCourseList()
  
      },
  
  
  
      /*
  
       * 获取生活馆列表
  
       */
  
      getLifeHouse() {
  
        let self = this
  
        let getHouseUrl = api.getLifeNameList
  
        self.sendReq(getHouseUrl, {}, (res) => {
  
          self.lifeList = res
  
        })
  
      },
  
  
  
      /*
  
       * 发送请求函数
  
       */
  
      sendReq(url, params, callback) {
  
        let self = this,
  
          config = {
  
            url: url,
  
            param: params,
  
            loading: "isLoading"
  
          }
  
        // 调用封装好的发送请求
  
        restful.sendMyData(config, self, (res) => {
  
          if (res && res.code === responeCode.OK) {
  
            let d = res.data
  
            callback && callback(d)
  
          }
  
        })
  
      },
  
    },
  
  
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {
  
      let self = this
  
      // 获取生活馆
  
      self.getLifeHouse()
  
      self.ruleForm.lifeId = self.$route.query.lifeId
  
      if (!self.ruleForm.groupCount2) self.ruleForm.groupCount2 = 0
  
      if (!self.ruleForm.personalCount2) self.ruleForm.personalCount2 = 0
  
    },
  
  
  
    mounted() {
  
      let self = this
  
      // 获取特权卡背景
  
      self.getCardImageList()
  
      // 如果没有生活馆的id 也就是说是新增页面,这个时候不需要去获取课的列表
  
      if (!self.ruleForm.lifeId) return false
  
      // 先获取列表的数据然后去初始化表格的内容
  
      // 获取团课列表
  
      self.getGroupCourseList()
  
      // 获取私教课列表
  
      self.getCourseList()
  
    },
  
  
  
    /*
  
     * 监听
  
     */
  
    watch: {}
  
  }
</script>

<style scoped>
  .vipCardSet_condition {
  
    display: inline-block;
  
    margin-right: 70px;
  
    float: left;
  
    font-size: 14px;
  
    color: #5a5e66;
  
    padding-left: 50px;
  
    margin-bottom: 22px;
  
  }
  
  
  
  .pdl10 {
  
    padding-left: 10px;
  
  }
  
  
  
  .pdl20 {
  
    padding-left: 20px;
  
  }
  
  
  
  .pdl30 {
  
    padding-left: 30px;
  
  }
  
  
  
  .pdl40 {
  
    padding-left: 40px;
  
  }
  
  
  
  .mgl4 {
  
    margin-left: 4px;
  
  }
  
  
  
  .mgl5 {
  
    margin-left: 5px;
  
  }
  
  
  
  .mgl6 {
  
    margin-left: 6px;
  
  }
  
  
  
  .mgl10 {
  
    margin-left: 10px;
  
  }
  
  
  
  .el-radio-button {
  
    padding-right: 10px;
  
  }
  
  
  
  .el-radio-button__inner {
  
    border: none!important;
  
  }
  
  
  
  .vipCard_img-div {
  
    width: 100%;
  
    height: auto;
  
    text-align: left;
  
  }
  
  
  
  .vipCard_img-div img {
  
    width: 100px;
  
    margin: 10px;
  
  }
  
  
  
  .el-table__row {
  
    text-align: left!important;
  
  }
  
  
  
  .vipCardSet_label::before {
  
    content: '*';
  
    color: #fa5555;
  
    margin-right: 4px;
  
  }
  
  
  
  .el-row {
  
    background-color: #fff;
  
    margin-bottom: 10px;
  
  }
  
  
  
  .title {
  
    text-align: left;
  
    padding: 20px 0px 40px 20px;
  
    font-family: PingFangSC-Medium;
  
    font-size: 24px;
  
    color: #444A49;
  
    line-height: 24px;
  
  }
</style>
