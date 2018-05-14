<template>
  <div class="houseAreaLinkage">
  
    <section class="row">
  
      <!-- 当只存在一个馆的时候不需要显示省市区 -->
      <div class="houseAreaLinkage_select mgr4" v-if='!loginedOnlyOneHouse'>
  
        省份：
  
        <el-select filterable v-model="linkageObj.province" clearable placeholder="请选择省份" size="medium" @change='setProvince'>
  
          <el-option v-for="item in provinceList" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
  
        </el-select>
  
      </div>
  
  
      <!-- 当只存在一个馆的时候不需要显示省市区 -->
      <div class="houseAreaLinkage_select mgr4" v-if='!loginedOnlyOneHouse'>
  
        城市：
  
        <el-select filterable v-model="linkageObj.city" clearable placeholder="请选择城市" @change='setCity' size="medium" :disabled='disabledArr.c'>
  
          <el-option v-for="item in cityList" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
  
        </el-select>
  
      </div>
  
      <!-- 当只存在一个馆的时候不需要显示省市区 -->
      <div class="houseAreaLinkage_select mgr4" v-if='!loginedOnlyOneHouse'>
  
        区域：
  
        <el-select filterable v-model="linkageObj.area" clearable placeholder="请选择区域" @change='setArea' size="medium" :disabled='disabledArr.a'>
  
          <el-option v-for="item in areaList" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
  
        </el-select>
  
      </div>
  
  
  
      <div v-if="showHouse&&isNeedLinkage" class="houseAreaLinkage_select mgr4">
  
        馆名：
  
        <el-select filterable v-model="linkageObj.lifeId" clearable placeholder="请选择生活馆" @change='setHouse' size="medium" :disabled='disabledArr.h || loginedOnlyOneHouse'>
  
          <el-option v-for="item in houseList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId"></el-option>
  
        </el-select>
  
  
  
      </div>
  
      <div v-if="showHouse&&!isNeedLinkage" class="houseAreaLinkage_select mgr4">
  
        馆名：
  
        <el-select filterable v-model="linkageObj.lifeId" clearable placeholder="请选择生活馆" @change='setHouse' size="medium" :disabled='loginedOnlyOneHouse'>
  
          <el-option v-for="item in houseList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId"></el-option>
  
        </el-select>
  
      </div>
  
      <div v-if="showStoreTag" class="houseAreaLinkage_select mgr4">
  
        店铺标签：
  
        <el-select filterable v-model="linkageObj.tag" clearable placeholder="请选择店铺" @change='setStoreTag' size="medium">
  
          <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
  
        </el-select>
  
      </div>
  
    </section>
  
  
  
    <section class="row" v-if="isNotLifeView">
  
      <div class="houseAreaLinkage_input mgr4">
  
        猫号：
  
        <el-input @change='getMallId' v-model="mallId" placeholder="请输入内容" style="width: 200px" size="medium"></el-input>
  
      </div>
  
  
  
      <div class="houseAreaLinkage_input mgr4" v-if="isShowPhone">
  
        手机号码：
  
        <el-input v-model="mobile" placeholder="请输入内容" style="width: 200px" size="medium"></el-input>
  
      </div>
  
  
  
      <div class="houseAreaLinkage_input mgr4">
  
        {{(lableTxt && lableTxt.startTime) ? lableTxt.startTime:"开始时间："}}
  
        <el-date-picker :editable="false" v-model="startTime" @change="getStartTime" type="datetime" placeholder="选择日期" default-value="" value-format='yyyy-MM-dd HH:mm:ss' size="medium" />
  
      </div>
  
  
  
      <div class="houseAreaLinkage_input">
  
        结束时间：
  
        <el-date-picker :editable="false" v-model="endTime" type="datetime" @change="getEndTime" placeholder="选择日期" default-value="" value-format='yyyy-MM-dd HH:mm:ss' size="medium" />
  
      </div>
  
    </section>
  
  
  
  </div>
</template>

<script>
  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import {
  
    restful
  
  } from '@/servers/server'
  
  export default {
  
    // 组件的名称
  
    name: 'houseAreaLinkage',
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {
  
      isNotLifeView: {
  
        type: Boolean,
  
        default: true
  
      },
  
      showStoreTag: {
  
        type: Boolean,
  
        default: false
  
      },
  
      showHouse: {
  
        type: Boolean,
  
        default: true
  
      },
  
      isShowPhone: {
  
        type: Boolean,
  
        default: true
  
      },
  
      //当前查询条件的label内容
  
      lableTxt: {
  
        type: Object,
  
        default: () => {}
  
      },
  
      //是否需要做省市区联动
  
      isNeedLinkage: {
  
        type: Boolean,
  
        default: true
  
      }
  
    },
  
    // 数据绑定
  
    data() {
  
      return {
  
        linkageObj: {
  
          province: '',
  
          city: '',
  
          area: '',
  
          lifeId: '',
  
          tag: ''
  
        },
  
        disabledArr: {
  
          p: false,
  
          c: true,
  
          a: true,
  
          h: true
  
        },
  
        startTime: null,
  
        endTime: null,
  
        mallId: null,
  
        mobile: null,
  
        provinceList: [],
  
        cityList: [],
  
        areaList: [],
  
        houseList: [],

        loginedOnlyOneHouse: false
  
      }
  
    },
  
    created() {

      let self = this

      self.init()
      
  
      // 获取到省份的数据
  
      self.getMyProvince()
  
      self.getMyLifeHouses('')
  
    },
  
    // 方法
  
    methods: {

      init() {

        let self = this, lifeId = localStorage.lifeId

        if(lifeId && lifeId.length > 0 && lifeId !== "*") {

          self.linkageObj.lifeId = lifeId
        
          self.setHouse(lifeId)

          self.loginedOnlyOneHouse = true
        
        }

      },
  
  
  
      /*
  
       * 设置省份
  
       */
  
      setProvince(val) {
  
        // 如果清空了省的数据，后面的数据都需要联动禁用,[根据业务需要肯能不需要禁用]
  
        if (!val) {
  
          this.disabledArr.c = this.disabledArr.a = this.disabledArr.h = true
  
        } else {
  
          this.disabledArr.c = false
  
        }
  
        this.linkageObj.province = val
  
        // 需要清空下级联动的数据
  
        this.linkageObj.city = this.linkageObj.area = this.linkageObj.lifeId = ''
  
        // 获取省份之后需要再获取城市的数据
  
        if (val) this.getMyCity(val)
  
        // 获取生活馆的数据
  
        if (!this.isNeedLinkage) this.getMyLifeHouses(val)
  
        // 通知父类改变省份的值
  
        this.$emit('getProvince', val)
  
      },
  
  
  
      /*
  
       * 设置城市
  
       */
  
      setCity(val) {
  
        this.linkageObj.city = val
  
        if (!val) {
  
          this.disabledArr.a = this.disabledArr.h = true
  
        } else {
  
          this.disabledArr.a = false
  
        }
  
        // 需要清空下级联动的数据
  
        this.linkageObj.area = this.linkageObj.lifeId = ''
  
        if (val) this.getMyArea(val)
  
        // 获取生活馆的数据
  
        if (!this.isNeedLinkage) this.getMyLifeHouses(val || this.linkageObj.province)
  
        this.$emit('getCity', val)
  
      },
  
  
  
      /*
  
       * 设置区域
  
       */
  
      setArea(val) {
  
        this.disabledArr.h = !val ? true : false
  
        // 需要清空下级联动的数据
  
        this.linkageObj.lifeId = ''
  
        // TODO 下面的判断后续可能移除
  
        if (this.showHouse && val) this.getMyLifeHouses(val)
  
        // 获取生活馆的数据
  
        if (!this.isNeedLinkage) this.getMyLifeHouses(val || this.linkageObj.province || this.linkageObj.city)
  
        this.$emit('getArea', val)
  
      },
  
  
  
      /*
  
       * 设置生活馆
  
       */
  
      setHouse(val) {
  
        this.linkageObj.lifeId = val;
  
        this.$emit('getHouse', val)
  
      },
  
  
  
      /*
  
       * 设置店铺标签
  
       */
  
      setStoreTag(val) {
  
        this.linkageObj.tag = val;
  
        this.$emit('getStoreTag', val)
  
      },
  
  
  
      /*
  
       * TODO 暂时不需要用到
  
       */
  
      setlinkageObj(val) {
  
        this.linkageObj = val;
  
      },
  
  
  
      /*
  
       * 设置猫号id
  
       */
  
      setMallId(val) {
  
        this.mallId = val
  
      },
  
  
  
      /*
  
       * 设置手机号码
  
       */
  
      setMobile(val) {
  
        this.mobile = val
  
      },
  
  
  
      /*
  
       * 设置开始时间
  
       */
  
      setStartTime(val) {
  
        this.startTime = val
  
      },
  
  
  
      /*
  
       * 设置结束时间
  
       */
  
      setEndTime(val) {
  
        this.endTime = val
  
      },
  
  
  
      /*
  
       * 获取省份
  
       */
  
      getMyProvince() {
  
        var self = this
  
        var url = api.getArea + '100000'
  
        self.sendReq(url, {}, (res) => {
  
          self.provinceList = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取城市
  
       */
  
      getMyCity(val) {
  
        var self = this
  
        var url = api.getArea + val
  
        self.sendReq(url, {}, (res) => {
  
          self.cityList = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取区域
  
       */
  
      getMyArea(val) {
  
        var self = this
  
        var url = api.getArea + val
  
        self.sendReq(url, {}, (res) => {
  
          self.areaList = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取生活馆
  
       */
  
      getMyLifeHouses(val) {
  
        var self = this
  
        var url = api.getLifehouseNames
  
        self.sendReq(url, {
  
          regionId: val
  
        }, (res) => {
  
          self.houseList = res || []
  
        })
  
      },
  
  
  
      /*
  
       * TODO 待扩展,获取店铺标签
  
       */
  
      getMyStoreTag() {},
  
  
  
      /*
  
       * 获取猫号id
  
       */
  
      getMallId() {
  
        this.$emit('getMallId', this.mallId)
  
        return this.mallId
  
      },
  
  
  
      /*
  
       * 获取手机
  
       */
  
      getMobile() {
  
        this.$emit('getMobile', this.mobile)
  
        return this.mobile
  
      },
  
  
  
      /*
  
       * 获取开始时间
  
       */
  
      getStartTime() {
  
        this.$emit('getStartTime', this.startTime)
  
        return this.startTime
  
      },
  
  
  
      /*
  
       * 获取结束时间
  
       */
  
      getEndTime() {
  
        this.$emit('getEndTime', this.endTime)
  
        return this.endTime
  
      },
  
  
  
      /*
  
       * 请求获取数据
  
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
  
    }
  
  }
</script>

<style scoped="scoped">
  .row {
  
    margin-bottom: 20px;
  
    min-height: 32px;
  
    height: auto;
  
    text-align: left;
  
  }
  
  
  
  .houseAreaLinkage {
  
    padding: 10px 10px;
  
  }
  
  
  
  .houseAreaLinkage_select {
  
    display: inline-block;
  
    padding: 10px 0;
  
  }
  
  
  
  .houseAreaLinkage_input {
  
    text-align: left;
  
    padding: 10px 0;
  
    line-height: 32px;
  
    display: inline-block;
  
  }
</style>
