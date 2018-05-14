<!--
  课程表
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-row class="txall">
  
      <div class="groupCurriculum_condition pdt40">
  
        场馆：
  
        <el-select v-model="lifeId" clearable filterable :disabled="houseList.length === 1" placeholder="全部" size="medium" @change='setHouse'>
  
          <el-option v-for="item in houseList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId"></el-option>
  
        </el-select>
  
      </div>
  
  
  
      <div class="groupCurriculum_condition pdt40">
  
        课程名称：
  
        <el-select v-model="courseId" clearable placeholder="全部" size="medium" @change='setCurriculum'>
  
          <el-option v-for="item in curriculumList" :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
  
        </el-select>
  
      </div>
  
  
  
      <div class="groupCurriculum_condition pdt40" v-show='lifeId'>
  
        授课教练：
  
        <el-select v-model="coachId" clearable placeholder="全部" size="medium" @change='setCoach'>
  
          <el-option v-for="item in curriculumCoachList" :key="item.coachId" :label="item.coachName" :value="item.coachId" />
  
        </el-select>
  
      </div>
  
  
  
      <div class="groupCurriculum_condition pdt40 pdb20 fr">
  
        <!-- TODO 月跟周模式的权限是否一致，这里先做一致性处理 -->
  
        <el-button v-if="isClassSet ? classSetSearch : scheduleSearch" type="primary" round @click="search" icon="el-icon-search" :loading='isLoading'>
  
          查询
  
        </el-button>
  
        <el-button round @click="reset">
  
          重置
  
        </el-button>
  
      </div>
  
    </el-row>
  
  
  
    <el-row>
  
      <el-row>
  
        <span class="fl">场馆名称：{{ lifeName }}</span>
  
        <span class="fr" style="display: flex">
  
            <span style="font-size: 20px;padding-right:10px;">日历模式</span>
  
        <el-radio-group v-model="calenderType">
  
          <!-- TODO 如果只有一种模式的话那么这里的radio要自动选中某种模式 -->
  
          <el-radio :label="1">周</el-radio>
  
          <el-radio :label="2">月</el-radio>
  
        </el-radio-group>
  
        </span>
  
      </el-row>
  
      <el-row>
  
        <fullcalendar v-show="calenderType === 2" ref="fullcalendar" lang="zh" :events="calendar.events" :weekNames="calendar.weekNames" :titleFormat="calendar.titileFormat" @changeMonth="changeMonth" @checkOD='mMcheckOD' v-loading='isLoading'></fullcalendar>
  
        <div class="groupCurriculum_calendar" v-show="calenderType === 1">
  
          <div class="full-calendar-header">
  
            <div class="header-center">
  
              <span class="prev-month" @click="setDate('pre')">&lt;</span>
  
              <span class="title">{{currentYear}}年{{currentMonth >= 10 ? currentMonth : ('0' + currentMonth)}}月</span>
  
              <span class="next-month" @click="setDate('next')">&gt;</span>
  
            </div>
  
          </div>
  
          <div class="full-calendar-body" v-loading='isLoading'>
  
            <div class="weeks">
  
              <strong class="week" @click="jumpWeek('pre')">&lt;</strong>
  
              <strong class="week" v-for="(item, index) in week" :key="item.name">
  
                {{item.name}}（{{item.value}}）
  
              </strong>
  
              <strong class="week" @click="jumpWeek('next')">&gt;</strong>
  
            </div>
  
            <div class="dates">
  
              <div class="dates-bg">
  
                <div class="week-row" v-for="(timePeriod, index) in weekData.timePeriodArr" :key="timePeriod">
  
                  <!-- 具体时间段 -->
  
                  <div class="day-cell">
  
                    {{timePeriod}}
  
                  </div>
  
                  <div class="day-cell" v-for="(d, i) in week" :key="i" @click="jumpDay(d)">
  
                    <div v-for="(swd, l) in showWeekData" :key="l" v-show='index === l'>
  
                      <div v-for="(c, j) in swd" v-show="c.key" :key="j">
  
                        <p style='font-size: 12px;' v-for="(item, k) in c.data" v-show="item.dateTimestamp == d.timestamp" @click.stop='jumpDay(d, item)' :key="item.coachId">
  
                          <span :class="{groupCurriculum_private_sign: isClassSet && item.courseType === 'PERSONALCOURSE', groupCurriculum_group_sign: isClassSet && item.courseType === 'GROUPCOURSE'}">&nbsp;</span> {{item.startTimeFormat}}-{{item.endTimeFormat}}
  
                          {{item.courseName}} {{item.coachName}} {{item.preorderCount}}<span v-if='item.maxCount'>/{{item.maxCount}}</span>
  
                        </p>
  
                      </div>
  
                    </div>
  
                  </div>
  
                  <!-- 不需要填写, 占位 -->
  
                  <div class="day-cell"></div>
  
  
  
                  <!-- TODO 暂且保留下面的注释 -->
  
                  <!-- 具体时间段 -->
  
                  <!-- <div class="day-cell">
  
                    {{weekData.data[0].timePeriod}}
  
                  </div>
  
                  <div class="day-cell" v-for="(d, i) in week" :key="i" @click="jumpDay(d)">
  
                    <div
  
                      v-for="(c, j) in showWeekData[0]"
  
                      v-show="c.key"
  
                      :key="j"
  
                    >
  
  
  
                      <p v-for="(item, k) in c.data" v-show="item.startTimestamp == d.timestamp">
  
                        {{item.timeOfCourse}} {{item.courseName}} {{item.coachName}} {{item.leftCount}}/{{item.totalCount}}
  
                      </p>
  
                    </div>
  
                  </div> -->
  
  
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
        <el-row class="txall" v-if='isClassSet'>
  
          <p>
  
            <span style="position: relative; padding: 0px 16px;"><span class="groupCurriculum_private_sign"></span>为私教课预约</span>
  
            <span style="position: relative; padding: 0px 16px;"><span class="groupCurriculum_group_sign"></span>为团课排课</span>
  
          </p>
  
        </el-row>
  
      </el-row>
  
    </el-row>
  
  </el-main>
</template>
<script>
  import { mapGetters } from 'vuex'
  
  import fullcalendar from '@/plugins/vue-fullcalendar/index.js'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import moment from 'moment'
  
  import {
  
    showWeekOfDay,
  
    changIntoChineseDateMod,
  
    cal,
  
    getCountDays,
  
    changChineseModIntoTimestamp,
  
    showObjType
  
  } from '@/common/tools'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    restful
  
  } from '@/servers/server'
  
  
  
  /*
  
   * 注意时间戳的转化
  
      2017-12-12 转换后是当天的 8 点
  
      2017-12-01 转换后是当天的 8 点
  
      2017-12-1 转换后是当天的 0 点
  
      2017-12 转换后是月的第一天的 8 点
  
   */

  /**
   * TODO 页面切换月份的时候需不需要做权限控制
   * 没有权限的提示信息可以做个变量
  */
  
  
  
  let calendarData = {
  
    events: [],
  
    titileFormat: 'yyyy年MM月',
  
    weekNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  
  }
  
  let weekData = {
  
    timePeriodArr: [],
  
    data: []
  
  }
  
  export default {
  
    // 组件的名称
  
    name: 'groupCurriculum',
  
  
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {
  
      // 是否是上课安排
  
      isClassSet: {
  
        type: Boolean,
  
        default: false
  
      },
  
      // 是否是预约团课
  
      isAppoint: {
  
        type: Boolean,
  
        default: false
  
      },
  
      // 上课类型
  
      courseType: {
  
        type: String
  
      }
  
    },

    computed: {
      
      ...mapGetters([

        'classSetSearch',

        'scheduleSearch',

        'dayCurriculumSearch'

      ])
    },
  
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        // 加载中
  
        isLoading: false,
  
        // 周月模式，1 周末模式 2 月模式
  
        calenderType: 2,
  
        currentYear: null,
  
        currentMonth: null,
  
        // 生活馆列表
  
        houseList: [],
  
        // 生活馆id
  
        lifeId: null,
  
        // 生活馆名称
  
        lifeName: null,
  
        // 课程列表
  
        curriculumList: [],
  
        // 课程id
  
        courseId: null,
  
        // 授课教练列表
  
        curriculumCoachList: [],
  
        // 授课教练id
  
        coachId: null,
  
        calendar: {
  
          events: []
  
        },
  
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
  
        weekData: weekData,
  
        // 页面显示周的数据
  
        showWeekData: [],
  
      }
  
    },
  
  
  
    // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
  
    // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined
  
  
  
    // 方法
  
    methods: {
  
      /*
  
       *  周排班模式下切换周的时候执行的函数
  
       */
  
      setDate(type, move) {
  
        let self = this,
  
          maxMonth = 12,
  
          minMonth = 1
  
        if (type === 'pre') {
  
          // 如果所选日期是当前日期之前，并且是周模式的话，那么不能切换
  
          if (self.checkIsOutOfDate() && self.calenderType === 1 && self.isClassSet) {
  
            self.$message({
  
              message: '不能查看当前月份的数据',
  
              type: 'error',
  
              duration: 3000
  
            });
  
            return false
  
          }
  
          if (move == undefined && self.calenderType === 1) {
  
            self.calendarPreMontEle.click()
  
          }
  
          if (self.currentMonth <= minMonth) {
  
            self.currentMonth = maxMonth
  
            self.currentYear -= 1
  
          } else {
  
            self.currentMonth -= 1
  
          }
  
        } else if (type === 'next') {
  
          if (move == undefined && self.calenderType === 1) {
  
            self.calendarNextMontEle.click()
  
          }
  
          if (self.currentMonth >= maxMonth) {
  
            self.currentMonth = minMonth
  
            self.currentYear += 1
  
          } else {
  
            self.currentMonth += 1
  
          }
  
        }
  
        // 重新获取周
  
        // self.handleWeek(self.getNewWeek(self.currentYear + '-' + self.currentMonth))
  
  
  
        // 当前天置 0 ,表示切换月份的时候从1号开始
  
        self.currentDate = 0
  
        self.search()
  
  
  
        // TODO 得到团课的数据
  
        // self.getWeekModGroupCurriculum(type)
  
      },
  
  
  
      /*
  
       * 设置生活馆
  
       */
  
      setHouse(val) {
  
        let self = this
  
        self.lifeId = val
  
        if (!self.lifeId) {
  
          self.lifeName = ''
  
          // 清除课程的数据
  
          self.curriculumList = []
  
          self.courseId = ''
  
          // 如果是团课的需要清除授课教练的数据
  
          // if(self.isClassSet) return false
  
          self.curriculumCoachList = []
  
          self.coachId = ''
  
          return false
  
        }
  
        // 获取生活馆的名称
  
        self.houseList.forEach((item, index) => {
  
          if (self.lifeId === item.lifeId) self.lifeName = item.lifeName
  
        })
  
  
  
        // 获取课程名称
  
        self.getGroupCourseNameList()
  
        // 获取授课教练
  
        self.findCoachByLife()
  
      },
  
  
  
      /*
  
       * 获取课程名称
  
       */
  
      getGroupCourseNameList(clearable) {
  
        let self = this,
  
          getCourseUrl = self.isClassSet ? api.getAllCourseNameList : api.getGroupCourseNameList
  
        self.sendReq(getCourseUrl, {
  
          lifeId: self.lifeId
  
        }, (res) => {
  
          self.curriculumList = res
  
          // 默认情况下是需要清除 courseId
  
          if (!clearable) self.courseId = ''
  
        })
  
      },
  
  
  
      /*
  
       * 获取授课教练
  
       */
  
      findCoachByLife() {
  
        let self = this,
  
          getCoachUrl = api.findCoachByLife
  
        self.sendReq(getCoachUrl, {
  
          lifeId: self.lifeId
  
        }, (res) => {
  
          self.curriculumCoachList = res
  
        })
  
      },
  
  
  
      /*
  
       * 设置课程
  
       */
  
      setCurriculum(val) {
  
        this.courseId = val
  
      },
  
  
  
      /*
  
       * 设置教练
  
       */
  
      setCoach(val) {
  
        this.coachId = val
  
      },
  
  
  
      /*
  
       * 重置
  
       */
  
      reset() {
  
        let self = this
  
        self.coachId = self.courseId = self.lifeId = self.lifeName = null
  
      },
  
  
  
      /*
  
       * 搜索
  
       */
  
      search() {
  
        let self = this
  
        let params = {
  
            courseType: (self.courseType === 'ALL' ? null : (self.courseType == undefined ? 'GROUPCOURSE' : self.courseType)),
  
            coachId: self.coachId,
  
            courseId: self.courseId,
  
            date: self.currentYear + '-' + self.currentMonth,
  
            lifeId: self.lifeId
  
          },
  
          getMonthCourseScheduleListUrl = self.isClassSet ? api.getMonthListByCoach : api.getMonthCourseScheduleList,
  
          getWeekCourseScheduleListUrl = self.isClassSet ? api.getWeekListByCoach : api.getWeekCourseScheduleList
  
        if (!self.lifeId) return self.$message.error('请先选择生活馆')
  
        // 请求月的接口,获取月的数据
  
        self.sendReq(getMonthCourseScheduleListUrl, params, (res) => {
  
          // 需要做数据格式转化 如果返回 changeCalendarMonthDayFormat 函数返回 false 的话需要重新初始化
  
          self.calendar = self.changeCalendarMonthDayFormat(res) ? calendarData : {
  
            events: [],
  
            titileFormat: 'yyyy年MM月',
  
            weekNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  
          }
  
        }, true)
  
        // 请求周的接口,获取周的数据
  
        self.sendReq(getWeekCourseScheduleListUrl, params, (res) => {
  
          self.weekData = res || {
  
            timePeriodArr: [],
  
            data: []
  
          }
  
          // 处理周的显示
  
          let d = self.getDayM(self.currentDate)
  
          self.handleWeek(self.getNewWeek(self.currentYear + '-' + self.currentMonth + '-' + d))
  
        }, true)
  
      },
  
  
  
      /*
  
       * 转化数据格式,为月模式可用
  
       */
  
      changeCalendarMonthDayFormat(data) {
  
        if (showObjType(data) !== 'Array' || data.length === 0) return false
  
        // 需要清空原数组,不然数据会累加
  
        calendarData.events = []
  
        data.forEach((d, i) => {
  
          if (d.courseScheduleCourseInfo && d.courseScheduleCourseInfo.length > 0) {
  
            d.courseScheduleCourseInfo.forEach((item, index) => {
  
              let title = item.startTimeFormat + '-' + item.endTimeFormat + ' ' + item.coachName + ' ' +
  
                item.courseName + ' ' + item.preorderCount + (item.maxCount > 0 ? ('/' + item.maxCount) : '')
  
              calendarData.events.push({
  
                title: title,
  
                start: item.date,
  
                // end: '',
  
                data: item
  
              })
  
            })
  
          }
  
        })
  
        return true
  
      },
  
  
  
      /*
  
       * 如果传入是 0 ，那么默认为 01
  
       * 如果是月的 1 号，那么应该转换成 01
  
       */
  
      getDayM(d) {
  
        if (d === 0) {
  
          d = '01'
  
        } else if (d > 0 && d <= 10) {
  
          d = '0' + d
  
        }
  
        return d
  
      },
  
  
  
      /*
  
       * 获取周模式的月数据 [暂时不用到]
  
       */
  
      getWeekModGroupCurriculum(type) {},
  
  
  
      /*
  
       *  获取场馆列表
  
       */
  
      getLifeHouse() {
  
        let self = this
  
        let getLifeUrl = api.getLifeNameList
  
        self.sendReq(getLifeUrl, {}, (res) => {
  
          self.houseList = res || []
  
          if (self.houseList.length === 1) {
  
            self.setHouse(self.houseList[0].lifeId)
  
          } else {
  
            self.houseList.forEach((item, index) => {
  
              if (self.lifeId === item.lifeId) self.lifeName = item.lifeName
  
            })
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 发送请求
  
       */
  
      sendReq(url, params, callback, l) {
  
        let self = this,
  
          config = {
  
            url: url,
  
            param: params,
  
          }
  
        if (l) config.loading = "isLoading"
  
        // 调用封装好的发送请求
  
        restful.sendMyData(config, self, (res) => {
  
          if (res && res.code === responeCode.OK) {
  
            let d = res.data
  
            callback && callback(d)
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 点击有排课的一天的操作
  
       */
  
      emitEventClick(...args) {
  
        let self = this
  
        if (self.isClassSet) return false

        if (!self.dayCurriculumSearch) return self.$message.error('对不起，您没有查看每日排课的权限')
  
        if (!self.lifeId) return self.$message.error('请先选择生活馆')
  
        if (self.isAppoint) {
  
          let courseInfo = args[0] && args[0].data
  
          // console.log('groupCurriculum emitEventClick courseInfo ', courseInfo)
  
          self.$router.push({
  
            path: "/selectUserRecord/" + courseInfo.courseId,
  
            query: {
  
              lifeId: self.lifeId || '',
  
              courseScheduleId: courseInfo.courseScheduleId || ''
  
            }
  
          })
  
          return
  
        }
  
        self.$router.push({
  
          path: "/dayCurriculum/" + args[0].start,
  
          query: {
  
            lifeId: self.lifeId || '',
  
            coachId: self.coachId || '',
  
            courseId: self.courseId || ''
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 点击没有排课的一天的操作
  
       */
  
      emitDayClick(...args) {
  
        let self = this,
  
          dat = moment(args[0]).format('YYYY-MM-DD')
  
        if (self.isClassSet || self.isAppoint) return false

        if (!self.dayCurriculumSearch) return self.$message.error('对不起，您没有查看每日排课的权限')
  
        if (!self.lifeId) return self.$message.error('请先选择生活馆')
  
        self.$router.push({
  
          path: "/dayCurriculum/" + dat,
  
          query: {
  
            lifeId: self.lifeId || '',
  
            coachId: self.coachId || '',
  
            courseId: self.courseId || ''
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 暂时不用到
  
       */
  
      emitChangeMonth(...args) {},
  
  
  
      /*
  
       * 月模式下检验是否是过去日期
  
       */
  
      mMcheckOD() {
  
        let self = this
  
        self.$message({
  
          message: '不能查看当前月份以前的数据',
  
          type: 'error',
  
          duration: 3000
  
        });
  
        return false
  
      },
  
  
  
      /*
  
       * 月模式下改变月的时候需要执行的函数
  
       */
  
      changeMonth(...args) {
  
        let self = this
  
        if (!self.compareMonth) {
  
          self.compareMonth = args[0]
  
        } else {
  
          if (self.calenderType === 2) {
  
            if (new Date(self.compareMonth).getTime() > new Date(args[0]).getTime()) {
  
              self.setDate('pre', 'move')
  
            } else {
  
              self.setDate('next', 'move')
  
            }
  
          }
  
          self.compareMonth = args[0]
  
        }
  
      },
  
  
  
      /*
  
       * 切换周
  
       */
  
      jumpWeek(type) {
  
        let lastIndex = this.week.length
  
        let newWeek = type === 'pre' ?
  
          cal(this.week[0].timestamp, lastIndex) :
  
          newWeek = cal(this.week[lastIndex - 1].timestamp + 86400000, 0)
  
        this.handleWeek(newWeek)
  
      },
  
  
  
      /*
  
       * 跳到每日排班
  
       */
  
      jumpDay(d, courseInfo) {
  
        let self = this,
  
          day = moment(d.timestamp).format("YYYY-MM-DD"),
  
          matchMonth = day.split('-')[1]
  
        if (self.isClassSet) return false
  
        // 不在所选月份跟 没有查看每日排班权限的 不能跳
  
        if (matchMonth != self.currentMonth) return false;

        if (!self.dayCurriculumSearch) return self.$message.error('对不起，您没有查看每日排课的权限')
  
        if (!self.lifeId) return self.$message.error('请先选择生活馆')
  
        if (self.isAppoint) {
  
          if (!courseInfo) return false
  
          self.$router.push({
  
            path: "/selectUserRecord/" + courseInfo.courseId,
  
            query: {
  
              lifeId: self.lifeId || '',
  
              courseScheduleId: courseInfo.courseScheduleId || ''
  
            }
  
          })
  
          return false
  
        }
  
        self.$router.push({
  
          path: "/dayCurriculum/" + day,
  
          query: {
  
            lifeId: self.lifeId || '',
  
            coachId: self.coachId || '',
  
            courseId: self.courseId || ''
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 处理周的显示跟周的数据
  
       */
  
      handleWeek(newWeek) {
  
        var self = this,
  
          startDay = null,
  
          isMatch = false,
  
          newWeek = newWeek || []
  
        self.week = self.week.map((item, index) => {
  
          item.value = newWeek[index].value
  
          item.timestamp = newWeek[index].timestamp
  
          if (!isMatch && item.value.split('月')[0] == self.currentMonth) {
  
            isMatch = true
  
            startDay = parseInt(item.value.split('日')[0].split('月')[1])
  
          }
  
          return item
  
        })
  
        // self.showWeekData[0] = self.weekData.data[0].curriculum.slice(startDay - 1, startDay + 6)
  
        self.showWeekData = []
  
        self.showWeekData = self.weekData && self.weekData.data && self.weekData.data.map((item, index) => {
  
          return item.data.slice(startDay - 1, startDay + 6)
  
        })
  
        // console.warn('groupCurriculum methods handleWeek self.showWeekData ', self.showWeekData)
  
      },
  
  
  
      /*
  
       * 切换周的时候获取新周
  
       */
  
      getNewWeek(currentDay) {
  
        let index = showWeekOfDay(currentDay).index,
  
          // 因为后台转化时间戳的时候会转成当天的 0 点,而前端转的时候会转成当天的8点,所以前端需要减去 8 个小时的时间戳
  
          currentDayTimestamp = new Date(currentDay).getTime() - 8 * 60 * 60 * 1000,
  
          newWeek = cal(currentDayTimestamp, index)
  
        return newWeek
  
      },
  
  
  
      /*
  
       * 检查所选日期是否为当前月份之前
  
       */
  
      checkIsOutOfDate() {
  
        let self = this,
  
          date = new Date(),
  
          y = date.getFullYear(),
  
          m = date.getMonth()
  
        m = m === 0 ? 12 : m + 1
  
        let ret = new Date(self.currentYear + '-' + self.currentMonth).getTime() <= new Date(y + '-' + m).getTime()
  
        return ret
  
      }
  
  
  
    },
  
  
  
    watch: {
  
      // 监听路由变化
  
      '$route' (to, from) {
  
        let self = this
  
        self.showWeekData = {
  
          timePeriodArr: [],
  
          data: []
  
        }
  
        self.calendar = {
  
          events: [],
  
          titileFormat: 'yyyy年MM月',
  
          weekNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  
        }
  
        self.reset()
  
      }
  
    },
  
  
  
    components: {
  
      fullcalendar
  
    },
  
  
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {

      let self = this,
  
        date = new Date(),
  
        y = date.getFullYear(),
  
        m = date.getMonth(),
  
        d = date.getDate()
  
      // 显示在页面的年份
  
      self.currentYear = y
  
      // 显示在页面的月份
  
      self.currentMonth = m === 0 ? 12 : m + 1
  
      // 天数
  
      self.currentDate = self.getDayM(d)
  
      let ymd = self.currentYear + '-' + self.currentMonth + '-' + self.currentDate,
  
        newWeek = self.getNewWeek(ymd)
  
      self.handleWeek(newWeek)
  
      // 获取馆的数据
  
      self.getLifeHouse()
  
      // 获取链接url上面的参数
  
      let urlQ = self.$route.query
  
      if (urlQ.lifeId) {
  
        self.lifeId = urlQ.lifeId
  
        // 获取课程名称
  
        self.getGroupCourseNameList(true)
  
        // 存在lifeId的话自动搜索
  
        self.search()
  
      }
  
      if (urlQ.courseId) self.courseId = urlQ.courseId
  
      // 注意这里设置进入的时候，到时候取的时候注意是字符串
  
      localStorage.setItem('isClassSetToVueFullCalendar', self.isClassSet)  
  
      // 挂载插件的函数
  
      fullcalendar.methods.emitEventClick = self.emitEventClick
  
      fullcalendar.methods.emitDayClick = self.emitDayClick
  
      // fullcalendar.methods.emitChangeMonth = self.emitChangeMonth
  
    },
  
  
  
    // 完成挂载，相当于dom ready
  
    mounted() {
  
      // TODO 需要优化
  
      this.calendarPreMontEle = this.$refs['fullcalendar'].$el.children[0].children[1].children[0]
  
      this.calendarNextMontEle = this.$refs['fullcalendar'].$el.children[0].children[1].children[2]
  
      // this.calendarMontTitle = this.$refs['fullcalendar'].$el.children[0].children[1].children[1].innerText
  
    },
  
  
  
    // 销毁，可以做一些定时器的消费等操作
  
    destroyed() {},
  
  }
</script>

<style scoped>
  .groupCurriculum_private_sign,
  
  .groupCurriculum_group_sign {
  
    width: 6px;
  
    height: 6px!important;
  
    border-radius: 50%;
  
    -moz-border-radius: 50%;
  
    -webkit-border-radius: 50%;
  
    position: absolute;
  
    top: 50%;
  
    left: 0px;
  
  }
  
  
  
  .groupCurriculum_private_sign {
  
    background-color: #00B99E;
  
  }
  
  
  
  .groupCurriculum_group_sign {
  
    background-color: blue;
  
  }
  
  
  
  .privateClass {
  
    color: #00B99E
  
  }
  
  
  
  .groupClass {
  
    color: blue
  
  }
  
  
  
  .day-cell {
  
    cursor: pointer;
  
  }
  
  
  
  .dates-bg {
  
    position: relative;
  
  }
  
  
  
  .week:nth-child(1),
  
  .week:nth-child(9) {
  
    font-size: 20px;
  
  }
  
  
  
  .week {
  
    cursor: pointer;
  
    font-size: 14px;
  
  }
  
  
  
  .day-cell p {
  
    padding: 10px 10px;
  
    position: relative;
  
  }
  
  
  
  .full-calendar-body .dates .week-row {
  
    border-left: 0px;
  
  }
  
  
  
  .full-calendar-body .dates .week-row .day-cell:nth-child(1) {
  
    display: flex;
  
    align-items: center;
  
  }
  
  
  
  .full-calendar-body .dates .week-row .day-cell:nth-child(9) {
  
    border-right: none;
  
  }
  
  
  
  .el-row {
  
    width: 100%;
  
    height: auto;
  
    background: #fff;
  
    margin: 0;
  
    padding: 10px 20px;
  
    box-sizing: border-box;
  
  }
  
  
  
  .el-radio {
  
    margin: 0px;
  
  }
  
  
  
  i,
  
  label {
  
    font-size: 24px;
  
  }
  
  
  
  label {
  
    padding: 0 10px;
  
  }
  
  
  
  .groupCurriculum_condition {
  
    display: inline-block;
  
    padding-right: 40px;
  
  }
  
  
  
  .pdt40 {
  
    padding-top: 40px;
  
  }
  
  
  
  .pdb20 {
  
    padding-bottom: 20px;
  
  }
  
  
  
  .comp-full-calendar {
  
    padding: 0;
  
    max-width: 100%;
  
  }
</style>
