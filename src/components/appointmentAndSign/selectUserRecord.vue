<template>
    <el-main>
      <section class="signRecord_main">
          <el-row>
            <el-row>
              <el-col :span="24">
                <div>
                  <el-input style="width:300px;padding-right: 20px;" v-model="params.phoneOrMallId" placeholder="请输入手机或者猫号"></el-input>
                </div>
              </el-col>
              <el-col :span="24" class="text-right" style="padding: 20px 0;">
                <el-button type="primary" :loading="isLoading" round icon="el-icon-search"  @click="search()">查询</el-button>
                <el-button type="default" round @click="reset()">重置</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="padding: 20px 0;">课程名称: {{courseName}}</div>
                <div style="padding: 20px 0;">场馆名称: {{lifeName}}</div>
                <div style="padding: 20px 0;">用户名称: {{userInfo.userName}}</div>
              </el-col>
              <el-col :span="24">
                <h4 style="display: inline-block;padding: 10px 0;">拥有的特权卡<span v-show='userInfo.privilegeCardPreorderUsers.length === 0'>：无</span></h4>
                <table border="2" bordercolor="#ccc" width="300" cellspacing="0" cellpadding="5" v-show='userInfo.privilegeCardPreorderUsers.length > 0'>
                  <thead>
                  <tr>
                    <th></th>
                    <th>特权卡名称</th>
                    <th>团课剩余次数</th>
                    <th>过期时间</th>
                    <th>状态</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(t, index) in userInfo.privilegeCardPreorderUsers" :key="index">
                    <td>
                      <!-- <el-radio
                        v-model="saveParams.myCourseCountId"
                        :label="t.myCourseCountId"
                      ></el-radio> -->
                      <input
                        style="cursor: pointer"
                        v-model="saveParams.myCourseCountId"
                        type="radio"
                        :value="t.myCourseCountId"
                        :disabled="t.ifActivated == 0"
                      >
                    </td>
                    <td>{{t.privilegeCardName}}</td>
                    <td>{{t.remain}}</td>
                    <td>{{t.expireTime}}</td>
                    <td>{{t.activatedStatusDesc}}</td>
                  </tr>
                  </tbody>
                </table>
              </el-col>
            </el-row>
          </el-row>
        <el-row>
          <el-col :span="24" style="padding: 20px 0;">
            <el-button type="default" round @click="onBack">上一步</el-button>
            <el-button type="primary" round @click="onSave" :disabled='userInfo.privilegeCardPreorderUsers.length === 0 || !saveParams.myCourseCountId'>确 定</el-button>
          </el-col>
        </el-row>
      </section>
    </el-main>
</template>

<script>
  import { api } from '@/config/api'
  import { restful } from '@/servers/server'
  import { responeCode } from '@/config/config'
  export default {
    name: 'selectUserRecord',
    data () {
      return {
        isLoading: false,
        params: {
          // 生活馆
          lifeId: '',
          // 课程id
          courseId: '',
          // 手机号或者猫号
          phoneOrMallId: ''
        },
        saveParams: {
          // 排班id
          courseScheduleId: '',
          // 我的课程关联表id
          myCourseCountId: ''
        },
        // 课程名称
        courseName: '',
        // 生活馆名称
        lifeName: '',
        userInfo: {
          privilegeCardPreorderUsers: [],
          userId: '',
          userName: '',
        }
      }
    },

    ////////////////////////////////////////////////////////////////////////////
    methods: {
      /*
       * 根据团课id获取团课的详情
       */
      getGroupCourseDetail() {
        let self = this,
            params = {
              url: api.getGroupCourseDetail,
              param: {
                courseId: self.params.courseId
              }
            }
        restful.sendMyData(params, self, (res) => {
          if(res.code === responeCode.OK) {
            self.courseName = res.data && res.data.courseName
          }
        })
      },

      /*
       * 获取生活馆
       */
      getLifeHouseDetail() {
        let self = this,
            params = {
              url : api.getLifeHouseDetail,
              param: {
                lifeId: self.params.lifeId
              }
            }
        restful.sendMyData(params, self, (res) => {
          if(res.code === responeCode.OK) {
            self.lifeName = res.data && res.data.lifeName
          }
        })
      },

      /*
       * 确认保存
       */
      onSave () {
        let self = this,
            params = {
              url: api.appPreorderMulti,
              param: self.saveParams
            }
        restful.sendMyData(params, self, (res) => {
          if(res.code === responeCode.OK) {
            self.$message.success(res.data)
            self.$router.push({
              path: "/teamTeachRecord",
              query: {
                lifeId: self.params.lifeId || '',
              }
            })
          }
        })
      },

      /*
       * 上一步
       */
      onBack () {
        let self = this
        self.$router.push({
          path: "/teamTeachRecord",
          query: {
            lifeId: self.params.lifeId || '',
          }
        })
      },

      /*
       * 重置
       */
      reset () {
        let self = this
        self.params.phoneOrMallId = ''
      },

      /*
       * 查询
       */
      search(){
        var self = this,
            config = {
              url: api.getValidPrivilegeCardList,
              param: self.params,
              loading:"isLoading",
            }
        restful.sendMyData(config, self, function(res){
          if(res.code === responeCode.OK) {
            self.userInfo = res.data || {
              privilegeCardPreorderUsers: []
            }
          }
        });
      },
    },

    ////////////////////////////////////////////////////////////////////////////
    created() {
      let self = this,
          qS = self.$route.query,
          rP = self.$route.params
      self.params.lifeId = qS.lifeId
      self.params.courseId = rP.id
      self.saveParams.courseScheduleId = qS.courseScheduleId
      self.getGroupCourseDetail()
      self.getLifeHouseDetail()

      if(qS.lifeId === 'undefined') qS.lifeId = ''
      self.$route.matched[0].meta[0].path = "/teamTeachRecord?lifeId=" + qS.lifeId
    }
    ////////////////////////////////////////////////////////////////////////////


  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .signRecord_main {
    padding: 30px 20px;
    text-align: left;
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 #E9F0F0;
  }
  .text-right {
    text-align: right;
  }
  table {
    width: 100%;
    font-size: .5rem;
    th {
      width: 20%;
      padding: 10px 5px;
      border: 1px solid #ccc;
    }
    tr {
      td {
        border: 1px solid #ccc;
        padding: 10px 5px;
        span {
          color: #28A3E6;
          &:hover {
            color: #f00;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
