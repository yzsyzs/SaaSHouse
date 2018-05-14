<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--积分管理-->
<template>
	<el-main>
		<section class="integralManagement_main">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="积分贡献统计" v-if="checkPermission('api/manage/distribution/getStatisticalIntegral')" name="first">
					<el-row>
						<el-form :model="params" :rules="rules" ref="statistical" label-width="0" class="demo-ruleForm">
							<el-col :span="2" style="text-align: left;width:110px;">
								<el-form-item prop="region">
									<el-select @change="selectChange(params.region)" v-model="params.region" style="width: 100px;" placeholder="请选择活动区域">
										<el-option label="猫号" value="1"></el-option>
										<el-option label="手机号" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4" style="text-align: left;" v-if="params.region==1">
								<el-form-item prop="mallId">
									<el-input type="text" class="w200" v-model="params.mallId" placeholder="请输入猫号" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4" style="text-align: left;width:200px;margin-left: 20px;" v-if="params.region==2">
								<el-form-item prop="phone">
									<el-input type="text" class="w200" v-model="params.phone" placeholder="请输入手机号" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							</el-form-item>
							<el-col :span="24" class="text-left">
								<el-form-item>
									<el-button :loading="statisticalLoading" round type="primary" @click="statistical('statistical')">查询</el-button>
									<el-button round @click="resetStatistical('params')">重置</el-button>
								</el-form-item>
							</el-col>
						</el-form>
					</el-row>
					<el-row v-if="getStatistical.userInformation">
						<p class="pdt15">猫号：{{getStatistical.userInformation.mallId}}</p>
						<p class="pdt15">姓名：{{getStatistical.userInformation.userName}}</p>
					</el-row>
					<el-row v-if="getStatistical.integralOrigin" class="pdt15">
						<el-table :data="getStatistical.integralOrigin" border>
							<el-table-column prop="name" label="积分来源">
							</el-table-column>
							<el-table-column prop="quarterSum" label="本季度贡献/分">
							</el-table-column>
							<el-table-column prop="totalSum" label="总贡献/分">
							</el-table-column>
							<el-table-column label="">
								<template slot-scope="scope">
									<a v-if="scope.row.name=='一级亲友' && getStatistical.firstContribution>0 && checkPermission('api/manage/distribution/getStatisticalIntegral/')" @click="statisticalDetail(scope.row)">明细</a>
									<a v-if="scope.row.name=='二级亲友' && getStatistical.secondContribution>0 && checkPermission('api/manage/distribution/getStatisticalIntegral/')" @click="statisticalDetail(scope.row)">明细</a>
									<a v-if="scope.row.name=='三级亲友' && getStatistical.thirdContribution>0 && checkPermission('api/manage/distribution/getStatisticalIntegral/')" @click="statisticalDetail(scope.row)">明细</a>
								</template>
							</el-table-column>
						</el-table>
					</el-row>
					<el-row id="betterscroll" lock-scroll ref='betterscroll' style="height: 500px;">
						<el-dialog title="" :close-on-click-modal="false" :visible.sync="statisticalDialogTableVisible">
							<el-table border :data="statisticalDetailList.StatisticalIntegralDet">
								<el-table-column property="name" label="姓名"></el-table-column>
								<el-table-column property="quarterSum" label="本季度贡献/分"></el-table-column>
								<el-table-column property="totalSum" label="总贡献/分"></el-table-column>
							</el-table>
							<h5 v-if="isCanLoadMore" class="moreLoad" @click="statisticalDetail(scope.row)" style="">加载更多</h5>
							<h5 v-if="!isCanLoadMore" class="moreLoad" style="">已全部加载完成</h5>

						</el-dialog>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="积分余额" v-if="checkPermission('api/manage/distribution/getIntegralRemain')" name="second">
					<el-row>
						<el-form :model="params" :rules="rules" ref="params" label-width="0" class="demo-ruleForm">
							<el-col :span="2" style="text-align: left;width:110px;">
								<el-form-item prop="region">
									<el-select @change="selectChange(params.region)" v-model="params.region" style="width: 100px;" placeholder="请选择活动区域">
										<el-option label="猫号" value="1"></el-option>
										<el-option label="手机号" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4" style="text-align: left;" v-if="params.region==1">
								<el-form-item prop="mallId">
									<el-input type="text" class="w200" v-model="params.mallId" placeholder="请输入猫号" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4" style="text-align: left;width:200px;margin-left: 20px;" v-if="params.region==2">
								<el-form-item prop="phone">
									<el-input type="text" class="w200" v-model="params.phone" placeholder="请输入手机号" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							</el-form-item>
							<el-col :span="24" class="text-left">
								<el-form-item>
									<el-button round type="primary" :loading="balanceLoading" @click="balance('params')">查询</el-button>
									<el-button round @click="resetBalance('params')">重置</el-button>
								</el-form-item>
							</el-col>
						</el-form>
					</el-row>
					<el-row v-if="getBalance.mallId">
						<p class="pdt15">猫号：{{getBalance.mallId}}</p>
						<p class="pdt15">积分余额：{{getBalance.integralRemain}}</p>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="积分流水" v-if="checkPermission('api/manage/distribution/adminIntegral')" name="third">
					<el-row>
						<el-col :span="24">
							<el-col :span="8">
								<el-col :span="4" class="text-right" style="line-height: 40px;">
									日期：
								</el-col>
								<el-col :span="16">
									<el-date-picker :editable="false" v-model="laundryParams.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-col>
							</el-col>
							<el-col :span="4">
								<el-col :span="8">
									<el-select v-model="laundryParams.mallOrPhone" placeholder="请选择">
										<el-option label="猫号" value="1"></el-option>
										<el-option label="手机号" value="2"></el-option>
									</el-select>
								</el-col>
								<el-col :span="16">
									<el-input v-if="laundryParams.mallOrPhone==1" v-model="laundryParams.mallId" placeholder="请输入猫号"></el-input>
									<el-input v-if="laundryParams.mallOrPhone==2" v-model="laundryParams.phone" :maxlength="11" placeholder="请输入手机号"></el-input>
								</el-col>
							</el-col>
							<el-col :span="8" :offset="1">
								<el-col :span="4" class="text-right" style="line-height: 40px;">
									订单号：
								</el-col>
								<el-col :span="16">
									<el-input v-model="laundryParams.orderNumber" :maxlength="22" placeholder="请输入订单号"></el-input>
								</el-col>
							</el-col>
						</el-col>
						<el-col :span="24" class="pdt50">
							<el-col :span="4">
								<el-col :span="8" class="text-right" style="line-height: 40px;">
									一级分类：
								</el-col>
								<el-col :span="16">
									<el-select clearable @change="incomeExpendChange()" v-model="laundryParams.incomeExpend" placeholder="请选择">
										<el-option label="收入" value="1"></el-option>
										<el-option label="支出" value="2"></el-option>
									</el-select>
								</el-col>
							</el-col>
							<el-col :span="4" :offset="1" v-if="laundryParams.incomeExpend>0">
								<el-col :span="8" class="text-right" style="line-height: 40px;">
									二级分类：
								</el-col>
								<el-col :span="16" v-if="laundryParams.incomeExpend">
									<el-select clearable v-if="laundryParams.incomeExpend==1" v-model="laundryParams.contributionType" placeholder="请选择">
										<el-option label="本人消费奖励" value="0"></el-option>
										<el-option label="亲友消费奖励" value="1,2,3"></el-option>
										<el-option label="填写介绍人奖励" value="4"></el-option>
										<el-option label="订单退还" value="6"></el-option>
									</el-select>
									<el-select v-if="laundryParams.incomeExpend==2" v-model="laundryParams.contributionType" placeholder="请选择">
										<el-option label="运动馆消费" value="5"></el-option>
									</el-select>
								</el-col>
							</el-col>
							<el-col :span="8" :offset="1">
								<el-button @click="laundry" round type="primary" :loading="laundryLoading">查询</el-button>
								<el-button @click="reset" round>重置查询条件</el-button>
							</el-col>
						</el-col>
					</el-row>
					<el-row class="pdt50">
						<el-col :span="24" v-if="laundryTotalData.totalElements&&isTabs">
							<h5>
								本次查询结果共{{laundryTotalData.totalElements?laundryTotalData.totalElements:0}}条流水，收入{{laundryTotalData.income?laundryTotalData.income:0}}分，支出{{laundryTotalData.expend?laundryTotalData.expend:0}}分
							</h5>
						</el-col>
						<el-table :data="getLaundry" style="width: 100%;padding-top: 15px;">
							<el-table-column prop="createTime" label="时间">
							</el-table-column>
							<el-table-column prop="mallId" label="猫号">
							</el-table-column>
							<el-table-column prop="nickName" label="昵称">
							</el-table-column>
							<el-table-column prop="userName" label="亲友姓名">
							</el-table-column>
							<el-table-column prop="integralType" label="一级分类">
								<template slot-scope="scope">
									<span v-if="scope.row.integralType== 1">
			        			积分收入
			        		</span>
									<span v-else>
			        			积分支出
			        		</span>
								</template>
							</el-table-column>
							<el-table-column prop="contributionType" label="二级分类">
								<template slot-scope="scope">
									<span>
										{{scope.row.contributionType == 0?"本人消费奖励":(scope.row.contributionType == 4?"填写介绍人奖励":(scope.row.contributionType == 5?"运动馆消费":(scope.row.contributionType == 6?"订单退还":"亲友消费奖励")))}}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="integral" label="本次变动">
								<template slot-scope="scope">
									<a @click="dialogTable(scope.row)" v-if="scope.row.integralType== 1&&checkPermission('api/manage/distribution/adminIntegralDetail')" >
										+{{scope.row.integral}}
									</a>
									<a @click="dialogTable(scope.row)" v-if="scope.row.integralType!= 1&&checkPermission('api/manage/distribution/adminIntegralDetail')">
										-{{scope.row.integral}}
									</a>
								</template>
							</el-table-column>
							<el-table-column prop="integralRemain" label="变动后余额/分">
							</el-table-column>
							<el-table-column prop="orderNumber" label="订单号">
							</el-table-column>
							<el-table-column prop="phone" label="手机">
							</el-table-column>
						</el-table>
					</el-row>
					<el-row>
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" layout="total, sizes, prev, pager, next, jumper" :total="laundryTotalData.totalElements?laundryTotalData.totalElements:0" style="text-align: right;">
						</el-pagination>
					</el-row>
					<el-dialog title="积分变动明细" :visible.sync="dialogTableVisible" width="30%" top="25vh">
						<!--本人消费奖励-->
						<section class="overflowhidden" style="overflow: hidden;" v-if="gridData.increaseIntegral.integralType==1&&gridData.increaseIntegral.contributionType==0">
							<div class="w33p fl" style="padding: 20px 0;">运动馆名</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.order.venuesName}}</div>
							<div class="w33p fl" style="padding: 20px 0;">现金消费金额</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.order.orderSum}}</div>
						</section>
						<!--亲友消费奖励-->
						<section class="overflowhidden" v-if="gridData.increaseIntegral.integralType==1&&(gridData.increaseIntegral.contributionType==1||gridData.increaseIntegral.contributionType==2||gridData.increaseIntegral.contributionType==3)">
							<div class="w33p fl" style="padding: 20px 0;">现金消费金额</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.order.orderSum}}</div>
							<div class="w33p fl" style="padding: 20px 0;">亲友姓名</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.increaseIntegral.userName}}</div>
							<div class="w33p fl" style="padding: 20px 0;">亲友级别</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.increaseIntegral.contributionType==1?"一级下级":(gridData.increaseIntegral.contributionType==2?"二级下级":"三级下级")}}</div>
						</section>
						<!--填写介绍人奖励-->
						<section class="overflowhidden " v-if="gridData.increaseIntegral.integralType==1&&gridData.increaseIntegral.contributionType==4">
							<div class="w33p fl" style="padding: 20px 0;">介绍人</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.increaseIntegral.introducer?gridData.increaseIntegral.introducer:"无"}}</div>
						</section>
						<!--运动馆消费-->
						<section class="overflowhidden " v-if="gridData.increaseIntegral.integralType==2&&gridData.increaseIntegral.contributionType==5">
							<div class="w33p fl" style="padding: 20px 0;">运动馆名</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.order.venuesName}}</div>
						</section>
						<!-- 订单退还 -->
						<section class="overflowhidden" v-if="gridData.increaseIntegral.integralType ==1 && gridData.increaseIntegral.contributionType == 6">
							<div class="w33p fl" style="padding: 20px 0;">运动馆名</div>
							<div class="w66p fl text-right" style="padding: 20px 0;">{{gridData.order.venuesName}}</div>
						</section>
					</el-dialog>
				</el-tab-pane>
			</el-tabs>
		</section>
	</el-main>
</template>

<script>
	import { responeCode } from '@/config/config'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	import BScroll from 'better-scroll'
	//积分余额组件	
	export default {
		// 组件的名称
		name: 'integralManagement',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			//校验手机号
			var validatePhone = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号码'));
				} else if(!/^1\d{10}$/.test(value)) {
					callback(new Error('您输入的手机号有误!'));
				} else {
					callback();
				}
			}
			return {
				rules: {
					mallId: [{
						required: true,
						message: '请输入猫号',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						validator: validatePhone,
						trigger: 'change'
					}],
				},
				//积分明细
				statisticalDetailList: {},
				//查询参数 - 积分贡献统计 And 积分余额
				params: {
					region: "1",
					mallId: "",
					phone: ""
				},
				//积分流水查询参数
				laundryParams: {
					page: "1",
					count: "20",
					mallOrPhone: "1"
				},
				total:0,
				mallOrPhone: [{
					id: 1,
					name: "猫号"
				}, {
					id: 2,
					name: "手机号"
				}],
				activeName: 'first',
				select: true,
				tabs: [{
					id: 1,
					select: false,
					name: "私教底薪"
				}, {
					id: 1,
					select: false,
					name: "基础工资"
				}],
				numberValidateForm: {
					age: ''
				},
				//接收积分余额返回数据
				getBalance: {},
				//接收积分贡献统计返回数据
				getStatistical: {},
				//接收积分流水返回数据
				getLaundry: [],
				//积分余额缓冲动画
				balanceLoading: false,
				//积分贡献统计
				statisticalLoading: false,
				//积分流水缓冲动画
				laundryLoading: false,
				//弹窗积分流水详情
				dialogTableVisible: false,
				dialogFormVisible: false,
				//积分贡献统计 明细弹窗
				statisticalDialogTableVisible: false,
				//积分流水详情数据
				gridData: {
					increaseIntegral: {},
					order: {}
				},
				//积分流水页列表外数据
				laundryTotalData: {},
				//是否在进行tab切换
				isTabs: false,
				loadMoreParam: {
					"mallId": "",
					"page": 1,
					"quarterSum": "",
					"totalSum": ""
				},
				//是否可以加载更多
				isCanLoadMore: false

			}
		},
		created(){
			this.checkPermission = window.checkPermission
		},
		methods: {
			//切换tabs时重置查询条件
			handleClick(tab, event) {
				console.log(tab.name, event);
				this.$refs['params'].resetFields();
				//积分流水查询参数
				this.laundryParams = {
					page: "1",
					count: "20",
					mallOrPhone: "1"
				}
				this.laundryTotalData = {
					//防止切换tab时重复请求
					totalElements: this.laundryTotalData.totalElements
				}
				this.isTabs = false;
				this.getLaundry = [];
			},
			selectChange(item) {
				this.params.mallId = '';
				this.params.phone = '';
			},
			//pageSize 改变时会触发 每页条数
			handleSizeChange(count) {
				this.laundryParams.count = count;
				this.laundry();
			},
			//currentPage 改变时会触发 当前页总量
			handleCurrentChange(page) {
				this.laundryParams.page = page;
				this.laundry();
			},
			//积分流水一级分类切换
			incomeExpendChange() {
				//this.laundryParams.contributionType = 1;
				this.$set(this.laundryParams, "contributionType", null)
			},
			//积分流水
			laundry() {
				var self = this;
				self.isTabs = true;
				console.log(self.laundryParams)
				let param = {
					contributionType: self.laundryParams.contributionType,
					count: self.laundryParams.count,
					page: self.laundryParams.page,
					startTime: self.laundryParams.date ? self.laundryParams.date[0].getTime() : null,
					incomeExpend: self.laundryParams.incomeExpend,
					endTime: self.laundryParams.date ? self.laundryParams.date[1].getTime() : null,
					orderNumber: self.laundryParams.orderNumber,
				}
				if(self.laundryParams.mallOrPhone == 1) {
					param.mallId = self.laundryParams.mallId
				} else {
					param.phone = self.laundryParams.phone
				}
				var config = {
					loading: "laundryLoading",
					okMsg: "查询成功",
					url: api.adminIntegral,
					param: {
						url: api.adminIntegralUrl,
						params: param
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.getLaundry = res.data.result;
						self.laundryTotalData = res.data;
					} else {
						self.getLaundry = [];
					}
				});
			},
			//积分流水重设
			resetLaundry(formName) {
				this.$refs[formName].resetFields();
			},
			//积分流水变化详情
			dialogTable(item) {
				var self = this;
				//验证通过
				var config = {
					loading: "balanceDialogLoading",
					okMsg: "获取积分变动明细成功",
					url:api.adminIntegralDetail,
					param: {
						url: api.adminIntegralDetailUrl,
						params: {
							orderNumber: item.orderNumber,
							redId: item.redId
						}
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.gridData.increaseIntegral = res.data.increaseIntegral;
						self.gridData.order = res.data.order;
						self.dialogTableVisible = true;

					} else {
						self.gridData = {
							increaseIntegral: {},
							order: {}
						};
					}
				});
			},
			//积分余额查询
			balance(formName) {
				var self = this;
				self.$refs[formName].validate((valid) => {
					if(valid) {
						let sendParam = {};
						if(self.params.region == 2) {
							sendParam = {
								telephone: self.params.phone,
								selectId: 2
							}
						} else if(self.params.region == 1) {
							sendParam = {
								mallId: self.params.mallId,
								selectId: 1
							}
						} else {
							return;
						}
						//验证通过
						var config = {
							loading: "balanceLoading",
							okMsg: "获取积分余额成功",
							url: api.getIntegralRemain,
							param: {
								url: api.getIntegralRemainUrl,
								params: sendParam
							}
						}
						restful.sendMyData(config, self, function(res) {
							if(res.code == 2000) {
								self.getBalance = res.data.integral;
							} else {
								self.getBalance = {};
							}
						});
					} else {
						//验证失败
					}
				});
			},
			//积分余额重设
			resetBalance(formName) {
				this.$refs[formName].resetFields();
			},
			//积分贡献统计
			statistical(formName) {
				var self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						console.log()
						let sendParam = {};
						if(self.params.region == 2) {
							sendParam = {
								telephone: self.params.phone,
								selectId: 2
							}
						} else if(self.params.region == 1) {
							sendParam = {
								mallId: self.params.mallId,
								selectId: 1
							}
						} else {
							return;
						}
						//验证通过
						var config = {
							loading: "statisticalLoading",
							okMsg: "获取积分贡献统计成功",
							url: api.getStatisticalIntegral,
							param: {
								url: api.getStatisticalIntegralUrl,
								params: sendParam
							}
						}
						restful.sendMyData(config, self, function(res) {
							if(res.code == 2000) {
								self.getStatistical = res.data.integral;
							} else {
								self.getStatistical = {}
							}
						});
					} else {
						//验证失败
					}
				});
			},
			//重置积分贡献统计查询条件
			resetStatistical(formName) {
				this.$refs[formName].resetFields();
			},
			//重置积分管理查询条件
			reset(){
				this.laundryParams = {
					page:1,
					count:20,
					date:null,
					orderNumber:'',
					mallOrPhone: "1"
				}
			},
			statisticalDetail(item) {
				//滚动加载
				/*let betterscroll = new BScroll(this.$refs['betterscroll'].$el,{
					click:true,
					scrollY:true,
					momentum: true,
					probeType: 3
				})
				betterscroll.on("scrollEnd",(pos)=>{
					console.log("滚动到底部了")
				})*/
				let urlName = null;
				switch(item.name) {
					case "一级亲友":
						urlName = "first";
						break;
					case "二级亲友":
						urlName = "second";
						break;
					case "三级亲友":
						urlName = "third";
						break;
				}

				var self = this;
				if(item) {
					self.loadMoreParam = {
						"mallId": self.getStatistical.userInformation.mallId,
						"page": 1,
						"quarterSum": item.quarterSum,
						"totalSum": item.totalSum
					}
				}
				//验证通过
				var config = {
					loading: "statisticalDetailLoading",
					okMsg: "获取积分贡献明细成功",
					url: api.getStatisticalIntegralByNumber + urlName,
					param: {
						url: api.getStatisticalIntegralByNumberUrl + urlName,
						params: self.loadMoreParam
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						var StatisticalIntegralTotal = res.data.StatisticalIntegral.StatisticalIntegralTotal;
						self.statisticalDetailList = res.data.StatisticalIntegral;
						self.statisticalDetailList.StatisticalIntegralDet.splice(0, 0, StatisticalIntegralTotal)
						self.statisticalDialogTableVisible = true;
						if(res.data.StatisticalIntegral.length >= 50) {
							self.loadMoreParam.page++;
						} else {
							self.isCanLoadMore = false;
						}
					} else {
						self.getStatistical = {}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.integralManagement_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	
	.text-left {
		text-align: left;
	}
	
	.w200 {
		width: 200px;
	}
	
	.pdt15 {
		padding-top: 15px;
	}
	
	.w300 {
		width: 300px;
	}
	
	.w100 {
		width: 100px;
	}
	
	.w350 {
		width: 350px;
	}
	
	.w400 {
		width: 400px;
	}
	
	.w450 {
		width: 450px;
	}
	
	.mgl50 {
		margin-left: 50px;
	}
	
	.pdt50 {
		padding-top: 50px;
	}
	
	.mgl10 {
		margin-left: 10px;
	}
	
	.w33p {
		width: 33.3%;
	}
	
	.w66p {
		width: 66%;
	}
	
	.text-right {
		text-align: right;
	}
	
	.overflowhidden {
		overflow: hidden;
	}
	
	.moreLoad {
		text-align: center;
		line-height: 36px;
		font-size: 20px;
		margin-top: 20px;
		cursor: pointer;
		color: #C9CACA;
	}
</style>