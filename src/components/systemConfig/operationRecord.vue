<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-11-29 11:05:15
 */-->
<template>
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker :editable="false" class="400" v-model="params.date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-input type="text " v-model="params.nickName" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input type="text " v-model="params.phone" auto-complete="off" placeholder="请输入电话号码"></el-input>
        </el-col>
        <el-col :span="10">
          <div style="padding-left: 20px;">
            <el-button type="primary" icon="el-icon-search" round @click="onQuery">查询</el-button>
            <el-button type="default" round @click="resetClick">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <section>
        <el-table :data="recordsTable" stripe highlight-current-row @row-click="recordsRow">
          <el-table-column type="date" prop="createTimeStr" label="时间" sortable width="200" align="center">
          </el-table-column>
          <el-table-column prop="mallId" label="猫号" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center">
          </el-table-column>
          <el-table-column prop="nickName" label="操作者" align="center">
          </el-table-column>
          <el-table-column prop="clientIp" label="IP" align="center">
          </el-table-column>
          <el-table-column prop="macAddress" label="Mac地址" :formatter="isNull" align="center">
          </el-table-column>
          <el-table-column prop="action" label="动作" width="150" align="center">
          </el-table-column>
        </el-table>
      </section>
      <footer>
        <div class="block" style="text-align: right;padding-right:20px;">
          <el-pagination
            @size-change="recordsChange"
            @current-change="recordsCurrentChange"
            :current-page="params.page"
            :page-sizes="[20, 40, 60, 100]"
            :page-size="params.count"
            :page-count="params.pageTotal"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </footer>
    </el-main>
</template>

<script>
  import { responeCode } from '@/config/config'
  import { api } from '@/config/api'
  import { restful } from '@/servers/server'
  import { tools, changIntoChineseDateMod } from '@/common/tools'
  export default {
    // 组件的名称
    name: 'operationRecord',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
        return {
          isLoading: false,
          params: {
            date: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            nickName: '',
            phone: '',
            page: 1,
            count:20
          },
          total: 0,
          recordsTable: [],
          pickerOptions2: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }],
            disabledDate (time) {
              return time.getTime() > Date.now()
            }
          }
        }
    },

    // 组件
    components: {},

    // 方法
    methods: {
      // Mac 中过滤 为null 的值
      isNull (val) {
        return val.macAddress ? val.macAddress : ''
      },
      // 选中行的方法
      recordsRow () {
      },
      // 重置方法
      resetClick () {
        let self = this
        self.params = {
          date: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
          nickName: '',
          phone: '',
          page: 1,
          count: 20
        }
        self.total = 0
      },
      // 查询
      onQuery () {
        let self = this
        let param = {
          count: self.params.count,
          nickName: self.params.nickName,
          page: self.params.page - 1,
          phone: self.params.phone,
          startCreateTimeStr: self.params.date ? tools.standTosimple(self.params.date[0]) : '',
          endCreateTimeStr: self.params.date ? tools.standTosimple(self.params.date[1]) : ''
        }
        //若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
        let config = {
          //请求方式
          method: 'post',
          //请求地址
          url: api.logList,
          //请求体参数
          param: param,
        }
        /**
         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
         * @config  {Object} 请求的参数主体
         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
         */

        restful.sendMyData(config, self, (res) => {
          if (res.code === 2000 && res.success === true && res.msg === 'OK') {
            self.recordsTable = res.data
            self.total = res.page_info.total
          }else{
          	self.recordsTable = []
            self.total = 0
          }
        })
      },
      // 当前页数改变触发函数
      recordsCurrentChange (val) {
        this.params.page = val
        this.onQuery()
      },
      // 每页条数改变触发函数
      recordsChange (val) {
      	this.params.count = val
        this.onQuery()
      }
    }
  }
</script>

<style scoped>
.el-row {
  text-align: left;
}
.el-form-item {
  padding: 0;
}
</style>
