<!--
  每日排课组件
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-row>
  
      <el-row class="center dayCurriculum_header">
  
        <span class="">{{showCurrentDay}}</span>
  
        <!-- <el-button class="fr" @click="jumpEditCurriculum">跳到排课信息</el-button> -->
  
        <el-button v-if="dayCurriculumAdd" class="fr" @click="jumpAddCurriculum" :disabled='isOutOfDate'> 添加团课排课 </el-button>
  
      </el-row>
  
  
  
      <el-row class="dayCurriculum_title">
  
        场馆名称：{{lifeName}}
  
      </el-row>
  
  
  
      <el-row class="dayCurriculum_main">
  
        <el-row class="dayCurriculum_main_header">
  
          <ul>
  
            <li class="fl" @click="jumpWeek('pre')">
  
              <</li>
  
                <li class="fl" v-for="(item, index) in week" :class="{active:activeIndex==index}" @click="changeDay(item, index)" :key="item.name">
  
                  {{item.name}}（{{item.value}}）
  
                </li>
  
                <li class="fl" @click="jumpWeek('next')">></li>
  
          </ul>
  
        </el-row>
  
        <el-row class="dayCurriculum_main_content">
  
          <el-row class="line" v-for="(item, index) in timeLines" :key="item.name">
  
            <span class="time">{{item.time}}</span>
  
            <div class="dayCurriculum_main_content_c" v-if="item.data && item.data.length > 0">
  
              <div class="content" v-for="(curriculum, index) in item.data" :key="curriculum.id" @click="jumpEditCurriculum(curriculum)">
  
                <span>{{curriculum.startTimeFormat}}-{{curriculum.endTimeFormat}}</span>
  
                <span>{{curriculum.courseName}}</span>
  
                <span>{{curriculum.coachName}}</span>
  
                <span>{{curriculum.preorderCount}}/{{curriculum.maxCount}}</span>
  
              </div>
  
            </div>
  
          </el-row>
  
        </el-row>
  
        <el-row v-show='timeLines.length === 0' style='padding: 20px 0px; width: 70%;'>
  
          <h1 v-loading.lock='timeLines.length === 0 && isLoading'></h1>
  
          <h1 v-show='timeLines.length === 0 && !isLoading && !isOutOfDate'>暂无数据, 点击右上角<span style="color: red">"添加团课排课"</span>按钮添加排课吧</h1>
  
          <h1 v-show='timeLines.length === 0 && !isLoading && isOutOfDate'>无以往数据!!!!</h1>
  
        </el-row>
  
      </el-row>
  
    </el-row>
  
  </el-main>
</template>

<script>

  import { mapGetters } from 'vuex'

  import {
  
    showWeekOfDay,
  
    changIntoChineseDateMod,
  
    cal,
  
    showObjType
  
  } from '@/common/tools'
  
  import moment from 'moment'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    restful
  
  } from '@/servers/server'
  
  export default {
  
    // 组件的名称
  
    name: 'dayCurriculum',
  
  
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {
      ...mapGetters([
        'dayCurriculumAdd',
        'dayCurriculumUpdTName'
      ])
    },
  
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        isLoading: true,
  
        lifeId: null,
  
        courseId: null,
  
        coachId: null,
  
        lifeName: '',
  
        currentDay: null,
  
        currentDayTimestamp: null,
  
        dayCurriculumParams: null,
  
        activeIndex: 1,
  
        week: [{
  
            name: '周日',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周一',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周二',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周三',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周四',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周五',
  
            value: null,
  
            timestamp: null
  
          },
  
          {
  
            name: '周六',
  
            value: null,
  
            timestamp: null
  
          },
  
        ],
  
  
  
        // 每个时间线
  
        timeLines: []
  
  
  
      }
  
    },
  
  
  
    // 组件
  
    components: {},
  
  
  
    // 方法
  
    methods: {
  
  
  
      /*
  
       * 切换周
  
       */
  
      jumpWeek(type) {
  
        this.activeIndex = null
  
        let lastIndex = this.week.length
  
        let newWeek = type === 'pre' ? cal(this.week[0].timestamp, lastIndex) : newWeek = cal(this.week[lastIndex - 1].timestamp + 86400000, 0)
  
  
  
        // 重新赋值 week的值
  
        this.week = this.week.map((item, index) => {
  
          item.value = newWeek[index].value
  
          item.timestamp = newWeek[index].timestamp
  
          if (item.timestamp === this.currentDayTimestamp) this.activeIndex = index;
  
          return item
  
        })
  
      },
  
  
  
      /*
  
       * 跳转到添加团课排课页面
  
       */
  
      jumpAddCurriculum() {
  
        let self = this
  
        self.$router.push({
  
          path: '/addCurriculum/' + self.currentDay,
  
          query: {
  
            lifeId: self.lifeId,
  
            coachId: self.coachId,
  
            courseId: self.courseId
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 跳转到编辑团课排课页面
  
       */
  
      jumpEditCurriculum(curriculum) {
  
        let self = this
  
        if (self.isOutOfDate) return self.$alert('以往日期只能查看不能新增或编辑')

        if (!self.dayCurriculumUpdTName) return self.$message('对不起，您没有编辑每日排课的权限')
  
        self.$router.push({
  
          path: '/editCurriculum/' + self.currentDay + '/' + curriculum.courseScheduleId,
  
          query: {
  
            lifeId: self.lifeId || '',
  
            coachId: self.coachId || '',
  
            courseId: self.courseId || ''
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 改变天数
  
       */
  
      changeDay(item, index) {
  
        let self = this
  
        self.isLoading = true
  
        self.timeLines = []
  
        self.currentDay = (moment(item.timestamp).format("YYYY-MM-DD"))
  
        self.showCurrentDay = changIntoChineseDateMod(self.currentDay)
  
        self.currentDayTimestamp = new Date(self.currentDay).getTime()
  
        self.isOutOfDate = new Date(self.thisDay).getTime() > self.currentDayTimestamp
  
        self.activeIndex = index
  
        self.getDayCurriculumDay()
  
      },
  
  
  
      /*
  
       * 获取生活馆
  
       */
  
      getLifeHouseDetail() {
  
        let self = this,
  
          url = api.getLifeHouseDetail
  
        self.sendReq(url, {
  
          lifeId: self.lifeId
  
        }, (res) => {
  
          self.lifeName = res.lifeName
  
        })
  
      },
  
  
  
      /*
  
       * 获取每天的数据
  
       */
  
      getDayCurriculumDay() {
  
        let self = this,
  
          url = api.getDailyCourseScheduleList,
  
          params = {
  
            date: self.currentDay,
  
            lifeId: self.lifeId,
  
            coachId: self.coachId,
  
            courseId: self.courseId
  
          }
  
        self.sendReq(url, params, (res) => {
  
          self.timeLines = res || []
  
        })
  
      },
  
  
  
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
  
      let queryString = this.$route.query,
  
        self = this
  
      // 生活馆id
  
      self.lifeId = queryString.lifeId
  
      // 教练id
  
      self.coachId = queryString.coachId
  
      // 课程id
  
      self.courseId = queryString.courseId
  
      // 课程表页面选中的那一天
  
      self.currentDay = self.$route.params.id
  
      self.currentDayTimestamp = new Date(self.currentDay).getTime()
  
      // 显示当前天,用于对比是否可以添加或者编辑排课
  
      self.showCurrentDay = changIntoChineseDateMod(self.currentDay)
  
      // 当前天数所对应周几
  
      self.activeIndex = showWeekOfDay(self.currentDay).index
  
      let newWeek = cal(self.currentDayTimestamp, self.activeIndex)
  
      // 重新赋值 week 的值
  
      self.week = self.week.map((item, index) => {
  
        item.value = newWeek[index].value
  
        item.timestamp = newWeek[index].timestamp
  
        return item
  
      })
  
      // 当前电脑日期
  
      self.thisDay = moment(new Date().getTime()).format('YYYY-MM-DD')
  
      // 所选日期是否比当前日期早, 过期了不能添加跟编辑团课排课
  
      self.isOutOfDate = new Date(self.thisDay).getTime() > self.currentDayTimestamp
  
      self.getLifeHouseDetail()
  
      self.getDayCurriculumDay()
  
      // TODO 重新设置父级面包屑的路由
  
      if (queryString.coachId === 'undefined') queryString.coachId = ''
  
      if (queryString.courseId === 'undefined') queryString.courseId = ''
  
      self.$route.matched[0].meta[0].path = "/groupCurriculum?lifeId=" + (queryString.lifeId || '') + '&coachId=' + (queryString.coachId || '') + '&courseId=' + (queryString.courseId || '')
  
    },
  
  
  
    // 完成挂载，相当于dom ready
  
    mounted() {},
  
  
  
    // 销毁，可以做一些定时器的消费等操作
  
    destored() {},
  
  }
</script>

<style scoped>
  .dayCurriculum_main_content_c .content {
  
    display: inline-block;
  
    height: 80px;
  
    background: #66d5c5;
  
    padding: 0 10px;
  
    color: #fff;
  
    cursor: pointer;
  
    box-sizing: border-box;
  
    margin: 4px 4px
  
  }
  
  
  
  
  
  /*margin: 4px 4px;font-size: 12px;*/
  
  
  
  
  
  /*.dayCurriculum_main_content_c::before { content: ''; width: 95%; position: absolute;top: 50%; border-bottom: 1px solid #e7e7e7; }*/
  
  
  
  .dayCurriculum_main_content_c {
  
    padding-left: 44px;
  
    height: auto;
  
    min-height: 80px;
  
    position: relative;
  
  }
  
  
  
  .dayCurriculum_main_content .time {
  
    height: 100%;
  
    width: 40px;
  
    display: flex;
  
    align-items: center;
  
    text-align: center;
  
    position: absolute;
  
  }
  
  
  
  
  
  /*.dayCurriculum_main_content .line::after { content: ''; width: 100%; border: 1px solid #e7e7e7; top: 0px;}*/
  
  
  
  .dayCurriculum_main_content .line {
  
    height: auto;
  
    min-height: 80px;
  
    width: 100%;
  
    line-height: 80px;
  
    position: relative;
  
    border-bottom: 1px solid #e7e7e7;
  
  }
  
  
  
  .dayCurriculum_main_content {
  
    text-align: left;
  
    position: relative;
  
  }
  
  
  
  .el-row {
  
    background: #fff;
  
  }
  
  
  
  .active {
  
    color: #00B99E;
  
  }
  
  
  
  .dayCurriculum_header {
  
    font-size: 26px;
  
    padding: 10px 10px;
  
  }
  
  
  
  .dayCurriculum_title {
  
    text-align: left;
  
    padding: 10px 10px;
  
  }
  
  
  
  .dayCurriculum_main {
  
    padding: 10px 10px;
  
    padding-bottom: 40px;
  
  }
  
  
  
  .dayCurriculum_main_header {
  
    height: 60px;
  
    text-align: center;
  
    background: #f5f7fa;
  
    margin: 0 auto;
  
    padding: 10px 20px;
  
  }
  
  
  
  .dayCurriculum_main_header ul li {
  
    cursor: pointer;
  
    height: 40px;
  
    padding: 0 6px;
  
    line-height: 40px;
  
  }
</style>
