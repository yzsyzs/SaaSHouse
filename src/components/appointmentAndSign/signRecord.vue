<!--签到记录-->
<template>
	<el-main>
		<section class="signRecord_main" v-if="checkPermission('api/manage/preorder/getCourseSignList')">
			<el-row>
				<el-row>
					<form :action="exportCourseSignList" method="post">
						<input type="hidden" name="token" :value="token" />
						<input type="hidden" name="courseType" :value="params.courseType" />
						<input type="hidden" name="coachId" :value="params.coachId" />
						<input type="hidden" name="courseName" :value="params.courseName" />
						<input type="hidden" name="startTime" :value="params.startTime" />
						<input type="hidden" name="endTime" :value="params.endTime" />
						<input type="hidden" name="keyWord" :value="params.keyword" />
						<input type="hidden" name="lifeId" :value="params.lifeId" />
						<el-col :span="24" class="text-right">
							<el-button v-if="checkPermission('api/manage/preorder/exportCourseSignList')" type="default" round native-type="submit">导出excel</el-button>
						</el-col>
					</form>
					<el-form :inline="true" :model="params" class="demo-form-inline" ref="signRecord">
						<el-form-item  label="场馆：" :disabled="lifeHouseList.length>1" style="padding-left: 28px;">
							<el-select :disabled="lifeHouseList.length==1" clearable filterable @change="getCoachAndCourseList(params.lifeId)" v-model="params.lifeId" placeholder="请选择">
								<el-option :label="item.lifeName" :value="item.lifeId" :key="index" v-for="(item,index) in lifeHouseList"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="授课教练：">
							<el-select :disabled="!params.lifeId" clearable filterable v-model="params.coachId" placeholder="请选择">
								<el-option :label="item.coachName" :value="item.coachId" :key="index" v-for="(item,index) in coachList"></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="课程类型：">
							<el-select :disabled="!params.lifeId" clearable class="w300" @change="getCourseList(params.lifeId)" v-model="params.courseType" placeholder="请选择">
								<el-option label="私教课" value="0"></el-option>
								<el-option label="团课" value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="课程名称：">
							<el-select :disabled="!params.courseType" clearable filterable class="w300" v-model="params.courseName" placeholder="请选择">
								<el-option :label="item.courseName" :value="item.courseName" :key="index" v-for="(item,index) in courseList"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="签到时间：">
							<el-date-picker :editable="false" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="w400" v-model="params.date" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
						</el-form-item>
						<el-form-item label="">
							<el-input v-model="params.keyWord" placeholder="输入手机号、猫号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button v-if="checkPermission('api/manage/preorder/getCourseSignList')" type="primary" :loading="loading" round @click="onQuery">查询</el-button>
							<el-button  type="default" round @click="onReset('signRecord')">重置</el-button>
						</el-form-item>						
					</el-form>
				</el-row>
				<el-row>
					<el-table :data="signRecordList" style="width: 100%">
						<el-table-column label="序号" type="index" width="">
						</el-table-column>
						</el-table-column>
						<el-table-column prop="signTime" label="签到时间">
						</el-table-column>
						<el-table-column prop="mallName" label="用户姓名">
						</el-table-column>
						<el-table-column prop="mallId" label="猫号">
						</el-table-column>
						<el-table-column prop="phone" label="手机号码">
						</el-table-column>
						<el-table-column prop="courseName" label="课程名称">
						</el-table-column>
						<el-table-column prop="coachName" label="授课教练">
						</el-table-column>
						<el-table-column prop="courseTime" width="180px" label="上课时间" style="width: 180px!important;">

						</el-table-column>
						<el-table-column prop="courseType" label="课程类别">
						</el-table-column>
						<el-table-column prop="lifeName" label="馆名称">
						</el-table-column>
						<el-table-column prop="signUser" label="操作人员">
						</el-table-column>
					</el-table>
				</el-row>
				<!--分页信息-->
				<el-row>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page+1" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
					</el-pagination>

				</el-row>
			</el-row>
		</section>
	</el-main>

</template>

<script>
	import { responeCode } from '@/config/config'
	import { tools } from '@/common/tools'
	import { restful } from '@/servers/server'
	import { api } from '@/config/api'
	export default {
		// 组件的名称
		name: 'signRecord',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {
				loading: false,
				//导出地址
				exportCourseSignList: api.exportCourseSignList,
				params: {
					lifeId: null,
					coachId: null,
					courseName:'',
					courseType:'',
					date: '',
					keyWord: '',
					page: 0,
					count: 20
				},
				total: 0,
				token: '',
				lifeHouseList: [],
				coachList: [],
				courseList: [],
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
				value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				value4: '',
				selectObj: {},
				signRecordList: [],
			}
		},
		created() {
			this.checkPermission = window.checkPermission
		},
		mounted() {
			let self = this
			//获取生活馆列表
			self.getLifeHouseList()
			self.token = localStorage.getItem('accessToken')
		},
		methods: {
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
							self.getCoachAndCourseList(self.params.lifeId);
						}
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			/**
			 * 获取教练和课程名称
			 * @lifeId  {Object} 场馆Id
			 */
			getCoachAndCourseList(lifeId) {
				this.params.courseName = '';
				this.params.coachId = '';
				this.params.courseType = '';
				this.getCoachList(lifeId);
				this.getCourseList(lifeId);
			},
			//获取当前馆列表
			getCoachList(lifeId) {
				let self = this;
				if(!lifeId) {
					return;
				}
				let configOfLife = {
					url: api.findCoachByLife,
					param: {
						lifeId: lifeId
					}
				}
				restful.sendMyData(configOfLife, self, function(res) {
					if(res.code == 2000) {
						self.coachList = res.data;
					} else {
						self.coachList = [];
						self.$message.error(res.msg);
					}
				});
			},
			getCourseList(lifeId) {
				this.params.courseName = '';
				let self = this;
				if(!lifeId) {
					return;
				}
				//获取生活馆列表
				let configOfLife = {
					url: self.params.courseType == 0 ? api.getDistinctCourseNameList : api.getDistinctGroupCourseNameList,
					param: {
						lifeId: lifeId
					}
				}
				restful.sendMyData(configOfLife, self, function(res) {
					if(res.code == 2000) {
						self.courseList = res.data;
					} else {
						self.courseList = [];
						self.$message.error(res.msg);
					}
				});
			},
			//提交-导出
			onSubmit() {
				console.log('submit!');
			},
			//查询
			onQuery() {
				var self = this;
				if(self.params.date&&self.params.date.length > 0) {
					console.log(self.params.date)
					self.params.startTime = tools.dateToTimeStamp(self.params.date[0]);
					self.params.endTime = tools.dateToTimeStamp(self.params.date[1]);
				}else{
					self.params.startTime = null
					self.params.endTime = null
				}
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getCourseSignList,
					//请求体参数
					param: self.params,
					//当前请求的缓冲字段名称
					loading: "loading",
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */

				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.signRecordList = res.data
						self.total = res.page_info.total
					} else {
						self.signRecordList = []
						self.total = 0
					}

				});
			},
			//重置
			onReset() {
				let self = this
				self.params = {
					lifeId: self.lifeHouseList.length == 1 ? self.params.lifeId : null,
					coachId: null,
					courseId: null,
					courseType: null,
					date: '',
					mallOrPhone: null,
					page: 0,
					count: 20
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
	
	.w300 {
		/*width: 200px;*/
	}
	
	.w400 {
		width: 350px;
	}
	
	.signRecord_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	
	.pdt15 {
		padding-top: 15px;
	}
</style>