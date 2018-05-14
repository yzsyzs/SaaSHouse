<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--私教课-列表-->
<template>
	<el-main>
		<section class="trainerCourseList_main">
			<el-row>
				<el-row>
					<el-form :inline="true" :model="params" method="POST" :action="exportUrl" ref="params" class="demo-form-inline">
						<el-col :span="24" class="text-right">
							<el-button v-if="isGroup&&checkPermission('api/manage/groupcourse/addOrEditGroupCourse')" type="primary" round @click="handleAdd">配置团课</el-button>
							<el-button v-if="!isGroup&&checkPermission('api/manage/course/addOrEditCourse')" type="primary" round @click="handleAdd">配置私教课</el-button>
							<el-button v-if="!isGroup&&checkPermission('api/manage/course/exportCourseList')" type="default" round native-type="submit">导出excel</el-button>
							<el-button v-if="isGroup&&checkPermission('api/manage/groupcourse/exportGroupCourseList')" type="default" round native-type="submit">导出excel</el-button>
							<input type="hidden" name="token" id="token" :value="params.token" />
							<input type="hidden" name="lifeId" id="lifeId" :value="params.lifeId" />
							<input type="hidden" name="coachId" id="coachId" :value="params.coachId" />
							<input type="hidden" name="courseName" id="courseName" :value="params.courseName" />
						</el-col>
						<el-col :span="24" class="text-left" style="padding-top: 20px;">
							<el-form-item label="场馆：" >
									<el-select :disabled="lifeHouseList.length==1" filterable clearable class="w300" @change="getCoachAndCourse(params.lifeId)" v-model="params.lifeId" placeholder="请选择场馆">
										<el-option :label="lifeHouse.lifeName" :value="lifeHouse.lifeId" :key="index" v-for="(lifeHouse,index) in lifeHouseList"></el-option>
									</el-select>
							</el-form-item>
							<el-form-item label="授课教练：" v-if="!isGroup&&!!params.lifeId">
									<el-select filterable clearable class="w300" v-model="params.coachId" placeholder="请选择授课教练">
										<el-option :label="coach.coachName" :value="coach.coachId" :key="index" v-for="(coach,index) in coachList"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="课程名称：">
									<el-select filterable :disabled="!params.lifeId" clearable class="w300" v-model="params.courseName" placeholder="请选择课程">
										<el-option :label="course.courseName" :value="course.courseName" :key="index" v-for="(course,index) in courseNameList"></el-option>
									</el-select>
								</el-form-item>
							<el-form-item style="padding: 0;">
								<el-button type="primary" :loading="isLoading" round @click="onQuery">搜索</el-button>
								<el-button type="default" round @click="reset('params')">重置</el-button>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
				<el-row v-for="(coursList,index) in coursListArr" :key="index">
					<el-col :span="24" class="pdtb20">
						{{coursList.lifeName}}
					</el-col>
					<el-table :data="isGroup?coursList.groupCourses:coursList.courses" style="width: 100%">
						<el-table-column label="序号" type="index" width="">
						</el-table-column>
						<el-table-column prop="courseName" label="课程名称">
						</el-table-column>
						<el-table-column prop="duration" label="课程时长">
						</el-table-column>
						<el-table-column v-if="!isGroup" prop="coachName" label="授课教练">
						</el-table-column>

						<el-table-column v-if="!isGroup" prop="price" label="价格">
							<template slot-scope="scope">
								<span>{{scope.row.price[0]?scope.row.price[0]:"--"}} <i v-if="scope.row.price[0]">等</i> </span>
							</template>
						</el-table-column>
						<el-table-column prop="sortNo" label="权重">
						</el-table-column>
						<el-table-column prop="id" label="操作">
							<template slot-scope="scope">
								<!--团课详情-->
								<a v-if="isGroup&&checkPermission('api/manage/groupcourse/getGroupCourseDetail')" @click="handleDetail(scope.row.courseId)">
									课程详情
								</a>
								<!--私教课详情-->
								<a v-if="!isGroup&&checkPermission('api/manage/course/getCourseDetail')" @click="handleDetail(scope.row.courseId)">
									课程详情
								</a>
								<!--团课排课-->
								<a v-if="isGroup" @click="goToRank(coursList.lifeId,scope.row.courseId)">
									查看排课
								</a>
								<!--团课编辑-->
								<a v-if="isGroup&&checkPermission('api/manage/groupcourse/addOrEditGroupCourse')" @click="handleEdit(scope.row.courseId)">
									编辑
								</a>
								<!--私教课编辑-->
								<a v-if="!isGroup&&checkPermission('api/manage/course/addOrEditCourse')" @click="handleEdit(scope.row.courseId)">
									编辑
								</a>
								<!--私教课启用-->
								<a class="info"  v-if="!isGroup&&scope.row.status==0&&checkPermission('api/manage/course/updateCourseStatus')" @click="updateCourseStatus(scope.row.courseId,1)">
									启用
								</a>
								<!--私教课停用-->
								<a class="danger"  v-if="!isGroup&&scope.row.status==1&&checkPermission('api/manage/course/updateCourseStatus')" @click="updateCourseStatus(scope.row.courseId,0)">
									停用
								</a>
								<!--私教课删除-->
								<a v-if="!isGroup&&checkPermission('api/manage/course/deleteCourse')" class="danger" @click="handleDel(scope.row.courseId)">
									删除
								</a>
								<!--团课删除-->
								<a v-if="isGroup&&checkPermission('api/manage/groupcourse/deleteGroupCourse')" class="danger" @click="handleDel(scope.row.courseId)">
									删除
								</a>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-row>
			<!--分页信息-->
			<el-row v-if="coursListArr.length>1">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page+1" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
				</el-pagination>
			</el-row>
			<el-row>
				<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
					<el-select clearable class="w300" filterable @change="getCoachAndCourse(gotoParams.lifeId)" v-model="gotoParams.lifeId" placeholder="请选择">
						<el-option :label="lifeHouse.lifeName" :value="lifeHouse.lifeId" :key="index" v-for="(lifeHouse,index) in lifeHouseList"></el-option>
					</el-select>
					<span slot="footer" class="dialog-footer">
				    <el-button round @click="dialogVisible = false;gotoParams.lifeId = ''">取 消</el-button>
				    <el-button round type="primary" @click="goToAdd()">确 定</el-button>
				  </span>
				</el-dialog>
			</el-row>
			<el-row>

			</el-row>
		</section>
	</el-main>

</template>

<script>
	import { responeCode } from '@/config/config'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	export default {
		// 组件的名称
		name: 'trainerCourseList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			isGroup: {
				type: Boolean,
				default: false
			},
			jumpRoute: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		// 数据绑定
		data() {
			return {
				isLoading: false,
				//生活馆列表
				lifeHouseList: [],
				//课程名称数组
				courseNameList: [],
				//教练数组
				coachList: [],
				//export
				exportUrl: null,
				gotoParams:{
					lifeId:null,
				},
				params: {
					page: 0,
					count: 20,
					courseName: '',
					coachId: '',
					lifeId: '',
					token: localStorage.getItem("accessToken")
				},
				exportParams: {

				},
				//课程集合
				coursListArr: [],
				//总条数
				total: 0,
				dialogVisible: false,
			}
		},
		mounted() {
			this.exportUrl = this.isGroup ? api.exportGroupCourseList : api.exportCourseList;
		},
		created() {
			let self = this;
			//加载权限验证函数
			self.checkPermission = window.checkPermission;

			//获取生活馆列表
			let configOfLife = {
				okMsg: "",
				isNeedOkMsg: false,
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
					self.$router.push({
						path: self.isGroup ? '/groupCourseList' : '/trainerCourseList'
					})
				}
			});
			self.onQuery()
		},
		methods: {			
			//根据生活馆切换教练和课程
			getCoachAndCourse(lifeId) {
				var self = this;
				self.params.coachId = '';
				self.params.courseId = '';
				self.coachList = [];
				self.courseNameList = [];
				if(!lifeId) {
					return;
				}
				if(!self.isGroup) {
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
						url: api.getDistinctCourseNameList,
						param: {
							lifeId: lifeId,
							deleteFlag:0
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

				} else {
					let configCourse = {
						url: api.getDistinctGroupCourseNameList,
						param: {
							lifeId: lifeId,
							deleteFlag:0
						}
					}
					/**
					 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
					 * @config  {Object} 请求的参数主体   
					 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数 
					 */
					restful.sendMyData(configCourse, self, function(res) {
						if(res.code == 2000) {
							self.courseNameList = res.data;
						} else {
							self.courseNameList = [];
						}
					});
				}

			},
			//提交-导出
			onSubmit() {
				console.log('submit!');
			},
			//查询
			onQuery() {
				let self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				if(self.params.lifeId) {
					self.params.page = null;
					self.params.count = null;
				}
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: self.isGroup ? api.getGroupCourseList : api.getCourseList,
					//请求体参数
					param: self.params,
					//是否需要返回信息
					isNeedOkMsg: false,
					//成功时的处理消息 错误信息由后台控制打印
					okMsg: "",
					//当前请求的缓冲字段名称
					loading: "isLoading",
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 */
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.coursListArr = res.data;
						self.total = res.page_info.total
					} else {
						self.coursListArr = [];
						self.total = 0;
					}

				});
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
			//重置
			reset() {
				this.params.lifeId = self.lifeHouseList.length == 1 ? self.params.lifeId : null;
				this.params.coachId = null;
				this.params.courseId = null;
				this.params.page = 0;
				this.params.count = 20;
			},
			//配置课程
			handleAdd(id) {
				let self = this;				
				if(self.lifeHouseList.length>1){
					self.dialogVisible = true;
					self.params.lifeId = "";
				}else{
					self.gotoParams.lifeId = self.params.lifeId;
					self.goToAdd();
				}				
			},
			//跳转到新增课程页面
			goToAdd() {
				let self = this;
				if(!self.gotoParams.lifeId) {
					this.$message({
						type: 'info',
						message: '请选择配置课程的生活馆'
					});
					return;
				}
				self.dialogVisible = false;
				let type = null;
				self.lifeHouseList.forEach((item) => {
					if(item.lifeId == self.gotoParams.lifeId) {
						type = item.houseType;
					}
				})
				self.$router.push({
					path: self.jumpRoute.add ? self.jumpRoute.add : '/trainerCourseList/add',
					query: {
						lifeId: self.gotoParams.lifeId,
						type: type
					}
				})
			},
			/**
			 * 课程详情
			 * @id  {String} 课程Id
			 */
			handleDetail(id) {
				let self = this;
				self.$router.push({
					path: self.jumpRoute.detail ? self.jumpRoute.detail + id : '/trainerCourseList/detail/' + id,
				})
			},
			/**
			 * 课程编辑
			 * @id  {String} 课程Id
			 */
			handleEdit(id) {
				let self = this;
				self.$router.push({
					path: self.jumpRoute.edit ? self.jumpRoute.edit + id : '/trainerCourseList/edit/' + id,
					query: {
						type: "0"
					}
				})
			},
			/**
			 * 查看排课
			 * @lifeId  {String} 生活馆Id
			 * @courseId  {String} 课程Id
			 */
			goToRank(lifeId, courseId) {
				let self = this;
				self.$router.push({
					path: '/groupCurriculum',
					query: {
						lifeId: lifeId,
						courseId: courseId
					}
				})
			},
			/**
			 * 课程删除
			 * @id  {String} 课程Id
			 */
			handleDel(id) {
				let self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: self.isGroup ? api.deleteGroupCourse : api.deleteCourse,
					//请求体参数
					param: {
						courseId: id
					},
					//当前请求的缓冲字段名称
					loading: "isLoading"
				}
				this.$confirm('是否删除该课程', '删除课程', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					/**
					 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
					 * @config  {Object} 请求的参数主体
					 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
					 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
					 */
					restful.sendMyData(config, self, (res) => {
						if(res.code == 2000) {
							self.$message.success("删除成功");
							this.onQuery();
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			/**
			 * 课程启停用
			 * @courseId  {String} 课程Id
			 * @isOpen  {Boolean} 是否启用
			 */
			updateCourseStatus(courseId, isOpen) {
				let self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.updateCourseStatus,
					//请求体参数
					param: {
						courseId: courseId,
						status: isOpen
					},
					//当前请求的缓冲字段名称
					loading: "isLoading"
				}
				let content = isOpen ? "是否停用此课程" : "是否启用此课程";
				let title = isOpen ? "启用课程" : "停用课程";
				let resultMsg = isOpen ? "启用成功" : "停用成功";
				self.$confirm(content, title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					/**
					 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
					 * @config  {Object} 请求的参数主体
					 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
					 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
					 */
					restful.sendMyData(config, self, (res) => {
						if(res.code == 2000) {
							self.$message.success(resultMsg);
							this.onQuery();
						}
					});
				}).catch(() => {

				});
			}
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
		width: 300px;
	}
	
	.w400 {
		width: 400px;
	}
	
	.trainerCourseList_main {
		padding: 10px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	
	.pdt15 {
		padding-top: 15px;
	}
	
	.pdb15 {
		padding-bottom: 15px;
	}
	
	.pdtb20 {
		padding: 20px 0;
		color: #444A49;
	}
</style>