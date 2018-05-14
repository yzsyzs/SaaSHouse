<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-12-15 10:40:50
 */-->
<!--预约记录-->
<template>
	<el-main>
		<section class="signRecord_main" v-if="checkPermission('api/manage/preorder/getPreorderList')">
			<el-row>
				<el-row>
					<el-col :span="24" class="text-right" style="padding-bottom: 20px;">
						<ExportForm ref='elForm'>
							<el-button v-if="checkPermission('api/manage/preorder/preorderMulti')&&checkPermission('api/manage/preorder/getPresonalCourseList')" type="default" round @click="$router.push({path: '/personalTeachRecord'})">代约私教课</el-button>
							<el-button v-if="checkPermission('api/manage/preorder/appPreorderMulti')&&checkPermission('api/manage/courseschedule/getMonthCourseScheduleList') " type="default" round @click="$router.push({path: '/teamTeachRecord'})">代约团课</el-button>
							<el-button v-if="checkPermission('api/manage/preorder/exportPreorderList')" type="default" :disabled="!isExcel" round native-type="submit">导出excel</el-button>
						</ExportForm>
					</el-col>
				</el-row>
				<div class="row">
					<div class="houseAreaLinkage_select mgr4" :disabled="lifeHouseList.length==1">
						场馆 ：
						<el-select :disabled="lifeHouseList.length==1" filterable clearable class="w400" @change="getCoachAndCourse(params.lifeId)" v-model="params.lifeId" placeholder="请选择">
							<el-option v-for="(item, index) in lifeHouseList" :key="index" :label="item.lifeName" :value="item.lifeId"></el-option>
						</el-select>
					</div>
					<div class="houseAreaLinkage_select mgr4">
						授课教练：
						<el-select filterable clearable class="w400" :disabled="!params.lifeId" v-model="params.coachId" placeholder="请选择">
							<el-option v-for="(item, index) in coachList" :key="index" :label="item.coachName" :value="item.coachId"></el-option>
						</el-select>
					</div>
					<div class="houseAreaLinkage_select mgr4">
						课程名称 ：
						<el-select filterable clearable :disabled="!params.lifeId" class="w400" v-model="params.courseName" placeholder="请选择">
							<el-option v-for="(item, index) in courseNameList" :key="index" :label="item.courseName" :value="item.courseName"></el-option>
						</el-select>
					</div>
				</div>
				<div class="row">
					<div class="houseAreaLinkage_select mgr4">
						状态 ：
						<el-select clearable class="w400" v-model="params.status" placeholder="请选择">
							<el-option v-for="(item, index) in statusArr" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</div>
					<div class="houseAreaLinkage_select mgr4">
						上课时间：
						<el-date-picker :editable="false" :clearable="false" v-model="params.time" @change="isTimeChange" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
					</div>
					<div class="houseAreaLinkage_select mgr4">
						<el-input v-model="params.phoneOrmallId" placeholder="输入手机号、猫号"></el-input>
					</div>
					<el-button v-if="checkPermission('api/manage/preorder/getPreorderList')" type="primary" :loading="isLoading" round @click="onQuery">查询</el-button>
					<el-button type="default" round @click="onReset">重置</el-button>
					<!--<el-button type="default" round @click="isVisible=!isVisible">{{isVisible?'收起':'展开'}}<i v-if="isVisible" class="el-icon-arrow-up"></i><i v-else class="el-icon-arrow-down"></i></el-button>-->
				</div>
			</el-row>
			<el-row :key="index" v-for="(course ,index) in signRecordList">
				<!--v-if="item.preorderInfos.length>0" :key="index" v-for="(course ,index) in item.preorderInfos"-->
				<el-row v-if="signRecordList.length>0">
					<el-col :span="24" style="padding-bottom: 20px;line-height: 3;text-align: center;">
						<el-col :span="5" style="text-align: left;">
							场馆名称:{{course.lifeName}}
						</el-col>
						<el-col :span="10" style="text-align: left;">
							课程信息: <span>{{course.courseName}}</span><span style="padding-left: 15px;">{{course.coachName}}</span><span style="padding-left: 15px;">{{course.timeFormat}}</span>
						</el-col>
						<el-col :span="4">
							<el-col :span="12" v-if="course.courseType=='PERSONALCOURSE'">
								{{course.haveCount}}
							</el-col>
							<el-col :span="12" v-if="course.courseType!='PERSONALCOURSE'">
								{{course.haveCount?course.haveCount:'0'}}/{{course.maxCount}}
							</el-col>
							<el-col :span="12">
								<el-button v-if="checkPermission('api/manage/preorder/cancelCourseSchedule')" type="default" round @click="cancelClick(course.courseScheduleId)">取消课程</el-button>
							</el-col>
						</el-col>
					</el-col>
					<el-table :data="course.preorderInfos" style="width: 100%">
						<el-table-column label="序号" type="index" width="">
						</el-table-column>
						<el-table-column prop="timeFormat" label="上课时间">
						</el-table-column>
						<el-table-column prop="mallName" label="预约用户">
						</el-table-column>
						<el-table-column prop="mallId" label="猫号">
						</el-table-column>
						<el-table-column prop="mobile" label="手机号码">
						</el-table-column>
						<el-table-column prop="courseType" label="课程类型">
							<template slot-scope="scope">
								{{scope.row.courseType=='PERSONALCOURSE'?"私教课":"团课"}}
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态">
							<template slot-scope="scope">
								{{scope.row.status=='PREORDER_CANCELED'?"预约已取消":(scope.row.status=='BEFORE_CLASS'?"待上课":(scope.row.status=='SIGNED_IN'?"已签到":"课程已取消"))}}
							</template>
						</el-table-column>
						<el-table-column prop="hander" label="操作">
							<template slot-scope="scope">
								<el-button v-if="scope.row.status=='BEFORE_CLASS'&&scope.row.ifBeforeTwoHour&&checkPermission('api/manage/preorder/courseSign')" @click="signClick(scope.row.preorderId)" type="text" size="small">签到</el-button>
								<el-button v-if="scope.row.status=='BEFORE_CLASS'&&checkPermission('api/manage/preorder/cancelCoursePreorder')" type="text" size="small" @click="cancelCourse(scope.row.preorderId)">取消预约</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-row>
			<el-row v-if="signRecordList.length<1" style="text-align: center;padding-top: 25px;">
				暂无数据
			</el-row>
			<el-row v-if="signRecordList.length>1">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page+1" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
				</el-pagination>
			</el-row>
			<el-row>
				<el-dialog title="请输入原因" :visible.sync="cancelVisible" width="30%" center>
					<el-input type="textarea" :rows="8" placeholder="请输入取消原因，比如：预约人数不足以开课；" :minlength="5" :maxlength="500" v-model="cancel.remark">
					</el-input>
					<span>取消课程后会以短信方式通知已预约的用户；</span>
					<span slot="footer" class="dialog-footer">
		              <el-button @click="cancelVisible = false">取 消</el-button>
		              <el-button :disabled="!cancel.remark" type="primary" @click="cancelVisibleClick">确 定</el-button>
		            </span>
				</el-dialog>
			</el-row>
		</section>
	</el-main>

</template>

<script>
	import { responeCode } from '@/config/config'
	import { restful } from '@/servers/server'
	import ExportForm from '@/components/base/exportForm'
	import { api } from '@/config/api'
	import axios from 'axios'
	import { tools, getExportFormComItem } from '@/common/tools'
	export default {
		// 组件的名称
		name: 'signRecord',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {
				// 控制导出表格是否可点击
				isExcel: false,
				submit: 'submit',
				// 结束
				isLoading: false,
				isVisible: true,
				cancelVisible: false,
				textarea: '',
				//取消预约
				cancel: {
					remark: '',
				},
				params: {
					phoneOrmallId: null,
					lifeId: '',
					status: null,
					time: '',
					coachId: null,
					courseName: '',
					page: 0,
					count: 20,
				},
				//当前记录返回数据量
				total: 0,
				lifeHouseList: [],
				coachList: [],
				courseNameList: [],
				statusArr: [{
						id: 'PREORDER_CANCELED',
						name: '预约已取消'
					},
					{
						id: 'BEFORE_CLASS',
						name: '待上课'
					},
					{
						id: 'SIGNED_IN',
						name: '已签到'
					},
					{
						id: 'COURSE_CANCELED',
						name: '课程已取消'
					},
				],
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
					}]
				},
				signRecordList: []
			}
		},
		watch: {
			/*params: {
				handler: function(val, oldVal) {
					if(val !== null) {
						this.isExcel = true
					}
				},
				deep: true
			}*/
		},
		created() {
			this.checkPermission = window.checkPermission
		},
		mounted() {
			this.getLifeHouseList()
			this.elForm = this.$refs.elForm
			this.elForm.$el.action = api.exportPreorderList
		},
		methods: {
			// 时间改变， 导出方法
			isTimeChange() {
				//this.isExcel = true
			},
			//查询
			onQuery() {
				let self = this
				if(self.params.time && self.params.time.length == 0 || !self.params.time) {
					self.$message.error("请选择上课时间再搜索");
					return;
				}
				if(self.params.time && self.params.time.length > 0) {
					if(tools.dateToTimeStamp(self.params.time[1]) - tools.dateToTimeStamp(self.params.time[0]) > 31 * 24 * 60 * 60) {
						self.$message.error("开始时间和结束时间不能相差超过31天");
						return;
					} else {
						self.params.startTime = self.params.time[0]
						self.params.endTime = self.params.time[1]
					}
				}
				self.params.status = self.params.status ? self.params.status : null
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getPreorderList,
					//请求体参数
					param: self.params,
					loading: "isLoading",
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */

				restful.sendMyData(config, self, (res) => {
					self.isExcel = false
					console.log(res)
					if(res.code === 2000 && res.success === true && res.msg === 'OK') {
						if(res.data.length === 0) {
							self.signRecordList = []
							self.total = 0
							return false
						} else {
							self.signRecordList = res.data
							self.total = res.page_info.total
						}
						self.isExcel = true
						self.elForm.refresh(getExportFormComItem(self.params))
					}
				})
			},
			// 重置
			onReset() {
				let self = this
				this.params = {
					phoneOrmallId: null,
					lifeId: self.lifeHouseList.length == 1 ? self.params.lifeId : '',
					status: null,
					time: [],
					coachId: null,
					courseId: null,
					page: 0,
					count: 20,
				}
			},
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
			// 签到
			signClick(preorderId) {
				let self = this
				let config = {
					url: api.courseSign,
					param: {
						preorderId: preorderId
					}
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.$message.success("签到成功")
						self.onQuery()
					} else {
						self.$message.error(res.msg)
					}
				});
			},
			/**
			 * 取消课程
			 * @course  {Object} 需要取消的课程   
			 */
			cancelClick(courseScheduleId) {
				this.cancelVisible = true
				this.cancel.remark = ''
				this.cancel.courseScheduleId = courseScheduleId
			},
			// 取消课程弹窗确定事件
			cancelVisibleClick() {
				let self = this
				self.cancel.remark = self.cancel.remark.trim()
				let config = {
					url: api.cancelCourseSchedule,
					param: self.cancel
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.$message.success("取消课程成功")
						self.cancelVisible = false
						self.onQuery()
					} else {
						self.$message.error(res.msg)
					}
				});
			},
			/**
			 * 取消预约
			 * @preorderId  {String} 预约Id   
			 */
			cancelCourse(preorderId) {
				let self = this;
				self.$confirm('是否取消该预约', '取消预约', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let configOfLife = {
						url: api.cancelCoursePreorder,
						param: {
							coursePreorderId: preorderId
						}
					}
					restful.sendMyData(configOfLife, self, (res) => {
						if(res.code == 2000) {
							self.$message.success("取消预约成功")
							self.onQuery()
						} else {
							self.$message.error(res.msg)
						}
					});
				}).catch(() => {

				});

			},
			//获取生活馆列表
			getLifeHouseList() {
				let self = this;
				let configOfLife = {
					url: api.getLifeNameList,
					param: {}
				}
				restful.sendMyData(configOfLife, self, function(res) {
					if(res.code == 2000) {
						self.lifeHouseList = res.data;
						if(res.data.length == 1) {
							self.params.lifeId = self.lifeHouseList[0].lifeId;
							self.getCoachAndCourse(self.params.lifeId);
						}
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//根据生活馆切换教练和课程
			getCoachAndCourse(lifeId) {
				var self = this;
				self.params.coachId = '';
				self.params.courseName = '';
				self.coachList = [];
				self.courseNameList = [];
				if(!lifeId) {
					return;
				}
				let config = {
					url: api.findCoachByLife,
					param: {
						lifeId: lifeId
					}
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体   
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数 
				 */
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.coachList = res.data;
					} else {
						self.coachList = [];
					}
				});
				let courseConfig = {
					url: api.getAllCourseNameList,
					param: {
						lifeId: lifeId
					}
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体   
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数 
				 */
				restful.sendMyData(courseConfig, self, function(res) {
					if(res.code == 2000) {
						self.courseNameList = res.data;
					} else {
						self.courseNameList = [];
					}
				});

			},
		},
		components: {
			ExportForm
		}
	}
</script>

<style scoped>
	.text-left {
		text-align: left;
	}
	
	.text-right {
		text-align: right;
	}
	
	.w400 {
		width: 200px;
	}
	
	.signRecord_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
		min-height: 600px;
	}
	
	.pdt15 {
		padding-top: 15px;
	}
	
	.houseAreaLinkage_select {
		display: inline-block;
		padding: 10px 0;
	}
	
	.row {
		margin-bottom: 20px;
		min-height: 32px;
		height: auto;
		text-align: left;
	}
</style>