<!--
  特权卡列表
  @作者: chanwefun
-->
<template>
  <el-main>
  
    <header>
  
      <el-row>
  
        <el-button v-if="vipCardSave" class="fr" type="primary" round @click="$router.push({path: '/addVipCard'})">
  
          添加特权卡
  
        </el-button>
  
      </el-row>
  
    </header>
  
    <section>
  
      <div class="vipCard_section_top">
  
        <el-row class="txall">
  
          <div class="vipCardList_condition">
  
            生活馆:
  
            <el-select filterable clearable :disabled='lifeList.length === 1' v-model="params.lifeId" placeholder="">
  
              <el-option v-for="item in lifeList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId"></el-option>
  
            </el-select>
  
          </div>
  
  
  
          <div class="vipCardList_condition">
  
            特权卡类型:
  
            <el-select filterable clearable v-model="params.cardType" placeholder="">
  
              <el-option v-for="item in vipCardTypeList" :key="item.cardType " :label="item.name" :value="item.cardType ">
  
              </el-option>
  
            </el-select>
  
          </div>
  
  
  
          <div class="vipCardList_condition">
  
            特权卡状态:
  
            <el-select filterable clearable v-model="params.status" placeholder="">
  
              <el-option v-for="item in vipCardStatusList" :key="item.status" :label="item.name" :value="item.status">
  
              </el-option>
  
            </el-select>
  
          </div>
  
  
  
          <div class="vipCardList_condition">
  
            <el-input placeholder="输入关键字搜索" v-model="params.name" @keyup.enter.native="search" style="width: 200px; padding-right: 20px;" size="medium"></el-input>
  
            <el-button v-if="vipCardSearch" round type="primary" icon="el-icon-search" @click="search" :loading='loading'>搜索</el-button>
  
            <el-button round @click='reset'>重置</el-button>
  
          </div>
  
        </el-row>
  
      </div>
  
      <el-row>
  
        <el-table :data="listData" v-loading="loading" stripe highlight-current-row @row-click="rowVipCard" style="width: 100%;">
  
          <el-table-column type="index" label="序号" :index="indexMethod" width="80" align="center">
  
          </el-table-column>
  
          <el-table-column prop="cardType" label="特权卡类型" align="center">
  
          </el-table-column>
  
          <el-table-column prop="name" label="特权卡名称" align="center">
  
          </el-table-column>
  
          <el-table-column prop="lifeName" label="支持生活馆" align="center">
  
          </el-table-column>
  
          <el-table-column prop="sortNo" sortable label="排序权重" align="center">
  
          </el-table-column>
  
          <el-table-column prop="statusName" label="状态" align="center">
  
          </el-table-column>
  
          <el-table-column label="操作" align="center">
  
            <template slot-scope="scope">
  
              <el-button v-if="vipCardSave" @click="editVipCard(scope.row)" type="text" size="small">编辑</el-button>
  
              <el-button v-if="vipCardUpStatus" style="margin-left: 0px" @click="udVipCard(scope.row)" type="text" size="small"> | {{scope.row.status == 0 ? '启用' : '停用'}}</el-button>
  
              <el-button v-if="vipCardDel" style="margin-left: 0px" type="text" @click.native.prevent="deleteVipCard(scope.row)" size="small"> | 删除</el-button>
            </template>
          
          </el-table-column>
        
        </el-table>
    
    </el-row>
  
  </section>
  
  <footer>
  
    <div class="block">
  
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
  
    </div>
  
  </footer>

</el-main>

</template>

<script>

  import { mapGetters } from 'vuex'

  import {
  
    api
  
  } from '@/config/api'
  
  import {
  
    listSearchMixin
  
  } from '@/common/mixin/mixin'
  
  export default {
  
    // 组件的名称
  
    name: 'vipCardList',
  
    // 混合模式， 复用组件的内容
  
    mixins: [listSearchMixin],
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},

    computed: {

      ...mapGetters([

        'vipCardSearch',
        
        'vipCardDel',
        
        'vipCardSave',
        
        'vipCardUpStatus'
    
      ])
    
    },
  
    // 数据绑定
  
    data() {
  
      return {
  
        // 页码
  
        page: 0,
  
        // 一页显示多少条数据
  
        count: 20,
  
        // 接受后台返回的页数据
  
        page_info: {},
  
        // 搜索参数，除了分页
  
        params: {
  
          lifeId: '',
  
          cardType: '',
  
          status: ''
  
        },
  
        // 馆列表
  
        lifeList: [],
  
        // 特权卡类型数据
  
        vipCardTypeList: [{
  
          name: '次卡',
  
          cardType: 0
  
        }, {
  
          name: '期限卡',
  
          cardType: 1
  
        }],
  
        // 特权卡状态
  
        vipCardStatusList: [{
  
          name: '停用',
  
          status: 0
  
        }, {
  
          name: '启用',
  
          status: 1
  
        }]
  
      }
  
    },
  
  
  
    // 方法
  
    methods: {
  
      /*
  
       * 重置
  
       */
  
      reset() {
  
        let self = this
  
        self.page = 0
  
        self.params = {
  
          lifeId: '',
  
          cardType: '',
  
          status: ''
  
        }
  
      },
  
      /*
  
       * 特权卡列表每一行点击方法
  
       */
  
      rowVipCard() {},
  
  
  
      /*
  
       * 获取列表参数，必须在组件定义
  
       */
  
      getParams() {
  
        let self = this
  
        return {
  
          url: api.getCardList,
  
          data: { ...self.params,
  
            ...{
  
              count: self.count,
  
              page: self.page > 0 ? self.page - 1 : self.page,
  
            }
  
          }
  
        }
  
      },
  
  
  
      /*
  
       * 特权卡操作，启用 或者 停用
  
       */
  
      udVipCard(row) {
  
        let self = this,
  
          params = {
  
            url: api.updateCardStatus,
  
            data: {
  
              id: row.id,
  
              status: row.status == 0 ? 1 : 0
  
            }
  
          }
  
        self.sendReq(params, (res) => {
  
          self.$message.success({
  
            message: res
  
          })
  
          self.search()
  
        })
  
      },
  
  
  
      /*
  
       * 编辑特权卡列表方法
  
       */
  
      editVipCard(row) {
  
        this.$router.push({
  
          path: `/editorVipCard/${row.id}`,
  
          query: {
  
            lifeId: row.lifeId
  
          }
  
        })
  
      },
  
  
  
      /*
  
       * 特权卡删除方法
  
       */
  
      deleteVipCard(row) {
  
        let self = this
  
        self.$confirm('确定删除该卡吗?', '提示', {
  
            confirmButtonText: '确定',
  
            cancelButtonText: '取消',
  
            type: 'warning',
  
            center: 'true'
  
          })
  
          .then(() => {
  
            this.handleDelCard(row.id)
  
          })
  
          .catch(() => {})
  
      },
  
  
  
      /*
  
       * 处理特权卡删除
  
       */
  
      handleDelCard(id) {
  
        let self = this,
  
          params = {
  
            url: api.deleteCard,
  
            data: {
  
              id: id
  
            }
  
          }
  
        self.sendReq(params, (res) => {
  
          self.$message.success({
  
            message: res
  
          })
  
          self.search()
  
        })
  
      },
  
  
  
      /*
  
       * 获取生活馆列表
  
       */
  
      getLifeHouse() {
  
        let self = this,
  
          params = {
  
            url: api.getLifeNameList,
  
            data: {}
  
          }
  
        self.sendReq(params, (res) => {
  
          self.lifeList = res || []
  
          if (self.lifeList.length === 1) {
  
            self.params.lifeId = self.lifeList[0].lifeId
  
          }
  
        })
  
      },
  
    },
  
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  
    created() {
  
      let self = this
  
      self.getLifeHouse()
    
    },
  
  
  
    // 完成挂载，相当于dom ready
  
    mounted() {
  
      let self = this
  
      self.search()
  
    },
  
  
  
    // 销毁，可以做一些定时器的消费等操作
  
    destored() {},
  
  }
</script>

<style scoped>
  footer {
  
    text-align: right;
  
    padding: 30px;
  
  }
  
  
  
  .vipCardList_condition {
  
    display: inline-block;
  
    padding: 10px 20px;
  
  }
  
  
  
  .el-select {
  
    padding-left: 10px!important;
  
  }
  
  
  
  .vipCard_section_top {
  
    padding: 40px 0;
  
    text-align: left;
  
  }
  
  
  
  .vipCard_section_list {
  
    min-height: 600px;
  
  }
  
  
  
  .row {
  
    display: inline-block;
  
    padding: 5px;
  
  }
  
  
  
  .row span {
  
    padding-right: 10px;
  
  }
</style>
