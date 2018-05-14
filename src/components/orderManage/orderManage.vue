<template>
	<el-main>
		<el-row class="orderManage" v-if="checkPermission('api/manage/order/orderList')" >
			<HouseAreaLinkage :isShowPhone="isShowPhone" :lableTxt="lableTxt" :isNeedLinkage="false" ref='houseAreaLinkage' @getStartTime="setStartTime" @getEndTime="setEndTime" @getMallId="setMallId" @getProvince='setProvince' @getCity='setCity' @getArea='setArea' @getHouse='setHouse'>
			</HouseAreaLinkage>
			<el-row style="text-align: left;margin-left: -10px;">
				订单号：
				<el-input v-model="params.orderNo" style="width: 200px" size="medium"></el-input>
				订单状态：
				<el-select filterable v-model="params.orderStatus" clearable placeholder="全部" size="medium">
					<el-option v-for="(item,index) in orderArr" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
				订单类型：
				<el-select filterable v-model="params.orderType" @change="getGoods(params.orderType)" clearable placeholder="全部" size="medium">
					<el-option v-for="(item,index) in orderTypeArr" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<div style="display: inline-block;" v-if="!!params.lifeId&&params.orderType==1">
					课程名称：
					<el-select filterable v-model="params.courseName" clearable placeholder="全部" size="medium">
						<el-option v-for="(item,index) in courseNameList" :key="index" :label="item.courseName" :value="item.courseName"></el-option>
					</el-select>
				</div>
				<div style="display: inline-block;" v-if="!!params.lifeId&&params.orderType==2">
					特权卡名称：
					<el-select filterable v-model="params.privilegeId" clearable placeholder="全部" size="medium">
						<el-option v-for="(item,index) in privilegeNameList" :key="index" :label="item.cardName" :value="item.cardId"></el-option>
					</el-select>
				</div>
				<div style="display: inline-block;" v-if="!!params.lifeId&&params.orderType==3">
					商品名称：
					<el-input v-model="params.otherGoodsName" size="medium"></el-input>
				</div>
				<el-button round  type="primary" style="margin-left: 20px;" icon="el-icon-search" size="medium" :loading='loading' @click.stop='search'>查询</el-button>
				<el-button round type="info" size="medium" @click.stop='reset'>重置</el-button>
				<form :action="orderExport" method="post" style="display: inline-block;margin-left: 10px;">
					<!--验证token-->
					<input type="hidden" name="token" id="" :value="params.token" />
					<!--省市区编号-->
					<input type="hidden" name="regionId" id="" :value="params.regionId" />
					<!--场馆编号-->
					<input type="hidden" name="lifeId" id="" :value="params.lifeId" />
					<!--提交时间-->
					<input type="hidden" name="startTime" id="" :value="params.startTime" />
					<!--结束时间-->
					<input type="hidden" name="endTime" id="" :value="params.endTime" />
					<!--猫号-->
					<input type="hidden" name="mallId" id="" :value="params.mallId" />
					<!--订单号-->
					<input type="hidden" name="orderNo" id="" :value="params.orderNo" />
					<!--订单状态-->
					<input type="hidden" name="orderStatus" id="" :value="params.orderStatus" />
					<!--订单类型-->
					<input type="hidden" name="orderType" id="" :value="params.orderType" />
					<!--课程名称-->
					<input type="hidden" name="courseName" id="" :value="params.courseName" />
					<!--特权卡id-->
					<input type="hidden" name="privilegeId" id="" :value="params.privilegeId" />
					<!--其他商品名称-->
					<input type="hidden" name="otherGoodsName" id="" :value="params.otherGoodsName" />
					<el-button round v-if="checkPermission('api/manage/order/orderListExport')" type="default" native-type='submit' size="medium">导出</el-button>
				</form>
			</el-row>
			<el-row class="txall">

			</el-row>
			<el-row class="pdt40">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column type='index' label="序号" width="100" style="width:100px;"></el-table-column>
					<el-table-column prop="lifeName" label="所属生活馆" width="180"></el-table-column>
					<el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
					<el-table-column prop="createTime" label="提交时间" width="150"></el-table-column>
					<el-table-column prop="mallId" label="猫号"></el-table-column>
					<el-table-column prop="phone" label="手机号"></el-table-column>
					<el-table-column prop="goodsName" label="商品名称"></el-table-column>
					<el-table-column prop="count" label="课时数/规格"></el-table-column>
					<el-table-column prop="campaignPrice" label="支付价（元）"></el-table-column>
					<el-table-column prop="orderStatus" label="订单状态"></el-table-column>
					<el-table-column prop="orderType" label="订单类型"></el-table-column>
					<el-table-column prop="payChannel" label="支付渠道"></el-table-column>
					<el-table-column prop="orderId" label="操作" v-if="checkPermission('api/manage/order/orderDetail')">
						<template slot-scope="scope">
							<a @click="detail(scope.row.orderId)">详情</a>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-row>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 40, 60, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
				</el-pagination>
			</el-row>
		</el-row>
		<el-row>
			<el-dialog title="订单详情":show-close="false"  top="50px" style="text-align: left;" :visible.sync="dialogVisible">
				<p class="detail_title" style="padding-top: 0;">商品信息</p>
				<el-row class="pdt20">
					<span class="detail_left">馆名称:</span><span class="detail_right">{{orderInfo.lifeName}}</span>					
				</el-row>
				<el-row class="pdt20">
					<el-col :span="8">
						<span class="detail_left">商品名称：</span><span class="detail_right">{{orderInfo.goodsName}}</span>
					</el-col>
					<el-col :span="8">
						<span class="detail_left">课程数/规格：</span><span class="detail_right">{{orderInfo.count}}</span>
					</el-col>
					<el-col :span="8">
						<span class="detail_left">市场价：</span><span class="detail_right">{{orderInfo.marketPrice}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="8">
						<span class="detail_left">活动名称：</span><span class="detail_right">{{orderInfo.campaignName}}</span>
					</el-col>
					<el-col :span="8">
						<span class="detail_left">活动价：</span><span class="detail_right">{{orderInfo.campaignPrice}}</span>
					</el-col>
				</el-row>
				<p class="detail_title">订单信息</p>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">订单号：</span><span class="detail_right">{{orderInfo.orderNo}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">订单类型：</span><span class="detail_right">{{orderInfo.orderType}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="16">
						<span class="detail_left">支付价格：</span><span class="detail_right">{{orderInfo.amount}}</span>
					</el-col>
					<el-col :span="8">
						<span class="detail_left">通过积分抵扣：</span><span class="detail_right">{{orderInfo.integral}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">备注信息：</span><span class="detail_right">{{orderInfo.remark}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">支付渠道：</span><span class="detail_right">{{orderInfo.payChannel}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">订单状态：</span><span class="detail_right">{{orderInfo.orderStatus}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="24">
						<span class="detail_left">提交时间：</span><span class="detail_right">{{orderInfo.createTime}}</span>
					</el-col>
				</el-row>
				<p class="detail_title">用户信息</p>
				<el-row class="pdt20">
					<el-col :span="8">
						<span class="detail_left">用户猫号：</span><span class="detail_right">{{orderInfo.mallId}}</span>
					</el-col>
					<el-col :span="8">
						<span class="detail_left">用户手机：</span><span class="detail_right">{{orderInfo.phone}}</span>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-col :span="8">
						<span class="detail_left">推荐导师：</span><span class="detail_right">{{orderInfo.saleName}}</span>
					</el-col>
					<el-col :span="16" v-if="checkPermission('api/manage/order/updateSale')">
						<span class="detail_left">修改推荐导师：</span>
						<el-select filterable v-model="orderInfo.saleId"  clearable placeholder="全部" size="medium">
							<el-option v-for="(item,index) in saleList" :key="index" :label="item.saleName" :value="item.saleId"></el-option>
						</el-select>
					</el-col>
				</el-row>
				<el-row class="pdt20">
					<el-button v-if="checkPermission('api/manage/order/updateSale')" type="primary" round @click="editTrainer(orderInfo.saleId,orderInfo.orderId)">修改推荐导师</el-button>
    			<el-button  round @click="dialogVisible = false">关闭</el-button>
				</el-row>
				
			</el-dialog>
		</el-row>
	</el-main>
</template>

<script>
	import HouseAreaLinkage from '@/components/base/houseAreaLinkage'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	import { getExportFormComItem } from '@/common/tools'
	export default {

		// 组件的名称
		name: 'orderManage',

		// 数据绑定
		data() {
			return {
				lableTxt: {
					"startTime": "提交时间："
				},
				isShowPhone: false,
				//导出地址
				orderExport: "",
				params: {
					orderStatus: '',
					courseName: '',
					otherGoodsName: null,
					privilegeId: '',
					orderType: '',
					orderNo: null,
					mallId: null,
					lifeId: '',
					phone: '',
					page: 0,
					count: 20,
					regionId: '',
					endTime: '',
					startTime: '',
					token: localStorage.getItem("accessToken")
				},
				orderArr: [{
						id: 1,
						name: "待付款"
					}, {
						id: 2,
						name: "待使用"
					}, {
						id: 3,
						name: "已完成"
					},
					{
						id: 4,
						name: "已取消"
					}
				],
				orderTypeArr: [{
					id: 1,
					name: "课程包购买"
				}, {
					id: 2,
					name: "特权卡购买"
				}, {
					id: 3,
					name: "其他商品"
				}],
				submit: 'submit',
				loading: false,
				page_info: {},
				houseList: [],
				orderData: [],
				//课程名称数组
				courseNameList: [],
				//特权卡数组
				privilegeNameList: [],
				//详情是否显示
				dialogVisible: false,
				//当前生活馆导师列表
				saleList:[],
				//当前的订单信息
				orderInfo:{},
				//当前数组总数
				total:null,

			}
		},

		created() {
			this.checkPermission = window.checkPermission;
			this.orderExport = api.orderListExport;
		},

		mounted() {
			let self = this
			self.hEl = self.$refs['houseAreaLinkage']
		},
		// 组件
		components: {
			HouseAreaLinkage
		},
		// 方法
		methods: {
			/**
			 * 当前页页码
			 * @page {String} 当前页数量
			 */
			handleCurrentChange(page) {
				let self = this;
				self.params.page = page - 1;
				self.onQuery()
			},
			/**
			 * 跳转到或者点击页码
			 * @count {String} 当前页数量
			 */
			handleSizeChange(count) {
				let self = this;
				self.params.count = count;
				self.onQuery()
			},
			//查询列表函数
			onQuery() {
				let self = this,
					getOrderListUrl = api.getOrderList,
					page = this.page > 0 ? this.page - 1 : this.page,
					e = self.hEl,
					p = self.params;
				self.params.startTime = e.getStartTime()
				self.params.endTime = e.getEndTime()
				self.params.mallId = e.getMallId()
				let config = {
					url: api.orderList,
					param: self.params,
					loading: 'loading'
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code && res.code == 2000) {
						self.orderData = res.data;
						self.total = res.page_info.total
					} else if(res.code && res.code != 2000) {
						self.orderData = [];
						self.$message.error(res.msg);
					}
				})
			},
			//重置
			reset() {
				this.hEl.setProvince()
				this.hEl.setCity()
				this.hEl.setArea()
				this.hEl.setHouse()
				this.hEl.setMallId()
				this.hEl.setMobile()
				this.hEl.setStartTime()
				this.hEl.setEndTime()
				this.params = {
					orderStatus: '',
					courseCount: null,
					courseId: null,
					otherGoodsName: null,
					privilegeId: null,
					orderType: '',
					orderNo: null,
					mallId: null,
					lifeId: '',
					phone: '',
					page: 0,
					count: 20,
					regionId: '',
					endTime: '',
					startTime: '',
					token: localStorage.getItem("accessToken")
				}
				return false
			},

			search() {
				this.loading = true
				this.onQuery()
			},
			/**
			 * 刷新当前的regionId
			 * @val {String} 当前的省id
			 */
			setProvince(val) {
				this.params.regionId = val
			},
			/**
			 * 刷新当前的regionId
			 * @val {String} 当前的市id
			 */
			setCity(val) {
				this.params.regionId = val
			},
			/**
			 * 刷新当前的regionId
			 * @val {String} 当前的区id
			 */
			setArea(val) {
				this.params.regionId = val
			},
			/**
			 * 刷新当前的lifeId
			 * @val {String} 当前的区lifeId
			 */
			setHouse(val) {
				this.params.orderType = '';
				this.params.lifeId = val
			},
			/**
			 * 刷新当前的mallId
			 * @val {String} 当前组件的猫号mallId
			 */
			setMallId(val) {
				this.params.mallId = val
			},
			/**
			 * 刷新当前开始时间
			 * @val {String} 当前组件的开始时间
			 */
			setStartTime(val) {
				let self = this
				self.params.startTime = val
			},
			/**
			 * 获取当前组件的结束时间
			 * @val {String} 当前组件的结束时间
			 */
			setEndTime(val) {
				let self = this
				self.params.endTime = val
			},
			//获取当前二级查询条件
			getGoods(type) {
				let self = this
				if(self.params.lifeId) {
					if(type == 1) {
						self.getCourseNameList(self.params.lifeId);
					} else if(type == 2) {
						self.getVipCardList(self.params.lifeId);
					}
				}
			},
			/**
			 * 获取相应生活馆下的课程列表
			 * @lifeId {String} 场馆id
			 */
			getCourseNameList(lifeId) {
				let self = this
				let config = {
					url: api.getDistinctCourseNameList,
					param: {
						lifeId: lifeId,
						deleteFlag:0,
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.courseNameList = res.data
					} else {
						self.$message.error(res.msg);
					}
				})
			},
			/**
			 * 获取相应生活馆下的特权卡列表
			 * @lifeId {String} 场馆id
			 */
			getVipCardList(lifeId) {
				let self = this
				let config = {
					url: api.findCardByLife,
					param: {
						lifeId: lifeId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.privilegeNameList = res.data
					} else {
						self.$message.error(res.msg);
					}
				})
			},
			/**
			 * 获取订单详情
			 * @orderId {String} 订单id
			 */
			detail(orderId) {				
				let self = this
				let config = {
					url: api.orderDetail,
					param: {
						orderId: orderId
					}
				}
				restful.sendMyData(config,self, (res) => {
					if(res.code == 2000) {
						self.orderInfo = res.data
						self.dialogVisible = true
						self.getTrainerListByLifeId(res.data.lifeId)
					}
				})
			},
			/**
			 * 修改推荐导师
			 * @trainerId {String} 导师Id
			 * @orderId {String} 订单id
			 */
			editTrainer(saleId,orderId){
				let self = this
				let config = {
					url: api.updateSale,
					param: {
						orderId: orderId,
						saleId:saleId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.detail(orderId)
						self.$message.success("修改推荐导师成功")
					} else {
						self.$message.error(res.msg)
					}
				})
			},
			/**
			 * 获取当前生活馆下面的销售列表
			 * @lifeId {String} 场馆Id
			 */
			getTrainerListByLifeId(lifeId){
				let self = this
				let config = {
					url: api.findSaleByLife,
					param: {
						lifeId: lifeId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.saleList = res.data
					} else {
						self.saleList = [];
						self.$message.error(res.msg);
					}
				})
			}
			
		}
	}
</script>

<style scoped>
	.el-form-item {
		padding: 20px 20px;
		margin: 0px;
	}
	
	.hidden {
		display: none;
	}
	
	.orderManage_btn {
		padding: 20px 0px;
	}
	
	.pdlr5 {
		padding: 0 5px;
	}
	
	.pdt40 {
		padding-top: 40px;
	}
	.pdt20{
		padding-top: 20px;
	}
	.el-table {
		text-align: left;
	}
	
	.el-pagination .el-pagination__total,
	.el-pagination .el-pagination__sizes {
		float: left;
	}
	
	.orderManage {
		width: 100%;
		background: #fff;
		margin: 30px 0;
		padding: 40px 20px;
		box-sizing: border-box;
		padding-top: 0px;
	}
	
	.orderManage .el-row {
		width: 100%;
		height: auto;
		background: #fff;
		padding: 40px 20px;
		box-sizing: border-box;
		padding-top: 0px;
	}
	.detail_title{
		padding: 20px 0;
		font-size: 20px;
		font-weight: 600;
		border-bottom:1px solid #ccc;
	}
	.detail_left{
		color: #ccc;
	}
</style>