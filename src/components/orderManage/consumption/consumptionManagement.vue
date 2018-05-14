<template>
  <el-main>
  
    <el-row v-if="consumptionManagementSearch">
  
      <HouseAreaLinkage ref='houseAreaLinkage' @getProvince='setProvince' @getCity='setCity' @getArea='setArea' @getHouse='setHouse' :isNeedLinkage='false'></HouseAreaLinkage>
  
      <el-row class="txall" style="padding-left:10px;">
  
        用户来源：
  
        <el-select filterable v-model="params.courseOrigin" clearable placeholder="请选择" size="medium">
  
          <el-option v-for="item in courseOriginArr" :key="item.status" :label="item.name" :value="item.status"></el-option>
  
        </el-select>
  
        <ExportForm ref='elForm' style="display: inline-block;padding: 0px 10px;">
  
          <el-button v-if="consumptionManagementSearch" round type="primary" icon="el-icon-search" size="medium" :loading='loading' @click='search'>查询</el-button>
  
          <el-button round type="info" size="medium" @click.stop='reset'>重置</el-button>
  
          <el-button v-if="consumptionManagementExport" round type="success" native-type='submit' size="medium">导出</el-button>
  
        </ExportForm>
  
      </el-row>
  
  
  
      <el-row class="txall" v-loading='loading' style="padding: 0px 10px;">
  
        <el-table :data="listData" border style="width: 100%;">
  
          <el-table-column fixed="left" type='index' :index="indexMethod" label="序号" align='left' width="100">
  
          </el-table-column>
  
          <el-table-column prop="lifeName" label="场馆名称" align='left' width="180">
  
          </el-table-column>
  
          <el-table-column prop="orderNo" label="订单号" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="mallId" label="猫号" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="mallName" label="昵称" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="userName" label="用户姓名" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="userMobile" label="手机号" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="courseOrigin" label="消费类型" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="scheduleDateTimeFormat" label="上课时间" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="courseType" label="课程类型" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="courseName" label="课程名称" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="actualPrice" label="课程总价" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="unitPrice" label="课程单价" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="courseCount" label="总课时数" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="surplusCourse" label="剩余课时数" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="trainerName" label="授课导师" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column prop="consumeType" label="耗课形式" align='left' width="120">
  
          </el-table-column>
  
          <el-table-column fixed="right" prop="signMan" label="签到人员" align='left' width="120">
  
          </el-table-column>
  
  
  
          <!-- <el-table-column prop="operate" label="操作">
  
              <template slot-scope="scope">
  
                  <router-link :to="{ name: '场馆详情', params: {id: scope.row.lifeId} }">查看详情</router-link>
  
                  <router-link :to="{ name: '编辑场馆', params: {id: scope.row.lifeId} }">编辑</router-link>
  
                  <el-button type="text" size="small" class="danger pdlr5" @click="confirmDel(scope.row)">删除</el-button>
          
              </template>
          
          </el-table-column> -->

        </el-table>
      
      </el-row>

      <el-row class="pdt40">
      
        <el-pagination
      
          @size-change="handleSizeChange"
      
          @current-change="handleCurrentChange"
      
          :current-page="page"
      
          :page-sizes="[20, 40, 60, 100]"
      
          layout="total, sizes, prev, pager, next, jumper"
      
          :page-count='Math.ceil(page_info.total/count)'
      
          style="text-align: right;"
      
        ></el-pagination>
      
      </el-row>
    
    </el-row>
  
  </el-main>

</template>

<script>

  import { mapGetters } from 'vuex'

  import HouseAreaLinkage from '@/components/base/houseAreaLinkage'
  
  import ExportForm from '@/components/base/exportForm'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import {
  
    listSearchMixin
  
  } from '@/common/mixin/mixin'
  
  import {
  
    compareStartTimeAndEndTime
  
  } from '@/common/tools'
  
  
  
  /*
  
   * TODO 结束时间跟开始时间比对
  
   */
  
  export default {
  
    // 组件的名称
  
    name: 'consumptionManagement',
  
    // 混合模式， 复用组件的内容
  
    mixins: [listSearchMixin],
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([
        
        'consumptionManagementSearch',

        'consumptionManagementExport'
    
      ])
    
    },
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        courseOriginArr: [{
  
          status: 1,
  
          name: "京东众筹"
  
        }, {
  
          status: 0,
  
          name: "APP购买"
  
        }],
  
        page: 0,
  
        count: 20,
  
        params: {
  
          lifeId: '',
  
          mobile: '',
  
          mallId: '',
  
          courseOrigin: '',
  
          startTime: '',
  
          endTime: '',
  
          regionId: ''
  
        },
  
        page_info: {},
  
      }
  
    },
  
  
  
    // 组件
  
    components: {
  
      HouseAreaLinkage,
  
      ExportForm
  
    },
  
  
  
    // 方法
  
    methods: {
  
  
  
      /**
  
       * 获取列表参数，必须在这个组件定义
  
       */
  
      getParams() {
  
        let self = this,
  
          e = self.hEl,
  
          st = e.getStartTime(),
  
          et = e.getEndTime()
  
  
  
        // 校验开始时间跟结束时间
  
        if (!self.checkStartTimeAndEndTime(st, et)) return false
  
        return {
  
          url: api.getCourseConsumeList,
  
          data: { ...self.params,
  
            ...{
  
              count: self.count,
  
              page: self.page > 0 ? self.page - 1 : self.page,
  
              mobile: e.getMobile() || '',
  
              mallId: e.getMallId() || '',
  
              startTime: st || '',
  
              endTime: et || ''
  
            }
  
          }
  
        }
  
      },
  
  
  
      /**
  
       * 校验开始时间跟结束时间
  
       */
  
      checkStartTimeAndEndTime(st, et) {
  
        let rs = compareStartTimeAndEndTime(st, et)
  
        if (!rs.success) {
  
          this.$message.error(rs.msg)
  
        }
  
        return rs.success
  
      },
  
  
  
      /**
  
       * 重置
  
       */
  
      reset() {
  
        let self = this
  
        self.hEl.setProvince()
  
        self.hEl.setCity()
  
        self.hEl.setArea()
  
        self.hEl.setHouse()
  
        self.hEl.setMallId()
  
        self.hEl.setMobile()
  
        self.hEl.setStartTime()
  
        self.hEl.setEndTime()
  
        self.params.courseOrigin = ''
  
        self.page = 0
  
        return false
  
      },
  
  
  
      /**
  
       * 设置省份的值
  
       */
  
      setProvince(val) {
  
        this.params.regionId = val
  
      },
  
  
  
      /**
  
       * 设置城市的值
  
       */
  
      setCity(val) {
  
        this.params.regionId = val
  
      },
  
  
  
      /**
  
       * 设置区域的值
  
       */
  
      setArea(val) {
  
        this.params.regionId = val
  
      },
  
  
  
      /**
  
       * 设置生活馆的值
  
       */
  
      setHouse(val) {
  
        this.params.lifeId = val
  
      },
  
  
  
    },
  
  
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {
  
      let self = this
    
    },
  
  
  
    // 完成挂载，相当于dom ready
  
    mounted() {
  
      let self = this
  
      self.hEl = self.$refs['houseAreaLinkage']
  
      self.elForm = self.$refs['elForm']
  
      if (self.elForm) self.elForm.$el.action = api.courseConsumeListExport
  
      self.search()
  
    },
  
  
  
    // 销毁，可以做一些定时器的消费等操作
  
    destored() {},
  
  }
</script>

<style scoped>
  .el-row {
  
    width: 100%;
  
    height: auto;
  
    background: #fff;
  
    padding: 40px 20px;
  
    box-sizing: border-box;
  
    padding-top: 0px;
  
  }
</style>
