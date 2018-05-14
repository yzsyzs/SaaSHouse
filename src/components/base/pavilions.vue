<!--
  场馆组件,用于新增编辑
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" v-show='pavilionSetDetail'>
  
      <p class="title">场馆-基本信息</p>
  
      <el-row>
  
        <el-form-item class="fl" label="场馆名称" prop="lifeName">
  
          <el-input v-model="ruleForm.lifeName" placeholder="请输入场馆名称"></el-input>
  
        </el-form-item>
  
        <el-form-item class="fr" label="场馆类型" prop="type">
  
          <el-select clearable v-model="ruleForm.type" placeholder="请选择场馆类型">
  
            <el-option v-for="item in lifeTypeArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
  
          </el-select>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl pavilions_select-area" label="所属区域" prop="selectAreaCode">
  
          <el-select clearable v-model="ruleForm.provinceAreaCode" placeholder="全部" @change="setProvince">
  
            <el-option v-for="item in provinceArr" :label="item.regionName" :value="item.regionId" :key="item.regionId"></el-option>
  
          </el-select>
  
  
  
          <el-select clearable v-model="ruleForm.cityAreaCode" placeholder="全部" @change="setCity">
  
            <el-option v-for="item in cityArr" :label="item.regionName" :value="item.regionId" :key="item.regionId"></el-option>
  
          </el-select>
  
  
  
          <el-select clearable v-model="ruleForm.areaCode" placeholder="全部" @change="setArea">
  
            <el-option v-for="item in areaArr" :label="item.regionName" :value="item.regionId" :key="item.regionId">{{item.regionName}}</el-option>
  
          </el-select>
  
  
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl w400" label="地理位置" prop="location">
  
          <Bmap @selectDetailAddress='selectDetailLocation' @selectDetailH='selectDetailH' ref='BmapEl' />
  
        </el-form-item>
  
  
  
        <el-form-item class="fr" label="详细地址" prop="address">
  
          <el-input v-model="ruleForm.address" placeholder="详细地址"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl" label="电话" prop="phone">
  
          <el-input v-model="ruleForm.phone" placeholder="请输入电话"></el-input>
  
        </el-form-item>
  
        <el-form-item class="fr" label="排序权重" prop="sortNo">
  
          <el-input v-model.number="ruleForm.sortNo" type="number"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl" label="营业时间">
  
          <el-form-item prop="openTime" style="width:100px!important;display: inline-block;padding: 0px 8px;">
  
            <el-time-select style="width:100px!important;" v-model="ruleForm.openTime" @change='setOpenTime' :picker-options="{
  
                start: '06:00',
  
                step: '00:10',
  
                end: '24:00',
  
              }" placeholder="开始">
  
            </el-time-select>
  
          </el-form-item>
  
          <el-form-item prop="endTime" style="width:100px!important;display: inline-block; padding: 0px 8px;">
  
            <el-time-select style="width:100px!important;" :disabled='!ruleForm.openTime' v-model="ruleForm.endTime" :picker-options="{
  
                start: '06:00',
  
                step: '00:10',
  
                end: '24:00',
  
                minTime: ruleForm.openTime
  
              }" placeholder="结束">
  
            </el-time-select>
  
          </el-form-item>
  
        </el-form-item>
  
        <el-form-item class="fr" label="场地面积" prop="houseArea">
  
          <el-input v-model.number="ruleForm.houseArea" type='number'></el-input>
  
          <span class="unit2">平方米</span>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl" label="状态" prop="status">
  
          <el-radio-group v-model="ruleForm.status">
  
            <el-radio :label="2">未上线</el-radio>
  
            <el-radio :label="1">已上线</el-radio>
  
          </el-radio-group>
  
        </el-form-item>
  
  
  
        <el-form-item class="fr" label="推荐喵村" prop="miaoId" v-if="ruleForm.type !== '2'">
  
          <el-input v-model="ruleForm.miaoId" placeholder="请输入推荐喵村"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl" label="场馆编号" prop="lifeNo">
  
          <el-input type='number' v-model.number="ruleForm.lifeNo"></el-input>
  
        </el-form-item>
  
  
  
        <el-form-item class="fr" label="资金投入" prop="totalCapital">
  
          <el-input type="number" v-model.number="ruleForm.totalCapital" placeholder="请输入资金投入"></el-input>
  
          <span class="unit">万元</span>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <p class="title">场馆-添加图片</p>
  
      <el-row>
  
        <el-form-item class="fl" label="列表图片" prop="imgId" style="width: 100%!important;">
  
          <ImgUpload :upImgArr='listImg' :imageWidth='listImgWidth' :imageHeight='listImgHeight' @getImgArr="getListImgArr" ref='listImg' v-show="!uploadListImg" />
  
          <div v-show="uploadListImg" class="yetUploadImgList">
  
            <img :src="ruleForm.listImgArr[0].url" alt="" />
  
            <i class="delImg" v-if='!isDetail' @click="delImg(ruleForm.listImgArr[0])"></i>
  
          </div>
  
          <p class='pic-foramt-tip'>图片尺寸1036*518，大小不超过1M（只能上传一张）</p>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row>
  
        <el-form-item class="fl" label="详情图片" prop="images" style="width: 100%!important;">
  
          <ImgUpload :upImgArr='detailImg' :maxlength="detailImgLength" @getImgArr="getDetailImgArr" ref='detailImg' v-show='ruleForm.detailImgArr.length < 10' />
  
          <div class="yetUploadImgDetail" v-show='ruleForm.detailImgArr.length > 0' v-for='(item, index) in ruleForm.detailImgArr' :key="item.imgId">
  
            <img :src="item.url" alt="" />
  
            <i class="delImg" v-show='!isDetail' @click="delDetailImg(item)"></i>
  
          </div>
  
          <p class='pic-foramt-tip'>图片尺寸1124*843，大小不超过2M（最多上传10张）</p>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <p class="title">设置场馆管理员</p>
  
      <el-row>
  
        <el-form-item class="fl" label="场馆管理员" prop="adminId">
  
          <el-select clearable filterable v-model="ruleForm.adminId" placeholder="请选择场馆管理员">
  
            <el-option v-for="item in superAdminArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
  
          </el-select>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="pdt20">
  
        <el-form-item>
  
          <el-button @click="resetForm('ruleForm')">取消</el-button>
  
          <el-button type="warning" @click="jumpToEdit" v-if='isDetail'>编辑</el-button>
  
          <el-button v-if="pavilionSetAddOrEdit" type="primary" @click="submitForm('ruleForm')" :loading="isLoading" v-show='!isDetail'>确定</el-button>
  
        </el-form-item>
  
      </el-row>
  
    </el-form>
  
  </el-main>
</template>

<script>

  import { mapGetters } from 'vuex'

  import Bmap from '@/components/base/Bmap'
  
  import ImgUpload from '@/components/upload/imgUpload'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import regExp from '@/common/regExp'
  
  import {
  
    api
  
  } from '@/config/api.js'
  
  import {
  
    tools
  
  } from '@/common/tools'
  
  import {
  
    restful
  
  } from '@/servers/server'
  
  
  
  // 提交的字段
  
  let fileds = {
  
    // 地理位置
  
    location: null,
  
    // 详细地址
  
    address: null,
  
    // 管理员id
  
    adminId: '',
  
    // 管理员名称
  
    adminName: null,
  
    // 地区id
  
    areaCode: null,
  
    // 营业结束时间戳
  
    endTime: null,
  
    // 场馆面积
  
    houseArea: null,
  
    // 详细图片id集合
  
    images: [],
  
    // 列表图片id
  
    imgId: null,
  
    // 纬度
  
    latitude: null,
  
    // 生活馆Id,为空时新增
  
    lifeId: null,
  
    // 场馆编号
  
    lifeNo: null,
  
    // 生活馆名称
  
    lifeName: null,
  
    // 经度
  
    longitude: null,
  
    // 喵村id
  
    miaoId: null,
  
    // 营业开始时间戳
  
    openTime: null,
  
    // 生活馆电话
  
    phone: null,
  
    // 排序权重
  
    sortNo: null,
  
    // 状态，1：上线，2：下线
  
    status: null,
  
    // 资金投入
  
    totalCapital: null,
  
    // 场馆类型:0 健康猫直营馆、1 健康猫生活馆、2 非健康猫连锁
  
    type: null
  
  }
  
  
  
  export default {
  
    // 组件的名称
  
    name: 'pavilions',
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {
  
      pavilions: {
  
        type: Object,
  
        default: {}
  
      },
  
      isRequired: {
  
        type: Boolean,
  
        default: true
  
      },
  
      isDetail: {
  
        type: Boolean,
  
        default: false
  
      }
  
    },

    computed: {

      ...mapGetters([
        
        'pavilionSetAddOrEdit',

        'pavilionSetDetail'
    
      ])
    
    },
  
    components: {
  
      Bmap,
  
      ImgUpload
  
    },
  
  
  
    // 数据绑定
  
    data() {
  
      let lifeTypeArr = [{
  
          name: '健康猫直营馆',
  
          id: '0'
  
        }, {
  
          name: '健康猫生活馆',
  
          id: '1'
  
        }, {
  
          name: '非健康猫连锁',
  
          id: '2'
  
        }],
  
        superAdminArr = [],
  
        commonRule = {
  
          bZtN: {
  
            type: 'number',
  
            min: 1,
  
            max: 9999.99,
  
            message: '请输入 1~9999 之间的数字,最多两位小数'
  
          },
  
        },
  
        validatePhone = (rule, value, callback) => {
  
          if (!value) return callback(new Error('请输入电话'))
  
          if (!regExp.tel.test(value)) return callback(new Error('请输入格式正确的是电话'))
  
          return callback()
  
        },
  
        validateF = (rule, value, callback) => {
  
          if (!value) return callback(new Error(rule.msg || '请输入'))
  
          if (value && !regExp.float2.test(value)) return callback(new Error('最多输入两位小数'))
  
          return callback()
  
        },
  
        validateSortNo = (rule, value, callback) => {
  
          if (!regExp.roundNmuber.test(value)) return callback(new Error('请输入0-999的整数'))
  
          return callback()
  
        },
  
        validateLocation = (rule, value, callback) => {
  
          if (value && !this.ruleForm.latitude) return callback(new Error('请从百度地图给出的地址列表中选择'))
  
          return callback()
  
        },
  
        validateLifeNo = (rule, value, callback) => {
  
          if (!regExp.roundNmuber.test(value) || value <= 0 || value > 9999) return callback(new Error('请输入1-9999的整数'))
  
          return callback()
  
        }
  
      return {
  
        isLoading: false,
  
        listImg: 'listImg',
  
        detailImg: 'detailImg',
  
        uploadListImg: false,
  
        detailImgLength: 10,
  
        listImgWidth: 1036,
  
        listImgHeight: 518,
  
        maxLen7: 7,
  
        provinceArr: [],
  
        cityArr: [],
  
        areaArr: [],
  
        lifeTypeArr: lifeTypeArr,
  
        superAdminArr: superAdminArr,
  
        ruleForm: {
  
          adminId: '',
  
          status: 2
  
        },
  
        rules: {
  
          lifeName: [{
  
            required: this.isRequired,
  
            message: '请输入场馆名称',
  
            trigger: 'blur'
  
          }, {
  
            min: 1,
  
            max: 12,
  
            message: '最多只能输入12个字符',
  
            trigger: 'blur'
  
          }],
  
          type: [{
  
            required: this.isRequired,
  
            message: '请选择活动区域',
  
            trigger: 'change'
  
          }],
  
          selectAreaCode: [{
  
            required: this.isRequired,
  
            message: '请选择所属区域',
  
            trigger: 'change'
  
          }],
  
          location: [{
  
            required: this.isRequired,
  
            message: '请输入地理位置',
  
            trigger: 'blur'
  
          }, {
  
            min: 1,
  
            max: 50,
  
            message: '最多只能输入50个字符',
  
            trigger: 'blur'
  
          }, {
  
            validator: validateLocation,
  
            trigger: 'blur'
  
          }],
  
          address: [{
  
            required: this.isRequired,
  
            message: '请输入详细地址',
  
            trigger: 'blur'
  
          }, {
  
            min: 1,
  
            max: 50,
  
            message: '最多只能输入50个字符',
  
            trigger: 'blur'
  
          }],
  
          totalCapital: [{
  
            required: this.isRequired,
  
            msg: '请输入资金投入',
  
            validator: validateF,
  
            trigger: 'blur'
  
          }, commonRule.bZtN],
  
          phone: [{
  
            required: this.isRequired,
  
            validator: validatePhone,
  
            trigger: 'blur'
  
          }],
  
          sortNo: [{
  
            required: this.isRequired,
  
            type: 'number',
  
            min: 0,
  
            max: 999,
  
            message: '请输入0-999的整数',
  
            trigger: 'blur'
  
          }, {
  
            validator: validateSortNo
  
          }],
  
          openTime: [{
  
            required: this.isRequired,
  
            message: '请选择开始时间',
  
            trigger: 'change'
  
          }],
  
          endTime: [{
  
            required: this.isRequired,
  
            message: '请选择结束时间',
  
            trigger: 'change'
  
          }],
  
          houseArea: [{
  
            required: this.isRequired,
  
            msg: '请输入场馆面积',
  
            validator: validateF,
  
            trigger: 'blur'
  
          }, commonRule.bZtN],
  
          adminId: [{
  
            required: this.isRequired,
  
            message: '请选择场馆管理员',
  
            trigger: 'change'
  
          }],
  
          status: [{
  
            required: this.isRequired
  
          }],
  
          imgId: [{
  
            required: this.isRequired,
  
            message: '请选择列表图片',
  
            trigger: 'change'
  
          }],
  
          images: [{
  
            type: 'array',
  
            required: this.isRequired,
  
            message: '请选择场馆详情图片',
  
            trigger: 'change'
  
          }],
  
          lifeNo: [{
  
            required: this.isRequired,

            validator: validateLifeNo,
    
            trigger: 'blur'
  
          }]
  
        }
  
      }
  
    },
  
  
  
    created() {
  
      let self = this
  
      self.ruleForm = { ...self.pavilions
  
      }
  
      self.getAdminList()
  
      self.getProvince()  
  
    },
  
    // 方法
  
    methods: {
  
      /*
  
       * 提交数据
  
       */
  
      submitForm(formName) {
  
        let self = this
  
        try {
  
          self.setReqParams()
  
          self.$refs[formName].validate((valid) => {
  
            if (valid) {
  
              self.sendReq(api.addOrEditLifeHouse, fileds, function(res) {
  
                self.$message.success('提示信息：' + res);
  
                self.$router.push({
  
                  path: '/pavilionsSet'
  
                })
  
              })
  
            } else {
  
              self.loading = false
  
              console.warn('error submit!!')
  
              return false
  
            }
  
          });
  
        } catch (e) {
  
          self.loading = false
  
          console.error(e)
  
        }
  
      },
  
  
  
      /*
  
       * 重置
  
       */
  
      resetForm(formName) {
  
        this.$refs[formName].resetFields()
  
        this.$router.push({
  
          path: '/pavilionsSet'
  
        })
  
      },
  
  
  
      /*
  
       * 设置开始时间
  
       */
  
      setOpenTime(val) {
  
        if (!val) this.ruleForm.endTime = ''
  
      },
  
      /*
  
       * 获取管理员列表
  
       */
  
      getAdminList() {
  
        let self = this
  
        self.sendReq(api.getAdminList, {}, (res) => {
  
          this.superAdminArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 跳到编辑页面
  
       */
  
      jumpToEdit() {
  
        let id = this.$route.params.id
  
        this.$router.push({
  
          path: '/pavilionsSet/editPavilions/' + id
  
        })
  
      },
  
      /*
  
       * 页面数据刷新
  
       */
  
      refresh(newPavilions) {
  
        let self = this
  
        // self.ruleForm = {}
  
        self.ruleForm = newPavilions
  
        // 给地理位置赋值
  
        self.$refs['BmapEl'].refresh({
  
          location: self.ruleForm.location
  
        })
  
        // 处理列表图片
  
        if (self.ruleForm.imgListId) {
  
          self.ruleForm.imgId = self.ruleForm.imgListId
  
          self.uploadListImg = true
  
        }
  
        // 处理详情图片
  
        if (self.ruleForm.imageDetails && self.ruleForm.imageDetails.length > 0) {
  
          self.ruleForm.imageDetails.map((item, index) => {
  
            self.ruleForm.detailImgArr.push({
  
              imgId: item.imgDetailId,
  
              url: item.imgDetailUrl
  
            })
  
            self.ruleForm.images.push(item.imgDetailId)
  
          })
  
        }
  
        // 处理列表图片
  
        if (self.ruleForm.imgListId) {
  
          self.$set(self.ruleForm, 'listImgArr', [{
  
            imgId: self.ruleForm.imgListId,
  
            url: self.ruleForm.imgListUrl
  
          }])
  
          self.$refs['listImg'].init(self.ruleForm.listImgArr)
  
        }
  
        if (self.ruleForm.detailImgArr && self.ruleForm.detailImgArr.length > 0) {
  
          self.$refs['detailImg'].init(self.ruleForm.detailImgArr)
  
        }
  
        let provinceAreaCode = self.ruleForm.provinceAreaCode,
  
          cityAreaCode = self.ruleForm.cityAreaCode,
  
          areaCode = self.ruleForm.areaCode
  
        if (provinceAreaCode) self.getCity(provinceAreaCode)
  
        if (cityAreaCode) self.getArea(cityAreaCode)
  
        self.ruleForm.selectAreaCode = areaCode || cityAreaCode || provinceAreaCode
  
      },
  
  
  
      /*
  
       * 获取视频封面上传完成后的图片
  
       */
  
      getListImgArr(listImgArr) {
  
        this.ruleForm.listImgArr = listImgArr
  
        this.ruleForm.imgId = listImgArr[0].imgId
  
        this.uploadListImg = true
  
      },
  
  
  
      /*
  
       * 删除列表图片
  
       */
  
      delImg(childImg) {
  
        let isDelOk = this.$refs["listImg"].imgUploadDel(childImg);
  
        if (isDelOk) {
  
          this.uploadListImg = false;
  
          //防止删除后图片找不到地址报错
  
          this.ruleForm.listImgArr = [{}]
  
          this.ruleForm.imgId = ''
  
        } else {
  
          self.$message.error("图片删除失败");
  
        }
  
      },
  
  
  
      /*
  
       * 得到详情的图片
  
       */
  
      getDetailImgArr(detailImgArr) {
  
        this.ruleForm.detailImgArr = [...detailImgArr]
  
      },
  
  
  
      /*
  
       * 删除详情的图片
  
       */
  
      delDetailImg(childImg) {
  
        let isDelOk = this.$refs["detailImg"].imgUploadDel(childImg);
  
        if (isDelOk) {
  
          let newArr = this.ruleForm.detailImgArr.filter((item, index) => {
  
            if (item.imgId !== childImg.imgId) return item
  
          })
  
          this.$set(this.ruleForm, 'detailImgArr', newArr)
  
        } else {
  
          self.$message.error("图片删除失败");
  
        }
  
      },
  
  
  
      /*
  
       * 选择地理位置
  
       */
  
      selectDetailLocation(val, H) {
  
        let self = this
  
        if (!H) H = {}
  
        if (self.ruleForm.location !== val) {
  
          // 如果输入内容变化了但是经纬度没有变化，证明没有从百度地图给出的地址中选择，需要提示错误
  
          if (self.ruleForm.latitude === H.lat && self.ruleForm.longitude === H.lng) H = {}
  
          self.ruleForm.latitude = H.lat
  
          self.ruleForm.longitude = H.lng
  
        }
  
        self.ruleForm.location = val
  
      },
  
  
  
      /*
  
       * 得到经纬度
  
       */
  
      selectDetailH(val) {
  
        // console.log('pavilions methods selectDetailH val 获取经纬度的值：', val)
  
        this.ruleForm = { ...this.ruleForm,
  
          ...{
  
            latitude: val.lat,
  
            longitude: val.lng
  
          }
  
        }
  
      },
  
  
  
      /*
  
       * 获取省份
  
       */
  
      getProvince() {
  
        let self = this
  
        let getProvinceUrl = api.getArea + '100000'
  
        self.sendReq(getProvinceUrl, {}, (res) => {
  
          self.provinceArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取城市
  
       */
  
      getCity(val) {
  
        if (!val) return false
  
        let self = this
  
        let getCityUrl = api.getArea + val
  
        self.sendReq(getCityUrl, {}, (res) => {
  
          self.cityArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取区域
  
       */
  
      getArea(val) {
  
        if (!val) return false
  
        let self = this
  
        let getAreaUrl = api.getArea + val
  
        self.sendReq(getAreaUrl, {}, (res) => {
  
          self.areaArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 设置省份
  
       */
  
      setProvince(val) {
  
        let self = this
  
        self.$set(self.ruleForm, 'selectAreaCode', val)
  
        self.cityArr = []
  
        self.areaArr = []
  
        self.ruleForm.cityAreaCode = self.ruleForm.areaCode = null
  
        self.getCity(val)
  
      },
  
  
  
      /*
  
       * 设置城市
  
       */
  
      setCity(val) {
  
        // console.log("pavilions setCity val ", val)
  
        let setVal = val || this.ruleForm.provinceAreaCode
  
        this.$set(this.ruleForm, 'selectAreaCode', setVal)
  
        this.areaArr = []
  
        this.ruleForm.areaCode = null
  
        this.getArea(val)
  
      },
  
  
  
      /*
  
       * 设置区域
  
       */
  
      setArea(val) {
  
        let setVal = val || this.ruleForm.cityAreaCode || this.ruleForm.provinceAreaCode
  
        this.$set(this.ruleForm, 'selectAreaCode', setVal)
  
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
  
  
  
      /*
  
       * 设置最后发送的请求参数
  
       */
  
      setReqParams() {
  
        let self = this
  
        self.superAdminArr.forEach((item, index) => {
  
          if (item.id === self.ruleForm.adminId) {
  
            self.ruleForm.adminName = item.name
  
            return;
  
          }
  
        })
  
        Object.keys(fileds).forEach((item, index) => {
  
          if (item === 'images') {
  
            fileds[item] = []
  
            self.ruleForm.detailImgArr.map((img, index) => {
  
              fileds[item].push(img.imgId)
  
              self.ruleForm.images.push(img.imgId)
  
            })
  
          } else if (item === 'openTime' || item === 'endTime') {
  
            if (self.ruleForm[item]) {
  
              let time = self.ruleForm[item].split(':')
  
              fileds[item] = tools.getTimestamp(time[0], time[1])
  
            }
  
          } else {
  
            fileds[item] = self.ruleForm[item]
  
          }
  
        })
  
      },
  
  
  
    },
  
    watch: {}
  
  }
</script>

<style scoped="scoped">
  .pic-foramt-tip {
  
    font-family: PingFangSC-Regular;
  
    font-size: 12px;
  
    color: #B9BEBD;
  
    line-height: 12px;
  
  }
  
  
  
  .yetUploadImgList {
  
    width: 160px;
  
    height: 120px;
  
    position: relative;
  
    overflow: hidden;
  
  }
  
  
  
  .yetUploadImgList img {
  
    width: 100%;
  
  }
  
  
  
  .yetUploadImgList i.delImg {
  
    display: block;
  
    width: 24px;
  
    height: 24px;
  
    position: absolute;
  
    right: 0;
  
    top: 0;
  
    background: url('../../assets/images/icon_closeimg.png');
  
  }
  
  
  
  .yetUploadImgDetail {
  
    display: inline-block;
  
    margin-right: 10px;
  
    width: 160px;
  
    height: 120px;
  
    position: relative;
  
    overflow: hidden;
  
  }
  
  
  
  .yetUploadImgDetail img {
  
    width: 100%;
  
  }
  
  
  
  .yetUploadImgDetail i.delImg {
  
    display: block;
  
    width: 24px;
  
    height: 24px;
  
    position: absolute;
  
    right: 0;
  
    top: 0;
  
    background: url('../../assets/images/icon_closeimg.png');
  
  }
  
  
  
  .hidden {
  
    display: none
  
  }
  
  
  
  .unit {
  
    position: absolute;
  
    top: 0px;
  
    right: -40px;
  
  }
  
  
  
  .unit2 {
  
    position: absolute;
  
    top: 0px;
  
    right: -70px;
  
  }
  
  
  
  .el-form {
  
    background: #fff;
  
    padding: 40px 0;
  
  }
  
  
  
  .el-form-item {
  
    width: 340px!important;
  
    text-align: left;
  
  }
  
  
  
  .w400 {
  
    width: 400px!important
  
  }
  
  
  
  .pavilions_select-area {
  
    width: 100%!important;
  
  }
  
  
  
  .pavilions_select-area .el-select {
  
    padding-right: 10px;
  
  }
  
  
  
  .el-row {
  
    width: 100%;
  
    padding: 0 100px;
  
    box-sizing: border-box;
  
  }
  
  
  
  .el-input,
  
  .el-cascader,
  
  .el-select {
  
    width: 240px!important;
  
  }
  
  
  
  .title {
  
    text-align: left;
  
    padding: 0px 0px 20px 20px;
  
    font-family: PingFangSC-Medium;
  
    font-size: 24px;
  
    color: #444A49;
  
    line-height: 24px;
  
  }
  
  
  
  .pdt20 {
  
    padding-top: 20px;
  
  }
</style>
