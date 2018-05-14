<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--员工配置-新增-->
<template>
	<el-main>
		<!--优先验证权限 若没权限则不再显示-->
		<section class="staffadd_main" v-if="checkPermission('api/manage/employee/saveEmployee')">
			<el-row>
				<el-col :span="24" class="staffadd_baseinfo first">
					<p style="padding: 20px 0;">基本信息</p>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24" style="min-width: 768px;" class="pdt15">
					<el-form :model="params" :rules="rules" ref="params" label-width="150px" class="demo-ruleForm">
						<el-form-item label="所属场馆：" prop="lifeId">
							<el-select @change="initMallId(params.lifeId)" :disabled="isEdit" style="width: 315px;" default-first-option clearable v-model="params.lifeId" filterable placeholder="请选择">
								<el-option v-for="item in lifeHouseList" :key="item.lifeId" :label="item.lifeName" :value="item.lifeId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="猫号：" prop="mallId">
							<el-input v-if="isEdit" :disabled="true" v-model="params.mallId" placeholder="请输入猫号" style="width: 200px" size="medium"></el-input>
							<el-input v-if="!isEdit" :disabled="!params.lifeId" @blur="getInfo(params.mallId)" v-model="params.mallId" placeholder="请输入猫号" style="width: 200px" size="medium"></el-input>
						</el-form-item>
						<el-form-item label="手机：" prop="mobile">
							<span>{{params.mobile?params.mobile:"--"}}</span>
						</el-form-item>
						<el-form-item label="资质：" prop="honor">
							<span>{{params.honor?params.honor:"暂无"}}</span>
						</el-form-item>

						<el-form-item label="头像：" prop="headImgUrl">
							<imgUpload @getLoading="getLoading" :isScale="true" v-show="!yetHeadImg" :imageWidth="1" :imageHeight="1" ref="headImg" upImgArr='headImg' @getImgArr="getHeadImgArr"></imgUpload>
							<div class="loading" v-if="isHeadImgLoading" v-loading="isHeadImgLoading"></div>
							<div v-show="yetHeadImg" class="yetUploadImgList" style="width: 100px;height: 100px;overflow: hidden;">
								<img :src="headImgArr[0].url" alt="" style="border-radius:100px;width: 100px;height: 100px;" />
								<i class="delImg" @click="delImg(headImgArr[0])"></i>
							</div>
							<el-col :span="24" style="min-width: 768px; color:#B9BEBD ;">
								建议正方形图片
							</el-col>
						</el-form-item>
						<el-form-item label="姓名：" prop="name">
							<el-input :maxlength="10" v-model="params.name" placeholder="请输入姓名" style="width: 200px" size="medium"></el-input>
						</el-form-item>
						<el-form-item label="性别：" prop="sex">
							<el-radio-group v-model="params.sex">
								<el-radio :label="1">男</el-radio>
								<el-radio :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="角色：" prop="roleIdList">
							<el-col :span="24" v-if="roleList.length<1">
								请先选择馆
							</el-col>
							<el-checkbox-group @change="hasTrainer(params.roleIdList)" v-model="params.roleIdList">
								<el-col :span="24" :key="index" v-for="(item,index) in roleList">
									<el-checkbox :label="item.roleId">{{item.roleName}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="是否接受补贴：" v-if="isHasTrainer" prop="subsidy">
							<el-checkbox v-model="params.subsidy">接受</el-checkbox>
						</el-form-item>
						<el-form-item v-if="isHasTrainer" label="专家类别：" prop="honor">
							<el-select style="width: 315px;" default-first-option clearable v-model="params.expertId" filterable placeholder="请选择">
								<el-option v-for="(item,index) in expertList" :key="index" :label="item.expertName" :value="item.expertId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="全职/兼职：" prop="workType">
							<el-radio-group v-model="params.workType">
								<el-radio :label="1">全职</el-radio>
								<el-radio :label="0">兼职</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="技能标签：" prop="skillTagList">
							<el-tag style="margin-right: 15px;" :key="index" v-for="(tag,index) in params.skillTagList">{{tag.tagName}}</el-tag>
							<el-button :disabled="!params.lifeId" @click="openDialog()" style="margin-left: 50px; padding: 10px 20px;" type="primary" icon="el-icon-edit" round>编辑技能标签</el-button>

						</el-form-item>
						<el-form-item label="身份证号：" prop="idCard">
							<el-input v-model="params.idCard" placeholder="请输入身份证号" style="width: 200px" size="medium"></el-input>
						</el-form-item>
						<el-form-item label="排序权重：" prop="sortNo">
							<el-input type="number" :maxlength="3" v-model="params.sortNo" placeholder="请输入数字" style="width: 200px" size="medium"></el-input>
						</el-form-item>
						<el-form-item label="简介：" prop="introduction">
							<el-input type="textarea" autosize placeholder="请输入个人介绍，最长500个上字，包含英文及符号。" style="width: 500px;min-height: 100px;" size="medium" :maxlength="500" v-model="params.introduction">
							</el-input>
						</el-form-item>
						<el-form-item label="相册：">
							<imgUpload @getLoading="getPhotoLoading" :maxlength="5" v-show="!yetPhotoImgList" :imageWidth="300" :imageHeight="300" ref="photoImgList" upImgArr='photoImgList' @getImgArr="getPhotoImgList"></imgUpload>
							<div class="loading" v-if="isPhotoImgLoading" v-loading="isPhotoImgLoading"></div>
							<div v-show="photoImgList.length>0" class="yetUploadImgList photoList" style="">
								<ul>
									<li :key="photo.imgId" v-for="photo in photoImgList">
										<img :src="photo.url" alt="" />
										<i class="delImg" @click="delPhotoImg(photo)"></i>
									</li>
								</ul>
							</div>
							<el-col :span="24" style="min-width: 768px; color:#B9BEBD ;padding-left:15px;">
								建议正方形图片
							</el-col>
						</el-form-item>
						<el-form-item label="是否允许登录：" prop="state">
							<el-radio-group v-model="params.state">
								<el-radio :label="1">允许</el-radio>
								<el-radio :label="0">不允许</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-col :span="24" style="height:50px;background: #F5F8F8;">
						</el-col>
						<!--TODO 下个版本使用-->
						<!--<el-col :span="24" class="staffadd_baseinfo first">
							<p style="padding: 20px 0;">薪资设置</p>
						</el-col>
						<el-col :span="24" class="pdt15">

						</el-col>

						<el-form-item label="固定底薪：" prop="salary">
							<el-select v-model="params.salary" placeholder="请选择">
								<el-option label="1" value="1200"></el-option>
								<el-option label="2" value="1300"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="销售提成：" prop="sall">
							<el-select v-model="params.sall" placeholder="请选择">
								<el-option label="1" value="1200"></el-option>
								<el-option label="2" value="1300"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="私教课酬：" prop="salaryForTrainer">
							<el-select v-model="params.salaryForTrainer" placeholder="请选择">
								<el-option label="1" value="1200"></el-option>
								<el-option label="2" value="1300"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="团课课酬：" prop="salaryForGroup">
							<el-select v-model="params.salaryForGroup" placeholder="请选择">
								<el-option label="1" value="1200"></el-option>
								<el-option label="2" value="1300"></el-option>
							</el-select>
						</el-form-item>-->
						<el-form-item style="text-align: center;">
							<el-button round type="primary" @click="submitForm('params')">保存</el-button>
							<el-button round @click="back()">返回列表</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<!--技能标签-->
			<el-dialog title="" :close-on-click-modal="false" :visible.sync="isDialog" width="50%">
				<el-row>
					<h5>已选择的标签</h5>
					<el-tag size="small" closable @close="delMyTag(tag)" :key="index" v-for="(tag,index) in params.skillTagList" style="margin-right: 15px;">{{tag.tagName}}</el-tag>
					<span v-if="params.skillTagList.length==0">暂无选择标签</span>
				</el-row>
				<!--已选择的标签-->
				<el-row style="border-bottom: 1px solid #eee; border-top: 1px solid #eee;padding: 20px 0 10px  0 ;margin-top:20px;margin-bottom: 20px;">
					<h5>所有的标签</h5>
					<el-tag size="small" :key="index" v-for="(tag,index) in tagList" style="margin-right: 15px;margin-top: 15px;">{{tag.tagName}} <span @click="addMyTag(tag)" style="padding: 0 15px; cursor: pointer;" class="el-icon-plus"></span><span @click="deleteTag(tag.tagId)" style="cursor: pointer;" class="el-icon-delete"></span></el-tag>
					<span v-if="tagList.length==0">暂无标签</span>
				</el-row>
				<el-row>
					<el-col :span="4">
						<el-input :maxlength="10" class="input-new-tag" v-if="newSkillTag" v-model="anNewSkillTag" ref="anNewSkillTag" size="small">
						</el-input>
						<el-button round v-else class="button-new-tag" size="small" @click="showSkillInput">+新标签</el-button>
					</el-col>
					<el-col :span="4">
						<el-button round v-if="newSkillTag" class="button-new-tag" size="small" type="primary" @click="savetag(anNewSkillTag)">确定</el-button>
					</el-col>
				</el-row>
				<el-row style="margin-top: 20px;">
					<el-button round class="button-new-tag" size="small" @click="isDialog=false">关闭</el-button>
				</el-row>
			</el-dialog>
		</section>
	</el-main>
</template>

<script>
	import { responeCode } from '@/config/config'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	import imgUpload from '@/components/upload/imgUpload.vue'
	export default {
		components: {
			imgUpload
		},
		// 组件的名称
		name: 'staffAdd',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			//当前是否为编辑状态
			isEdit: {
				type: Boolean,
				default: false
			},
			isCoach: {
				type: Boolean,
				default: false
			},
		},
		// 数据绑定
		data() {
			//校验导师是否存在
			var validatePhone = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号码'));
				} else if(!/^1\d{10}$/.test(value)) {
					callback(new Error('您输入的手机号有误!'));
				} else {
					callback();
				}
			};
			//校验身份证
			var validateIDCard = (rule, value, callback) => {
				if(!value) {
					callback();
					return;
				} else if(!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
					callback(new Error('您输入的身份证号有误!'));
				} else {
					callback();
				}
			};

			//校验导师是否存在
			var validateRoleIdList = (rule, value, callback) => {
				if(!value || value.length == 0) {
					callback(new Error('至少选择一个角色'));
				} else {
					callback();
				}
			};
			let validateSortNo = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入权重'));
				} else if(value <0 || value > 999 || value % 1 !== 0) {
					callback(new Error('请输入0-999的整数'));
				} else {
					callback();
				}
			};
			return {
				imageUrl: '',
				imgfile: {},
				isScaleOk: false,
				yetHeadImg: false,
				isHeadImgLoading: false,
				headImgArr: [{}],
				photoImgList: [],
				yetPhotoImgList: false,
				isPhotoImgLoading: false,
				//所有的标签技能-服务器初始化
				tagList: [],
				//专家类别
				expertList: [],
				//是否编辑技能标签				
				isDialog: false,
				//新标签内容
				anNewSkillTag: "",
				//当前技能标签
				roleListAll: [],
				//是否新增技能标签
				newSkillTag: false,
				//猫号是否有效
				isTrueMallId: false,
				lifeHouseList: [],
				roleList: [],
				dialogVisible: false,
				dialogImageUrl: [],
				max18: 18,
				max500: 500,
				imageList: [],
				//当前选择的角色是否含有导师
				isHasTrainer: false,
				params: {
					id: null,
					mallId: null,
					name: null,
					sex: 1,
					mobile: null,
					lifeId: '',
					roleIdList: [],
					subsidy: false,
					workType: 1,
					idCard: null,
					sortNo: null,
					introduction: null,
					photoImgs: [],
					//修改时的初始化参数
					skillTagList: [],
					//保存时的参数
					skillTagIds: [],
					state: 1,
					expertId: '',
				},
				rules: {
					mallId: [{
							required: true,
							message: '请输入猫号',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到20 个字符',
							trigger: 'blur'
						}
					],
					name: [{
						required: true,
						message: '请输入用户名',
						trigger: 'change'
					}],
					sex: [{
						type: 'number',
						required: true,
						message: '选择性别',
						trigger: 'change'
					}],
					lifeId: [{
						required: true,
						message: '请选择所属生活馆',
						trigger: 'change'
					}],
					sortNo: [{
						required: true,
						validator: validateSortNo,
						trigger: 'blur'
					}],
					state: [{
						type: "number",
						required: true,
						message: '请选择是否允许登录',
						trigger: 'change'
					}],
					subsidy: [{
						type: "boolean",
					}],

					roleIdList: [{
						type: "array",
						required: true,
						validator: validateRoleIdList,
						trigger: 'change'
					}],
					idCard: [{
						required: false,
						validator: validateIDCard,
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			let self = this;
			self.checkPermission = window.checkPermission;
			self.getExpertList();
		},
		mounted() {
			let self = this;
			//如果是编辑的话则获取到当前的员工信息
			if(self.$route.params.id) {
				let config = {
					url: self.isCoach ? api.coachDetail : api.employeeDetail,
					param: {
						employeeId: self.$route.params.id
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						for(let key in res.data) {
							self.params[key] = res.data[key];
						}
						self.params.sortNo = '' + self.params.sortNo;
						if(!self.params.roleIdList) {
							self.params.roleIdList = [];
						}
						if(!self.params.photoImgDetails) {
							self.params.photoImgs = [];
						}
						if(self.params.headImageId) {
							self.headImgArr[0].imgId = self.params.headImageId;
							self.headImgArr[0].url = self.params.headImageUrl;
							let headImgInit = [{
								imgId: self.params.headImageId,
								url: self.params.headImageUrl
							}]
							self.yetHeadImg = true;
							//初始化头像图片上传数组
							self.$refs["headImg"].init(headImgInit);
						}
						for(let i = 0; i < res.data.photoImgDetails.length; i++) {
							var obj = {
								imgId: res.data.photoImgDetails[i].imgId,
								url: res.data.photoImgDetails[i].url
							}
							self.params.photoImgs.push(res.data.photoImgDetails[i].photoImgId)
							self.photoImgList.push(obj);
						}
						//初始化照片图片上传数组 						
						self.$refs["photoImgList"].init(self.photoImgList);
						self.roleList = res.data.roleList;
						self.roleList.forEach((item) => {
							if(item.haveRole) {
								self.params.roleIdList.push(item.roleId);
							}
						})
						//验证当前是否有导师身份
						res.data.roleList.forEach((item) => {
							if(item.roleName == "导师") {
								
								self.trainerId = item.roleId
								self.isHasTrainer = item.haveRole?true:false																								
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
			//获取生活馆列表
			let configOfLife = {
				url: api.getLifeNameList,
				param: {}
			}
			restful.sendMyData(configOfLife, self, function(res) {
				if(res.code == 2000) {
					self.lifeHouseList = res.data;
				} else {
					self.$message.error(res.msg);
					self.$router.push({
						path: self.isCoach ? '/trainerList' : '/staffList'
					})
				}
			});

		},
		methods: {
			//获取专家类别
			getExpertList() {
				let self = this;
				let configOfLife = {
					url: api.expertList,
					param: {}
				}
				restful.sendMyData(configOfLife, self, function(res) {
					if(res.code == 2000) {
						self.expertList = res.data;

					} else {
						self.expertList = [];
					}
				});
			},
			/**
			 * 当前所选角色是否含有导师
			 * @roleList {Array} 当前选择的角色列表
			 */
			hasTrainer(roleList) {
				
				let self = this;
				let isCheckTrainer = false
				self.isHasTrainer = false;
				roleList.forEach((item) => {
					if(self.trainerId == item) {
						self.isHasTrainer = true						
						isCheckTrainer = true
					}
				})
				self.params.subsidy = isCheckTrainer?true:false
			},
			/**
			 * 生活馆发生变化时初始化猫号信息
			 * @lifeId {String} 当前选择的角色列表
			 */
			initMallId(lifeId) {
				var self = this;
				self.isTrueMallId = false;
				self.params.mallId = null;
				self.params.mobile = null;
				self.params.honor = null;
				//若为新增时切换生活馆则重置
				if(!self.isEdit) {
					self.params.skillTagList = [];
				}
				self.getRoleList(lifeId)

			},
			/**
			 * 生活馆发生变化时初始化猫号信息
			 * @mallId {String} 猫号Id
			 */
			getInfo(mallId) {
				var self = this;
				if(mallId) {
					//获取生活馆列表
					let config = {
						url: api.getSsoUser,
						param: {
							mallIdOrPhone: mallId
						}
					}
					restful.sendMyData(config, self, function(res) {
						if(res.code == 2000) {
							self.params.mallId = res.data.mallId;
							self.params.mobile = res.data.mobile;
							self.params.honor = res.data.honor;
							self.params.name = res.data.mallName;
							self.isTrueMallId = true;
						} else {
							self.$message.error(res.msg);
							self.isTrueMallId = false;
							self.params.mobile = null;
							self.params.honor = null;
							self.params.name = null;
						}
					});
				}
			},
			/**
			 * 根据生活馆id获取角色列表
			 * @lifeId {String} 场馆Id
			 */
			getRoleList(lifeId) {
				let self = this;
				if(!lifeId) {
					return;
				}
				//获取生活馆列表
				let config = {
					url: api.roleList,
					param: {
						lifeId: lifeId,
						origin: self.isCoach ? 1 : 0
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.roleList = res.data
						self.params.roleIdList = []
						//处理导师和教练新增
						res.data.forEach((item) => {
							if(item.roleName == "导师") {
								self.trainerId = item.roleId;
							}

						})
					} else {
						self.roleList = []
					}
				});

			},
			/**
			 * 获取当前图片上传列表
			 * @val {Array} 图片列表
			 */
			getHeadImgArr(val) {
				this.headImgArr = val;
				this.yetHeadImg = true;
			},
			/**
			 * 获取当前图片上传列表
			 * @val {Array} 图片列表
			 */
			getPhotoImgList(val) {
				var self = this;
				self.photoImgList = val;
				console.log(self.photoImgList)
			},
			/**
			 * 删除当前视频封面
			 * @childImg {Object} 图片列表
			 */
			delImg(childImg) {
				var self = this;

				let isDelOk = this.$refs["headImg"].imgUploadDel(childImg);
				if(isDelOk) {
					self.yetHeadImg = false;
					//防止删除后图片找不到地址报错
					self.headImgArr = [{}]
				} else {
					self.$message.error("图片删除失败");
				}
			},
			/**
			 * 删除当前视频封面
			 * @childImg {Object} 图片列表
			 */
			delPhotoImg(childImg) {
				let self = this
				//删除图片 - 确保上传的组件对象和要删除的对象存储相同
				let isDelOk = self.$refs["photoImgList"].imgUploadDel(childImg);
				if(!isDelOk) {
					self.$message.error("图片删除失败");
				}

			},
			/**
			 * 是否正在上传图片
			 * @bool {Boolean} 是否正在上传
			 */
			getLoading(bool) {
				this.isHeadImgLoading = bool;
			},
			/**
			 * 相册相片是否正在上传
			 * @bool {Boolean} 是否正在上传
			 */
			getPhotoLoading(bool) {
				this.isPhotoImgLoading = bool;
			},
			/**
			 * 保存信息
			 * @formName {String} 表单名称
			 */
			submitForm(formName) {
				var self = this;
				self.$refs[formName].validate((valid) => {
					if(valid) {
						if(!self.isTrueMallId && !self.isEdit) {
							self.$message.error("您输入的猫号不是有效的");
							return;
						}
						if(self.headImgArr[0].imgId) {
							self.params.headImageId = self.headImgArr[0].imgId;
						}
						self.params.photoImgs = [];
						for(let i = 0; i < self.photoImgList.length; i++) {
							self.params.photoImgs.push(self.photoImgList[i].imgId)
						}
						self.params.skillTagIds = [];
						if(self.params.skillTagList && self.params.skillTagList.length) {
							for(let i = 0; i < self.params.skillTagList.length; i++) {
								self.params.skillTagIds.push(self.params.skillTagList[i].tagId);
							}

						}
						self.params.sortNo = Number(self.params.sortNo);
						let config = {
							url: self.isCoach ? api.saveCoach : api.saveEmployee,
							param: self.params
						}
						self.params.introduction = self.params.introduction?self.params.introduction.trim():null
						restful.sendMyData(config, self, function(res) {
							if(res.code == 2000) {
								self.$message.success("保存成功");
								self.$router.push({
									path: self.isCoach ? '/trainerList' : '/staffList'
								})
							} else {
								self.$message.error(res.msg);
								self.params.sortNo = '' + self.params.sortNo;
							}
						});
					} else {
						self.$message({
							message: '未填写完整或填写内容不符合要求，请检查',
							type: 'error',
							duration: 1000
						});
					}
				})
			},
			/**
			 * 重置填写数据
			 * @formName {String} 表单名称
			 */
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//返回列表页
			back() {
				this.$router.push({
					path: this.isCoach ? '/trainerList' : '/staffList'
				})
			},
			//标签相关
			openDialog() {
				this.isDialog = true;
				this.getTagList();
			},
			/**
			 * 添加到我的标签
			 * @tag {Object} 当前的标签对象
			 */
			addMyTag(tag) {
				let isCanAddTag = true
				if(this.params.skillTagList.length > 2) {
					this.$message.error("最多添加3个标签")
					return
				}
				this.params.skillTagList.forEach((item) => {
					if(item.tagId == tag.tagId) {
						isCanAddTag = false
					}
				})
				if(!isCanAddTag) {
					this.$message.error("已经添加过此标签")
				} else {
					this.params.skillTagList.push(tag)
				}
			},
			//从我的标签移除			
			delMyTag(tag) {
				this.params.skillTagList.splice(tag, 1);
			},
			//增加新标签
			showSkillInput() {
				this.newSkillTag = true;
			},

			/**
			 * 新增标签
			 * @tag {Object} 当前的标签对象
			 */
			savetag(tagName) {
				let self = this;
				if(!tagName) {
					return;
					self.$message.error("标签名不能为空");
				}
				//获取生活馆列表
				let config = {
					url: api.addTag,
					param: {
						lifeId: self.params.lifeId,
						tagName: tagName
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.getTagList();
						self.newSkillTag = false;
						self.anNewSkillTag = "";
					} else {
						self.$message.error(res.msg);
					}
				});
			},
			/**
			 * 获取标签列表
			 */
			getTagList() {
				let self = this;
				let config = {
					url: api.tagList,
					param: {
						lifeId: self.params.lifeId
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.tagList = res.data;
					} else {
						self.tagList = [];
					}
				});
			},
			/**
			 * 删除标签
			 * @tagId {String} 标签Id
			 */
			deleteTag(tagId) {
				let self = this;
				let isCanDelTag = true
				self.params.skillTagList.forEach((item) => {
					if(item.tagId == tagId) {
						isCanDelTag = false
					}
				})
				if(!isCanDelTag) {
					self.$message.error("此标签已经添加到导师标签中，无法删除！");
					return;
				}
				self.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let config = {
						url: api.deleteTag,
						param: {
							skillTagId: tagId
						}
					}
					restful.sendMyData(config, self, function(res) {
						if(res.code == 2000) {
							self.$message.success("删除成功");
							self.getTagList();
						} else {
							self.$message.error(res.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
		}
	}
</script>

<style scoped>
	/*内容部分*/
	
	.staffadd_main {
		padding: 0px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	
	.staffadd_baseinfo {
		padding-left: 20px;
	}
	
	.staffadd_baseinfo.first {
		border-bottom: 1px solid #ccc;
	}
	/*头像上传*/
	
	.yetUploadImgList {
		position: relative;
		width: 100%;
		height: 120px;
	}
	
	.yetUploadImgList ul {
		width: 100%;
		height: 120px;
	}
	
	.yetUploadImgList li {
		float: left;
		height: 120px;
		width: 120px;
		position: relative;
	}
	
	.yetUploadImgList li:not(:first-child) {
		margin-left: 20px;
	}
	
	.yetUploadImgList li img {
		height: 120px;
		width: 120px;
		border-radius: 5px;
	}
	
	.yetUploadImgList i.delImg {
		display: block;
		width: 24px;
		height: 24px;
		position: absolute;
		right: 0;
		top: 0;
		background: url('../../assets/images/icon_closeimg.png');
	}
	
	.loading {
		top: 30px;
		left: 150px;
		position: absolute;
	}
	
	.staffadd_baseinfo_label {
		text-align: right;
		line-height: 50px;
		padding-right: 20px;
		min-width: 150px!important;
	}
	
	.staffadd_baseinfo_label .required {
		color: #f00;
		line-height: 50px;
	}
	
	.pdt15 {
		padding-top: 15px;
	}
</style>