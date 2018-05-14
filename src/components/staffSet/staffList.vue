<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--员工配置-->
<template>
	<el-main>
		<section class="stafflist_main">
			<el-row>
				<el-col :span="24" style="text-align: right;">
					<el-button v-if="roleStatus&&checkPermission('api/manage/employee/saveEmployee')"  @click="addStaff()" type="primary" round icon="el-icon-add" size="medium">添加工作人员</el-button>
					<el-button v-if="!roleStatus&&checkPermission('api/manage/employee/saveEmployee')" @click="addStaff()" type="primary" round icon="el-icon-add" size="medium">添加教练/导师</el-button>
				</el-col>
				<el-col :span="24">
					<div class="stafflist_content">
						<div class="stafflist_content_select">
							场馆：
							<el-select
								:disabled="isLifeSelet"
								default-first-option
								clearable
								v-model="params.lifeId"
								filterable
								@change="getRoleList(params.lifeId)"
								placeholder="请选择场馆">
								<el-option v-for="item in selectObj.lifeHouseList"
									:key="item.lifeId"
									:label="item.lifeName"
									:value="item.lifeId">
								</el-option>
							</el-select>
						</div>
						<div  class="stafflist_content_select" v-if="roleStatus&&!!params.lifeId">
							角色：
							<el-select
								v-model="params.roleId"
								clearable placeholder="全部角色"
								size="medium"
								@change=''>
								<el-option
									v-for="(item,index) in selectObj.roleList"
									:key="index"
									:label="item.roleName"
									:value="item.roleId">
								</el-option>
							</el-select>
						</div>
						<div class="stafflist_content_select">
							状态：
							<el-select
								v-model="params.state"
								clearable placeholder="全部"
								size="medium">
								<el-option
									v-for="item in selectObj.stateList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="stafflist_content_select">
							<el-input :maxlength="11" v-model="params.keyword" placeholder="按电话或姓名搜索" style="width: 200px" size="medium"></el-input>
						</div>
						<div class="stafflist_content_select">
							<el-button :loading="loading" type="primary" @click="getStaffList()" round icon="el-icon-search" size="medium">搜索</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-table
					v-loading="loading"
					text="查询中..."
			      	:data="staffList"
			      	style="width: 100%">
			      	<el-table-column
			        	prop="name"
			        	label="姓名"
			        	width="180">
			      	</el-table-column>
			      	<el-table-column
			        	prop="sex"
			        	label="性别"
			        	width="180">
			      	</el-table-column>
			      	<el-table-column
			       		prop="mobile"
			        	label="电话">
			      	</el-table-column>
			      	<el-table-column
			       		prop="roleNameList"
			        	label="角色">
			        	<template slot-scope="scope">
					        <span :key="index" v-for="(item,index) in scope.row.roleNameList">{{item}} <i v-if="index!=scope.row.roleNameList.length-1">，</i></span>
					    </template>
			      	</el-table-column>
			      	<el-table-column
			       		prop="sortNo"
			        	label="排序权重">
			      	</el-table-column>
			      	<el-table-column
			       		prop="lifeName"
			        	label="所属场馆">
			      	</el-table-column>
			      	<el-table-column
			       		prop="state"
			        	label="登录">
			        	<template slot-scope="scope">
			        		<span v-if="scope.row.state== 1">
			        			允许
			        		</span>
			        		<span v-else>
			        			不允许
			        		</span>
			        	</template>
			      	</el-table-column>
			      	<el-table-column
			       		prop="state"
			        	label="状态">
			        	<template slot-scope="scope">
			        		<span v-if="scope.row.state== 0" class="danger">
			        			冻结
			        		</span>
			        		<span v-else>
			        			正常
			        		</span>
			        	</template>
			      	</el-table-column>
			      	<el-table-column
			      		prop="id"
			        	label="操作">
			        	<template slot-scope="scope">
	        				<a  v-if="checkPermission('api/manage/employee/employeeDetail')"
				        		@click="handleDetail(scope.row.id)">
				        		查看
				        	</a>
				        	<a  v-if="checkPermission('api/manage/employee/saveEmployee')"
				        		@click="handleEdit(scope.row.id)">
				        		编辑
				        	</a>
				        	<a   v-if="scope.row.state==1&&checkPermission('api/manage/employee/updateState')"
				        		@click="handleEnable(scope.row,'close')">
				        		冻结
				        	</a>
				        	<a  class="danger" v-if="scope.row.state==0&&checkPermission('api/manage/employee/updateState')"
				        		@click="handleEnable(scope.row,'open')">
				        		还原
				        	</a>
     					</template>
			      	</el-table-column>
			    </el-table>
			</el-row>
			<el-row>
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="1"
			      :page-sizes="[20, 40, 60, 100]"
			      :page-size="20"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total"style="text-align: right;">
			    </el-pagination>
			</el-row>
		</section>
	</el-main>
</template>

<script scoped>
	import {responeCode} from '@/config/config'
	import {api} from '@/config/api'
	import {restful} from '@/servers/server'
	export default {
		// 组件的名称
		name: 'staffList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			roleStatus:{type:Boolean,default:true},
			jumpRoute:{type:Object,default:()=>{return {}}}
		},
		data() {
			return {
				selectObj:{
					lifeHouseList:[],
					roleList:[
					],
					stateList:[
						{id:1,name:"正常"},
						{id:0,name:"冻结"}
					]
				},
				isLifeSelet:false,
				//工作人员列表
				staffList:[],
				//当前条件查询结果条数
				total:0,
				//正在查询ing
				loading:false,
				params:{
					"page": 0,
					"count": 20,
					"keyword":"",
					"lifeId": "",
					"state": null,
					"keyword":""
				},

			}
		},
		created(){
			console.log(window.permissions)
			let self = this;
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
					self.selectObj.lifeHouseList = res.data;
					if(res.data.length<=1){
						self.isLifeSelet = true;
						self.params.lifeId = res.data[0].lifeId
					}
				} else {
					self.isLifeSelet = false;
					self.$message.error(res.msg);
				}
			});
			self.getStaffList();
		},
		methods:{
			/**
			 * 根据生活馆id获取角色列表
			 *  @lifeId {String}场馆Id
			 */
			getRoleList(lifeId) {
				let self = this;
				//若是导师列表则不需要执行
				if(!self.roleStatus){
					return;
				}
				if(!lifeId){
					return;
				}
				//获取生活馆角色列表
				let config = {
					url: api.roleList,
					param: {
						lifeId: lifeId,
						origin:self.isCoach?1:0
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.selectObj.roleList = res.data
					} else {
						self.selectObj.roleList = []
					}
				});
			},
			//获取员工列表
			getStaffList(){
				var self = this;
				let config = {
					url: self.roleStatus?api.employeeList:api.coachList,
					loading:"loading",
					param: self.params
				}
				restful.sendMyData(config, self,(res)=>{
					if(res.code == 2000) {
						self.staffList = res.data;
						self.total = res.page_info.total;
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			//新增
			addStaff(){
				var self = this;
				self.$router.push({path:self.jumpRoute.add?self.jumpRoute.add:'/staffList/add'})
			},
			/**
			 * 查看
			 *  @id {String}员工Id
			 */
			handleDetail(id){
				var self = this;
				self.$router.push({path:self.jumpRoute.detail?self.jumpRoute.detail+id:'/staffList/detail/'+id})
			},
			/**
			 * 编辑
			 *  @id {String}员工Id
			 */
			handleEdit(id){
				var self = this;
				self.$router.push({path: self.jumpRoute.edit?self.jumpRoute.edit+id:'/staffList/edit/'+id})
			},
			/**
			 * 冻结/还原
			 * @item {Object} 当前操作的对象
			 *  @state {Number}1,还原 0 冻结
			 */
			handleEnable(item,state) {
				var self = this;
				let title = state=="close"?"你确定要冻结吗？":"你确定要还原吗？";
				let content = state=="close"?"冻结后不可登录且不可进行排班、排课":"还原后可登录且可进行排班、排课";
		        this.$confirm(content,title, {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning',
		          center: true
		        }).then(() => {
		        	let config = {
						okMsg: state=="close"?"冻结成功":"还原成功",
						isNeedOkMsg: true,
						url: self.isCoach?apiupdateCoachState:api.updateState,
						param:{
							employeeId:item.id,
							state:state=="close"?0:1
						}
					}
					restful.sendMyData(config, self,(res)=>{
						if(res.code == 2000) {
							self.getStaffList();
						}else{
							self.$message.error(res.msg);
						}
					});

		        }).catch(() => {

		        });
		   },
			/**
			 * 分页-每页条数改变、
			 * @page {Number} 当前页码
			 */
			handleCurrentChange(page){
				let self = this;
				self.params.page = page-1;
				self.getStaffList()
			},
			/**
			 * 当前页面容量
			 * @count {Number} 当前页码
			 */
			handleSizeChange(count){
				let self = this;
				self.params.count = count;
				self.getStaffList()
			}
		}
	}
</script>

<style scoped>
	/*内容部分*/
	.stafflist_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	/*搜索部分*/
	.stafflist_content_select {
		padding: 30px 20px;
		display: inline-block;
		float: left;
	}
	/*条件部分*/
	.stafflist_select_conditions {
		padding-top: 40px;
		overflow: hidden;
	}

</style>
