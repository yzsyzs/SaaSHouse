<!--
  添加排课组件
  @作者: 陈伟芳
-->
<template>
  <el-main>
  
    <el-form class="addCurriculum" :model="ruleForm" :rules="rules" ref="ruleForm" v-loading='loading'>
  
      <p class="house">馆名称：{{lifeHouseDetail.lifeName}}</p>
  
      <p class="oper">添加排课（{{currentYear}}年{{currentMonth}}月{{currentDay}}日）</p>
  
  
  
      <el-row class="curriculum-time ">
  
        <el-form-item label="课程名称：" prop="courseId">
  
          <el-select clearable filterable v-model="ruleForm.courseId" placeholder="请选择场馆类型" @change='setCourse'>
  
            <el-option v-for="item in curriculumNameArr" :label="item.courseName" :value="item.courseId" :key="item.courseId"></el-option>
  
          </el-select>
  
        </el-form-item>
  
      </el-row>
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="开始时间：" prop="startTime">
  
          <el-time-select v-model="ruleForm.startTime" :picker-options="{
  
                start: `${lifeHouseDetail.openTime}`,
  
                step: '00:10',
  
                end: '24:00',
  
              }" @change='setStartTime' placeholder="选择时间">
  
          </el-time-select>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="结束时间：" prop="endTime">
  
          {{ruleForm.endTime}}
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="授课教练：" prop="coachId">
  
          <el-select clearable filterable v-model="ruleForm.coachId" placeholder="请选择授课教练">
  
            <el-option v-for="item in curriculumCoachArr" :label="item.coachName" :value="item.coachId" :key="item.coachId"></el-option>
  
          </el-select>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item>
  
          <el-button @click="resetForm('ruleForm')">取消</el-button>
  
          <el-button v-if="dayCurriculumAdd && dayCurriculumCoachHInC" type="primary" @click="submitForm('ruleForm')" :loading='loadingSave'>确定</el-button>
  
        </el-form-item>
  
      </el-row>
  
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
  
  import axios from 'axios'
  
  import moment from 'moment'
  
  export default {
  
    // 组件的名称
  
    name: 'addCurriculum',
  
  
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([
      
        'dayCurriculumAdd',

        'dayCurriculumCoachHInC'
      
      ])
    
    },
  
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        loading: true,
  
        lifeHouseDetail: {},
  
        loadingSave: false,
  
        curriculumNameArr: [],
  
        curriculumCoachArr: [],
  
        ruleForm: {
  
          lifeId: '',
  
          courseId: '',
  
          endTime: '',
  
          startTime: '',
  
          coachId: '',
  
        },
  
        rules: {
  
          startTime: [{
  
            required: true,
  
            message: '请选择开始时间'
  
          }],
  
          endTime: [{
  
            required: true,
  
            message: '请选择结束时间'
  
          }],
  
          courseId: [{
  
            required: true,
  
            message: '请选择课程名称'
  
          }],
  
          coachId: [{
  
            required: true,
  
            message: '请选择授课教练'
  
          }],
  
        },
  
      }
  
    },
  
  
  
    // 组件
  
    components: {},
  
  
  
    // 方法
  
    methods: {
  
  
  
      /*
  
       * 提交表单数据
  
       */
  
      submitForm(formName) {
  
        let self = this
  
        self.loadingSave = true
  
        self.$refs[formName].validate((valid) => {
  
          if (valid) {
  
            let ymd = self.currentYear + '-' + self.currentMonth + '-' + self.currentDay,
  
              startTime = ymd + ' ' + self.ruleForm.startTime,
  
              endTime = ymd + ' ' + self.ruleForm.endTime,
  
              hasInClassParams = {
  
                coachId: self.ruleForm.coachId,
  
                startTime: startTime,
  
                endTime: endTime
  
              }
  
            // TODO 这里放在表单验证 先发请求判断教练在这个时间段内是否有排班,如果没有才可以添加
  
            self.sendReq(api.coachHasInClass, {
  
              data: hasInClassParams
  
            }, (res) => {
  
              self.loadingSave = true
  
              let params = { ...self.ruleForm,
  
                startTime: startTime,
  
                endTime: endTime
  
              }
  
              self.sendReq(api.scheduleAdd, {
  
                data: params
  
              }, (res) => {
  
                self.loadingSave = false
  
                self.$message.success(res || '添加成功')
  
                self.$router.push({
  
                  path: '/dayCurriculum/' + ymd,
  
                  query: {
  
                    lifeId: self.ruleForm.lifeId,
  
                    coachId: '',
  
                    courseId: '',
  
                  }
  
                })
  
              })
  
            })
  
          } else {
  
            self.loading = self.loadingSave = false
  
            console.log('error submit!!')
  
            return false
  
          }
  
        });
  
      },
  
  
  
      /*
  
       * 点击取消按钮
  
       */
  
      resetForm(formName) {
  
        let self = this
  
        self.$refs[formName].resetFields();
  
        self.$router.push({
  
          path: '/dayCurriculum/' + self.date,
  
          query: {
  
            lifeId: self.ruleForm.lifeId,
  
            coachId: self.queryString.coachId || '',
  
            courseId: self.queryString.courseId || '',
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 得到时间戳
  
       */
  
      getTimestamp(time) {
  
        if (!time) return false
  
        let ta = time.split(':'),
  
          h = ta[0],
  
          m = ta[1],
  
          rt = new Date(this.currentYear + '-' + this.currentMonth + '-' + this.currentDay).setHours(h, m)
  
        return rt
  
      },
  
  
  
      /*
  
       * 设置课程
  
       */
  
      setCourse(val) {
  
        let self = this
  
        self.duration = ''
  
        self.curriculumNameArr.forEach((item, index) => {
  
          if (item.courseId === val) self.duration = item.duration
  
        })
  
        // 计算结束时间
  
        if (self.ruleForm.startTime) this.calTime(this.getTimestamp(self.ruleForm.startTime))
  
      },
  
  
  
      /*
  
       * 设置开始时间
  
       */
  
      setStartTime(val) {
  
        // 计算结束时间
  
        if (this.duration) this.calTime(this.getTimestamp(val))
  
      },
  
  
  
      /*
  
       * 计算结束时间
  
       */
  
      calTime(st) {
  
        let self = this,
  
          t = new Date(st).getTime() + self.duration * 60 * 1000
  
        self.ruleForm.endTime = moment(t).format("YYYY-MM-DD HH:mm").split(' ')[1]
  
      },
  
  
  
      /*
  
       * 获取课程名称列表
  
       */
  
      getGroupCourseNameList() {
  
        let self = this,
  
          url = api.getGroupCourseNameList
  
        self.sendReq(url, {
  
          data: {
  
            lifeId: self.ruleForm.lifeId
  
          }
  
        }, (res) => {
  
          self.curriculumNameArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取授课教练列表
  
       */
  
      findCoachByLife() {
  
        let self = this,
  
          url = api.findCoachByLife
  
        self.sendReq(url, {
  
          data: {
  
            lifeId: self.ruleForm.lifeId
  
          }
  
        }, (res) => {
  
          // TODO 下面需要放开
  
          self.curriculumCoachArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 根据lifeId获取生活馆信息
  
       */
  
      getLifeHouseDetail() {
  
        let self = this,
  
          url = api.getLifeHouseDetail
  
        self.sendReq(url, {
  
          data: {
  
            lifeId: self.ruleForm.lifeId
  
          }
  
        }, (res) => {
  
          self.lifeHouseDetail = res
  
        })
  
      },
  
  
  
  
  
      /*
  
       * 发送请求
  
       */
  
      sendReq(url, params, callback) {
  
        let self = this;
  
        axios({
  
          method: params.method || 'POST',
  
          url: url,
  
          data: params.data || {}
  
        }).then((res) => {
  
          self.loading = self.loadingSave = false
  
          if (res && res.data && res.data.code === responeCode.OK) {
  
            if (res.data.page_info) self.page_info = res.data.page_info
  
            callback && callback(res.data.data);
  
          } else {
  
            self.$message.error('失败提示: ' + (res.data && res.data.msg || '返回数据异常'))
  
            console.warn("addCurriculum sendReq res ", res)
  
          }
  
        }, (error) => {
  
          self.loading = self.loadingSave = false
  
          self.$message.error('出现错误 ' + error)
  
          console.warn("addCurriculum sendReq error ", error)
  
        })
  
      },
  
    },
  
  
  
    // 常用钩子函数，总共有8个，可以参照vue的生命周期看
  
  
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {
  
      let self = this
  
      self.queryString = self.$route.query
  
      let params = self.$route.params
  
  
  
      self.ruleForm.lifeId = self.queryString.lifeId
  
      self.date = params.id
  
  
  
      let t = self.date.split('-')
  
      self.currentYear = t[0]
  
      self.currentMonth = t[1]
  
      self.currentDay = t[2]
  
      self.getGroupCourseNameList()
  
      self.findCoachByLife()
  
      self.getLifeHouseDetail()  
  
      // TODO 重新设置父级面包屑的路由
  
      if (self.queryString.coachId === 'undefined') self.queryString.coachId = ''
  
      if (self.queryString.courseId === 'undefined') self.queryString.courseId = ''
  
      self.$route.matched[0].meta[1].path = '/dayCurriculum/' + (params.id || '') + "?lifeId=" + (self.queryString.lifeId || '')
  
      self.$route.matched[0].meta[1].path = "/groupCurriculum?lifeId=" + (self.queryString.lifeId || '') + '&coachId=' + (self.queryString.coachId || '') + '&courseId=' + (self.queryString.courseId || '')
  
    },
  
  
  
    // 完成挂载，相当于dom ready
  
    mounted() {},
  
  
  
    // 销毁，可以做一些定时器的消费等操作
  
    destored() {},
  
  }
</script>

<style scoped>
  .el-form {
  
    background: #fff;
  
  }
  
  
  
  .addCurriculum {
  
    text-align: left;
  
    padding: 20px 20px;
  
  }
  
  
  
  .addCurriculum .house {
  
    font-size: 18px;
  
    padding: 20px 0px;
  
  }
  
  
  
  .addCurriculum .oper {
  
    padding: 20px 80px;
  
    font-size: 24px;
  
    font-weight: bold;
  
  }
  
  
  
  .curriculum-time {
  
    padding: 20px 120px;
  
  }
  
  
  
  .pdt0 {
  
    padding-top: 0px;
  
  }
  
  
  
  .el-form-item__error {
  
    left: 90px;
  
  }
</style>
