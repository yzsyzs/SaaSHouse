<!--/*
 * @Author: lincl
 * @Date:   2017-11-17 20:34:24
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-17 20:34:32
 */-->
<!--京东众筹-->
<template>
	<el-main>
		<section class="raiseList_main">
			<el-row>
				<el-col :span="24">

					<div class="stafflist_content">
						<el-row>
							<div v-if="isShow" class="raiselist_content_select">
								区域：
								<el-select @change="getProList(params.areaId)" default-first-option clearable v-model="params.areaId" filterable placeholder="请选择区域">
									<el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId">
									</el-option>
								</el-select>
							</div>
							<div v-if="isShow" class="raiselist_content_select">
								省份：
								<el-select :disabled="!!!params.areaId" @change="getCityList(params.proId)" default-first-option clearable v-model="params.proId" filterable placeholder="请选择省份">
									<el-option v-for="(item,index) in proList" :key="index" :label="item.regionName" :value="item.id">
									</el-option>
								</el-select>
							</div>
							<div v-if="isShow" class="raiselist_content_select">
								城市：
								<el-select :disabled="!!!params.proId" @change="getLifeHouseList(params.cityId)" default-first-option clearable v-model="params.cityId" filterable placeholder="请选择城市">
									<el-option v-for="(item,index) in cityList" :key="index" :label="item.regionName" :value="item.regionId">
									</el-option>
								</el-select>
							</div>
							<div class="raiselist_content_select">
								场馆：
								<el-select :disabled="isLifeSelet" default-first-option clearable v-model="params.lifeId" filterable placeholder="请选择场馆">
									<el-option v-for="(item,index) in lifeHouseList" :key="index" :label="item.lifeName" :value="item.lifeId">
									</el-option>
								</el-select>
							</div>
							<div class="raiselist_content_select">
								激活时间：
								<el-date-picker :editable="false" @change="dateChange('activeDate')" v-model="params.activeDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
								</el-date-picker>
							</div>
							<div class="raiselist_content_select">
								猫号：
								<el-input :maxlength="11" v-model="params.mallId" placeholder="请输入猫号" style="width: 217px" size="medium"></el-input>
							</div>
							<div class="raiselist_content_select">
								认购订单ID：
								<el-input :maxlength="11" v-model="params.jdId" placeholder="请输入订单号" style="width: 200px" size="medium"></el-input>
							</div>
							<div class="raiselist_content_select">
								是否激活：
								<el-select default-first-option clearable v-model="params.isExchanged" placeholder="请选择">
									<el-option label="是" value="1"></el-option>
									<el-option label="否" value="0"></el-option>
								</el-select>
							</div>

							<div class="raiselist_content_select">
								过期时间：
								<el-date-picker :editable="false" @change="dateChange('expireTime')" v-model="params.expireTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
								</el-date-picker>
							</div>

							<div class="raiselist_content_select">
								手机号：
								<el-input :maxlength="11" v-model="params.mobile" placeholder="请输入手机号" style="width: 200px" size="medium"></el-input>
							</div>

							<div class="raiselist_content_select">
								<form :action="crowdfundingExport" :token="11212"  method="post">
									<!--权限token-->
									<input type="hidden" name="token" id="" :value="params.token" />
									<!--激活开始时间-->
									<input type="hidden" name="activeStartTime" id="" :value="params.activeStartTime" />
									<!--激活结束时间-->
									<input type="hidden" name="activeEndTime" id="" :value="params.activeEndTime" />
									<!--猫号-->
									<input type="hidden" name="mallId" id="" :value="params.mallId" />
									<!--京东认购Id-->
									<input type="hidden" name="jdId" id="" :value="params.jdId" />
									<!--是否激活-->
									<input type="hidden" name="isExchanged" id="" :value="params.isExchanged" />
									<!--大区Id-->
									<input type="hidden" name="areaId" id="" :value="params.regionId" />
									<!--生活馆Id-->
									<input type="hidden" name="lifeId" id="" :value="params.lifeId" />
									<!--过期开始时间-->
									<input type="hidden" name="startExpireTime" id="" :value="params.startExpireTime" />
									<!--过期结束时间-->
									<input type="hidden" name="endExpireTime" id="" :value="params.endExpireTime" />
									<!--手机号-->
									<input type="hidden" name="" id="" :value="params.mobile" />
									<el-button v-if="checkPermission('api/manage/crowdfunding/list')" :loading="loading" type="primary" @click="onQuery()" round icon="el-icon-search" size="medium">搜索</el-button>
									<el-button  type="primary" @click="reset()" round icon="el-icon-setting" size="medium">重置</el-button>
									<el-button v-if="checkPermission('api/manage/crowdfunding/dataInput')" type="warning" @click="goToInput()" round icon="el-icon-circle-plus-outline" size="medium">导入</el-button>
									<el-button v-if="checkPermission('api/manage/crowdfunding/list')" native-type="submit" type="warning" round icon="el-icon-document" size="medium">导出</el-button>
									<el-button v-if="checkPermission('api/manage/crowdfunding/deliver')" type="warning" @click="goToSend()" round icon="el-icon-sold-out" size="medium">发货</el-button>
								</form>

							</div>
						</el-row>

					</div>
				</el-col>
			</el-row>

			<el-row>
				<el-table v-loading="loading" text="查询中..." :data="raiseList" style="width: 100%;">
					<el-table-column prop="name" type="index" label="序号" width="100px">
					</el-table-column>
					<el-table-column prop="lifeName" width="200px" label="运动馆">
					</el-table-column>
					<el-table-column prop="jdId" label="认购订单ID">
					</el-table-column>
					<el-table-column prop="exchangedUserName" label="用户名">
					</el-table-column>
					<el-table-column prop="mallId" label="猫号">
					</el-table-column>
					<el-table-column prop="mobile" width="150px" label="手机号">
					</el-table-column>
					<el-table-column prop="amount" label="支付金额（元）">
					</el-table-column>
					<el-table-column prop="count" label="支持数量（份）">
					</el-table-column>
					<el-table-column prop="courseName" width="150px" label="课程名称">
					</el-table-column>
					<el-table-column prop="rewards" label="课时数">
					</el-table-column>
					<el-table-column prop="exchangeCode" label="兑换码">
					</el-table-column>
					<el-table-column prop="activeTime" width="200px" label="激活时间">
					</el-table-column>
					<el-table-column prop="expireTime" width="200px" label="（自动）到期时间">
					</el-table-column>
				</el-table>
			</el-row>


			<!--分页信息-->
			<el-row>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page+1" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
				</el-pagination>
			</el-row>
			<!--众筹发货-->
			<el-row>
				<el-dialog title="发货" :close-on-click-modal="false" :visible.sync="dialogFormVisibleForSend">
					<el-form :model="formForSend" inline>
						<el-form-item label="区域：" :label-width="formLabelWidth">
							<el-select @change="getProList(noSendParams.areaId,true)" default-first-option  v-model="noSendParams.areaId" filterable placeholder="请选择区域">
								<el-option v-for="(item,index) in noSendAreaList" :key="index" :label="item.areaName" :value="item.areaId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="省份：" :label-width="formLabelWidth">
							<el-select :disabled="!!!noSendParams.areaId" @change="getCityList(noSendParams.proId,true)" default-first-option  v-model="noSendParams.proId" filterable placeholder="请选择省份">
								<el-option v-for="(item,index) in noSendProList" :key="index" :label="item.regionName" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="城市：" :label-width="formLabelWidth">
							<el-select :disabled="!!!noSendParams.proId" @change="getNoSendLifeHouseList(noSendParams.cityId,true)" default-first-option  v-model="noSendParams.cityId" filterable placeholder="请选择城市">
								<el-option v-for="(item,index) in noSendCityList" :key="index" :label="item.regionName" :value="item.regionId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="场馆：" :label-width="formLabelWidth">
							<el-select :disabled="!!!noSendParams.cityId" default-first-option clearable v-model="noSendParams.lifeId" filterable placeholder="请选择场馆">
								<el-option v-for="(item,index) in noSendLifeHouseList" :key="index" :label="item.lifeName" :value="item.lifeId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button round @click="dialogFormVisibleForSend = false">关闭</el-button>
						<el-button round type="primary" :loading="sendLoading" @click="sendGoods()">确 定</el-button>
					</div>
					<el-row>
						<h5 style="color: #f00; padding-top: 30px;padding-left: 70px;">注：发货必须区域或者馆，不能按省、市发货</h5>
					</el-row>
				</el-dialog>
			</el-row>
			<!--众筹导入-->
			<el-row>
				<el-dialog title="导入" :close-on-click-modal="false" :show-close="false" :visible.sync="dialogFormVisibleForInput">
					<el-form :model="formForInput" inline>
						<!--<el-form-item label="区域：" :label-width="formLabelWidth">
							<el-select @change="getProList(params.areaId)" default-first-option clearable v-model="params.areaId" filterable placeholder="请选择区域">
								<el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="省份：" :label-width="formLabelWidth">
							<el-select @change="getCityList(params.proId)" default-first-option clearable v-model="params.proId" filterable placeholder="请选择省份">
								<el-option v-for="(item,index) in proList" :key="index" :label="item.regionName" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="城市：" :label-width="formLabelWidth">
							<el-select :disabled="!!!params.proId" @change="getLifeHouseList(params.cityId)" default-first-option clearable v-model="params.cityId" filterable placeholder="请选择城市">
								<el-option v-for="(item,index) in cityList" :key="index" :label="item.regionName" :value="item.regionId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="场馆：" :label-width="formLabelWidth">
							<el-select :disabled="isLifeSelet" default-first-option clearable v-model="params.lifeId" filterable placeholder="请选择场馆">
								<el-option v-for="(item,index) in lifeHouseList" :key="index" :label="item.lifeName" :value="item.lifeId">
								</el-option>
							</el-select>
						</el-form-item>-->
						<el-form-item label="众筹Excel表：" :label-width="formLabelWidth">
							<div style="width: 120px;">
								<el-button type="primary" round @click="openFile()">选择文件</el-button>
								<input type="file" @change="fileChange()" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  ref="raiseInput" name=""  id="" value="" style="display: none;" />
							</div>
							<p>{{formForInput.fileName}}</p>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button round @click="closeInput()">关闭</el-button>
						<el-button round type="primary" :loading="excelLoading" @click="startToSendExcel()">确 定</el-button>
					</div>
				</el-dialog>
			</el-row>
		</section>
	</el-main>

</template>

<script scoped>
	import { responeCode } from '@/config/config'
	import { tools } from '@/common/tools'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	export default {
		// 组件的名称
		name: 'staffList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			roleStatus: {
				type: Boolean,
				default: true
			},
			jumpRoute: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
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
					}]
				},
				isShow:true,
				//当前条件查询结果条数
				total: 0,
				//正在查询ing
				loading: false,
				//查询参数
				params: {
					"page": 0,
					"count": 20,
					"proId": "",
					"areaId": "",
					"cityId": "",
					"lifeId": "",
					"expireTime": '',
					"activeDate": '',
					"activeStartTime":'',
					"activeEndTime":'',
					"startExpireTime":'',
					"endExpireTime":'',
					"regionId":'',
					"isExchanged":null,
					"jdId":null,
					"mallId":null,
					"mobile":null,
					"token":localStorage.getItem("accessToken")
				},
				//发货参数
				noSendParams:{
					areaId:null,
					lifeId:null,
					proId:null,
					cityId:null
				},

				//众筹列表
				raiseList: [],
				//大区列表
				areaList: [],
				//未发货大区列表
				noSendAreaList: [],
				//省份列表
				proList: [],
				//未发货省份列表
				noSendProList: [],
				//城市列表
				cityList: [],
				//未发货城市列表
				noSendCityList: [],
				//生活馆列表
				lifeHouseList: [],
				//未发货生活馆列表
				noSendLifeHouseList:[],
				//众筹导出残参数
				crowdfundingExport: "",
				//是否显示众筹导入框
				dialogFormVisibleForInput: false,
				//是否显示发货框
				dialogFormVisibleForSend: false,
				//发货参数初始化
				formForSend: {},
				//导入数据初始化
				formForInput: {fileName:"请选择Excel文件"},
				formLabelWidth: '120px',
				//excel上传缓存
				excelLoading:false,
				//发货缓冲
				sendLoading:false,
			}
		},
		created() {
			let self = this;
			//获取生活馆列表
			self.getLifeHouseList(null,true);
			//获取大区列表
			self.getAreaList();
			self.crowdfundingExport = api.crowdfundingExport;
			self.checkPermission = window.checkPermission;
		},
		methods: {
			//获取众筹列表
			onQuery() {
				let self = this;
				if(!self.params.lifeId){
					self.params.regionId = self.params.cityId||self.params.proId ||self.params.areaId;
				}
				let param = {
					"page": self.params.page,
					"count": self.params.count,
					"areaId": self.params.regionId,
					"lifeId": self.params.lifeId,
					"activeStartTime":self.params.activeStartTime,
					"activeEndTime":self.params.activeEndTime,
					"startExpireTime":self.params.startExpireTime,
					"endExpireTime":self.params.endExpireTime,
					"isExchanged":parseInt(self.params.isExchanged),
					"jdId":self.params.jdId,
					"mallId":self.params.mallId,
					"mobile":self.params.mobile
				}
				let config = {
					url: api.getCrowdfundinglist,
					loading: "loading",
					param: param
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.raiseList = res.data;
						self.total = res.page_info.total;
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//获取大区
			getAreaList() {
				let self = this;
				let config = {
					url: api.getareas,
					param: {}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.areaList = res.data;
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//获取未发货大区
			getNoSendAreaList() {
				let self = this;
				let config = {
					url: api.getDeliveryAreas,
					param: {}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.noSendAreaList = res.data;
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			/**
			 * 根据大区获取省份信息
			 * @areaId  {string} 大区Id
			 * @isSend  {Boolean} 是否为发货
			 * @return null
			 */
			//获取省份
			getProList(areaId,isSend) {
				let self = this;
				if(isSend){
					self.noSendParams.proId = "";
					self.noSendParams.cityId = "";
					self.noSendParams.lifeId = "";
				}else{
					self.params.proId = "";
					self.params.cityId = "";
					self.params.lifeId = "";
					self.params.regionId = self.params.cityId||self.params.proId ||self.params.areaId;
				}
				if(typeof areaId == "undefined" || areaId == "") {
					self.getLifeHouseList();
					return;
				}
				let config = {
					url: api.getprovincesbyareaid,
					param: {
						areaId: areaId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						if(isSend){
							self.noSendProList = res.data;
						}else{
							self.proList = res.data;
							self.getLifeHouseList(areaId);
						}
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			/**
			 * 根据省份id获取省份信息
			 * @proId  {string} 省份id
			 *  @isSend  {Boolean} 是否为发货
			 * @return null
			 */
			//获取城市
			getCityList(proId,isSend) {
				let self = this;
				if(isSend){
					self.noSendParams.cityId = "";
					self.noSendParams.lifeId = "";
				}else{
					self.params.cityId = "";
					self.params.lifeId = "";
					self.params.regionId = self.params.cityId||self.params.proId ||self.params.areaId;
				}
				if(typeof proId == "undefined" || proId == "") {
					self.getLifeHouseList(self.params.areaId);
					return;
				}
				let url = api.getregion + "/" + proId
				let config = {
					url:api.getregion + "/" + proId,
					param:{}
				}
				restful.sendMyData(config,self,(res)=>{
					if(res.code == 2000) {
						if(isSend){
							self.noSendCityList = res.data;
						}else{
							self.cityList = res.data;
							self.getLifeHouseList(proId);
						}
					} else {
						self.$message.error(res.msg);
					}
				})
			},
			//获取馆
			/**
			 * 根据id获取生活馆信息
			 * @id  {string} id可为省份或市或者区
			 * @return null
			 */
			getLifeHouseList(id,isFirst) {
				let self = this;
				self.params.lifeId = "";
				let config = {
					url: api.getLifehouseNames,
					param: {
						regionId: id
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.lifeHouseList = res.data
						if(isFirst&&self.lifeHouseList.length==1){
							self.params.lifeId = res.data[0].lifeId
							self.isShow = false
						}
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			/**
			 * 根据id获取生活馆信息
			 * @id  {string} id可为省份或市或者区
			 * @return null
			 */
			getNoSendLifeHouseList(id) {
				let self = this;
				self.params.lifeId = "";
				let config = {
					url: api.getDeliveryLifehouses,
					param: {
						regionId: id
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.noSendLifeHouseList = res.data;
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//分页-每页条数改变
			handleCurrentChange(page) {
				let self = this;
				self.params.page = page-1;
				self.onQuery();
			},
			//跳转到或者点击页码
			handleSizeChange(count) {
				let self = this;
				self.params.count = count;
				self.onQuery();
			},
			//点击按钮开发选择文件按钮
			openFile(){
				this.$refs["raiseInput"].click();
			},
			//文件改变时
			fileChange(){
				var self = this;
				self.formForInput.isAready = false;
				let file = self.$refs["raiseInput"].files[0];
				const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'||'application/vnd.ms-excel';
		        const isLt2M = file.size / 1024 / 1024 < 100;
		        if (!isExcel) {
		          self.$message.error('上传头像图片只能是 Excel 文件!');
		          return;
		        }
		        if (!isLt2M) {
		          self.$message.error('上传头像图片大小不能超过100MB!');
		          return;
		        }
		        self.formForInput.fileName = file.name;
		        self.formForInput.file = file;
		        self.formForInput.isAready = true;
		        return isExcel && isLt2M;
			},
			//点击导入
			goToInput(){
				let self = this;
				self.dialogFormVisibleForInput = true;
				self.params.areaId = "";
				self.params.lifeId = "";
				self.params.proId = "";
				self.params.cityId = "";
				self.formForInput = {
					fileName:"请选择Excel文件"
				}
			},
			//打开发货页面
			goToSend(){
				this.dialogFormVisibleForSend = true;
				this.noSendParams ={
					areaId:'',
					lifeId:'',
					proId:'',
					cityId:'',
				}
				this.getNoSendAreaList();
			},
			//关闭导入众筹
			closeInput(){
				let self = this;
				self.params.areaId = "";
				self.params.lifeId = "";
				self.params.proId = "";
				self.params.cityId = "";
				self.dialogFormVisibleForInput = false;
			},
			//开始导入
			startToSendExcel(){
				let self = this;
				if(!self.formForInput.file){
					self.$message.error("必须选择需要导入的Excel文件");
					return;
				}
				let fd = new FormData();
				fd.append("file",self.formForInput.file);
				let config = {
					url: api.dataInput,
					headers: {
						"Content-Type": "multipart/form-data;"
					},
					loading:"excelLoading",
					param:fd
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.$message.success("导入成功");
						self.dialogFormVisibleForInput = false
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//开始发货
			sendGoods(){
				let self = this;
				if(!self.noSendParams.lifeId&&!self.noSendParams.areaId){
					self.$message.error("请选择需要发货的区域或者馆");
					return;
				}
				let config = {
					url: api.deliver,
					loading:"sendLoading",
					param: {
						lifeId: self.noSendParams.lifeId?self.noSendParams.lifeId:null,
						areaId:self.noSendParams.areaId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.$message.success("发货成功");
						self.dialogFormVisibleForSend = false;
					} else {
						self.$message.error(res.msg);
					}
				});

			},
			//日期插件时间改变
			dateChange(itemStr){
				var self = this;
				if(itemStr==="activeDate"&&self.params.activeDate){
					self.params.activeStartTime = tools.standTosimple(self.params.activeDate[0])+" 00:00";
					self.params.activeEndTime = tools.standTosimple(self.params.activeDate[1])+" 23:59";
				}else if(!self.params.activeDate&&itemStr==="activeDate"){
					self.params.activeStartTime = null;
					self.params.activeEndTime = null;
				}
				if(itemStr==="expireTime"&&self.params.expireTime){
					self.params.startExpireTime	 = tools.standTosimple(self.params.expireTime[0])+" 00:00";
					self.params.endExpireTime = tools.standTosimple(self.params.expireTime[1])+" 23:59";
				}else if(itemStr==="expireTime"&&!self.params.expireTime){
					self.params.startExpireTime = null;
					self.params.endExpireTime = null;
				}
			},
			//重置查询条件
			reset(){
			 	let self = this;
			 	//查询参数
				self.params = {
					"page": 0,
					"count": 20,
					"proId": "",
					"areaId": "",
					"cityId": "",
					"lifeId": "",
					"expireTime": '',
					"activeDate": '',					
				}
				self.getLifeHouseList();
			},

		}
	}
</script>

<style scoped>
	table.el-table__header tr th:nth-child(1),
	tbody tr td:nth-child(1) {
		padding-left: 15px!important;
	}
	/*内容部分*/

	.raiseList_main {
		padding: 20px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	/*搜索部分*/

	.raiselist_content_select {
		padding: 10px 20px;
		display: inline-block;
		/*float: left;*/
	}
</style>
