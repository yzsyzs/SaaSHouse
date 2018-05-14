
<!--
  分销设置
  @作者: chanwefun
-->
<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
  <el-form-item class="txall setUp-form-item" label='运动馆单笔现金消费满' prop='joinQualification'>
    <el-input type='number' step='0.01' v-model.number='ruleForm.joinQualification' placeholder="请输入" style="width: 200px" size="medium"></el-input> 元，可获得亲友资格
  </el-form-item>

  <el-form-item class="txall setUp-form-item" label='运动馆每季度现金消费满' prop='profitQualification'>
    <el-input type='number' step='0.01' v-model.number='ruleForm.profitQualification' placeholder="请输入" style="width: 200px" size="medium"></el-input> 元，可获得积分资格
  </el-form-item>

  <el-form-item class="txall setUp-form-item" label='运动馆订单积分抵扣比例' prop='deductionRatio'>
    <el-input type='number' step='0.01' v-model.number='ruleForm.deductionRatio' placeholder="请输入" style="width: 200px" size="medium"></el-input> %
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确定</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import axios from 'axios'
import { responeCode } from '@/config/config'
import regExp from '@/common/regExp'
import {api} from '@/config/api.js'
export default {
    // 组件的名称
    name: 'setUp',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
      let validate = (rule, value, callback) => {
            if(value <= 0) { return callback(new Error('请输入大于0的值')) }
            if(rule.field === "deductionRatio" &&  value > 100) return callback(new Error('请输入大于0 的0到100之间的值'))
            if(!regExp.float2.test(value)) return callback(new Error('最多输入两位小数'))
            return callback()
          }
      return {
        loading: false,
        ruleForm: {},
        rules: {
          joinQualification: [{required: true, type: 'number', message: '请输入单笔现金消费金额', trigger: 'blur'}, {validator: validate, trigger: 'blur'}],
          profitQualification: [{required: true, type: 'number', message: '请输入每季度现金消费', trigger: 'blur'}, {validator: validate, trigger: 'blur'}],
          deductionRatio: [{required: true, type: 'number', message: '订单积分抵扣比例', trigger: 'blur'}, {validator: validate, trigger: 'blur'}]
        }
      }
    },

    // 组件
    components: {},

    // 方法
    methods: {

      /*
       * 提交数据
       */
      submitForm(formName) {
        let self = this
        self.loading = true
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('您确定要保存?', '保存', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              })
              .then(() => {
                self.save()
              })
              .catch(() => { self.loading = false })
          } else {
            self.loading = false
            console.warn('error submit!!')
            return false
          }
        });
      },

      /*
       * 处理保存
       */
      save() {
        let self = this
        let params = {
  				url : api.setConfigFromJoinAndQualificationAndRatioUrl,
  				params: self.ruleForm
        }
        self.sendReq(api.setConfigFromJoinAndQualificationAndRatio, {data: params}, (res) => {
          self.$message.success('保存成功')
        })
      },

      /*
       * 获取积分配置数据
       */
      get() {
        let self = this
        let params = {
  				url : api.getConfigFromJoinAndQualificationAndRatiourl,
  				params: {}
        }
        self.sendReq(api.getConfigFromJoinAndQualificationAndRatio, {data: params}, (res) => {
          self.ruleForm = res && res.threeConfig || {}
        })
      },


      /*
       * 发送请求函数
       */
      sendReq(url, params, callback) {
        let self = this;
        axios({
          method: params.method || 'POST',
          url: url,
          data: params.data || {}
        }).then((res) => {
          self.loading = false
          if (res && res.data && res.data.code == responeCode.OK) {
            callback && callback(res.data.data);
          } else {
            return self.$message.error(res.data && ('状态码：' + res.data.code + '，提示信息：' + res.data.msg));
          }
        }, (error) => {
          console.error("setUp sendReq error ", error)
          self.loading = false
          return self.$message.error(error);
        })
      },
    },

    // 常用钩子函数，总共有8个，可以参照vue的生命周期看

    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created() {
      let self = this
      self.get()
    },

    // 完成挂载，相当于dom ready
    mounted() {},

    // 销毁，可以做一些定时器的销毁,缓存的清除等操作
    destroyed() {},
}
</script>

<style scoped>
.setUp-form-item { display: flex; align-items: center}
</style>
