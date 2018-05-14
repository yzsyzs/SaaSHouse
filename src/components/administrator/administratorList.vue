<!--
  管理员列表
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <el-row class="container" v-if="administratorSearch">
  
      <el-row class="txalr">
  
        <ExportForm ref='elForm'>
  
          <el-button v-if="administratorAddOrEdit" round @click="addAministrator">添加场馆管理员</el-button>
  
          <el-button v-if="administratorExport" round native-type='submit' type="primary">导出excel</el-button>
  
        </ExportForm>
  
  
  
        <el-row class="txall pdt20">
  
          <div class="houseAreaLinkage_input">
  
            姓名：
  
            <el-input v-model="params.realName" placeholder="请输入内容" style="width: 200px" size="medium"></el-input>
  
          </div>
  
  
  
          <div class="houseAreaLinkage_input">
  
            性别：
  
            <el-select filterable v-model="params.sex" clearable placeholder="请选择" size="medium">
  
              <el-option v-for="item in sexArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
  
            </el-select>
  
          </div>
  
  
  
          <div class="houseAreaLinkage_input">
  
            手机：
  
            <el-input v-model="params.mobile" placeholder="请输入内容" style="width: 200px" size="medium"></el-input>
  
          </div>
  
          <div class="houseAreaLinkage_input fr">
  
            <el-button v-if="administratorSearch" round type='primary' icon="el-icon-search" @click='search' :loading='loading'>搜索</el-button>
  
            <el-button round @click='reset'>重置</el-button>
  
          </div>
  
        </el-row>
  
  
  
      </el-row>
  
  
  
      <el-row class="pdt20">
  
        <el-table :data="listData" v-loading='loading' style="width: 100%">
  
          <el-table-column type='index' label="序号" :index="indexMethod" width="180" align='left'> </el-table-column>
  
          <el-table-column prop="realName" label="姓名" width="180" align='left'> </el-table-column>
  
          <el-table-column prop="mobile" label="手机号码" align='left'> </el-table-column>
  
          <el-table-column prop="sex" label="性别" align='left'> </el-table-column>
  
          <el-table-column prop="allowStatus" label="允许登录" align='left'> </el-table-column>
  
          <el-table-column prop="lifeNames" label="管理场馆" align='left'>
  
            <template slot-scope="scope" v-if='scope.row && scope.row.lifeNames'>
  
              <p v-if='scope.row.lifeNames.length <= 1'><label>{{scope.row.lifeNames[0]}}</label></p>
  
              <el-collapse :accordion='true' v-else>
  
                <el-collapse-item :title="scope.row.lifeNames[0]">
  
                  <p v-for='(item, index) in scope.row.lifeNames.slice(1, scope.row.lifeNames.length)' :key="index"><label>{{item}}</label></p>
  
                </el-collapse-item>
  
              </el-collapse>
              
            </template>
        
        </el-table-column>
        
      <el-table-column prop="operate" label="操作"  align='left'>
        
        <template slot-scope="scope">

          <router-link v-if="administratorAddOrEdit" :to="{ name: '编辑管理员', params: {id: scope.row.id} }">
          
            编辑</router-link>
          
          <el-button v-if="administratorDel" type="text" size="small" class="danger pdlr5" @click="confirmDel(scope.row)">删除</el-button>
        
        </template>
        
        </el-table-column>
        
        <el-table-column prop="sortNo" label="排序权重"  align='left'>
        
        </el-table-column>
      
      </el-table>
    
    </el-row>

    <el-row class="pdt40">
      
      <el-pagination
        
        @size-change="handleSizeChange"
        
        @current-change="handleCurrentChange"
        
        :current-page="page"
        
        :page-sizes="[20, 40, 60, 100]"
        
        :page-size="count"
        
        :total='page_info.total'
        
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

  import ExportForm from '@/components/base/exportForm'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    listSearchMixin
  
  } from '@/common/mixin/mixin'
  
  export default {
  
    // 组件的名称
  
    name: 'administratorList',
  
    // 混合模式， 复用组件的内容
  
    mixins: [listSearchMixin],
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([

        'administratorSearch',
        
        'administratorAddOrEdit',
        
        'administratorDel',
        
        'administratorExport'
    
      ])
    
    },
  
    // 数据绑定
  
    data() {
  
      return {
  
        sexArr: [{
  
          id: 0,
  
          name: '女'
  
        }, {
  
          id: 1,
  
          name: '男'
  
        }],
  
        // 搜索参数，除了分页
  
        params: {
  
          realName: '',
  
          sex: '',
  
          mobile: ''
  
        },
  
        // 页码
  
        page: 0,
  
        // 一页显示多少条数据
  
        count: 20,
  
        // 接受后台返回的页数据
  
        page_info: {},
  
      }
  
    },
  
    // 组件
  
    components: {
  
      ExportForm
  
    },
  
    // 方法
  
    methods: {
  
      /*
  
       * 点击添加管理员按钮
  
       */
  
      addAministrator() {
  
        let self = this
  
        self.$router.push({
  
          path: 'administratorList/addAdministrator'
  
        })
  
      },
  
  
  
      /*
  
       * 点击重置按钮
  
       */
  
      reset() {
  
        let self = this
  
        self.page = 0
  
        // self.count = 20
  
        self.params = {
  
          realName: '',
  
          sex: '',
  
          mobile: ''
  
        }
  
      },
  
  
  
      /*
  
       * 获取参数，必须在组件定义
  
       */
  
      getParams() {
  
        let self = this
  
        return {
  
          url: api.getAdminInfoList,
  
          data: { ...self.params,
  
            ...{
  
              count: self.count,
  
              page: self.page > 0 ? self.page - 1 : self.page,
  
            }
  
          }
  
        }
  
      },
  
  
  
      /*
  
       * 确认是否删除弹窗
  
       */
  
      confirmDel(value) {
  
        let pavilionsObj = value || {},
  
          id = pavilionsObj.id
  
        this.$confirm('是否删除该场馆管理员', '请选择', {
  
            confirmButtonText: '确定',
  
            cancelButtonText: '取消',
  
            type: 'warning',
  
            center: true
  
          })
  
          .then(() => {
  
            this.handleDel(id)
  
          })
  
          .catch((rej) => {
  
            console.error('administrator methods confirmDel catch rej ', rej)
  
          });
  
      },
  
  
  
      /*
  
       * 删除
  
       */
  
      handleDel(id) {
  
        let self = this
  
        let params = {
  
          url: api.deleteAdmin,
  
          data: {
  
            id: id
  
          }
  
        }
  
        self.sendReq(params, (res) => {
  
          self.$message.success(res);
  
          self.search()
  
        })
  
      },
  
    },
  
    created() {
  
      let self = this
    
    },
  
    mounted() {
  
      let self = this
  
      self.elForm = self.$refs['elForm']
  
      if (self.elForm) self.elForm.$el.action = api.exportAdminInfoList
  
      self.search()
  
    },
  
  }
</script>

<style scoped="scoped">
  .container {
  
    background: #ffffff;
  
    padding: 40px 10px;
  
  }
  
  
  
  .el-collapse {
  
    border: none!important;
  
  }
  
  
  
  .pdt20 {
  
    padding-top: 20px;
  
  }
  
  
  
  .pdl4 {
  
    padding-left: 4px;
  
  }
  
  
  
  .houseAreaLinkage_input {
  
    text-align: left;
  
    padding: 10px 20px;
  
    line-height: 32px;
  
    display: inline-block;
  
  }
  
  
  
  .el-collapse-item__content p {
  
    padding-bottom: 12px!important;
  
  }
</style>
