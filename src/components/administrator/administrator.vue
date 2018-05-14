<!--
  新增编辑管理员组件
  @作者： chanwefun
-->
<template>
  <el-main>
  
    <el-form :inline='true' :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" v-if="administratorDetail">
  
      <p class="title">基本信息</p>
  
      <el-row class="txall">
  
        <el-form-item class="" label="姓名" prop="realName">
  
          <el-input v-model="ruleForm.realName"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="txall">
  
        <el-form-item class="" label="手机号码" prop="mobile">
  
          <el-input v-model="ruleForm.mobile"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="txall">
  
        <el-form-item class="" label="性别" prop="sex">
  
          <el-radio-group v-model="ruleForm.sex">
  
            <el-radio :label="1">男</el-radio>
  
            <el-radio :label="0">女</el-radio>
  
          </el-radio-group>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="txall">
  
        <el-form-item class="" label="允许登录" prop="allowStatus">
  
          <el-switch v-model="ruleForm.allowStatus" active-color="#00B99E" inactive-color="#e7e7e7" :active-value='1' :inactive-value='0'>
  
          </el-switch>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="txall">
  
        <el-form-item class="" label="排序权重" prop="sortNo">
  
          <el-input type='number' v-model.lazy.number="ruleForm.sortNo"></el-input>
  
        </el-form-item>
  
      </el-row>
  
  
  
      <el-row class="txall" style='padding: 20px 80px;'>
  
        <el-form-item>
  
          <el-button @click="resetForm('ruleForm')">取消</el-button>
  
          <el-button v-if="administratorAddOrEdit" type="primary" @click="submitForm('ruleForm')" :loading='isLoading'>确定</el-button>
  
        </el-form-item>
  
      </el-row>
  
  
  
    </el-form>
  
  </el-main>
</template>

<script>

  import { mapGetters } from 'vuex'

  import axios from 'axios'
  
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
  
    name: 'aministrator',
  
  
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([
        
        'administratorAddOrEdit',

        'administratorDetail'
    
      ])
    
    },
  
  
  
    // 数据绑定
  
    data() {
  
      let validateMobile = (rule, value, callback) => {
  
          if (!value) return callback(new Error('请输入手机号码'))
  
          if (!regExp.phone.test(value)) return callback(new Error('请输入格式正确的手机号码'))
  
          return callback()
  
        },
  
        validateSN = (rule, value, callback) => {
  
          if (!regExp.roundNmuber.test(value) || value < 0 || value > 9999) return callback(new Error('请输入0-9999的整数'))
  
          return callback()
  
        }
  
      return {
  
        isLoading: false,
  
        ruleForm: {
  
          sex: 1,
  
          allowStatus: 0
  
        },
  
        rules: {
  
          realName: [{
  
            required: true,
  
            message: '请输入姓名'
  
          }, {
  
            max: 10,
  
            message: '名字最多10个字'
  
          }],
  
          mobile: [{
  
            required: true,
  
            validator: validateMobile,
  
            trigger: 'blur'
  
          }],
  
          sortNo: [{
  
            required: true,
  
            message: '请输入排序权重'
  
          }, {
  
            validator: validateSN
  
          }]
  
        }
  
      }
  
    },
  
  
  
    created() {
  
      let self = this
    
    },
  
  
  
    // 方法
  
    methods: {
  
      submitForm(formName) {
  
        let self = this
  
        self.$refs[formName].validate((valid) => {
  
          if (valid) {
  
            self.save()
  
          } else {
  
            self.isLoading = false
  
            console.log('error submit!!');
  
            return false;
  
          }
  
        });
  
      },
  
  
  
      resetForm(formName) {
  
        let self = this
  
        self.$refs[formName].resetFields();
  
        self.$router.push({
  
          path: '/administratorList'
  
        })
  
      },
  
  
  
      // 刷新函数 编辑页面的时候需要调用
  
      refresh(newAdmin) {
  
        let self = this
  
        self.ruleForm = newAdmin
  
      },
  
  
  
      save() {
  
        let self = this,
  
          url = api.addOrEditLifeAdmin
  
        self.sendReq(url, self.ruleForm, (res) => {
  
          self.$router.push({
  
            path: '/administratorList'
  
          })
  
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
  
      }
  
    },
  
  
  
    watch: {},
  
  
  
    // 组件
  
    components: {},
  
  }
</script>

<style scoped='scoped'>
  .el-form {
  
    background: #fff;
  
    padding: 40px 0;
  
  }
  
  
  
  .el-row {
  
    padding: 0 40px;
  
  }
  
  
  
  .title {
  
    text-align: left;
  
    padding: 0px 0px 20px 20px;
  
    font-family: PingFangSC-Medium;
  
    font-size: 24px;
  
    color: #444A49;
  
    line-height: 24px;
  
  }
</style>
