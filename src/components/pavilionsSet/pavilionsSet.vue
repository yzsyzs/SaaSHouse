<!--
  场馆列表
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-row class="pavilionsSet_main" v-if="pavilionSetSearch">
  
      <el-form :inline="true" class="demo-form-inline" method='POST' action=''>
  
        <el-row class="txalr pavilionsSet_main_btn">
  
          <ExportForm ref='elForm'>
  
            <el-button v-if="pavilionSetAddOrEdit" round @click="addPavilions">添加场馆</el-button>
  
            <el-button v-if="pavilionSetExport" native-type='submit' type="primary" round>导出excel</el-button>
  
          </ExportForm>
  
        </el-row>
  
        <el-row class="txall" style="background: rgba(237, 242, 252, 0.65)">
  
          <el-form-item label="场馆">
  
            <el-select filterable v-model="lifeId" clearable :disabled='houseList.length === 1' placeholder="全部" size="medium" @change='setHouse'>
  
              <el-option v-for="item in houseList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId"></el-option>
  
            </el-select>
  
          </el-form-item>
  
  
  
          <el-form-item label="状态">
  
            <el-select v-model="status" clearable placeholder="全部" size="medium" @change='setStatus'>
  
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  
            </el-select>
  
          </el-form-item>
  
  
  
          <el-form-item label="电话">
  
            <el-input v-model="phone" placeholder="请输入电话号码" style="width: 200px" size="medium"></el-input>
  
          </el-form-item>
  
  
  
          <el-form-item class="fr">
  
            <el-button v-if="pavilionSetSearch" type="primary" round @click="search" icon="el-icon-search" :loading='loading'>查询</el-button>
  
            <el-button round @click="reset">重置</el-button>
  
          </el-form-item>
  
        </el-row>
  
      </el-form>
  
      <el-row class="pdt40">
  
        <el-table :data="listData" style="width: 100%" v-loading="loading">
  
          <el-table-column type='index' :index="indexMethod" label="序号" width="180">
  
          </el-table-column>
  
          <el-table-column prop="lifeName" label="场馆名称" width="180">
  
          </el-table-column>
  
          <el-table-column prop="phone" label="电话">
  
          </el-table-column>
  
          <el-table-column prop="openTime" label="营业时间">
  
          </el-table-column>
  
          <el-table-column prop="status" label="状态">
  
          </el-table-column>
  
          <el-table-column prop="address" label="地址">
  
          </el-table-column>
  
          <el-table-column prop="operate" label="操作">
  
            <template slot-scope="scope">
  
                <!-- <router-link :to="{ name: '场馆详情', params: {id: scope.row.lifeId} }">查看详情</router-link> -->
  
                <router-link v-if="pavilionSetAddOrEdit" :to="{ name: '编辑场馆', params: {id: scope.row && scope.row.lifeId} }">编辑</router-link>
  
                <el-button v-if="pavilionSetDel" type="text" size="small" class="danger pdlr5" @click="confirmDel(scope.row)">删除</el-button>
            </template>
        
        </el-table-column>
        
        <el-table-column prop="sortNo" label="排序权重">
        
        </el-table-column>
      
      </el-table>
    
    </el-row>

    <el-row class="pdt40">
    
      <el-pagination
    
        @size-change="handleSizeChange"
    
        @current-change="handleCurrentChange"
    
        :current-page="page"
    
        :page-sizes="[20, 40, 60, 100]"
    
        :page-size="20"
    
        layout="total, sizes, prev, pager, next, jumper"
    
        :total ='page_info.total'
    
        :page-count='Math.ceil(page_info.total/count)'
    
        style="text-align: right"
    
      ></el-pagination>
    
    </el-row>
  
  </el-row>

</el-main>

</template>

<script>

  import { mapGetters } from 'vuex'

  import {
  
    api
  
  } from '@/config/api'
  
  import ExportForm from '@/components/base/exportForm'
  
  import {
  
    listSearchMixin
  
  } from '@/common/mixin/mixin'
  
  
  
  export default {
  
    // 组件的名称
  
    name: 'pavilionsSet',
  
    // 混合模式， 复用组件的内容
  
    mixins: [listSearchMixin],
  
    // 组件
  
    components: {
  
      ExportForm
  
    },

    computed: {

      ...mapGetters([

        'pavilionSetSearch',
        
        'pavilionSetAddOrEdit',
        
        'pavilionSetDel',
        
        'pavilionSetExport'
    
      ])
    
    },
  
    // 数据绑定
  
    data() {
  
      return {
  
        submit: 'submit',
  
        page_info: {},
  
        // 获取生活馆下拉列表
  
        houseList: [],
  
        // 生活馆 id
  
        lifeId: '',
  
        // 电话
  
        phone: '',
  
        // 状态数组
  
        statusList: [{
  
          id: 1,
  
          name: '已上线'
  
        }, {
  
          id: 2,
  
          name: '未上线'
  
        }],
  
        // 状态
  
        status: '',
  
        // 页码
  
        page: 0,
  
        // 页数
  
        count: 20,
  
      }
  
    },
  
  
  
    created() {
  
      let self = this
  
      self.getLifeHouse()
    
    },
  
  
  
    mounted() {
  
      let self = this
  
      self.elForm = self.$refs['elForm']
  
      if (self.elForm) self.elForm.$el.action = api.exportLifeHouseList
  
      self.search()
  
    },
  
  
  
    // 方法
  
    methods: {
  
  
  
      /*
  
       * 添加场馆
  
       */
  
      addPavilions() {
  
        this.$router.push({
  
          path: '/pavilionsSet/addPavilions'
  
        })
  
      },
  
  
  
      /*
  
       * 获取参数，必须在组件定义
  
       */
  
      getParams() {
  
        let self = this
  
        return {
  
          url: api.getLifeHouseList,
  
          data: {
  
            lifeId: self.lifeId,
  
            phone: self.phone,
  
            status: self.status,
  
            count: self.count,
  
            page: self.page > 0 ? self.page - 1 : self.page,
  
          }
  
        }
  
      },
  
  
  
      /*
  
       * 获取生活馆
  
       */
  
      getLifeHouse() {
  
        let self = this
  
        let params = {
  
          url: api.getLifeNameList,
  
          data: {}
  
        }
  
        self.sendReq(params, (res) => {
  
          self.houseList = res || []
  
          if (self.houseList.length === 1) {
  
            self.lifeId = self.houseList[0].lifeId
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 选择生活馆
  
       */
  
      setHouse(val) {},
  
  
  
      /*
  
       * 选择状态
  
       */
  
      setStatus(val) {},
  
  
  
      /*
  
       * 确认删除生活馆
  
       */
  
      confirmDel(value) {
  
        let self = this,
  
          pavilionsObj = value || {},
  
          lifeId = pavilionsObj.lifeId
  
        self.$confirm('是否删除该场馆', '请选择', {
  
            confirmButtonText: '确定',
  
            cancelButtonText: '取消',
  
            type: 'warning',
  
            center: true
  
          })
  
          .then(() => {
  
            self.handleDel(lifeId)
  
          })
  
          .catch(() => {});
  
      },
  
  
  
      /*
  
       * 删除生活馆
  
       */
  
      handleDel(lifeId) {
  
        let self = this,
  
          params = {
  
            url: api.deleteLifeHouse,
  
            data: {
  
              lifeId: lifeId
  
            }
  
          }
  
        self.sendReq(params, (res) => {
  
          self.$message.success(res);
  
          self.search()
  
        })
  
      },
  
  
  
      /*
  
       * 重置函数
  
       */
  
      reset() {
  
        let self = this
  
        self.lifeId = self.phone = self.status = null
  
        self.page = 0
  
      },
  
    }
  
  }
</script>

<style scoped>
  .el-form-item {
  
    padding: 20px 20px;
  
    margin: 0px;
  
  }
  
  
  
  .pavilionsSet_main_btn {
  
    padding: 20px 0px;
  
  }
  
  
  
  .pdlr5 {
  
    padding: 0 5px;
  
  }
  
  
  
  .pdt40 {
  
    padding-top: 40px;
  
  }
  
  
  
  .el-table {
  
    text-align: left;
  
  }
  
  
  
  .el-pagination .el-pagination__total,
  
  .el-pagination .el-pagination__sizes {
  
    float: left;
  
  }
  
  
  
  .pavilionsSet_main {
  
    width: 100%;
  
    height: auto;
  
    background: #fff;
  
    margin: 30px 0;
  
    padding: 40px 20px;
  
    box-sizing: border-box;
  
    padding-top: 0px;
  
  }
  
  
  
  .pavilionsSet_condition {
  
    display: inline-block;
  
    padding: 10px 10px;
  
  }
</style>
