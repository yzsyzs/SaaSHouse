<!--
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-form class="editCurriculum" :model="ruleForm" :rules="rules" ref="ruleForm" v-loading='loading'>
  
      <p class="house">馆名称：{{lifeHouseDetail.lifeName}}</p>
  
      <p class="oper">排课信息（{{currentYear}}年{{currentMonth}}月{{currentDay}}日）</p>
  
  
  
      <el-row class="curriculum-time">
  
        <el-form-item label="课程名称：">
  
          {{courseScheduleInfo.courseName}}
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="开始时间：">
  
          {{courseScheduleInfo.startTimeFormat}}
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="结束时间：">
  
          {{courseScheduleInfo.endTimeFormat}}
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="授课教练：" prop="coachId">
  
          <el-select clearable filterable v-model="ruleForm.coachId" placeholder="请选择场馆类型">
  
            <el-option v-for="item in curriculumCoachArr" :label="item.coachName" :value="item.coachId" :key="item.coachId"></el-option>
  
          </el-select>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item label="预约情况：">
  
          {{courseScheduleInfo.haveCount}} / {{courseScheduleInfo.maxCount}}
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="curriculum-time pdt0">
  
        <el-form-item>
  
          <el-button @click="resetForm('ruleForm')">取消</el-button>
  
          <el-button v-if="dayCurriculumUpdTName" type="primary" @click="submitForm('ruleForm')" :loading='loadingSave'>确定</el-button>
  
          <el-button v-if="dayCurriculumDel" type="danger" @click="delCurriculum" :loading='loadingDel'>删除</el-button>
  
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
  
  export default {
  
    // 组件的名称
  
    name: 'editCurriculum',
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([
      
        'dayCurriculumUpdTName',
        
        'dayCurriculumDel'
      
      ])
    
    },
  
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        loading: true,
  
        loadingSave: false,
  
        loadingDel: false,
  
        curriculumCoachArr: [],
  
        courseScheduleInfo: {},
  
        lifeHouseDetail: {},
  
        ruleForm: {
  
          coachId: ''
  
        },
  
        rules: {
  
          coachId: [{
  
            required: true,
  
            message: '请选择授课教练'
  
          }]
  
        }
  
      }
  
    },
  
  
  
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
  
            self.updateTrainerName()
  
          } else {
  
            self.loadingSave = self.loadingDel = self.loading = false
  
            console.log('error submit!!')
  
            return false
  
          }
  
        });
  
      },
  
  
  
      /*
  
       * 重置表单
  
       */
  
      resetForm(formName) {
  
        let self = this
  
        self.$refs[formName].resetFields()
  
        self.$router.push({
  
          path: '/dayCurriculum/' + self.date,
  
          query: {
  
            lifeId: self.lifeId,
  
            coachId: self.queryString.coachId || '',
  
            courseId: self.queryString.courseId || '',
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 删除排课
  
       */
  
      delCurriculum() {
  
        let self = this,
  
          url = api.scheduleDelete
  
        self.loadingDel = true
  
        self.sendReq(url, {
  
          data: {
  
            courseScheduleId: self.ruleForm.courseScheduleId
  
          }
  
        }, (res) => {
  
          self.$router.push({
  
            path: '/dayCurriculum/' + self.date,
  
            query: {
  
              lifeId: self.lifeId || '',
  
              coachId: self.queryString.coachId || '',
  
              courseId: self.queryString.courseId || '',
  
            }
  
          })
  
        })
  
      },
  
  
  
      /*
  
       * 更新排课教练
  
       */
  
      updateTrainerName() {
  
        let self = this,
  
          url = api.updateTrainerName
  
        self.sendReq(url, {
  
          data: self.ruleForm
  
        }, (res) => {
  
          self.$router.push({
  
            path: '/dayCurriculum/' + self.date,
  
            query: {
  
              lifeId: self.lifeId || '',
  
              coachId: self.queryString.coachId || '',
  
              courseId: self.queryString.courseId || '',
  
            }
  
          })
  
        })
  
      },
  
  
  
      /*
  
       * 获取授课教练列表数据
  
       */
  
      findCoachByLife() {
  
        let self = this,
  
          url = api.findCoachByLife
  
        self.sendReq(url, {
  
          data: {
  
            lifeId: self.lifeId
  
          }
  
        }, (res) => {
  
          self.curriculumCoachArr = res
  
        })
  
      },
  
  
  
      /*
  
       * 获取排班信息
  
       */
  
      getCourseSchedule() {
  
        let self = this,
  
          url = api.getCourseSchedule
  
        self.sendReq(url, {
  
          data: {
  
            courseScheduleId: self.ruleForm.courseScheduleId
  
          }
  
        }, (res) => {
  
          self.ruleForm.coachId = res.coachId
  
          self.courseScheduleInfo = res
  
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
  
            lifeId: self.lifeId
  
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
  
          self.loadingSave = self.loadingDel = self.loading = false
  
          if (res && res.data && res.data.code === responeCode.OK) {
  
            if (res.data.page_info) self.page_info = res.data.page_info
  
            callback && callback(res.data.data);
  
          } else {
  
            self.$message.error('失败提示: ' + (res.data && res.data.msg || '返回数据异常'))
  
            console.log("editCurriculum sendReq res ", res)
  
          }
  
        }, (error) => {
  
          self.loadingSave = self.loadingDel = self.loading = false
  
          self.$message.error('出现错误 ' + error)
  
          console.warn("editCurriculum sendReq error ", error)
  
        })
  
      },
  
  
  
    },
  
  
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {
  
      let self = this
  
      self.queryString = self.$route.query
  
      let params = self.$route.params 
  
      // 排课id
  
      self.ruleForm.courseScheduleId = params.courseScheduleId
  
      self.getCourseSchedule()
  
      self.lifeId = self.queryString.lifeId
  
      self.findCoachByLife()
  
      self.date = params.id
  
      // 根据lifeId获取生活馆信息
  
      self.getLifeHouseDetail()
  
      let t = self.date.split('-')
  
      self.currentYear = t[0]
  
      self.currentMonth = t[1]
  
      self.currentDay = t[2]  
  
      // TODO 重新设置父级面包屑的路由
  
      if (self.queryString.coachId === 'undefined') self.queryString.coachId = ''
  
      if (self.queryString.courseId === 'undefined') self.queryString.courseId = ''
  
      self.$route.matched[0].meta[1].path = '/dayCurriculum/' + (params.id || '') + "?lifeId=" + (self.queryString.lifeId || '')
  
      self.$route.matched[0].meta[1].path = "/groupCurriculum?lifeId=" + (self.queryString.lifeId || '') + '&coachId=' + (self.queryString.coachId) + '&courseId=' + (self.queryString.courseId)
  
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
  
  
  
  .editCurriculum {
  
    text-align: left;
  
    padding: 20px 20px;
  
  }
  
  
  
  .editCurriculum .house {
  
    font-size: 18px;
  
    padding: 20px 0px;
  
  }
  
  
  
  .editCurriculum .oper {
  
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
