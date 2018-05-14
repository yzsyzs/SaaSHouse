<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--员工配置-->
<template>
	<el-main>
		<section class="staffDetail_main" v-if="checkPermission('api/manage/employee/employeeDetail')">
			<el-row>
				<el-col :span="24" class="staffDetail_baseinfo title">
					<h5>基本信息</h5>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">所属场馆：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.lifeName}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label" style="line-height: 50px;">头像：</el-col>
					<el-col :span="5" class="staffDetail_content img_head"><img :src="params.headImageUrl" alt="" /></el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">猫号：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.mallId}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">姓名：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.name}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">性别：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.sex==1?"男":"女"}}
					</el-col>
				</el-col>

				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">手机：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.mobile}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">角色：</el-col>
					<el-col :span="5" class="staffDetail_content">
						<span style="padding-right:30px ;" :key="index" v-for="(role,index) in roleList">
							{{role.roleName}}
						</span>
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo"v-if="params.hasTrainer">
					<el-col :span="2" class="staffDetail_label">是否接受补贴：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.isSubsidy?"是":"否"}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo"v-if="params.hasTrainer">
					<el-col :span="2" class="staffDetail_label">专家类别：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.expertName}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">全职/兼职：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.workType==0?"兼职":"全职"}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">身份证号：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.idCard}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">权重：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.sortNo}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">简介：</el-col>
					<el-col :span="5" class="staffDetail_content">
						<p style="width: 500px;word-wrap:break-word;line-height: 30px;">{{params.introduction}}</p>
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">相册：</el-col>
					<el-col :span="15" class="staffDetail_content">
						<ul class="photos">
							<!--"-->
							<li :key="index" v-for="(photo,index) in params.photoImgDetails">
								<img :src="photo.url" alt="" />
							</li>
						</ul>
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo">
					<el-col :span="2" class="staffDetail_label">是否允许登录：</el-col>
					<el-col :span="5" class="staffDetail_content">
						{{params.state?"允许":"不允许"}}
					</el-col>
				</el-col>
				<el-col :span="24" class="staffDetail_baseinfo pdt15">

				</el-col>
				<!--<el-col :span="24" style="height:100px;background: #F5F8F8;">
								
			</el-col>
			<el-col :span="24" class="staffDetail_baseinfo title ">
				<h5>薪资</h5>
			</el-col>
			<el-col :span="24" class="staffDetail_baseinfo">
				<el-col :span="2" class="staffDetail_label">固定底薪：</el-col>
				<el-col :span="5" class="staffDetail_content">
					{{params.baseSalary}}				
				</el-col>				
			</el-col>
			<el-col :span="24" class="staffDetail_baseinfo">
				<el-col :span="2" class="staffDetail_label">销售提成：</el-col>
				<el-col :span="5" class="staffDetail_content">
					{{params.sellSalary}}				
				</el-col>				
			</el-col>
			<el-col :span="24" class="staffDetail_baseinfo">
				<el-col :span="2" class="staffDetail_label">私教课酬：</el-col>
				<el-col :span="5" class="staffDetail_content">
					{{params.trainerSalary}}				
				</el-col>				
			</el-col>
			<el-col :span="24" class="staffDetail_baseinfo">
				<el-col :span="2" class="staffDetail_label">团课课酬：</el-col>
				<el-col :span="5" class="staffDetail_content">
					{{params.groupSalary}}				
				</el-col>				
			</el-col>-->
				<el-col :span="24" style="height:100px;background: #F5F8F8; text-align: center;line-height: 100px;">
					<el-button round type="primary" @click="edit(params.id)" v-if="checkPermission('api/manage/employee/saveEmployee')">编辑</el-button>
					<el-button round type="default" @click="back()">返回</el-button>
				</el-col>
			</el-row>
		</section>
	</el-main>
</template>

<script>
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	export default {
		// 组件的名称
		name: 'staffDetail',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			isCoach: {
				type: Boolean,
				default: false
			}
		},
		// 数据绑定
		data() {
			return {
				params: {
					id: null,
					headImageUrl: null,
					mallId: null,
					name: null,
					sex: null,
					phone: null,
					lifeName: null,
					isSubsidy: null,
					roleIdList: null,
					idCard: null,
					sort: null,
					introduction: null,
					photoImgDetails: ['/static/favicon.ico', '/static/favicon.ico', ],
					skillTagList: null,
					honor: null,
					baseSalary: null,
					sellSalary: null,
					trainerSalary: null,
					groupSalary: null,

				},
				roleList:[]
			}
		},
		methods: {
			/**
			 * 编辑
			 * @id {String} 员工Id
			 */
			edit(id) {
				let self = this;
				this.$router.push({
					path: self.isCoach ? '/trainerList/edit/'+ id : '/staffList/edit/' + id
				})
			},
			back() {
				let self = this
				this.$router.push({
					path: self.isCoach ? '/trainerList' : '/staffList'
				})
			}
		},
		created() {
			let self = this;
			self.checkPermission = window.checkPermission;
			//如果是编辑的话则获取到当前的员工信息
			if(self.$route.params.id) {
				let config = {
					okMsg: "获取信息成功",
					isNeedOkMsg: false,
					url:self.isCoach?api.coachDetail:api.employeeDetail,
					param: {
						employeeId: self.$route.params.id
					}
				}
				self.roleList = [];
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.params = res.data;
						res.data.roleList.forEach((item)=>{
							if(item.haveRole){
								self.roleList.push(item);
							}
							
						})
						
					} else {
						self.$message.error(res.msg);
						self.$router.push({
							path: self.isCoach ? '/trainerList' : '/staffList'
						})
					}
				});
			}
		}
	}
</script>

<style scoped>
	.staffDetail_main {
		text-align: left;
		background: #fff;
	}
	
	.staffDetail_baseinfo {
		padding: 20px 15px;
	}
	
	.staffDetail_baseinfo.title {
		border-bottom: 1px solid #ccc;
		padding: 15px 15px;
	}
	
	.staffDetail_label {
		text-align: right;
		padding-right: 20px;
		min-width: 150px;
	}
	
	.staffDetail_content.img_head {
		width: 50px;
		height: 50px;
		overflow: hidden;
		border: 1px solid #ccc;
		border-radius: 100px;
	}
	
	.staffDetail_content.img_head img {
		width: 50px;
		height: 50px;
	}
	
	.photos {
		width: 100%;
		/*max-width: 800px;*/
	}
	
	.photos li {
		width: 100px;
		height: 100px;
		float: left;
		overflow: hidden;
		border-radius: 5px;
		margin-right: 20px;
	}
	
	.photos li img {
		width: 100%;
	}
</style>