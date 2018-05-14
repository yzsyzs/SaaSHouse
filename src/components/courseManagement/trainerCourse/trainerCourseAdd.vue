<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--新增私教课-->
<template>
	<el-main>
		<section class="trainerCourseAdd_main" v-if="checkPermission('api/manage/course/addOrEditCourse')">
			<el-row>
				<el-row>
					<el-form :model="params" ref="params" label-width="150px" class="demo-params">
						<el-col :span="24" class="minWidth1024">
							<el-col :span="8" :offset="1">
								<el-form-item label="课程名称：" prop="courseName" :rules="rules.courseName">
									<el-input class="w300" :maxlength="10" v-model="params.courseName"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :offset="5">
								<el-form-item label="排序权重：" prop="sortNo" :rules="rules.sortNo">
									<el-input class="w300" type="number" v-model="params.sortNo"></el-input>
								</el-form-item>
							</el-col>
						</el-col>
						<el-col :span="24" class="minWidth1024">
							<el-col :span="8" :offset="1" class="minWidth300">
								<el-form-item label="课程列表图片：">
									<imgUpload @getLoading="getLoading" v-show="!yetHeadImg" :imageWidth="1036" :imageHeight="518" ref="headImg" upImgArr='headImg' @getImgArr="getHeadImgArr"></imgUpload>
									<div class="loading" v-if="isHeadImgLoading" v-loading="isHeadImgLoading"></div>
									<div v-show="yetHeadImg" class="yetUploadImgList" style="width: 202px;height: 120px;overflow: hidden;">
										<img :src="headImgArr[0].url" alt="" style="border-radius:2px;width: 202px;height: 120px;" />
										<i class="delImg" @click="delImg(headImgArr[0])"></i>
									</div>
									<el-col :span="24" style="min-width: 768px; color:#B9BEBD ;">
										图片尺寸1036*518，大小不超过1M（只能上传一张）
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :span="8" :offset="5">
								<el-form-item label="达到效果：" prop="expectedEffect" :rules="rules.expectedEffect">
									<el-input :autosize="true" :maxlength="50" type="textarea" class="w300" v-model="params.expectedEffect"></el-input>
								</el-form-item>
							</el-col>
						</el-col>
						<el-col :span="24" class="minWidth1024">
							<el-col :span="22" :offset="1" class="minWidth300">
								<el-form-item label="课程详情图片：">
									<!--上传成功的图片集合-->
									<imgUpload :size="2" @getLoading="getPhotoLoading" :maxlength="10" v-show="!yetPhotoImgList" :imageWidth="1124" :imageHeight="843" ref="photoImgList" upImgArr='photoImgList' @getImgArr="getPhotoImgList"></imgUpload>
									<div class="loading" v-if="isPhotoImgLoading" v-loading="isPhotoImgLoading"></div>
									<el-col :span="24" style="min-width: 768px; color:#B9BEBD ;">
										图片尺寸1124*843，大小不超过2M（最多上传10张）
									</el-col>
									<div v-show="photoImgList.length>0" class="yetUploadImgList photoList" style="">
										<ul>
											<li :key="photo.imgId" v-for="photo in photoImgList">
												<img :src="photo.url" alt="" />
												<i class="delImg" @click="delPhotoImg(photo)"></i>
											</li>
										</ul>
									</div>

								</el-form-item>
							</el-col>
						</el-col>
						<el-col :span="24" class="minWidth1024">
							<el-col :span="8" :offset="1" v-if="!isGroup">
								<el-form-item label="授课教练：" prop="coachId" :rules="rules.coachId">
									<el-select class="w300" v-model="params.coachId" placeholder="请选择">
										<el-option v-for="(item,index) in coachList" :key="index" :label="item.coachName" :value="item.coachId">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8" :offset="1" v-if="isGroup">
								<el-form-item label="课程时长：" prop="duration" :rules="rules.duration">
									<el-input class="w300" type="number" v-model="params.duration"></el-input>
									分钟
								</el-form-item>
							</el-col>
							<el-col :span="8" :offset="5" v-if="!isGroup">
								<el-form-item label="课程时长：" prop="duration" :rules="rules.duration">
									<el-input class="w300" step="1" min="1" max="9999" type="number" v-model="params.duration"></el-input>
									分钟
								</el-form-item>
							</el-col>
						</el-col>
						<el-col :span="24" class="minWidth1024">
							<el-col :span="8" :offset="1">
								<el-form-item label="课程说明：" prop="description" :rules="rules.description">
									<el-input :autosize="true" v-model="params.description" type="textarea" :maxlength="150" class="w300"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :offset="5" v-if="isGroup">
								<el-form-item label="最大预约人数：" prop="maxCount" :rules="rules.maxCount">
									<el-input class="w300" type="number" v-model="params.maxCount"></el-input>
								</el-form-item>
							</el-col>
							
							<el-col :span="8" :offset="5" v-if="!isGroup&&(lifeType==0||lifeType==1)">
								<el-form-item label="课程类别：" prop="courseType" :rules="rules.courseType">
									<el-select class="w300" v-model="params.courseType" placeholder="请选择">
										<el-option v-for="item in courseTypeArr" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-col>
						<el-col :span="24" class="minWidth1024" v-if="isGroup&&(lifeType==0||lifeType==1)">
							<el-col :span="8" :offset="1">
								<el-form-item label="课程类别：" prop="courseType" :rules="rules.courseType">
									<el-select class="w300" v-model="params.courseType" placeholder="请选择">
										<el-option v-for="item in courseTypeArr" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-col>

						<el-col :span="24" style="background: #F5F8F8;" v-if="!isGroup">
							<p style="line-height: 50px; padding-left: 15px;">课程价格和有效期<span class="danger">(建议不要设置超过5种课时)</span></p>
						</el-col>

						<el-col :span="24" class="pdt15 minWidth1024" v-if="!isGroup">
							<el-col :span="6" class="bdr minWidth300 minHeight490 pdb15 mgt15" :key="index" v-for="(item,index) in params.coursePackage">
								<el-form :model="item" :rules="rulesCoursePakeges" label-width="150px" class="demo-params">
									<el-form-item label="课时数：" prop="courseCount">
										<el-input type="number"  class="w180" v-model="item.courseCount"></el-input> 节
									</el-form-item>
									<el-form-item label="原价：" prop="originalPrice">
										<el-input type="number" class="w180" v-model="item.originalPrice"></el-input> 元
									</el-form-item>
									<el-form-item label="有效期：" prop="expireTime">
										<el-input type="number" class="w180" v-model="item.expireTime"></el-input> 天
									</el-form-item>
									<el-form-item label="活动设置：" prop="isActivity">
										<el-switch v-model="item.isActivity" @change="item.activityAddCount=null;item.activityPrice=null"></el-switch>
									</el-form-item>
									<el-form-item label="活动价：" v-if="item.isActivity" prop="activityPrice">
										<el-input type="number" class="w180" v-model="item.activityPrice"></el-input> 元
									</el-form-item>
									<el-form-item label="加赠课时数：" v-if="item.isActivity" prop="activityAddCount">
										<el-input type="number" class="w180" v-model="item.activityAddCount"></el-input> 节
									</el-form-item>
									<el-col :span="12">
										<el-form-item label="特权服务：" prop="isPresentVip">
											<el-switch v-model="item.isPresentVip"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="是否推荐：" prop="isRecommend">
											<el-switch v-model="item.isRecommend"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :span="24" class="text-center">
										<el-button type="danger" round @click="delCoursePakege(params.coursePackage,index)">删除该课时</el-button>
									</el-col>
								</el-form>
							</el-col>
							<el-col :span="6" class="minWidth300" style="min-height: 350px;">
								<div class="addCoursePakege" @click="addCoursePakege(params.coursePackage)">
									<i>+</i>
									<br /> 添加更多课时
								</div>
							</el-col>

						</el-col>
						<el-col :span="24" style="background: #F5F8F8;padding: 20px 20px;">
							<el-button type="default" round @click="handleCencel">取消</el-button>
							<el-button type="primary" round @click="submitForm('params')">确定</el-button>
						</el-col>
					</el-form>
				</el-row>
			</el-row>
			
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
		name: 'trainerCourseAdd',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			jumpRoute: {
				type: Object,
				default: () => {
					return {}
				}
			},
			isGroup: {
				type: Boolean,
				default: false
			},
			isEdit: {
				type: Boolean,
				default: false
			}
		},
		// 数据绑定
		data() {
			//校验导师是否存在
			var validateDuration = (rule, value, callback) => {

				if(value === '') {
					callback(new Error('请输入课程时长'));
				} else if(value < 1 || value > 9999 || value % 1 !== 0) {
					callback(new Error('请输入1-9999的整数'));
				} else {
					callback();
				}
			};
			//校验最大预约人数
			var validateMaxCount = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入最大预约人数'));
				} else if(value < 1 || value > 9999 || value % 1 !== 0) {
					callback(new Error('请输入1-9999的整数'));
				} else {
					callback();
				}
			};
			//校验课时数
			var validateCourseCount = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入课时数'));
				} else if(value < 1 || value > 9999 || value % 1 !== 0) {
					callback(new Error('请输入1-9999的整数'));
				} else {
					callback();
				}
			};
			//校验加赠课时数
			var validateAddCourseCount = (rule, value, callback) => {
				if(value < 1 || value > 9999 || value % 1 !== 0) {
					callback(new Error('请输入1-9999的整数'));
				} else {
					callback();
				}
			};
			//校验有效期
			var validateExpiretime = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入有效期'));
				} else if(value < 1 || value > 999 || value % 1 !== 0) {
					callback(new Error('请输入1-999的整数'));
				} else {
					callback();
				}
			};
			//校验权重
			var validateSortNo = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入权重'));
				} else if(value < 0 || value > 999 || value % 1 !== 0) {
					callback(new Error('请输入0-999的整数'));
				} else {
					callback();
				}
			};

			//校验原价
			var validatePrice = (rule, value, callback) => {
				if(typeof value == "undefined" || value == "") {
					callback(new Error('请输入原价'));
				} else if(value < 0 || value > 9999) {
					callback(new Error('请输入0-9999之间的价格'));
				} else if(!/^\d+(?:\.\d{1,2})?$/.test(value)) {
					callback(new Error('最多两个小数'));
				} else {
					callback();
				}
			};
			//校验活动价格
			var validateActivePrice = (rule, value, callback) => {
				if(!value) {
					callback();
				} else if(value < 0 || value > 999) {
					callback(new Error('请输入0-9999之间的价格'));
				} else if(!/^\d+(?:\.\d{1,2})?$/.test(value)) {
					callback(new Error('只能输入两位小数'));
				} else {
					callback();
				}
			};
			return {
				//生活馆类别
				lifeType:null,
				//课程类别
				courseTypeArr: [{
						id: "0",
						name: "瑜伽"
					},
					{
						id: "1",
						name: "塑形"
					},
					{
						id: "2",
						name: "燃脂"
					},
				],
				coachList: [],
				imageUrl: '',
				isScaleOk: false,
				yetHeadImg: false,
				isHeadImgLoading: false,
				headImgArr: [{}],
				photoImgList: [],
				
				yetPhotoImgList: false,
				isPhotoImgLoading: false,
				params: {
					photoImgs:[],
					courseName: null,
					coursePackage: [{
						isPresentVip: true,
						courseCount: null,
						activityPrice:null,
						isRecommend:false,
						isActivity:false,
					}],
					courseImgList: [],
					sortNo: null,
					duration: null,
					description: null,
				},
				dialogVisible: false,
				dialogImageUrl: [],
				//已经删除的数组
				deleCourseArr:[],
				//记录原来的课程包信息做对比处理
				oldCoursePackage:[],
				rules: {
					//课程名称
					courseName: [{
							required: true,
							message: '请输入课程名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					//权重
					sortNo: [{
						required: true,
						validator: validateSortNo,
						trigger: 'blur'
					}],
					//达到效果
					expectedEffect: [{
						required: true,
						message: '请输入达到效果',
						trigger: 'blur'
					}],
					//教练Id
					coachId: [{
						required: true,
						message: '请选择授课教练',
						trigger: 'change'
					}],
					//课程说明
					duration: [{
						required: true,
						validator: validateDuration,
						trigger: 'blur'
					}],
					//最大预约人数
					maxCount: [{
						required: true,
						validator: validateMaxCount,
						trigger: 'blur'
					}],
					//课程说明
					description: [{
						required: true,
						message: '请输入课程说明',
						trigger: 'blur'
					}],
					//课程类别
					courseType: [{
						required: true,
						message: '请选择课程类别',
						trigger: 'change'
					}],
					//课时
					courseCount: [{
						required: true,
						validator: validateCourseCount,
						trigger: 'blur'
					}],
					//原价
					originalPrice: [{
						type: 'string',
						required: true,
						validator: validatePrice,
						trigger: 'blur'
					}],
					//有效期
					expireTime: [{
						required: true,
						validator: validateExpiretime,
						trigger: 'blur'
					}],
					//活动价
					activityPrice: [{
						validator: validateActivePrice,
						trigger: 'blur'
					}],
					//加赠课时
					activityAddCount: [{
						validator: validateAddCourseCount,
						trigger: 'blur'
					}],
				},
				rulesCoursePakeges: {
					//课时
					courseCount: [{
						required: true,
						validator: validateCourseCount,
						trigger: 'blur'
					}],
					//原价
					originalPrice: [{
						type: 'string',
						required: true,
						validator: validatePrice,
						trigger: 'blur'
					}],
					//有效期
					expireTime: [{
						required: true,
						validator: validateExpiretime,
						trigger: 'blur'
					}],
					//活动价
					activityPrice: [{
						validator: validateActivePrice,
						trigger: 'blur'
					}],
					//加赠课时
					activityAddCount: [{
						validator: validateAddCourseCount,
						trigger: 'blur'
					}],
				}
			};
		},
		created() {
			let self = this;
			//加载权限验证函数
			self.checkPermission = window.checkPermission;
			if(!self.isEdit&&self.$route.query&&self.$route.query.type){
				self.lifeType = self.$route.query.type;				
			}
			if(!self.isGroup&&!self.isEdit) {
				self.getCoachList(self.$route.query.lifeId);
			}
		},
		mounted() {
			let self = this;
			//如果是编辑的话则获取到当前的员工信息
			console.log(self.$route.query);
			if(self.$route.params.id) {
				self.getCourseInfo();
			}
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
				} else {
					self.$message.error(res.msg);
					self.$router.push({
						path: self.isGroup?'/groupCourseList':'/trainerCourseList'
					})
				}
			});
		},
		methods: {
			//获取教练列表
			getCoachList(lifeId){
				let self = this;
				let config = {
					okMsg: "保存成功",
					isNeedOkMsg: false,
					url: api.findCoachByLife,
					param: {
						ifCoachUsable:true,
						lifeId:lifeId
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
						self.$message.error(res.msg);
						self.$router.push({
							path: self.isGroup?'/groupCourseList':'/trainerCourseList'
						})
					}
				});
			},
			//编辑时获取当前的课程信息
			getCourseInfo(){
				let self = this;
				let config = {
					url: self.isGroup?api.getGroupCourseDetail:api.getCourseDetail,
					param: {
						courseId: self.$route.params.id
					}
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体   
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数 
				 */
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						for(let key in res.data) {
							self.params[key] = res.data[key];
						}
						self.lifeType = res.data.houseType;
						self.params.sortNo = '' + self.params.sortNo;
						if(!self.params.imageDetail) {
							self.params.photoImgs = [];
						}
						if(self.params.imgListId) {
							self.headImgArr[0].imgId = self.params.imgListId;
							self.headImgArr[0].url = self.params.imgListUrl;
							let headImgInit = [{
								imgId: self.params.headImageId,
								url: self.params.headImageUrl
							}]
							self.yetHeadImg = true;
							//初始化头像图片上传数组
							self.$refs["headImg"].init(headImgInit);
						}

						for(let i = 0; i < res.data.imageDetail.length; i++) {
							var obj = {
								imgId: res.data.imageDetail[i].imgDetailId,
								url: res.data.imageDetail[i].imgDetailUrl
							}
							self.params.photoImgs.push(res.data.imageDetail[i].imgDetailId)
							self.photoImgList.push(obj);
						}
						//初始化照片图片上传数组 						
						self.$refs["photoImgList"].init(self.photoImgList);
						self.getCoachList(self.params.lifeId);
					} else {
						self.$message.error(res.msg);
						self.$router.push({
							path:self.isGroup?'/groupCourseList':'/trainerCourseList'
						})
					}
				});
			},
			//取消按钮
			handleCencel() {
				let self = this;
				this.$router.push({
					path: self.isGroup ? '/groupCourseList' : '/trainerCourseList'
				})
			},
			/**
			 * 增加课时
			 * @parent  {Object} 被删除的课程包  
			 * @index  {int} 需要删除的小标 
			 */
			addCoursePakege(parent) {
				var newCourse = {
						isPresentVip: true,
						courseCount: null,
						activityPrice:null,
						isRecommend:false,
						isActivity:false,
					}
				parent.push(newCourse)
			},
			/**
			 * 删除课时
			 * @parent  {Object} 被删除的课程包  
			 * @index  {int} 需要删除的小标 
			 */
			delCoursePakege(parent, index) {
				let self = this;
				console.log(index)
				//判断当前的课时数是否大于1 小于1不可删除
				if(parent.length > 1) {
					//保留删除对象到新数组同时删除原数组--若有coursePackageId值的话则为修改原有的字段没有的则为本次新增还没保存的数据			
					if(parent[index].coursePackageId){
						parent[index].isDelete = 1;
						self.deleCourseArr.push(parent[index]);			
						parent.splice(index, 1)
					}else{
						parent.splice(index,1);
					}
					
				} else {
					this.$message({
						type: 'error',
						message: '至少保留一个课时'
					});
				}
				console.log(self.deleCourseArr);
			},
			//重置
			onReset() {},
			//返回
			onBack() {
				this.$router.push({
					path: self.isGroup ? '/groupCourseList' : '/trainerCourseList'
				})
			},
			//获取当前课程列表图片上传列表
			getHeadImgArr(val) {
				this.headImgArr = val;
				this.yetHeadImg = true;
			},
			//获取当前课程详情图片上传列表
			getPhotoImgList(val) {
				var self = this;
				self.photoImgList = val;
				console.log(self.photoImgList)
			},
			//课程列表图片删除
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
			//课程详情
			delPhotoImg(childImg) {
				let self = this
				let isDelOk = self.$refs["photoImgList"].imgUploadDel(childImg);
				if(!isDelOk) {
					self.$message.error("图片删除失败");
				}
			},
			//是否正在上传图片
			getLoading(bool) {
				this.isHeadImgLoading = bool;
			},
			//相册相片是否正在上传
			getPhotoLoading(bool) {
				this.isPhotoImgLoading = bool;
			},
			//保存信息
			submitForm(formName) {
				var self = this;
				console.log(self.params);
				console.log(self.$refs["coursePacges"]);
				self.$refs[formName].validate((valid) => {
					if(valid) {
						//检验所有的课时信息
						if(!self.isGroup) {
							let checkAllCourse = true;
							let checkActive = true;
							for(let i = 0; i < self.params.coursePackage.length; i++) {
								if(!self.checkCoursePakeges(self.params.coursePackage[i])) {
									checkAllCourse = false;
								}
							}
							if(!checkAllCourse) {
								self.$message.error("必须同时填写正确的课时数，原价，和有效期");
								return;
							}
							for(let i = 0; i < self.params.coursePackage.length; i++) {
								if(self.params.coursePackage[i].isActivity) {
									if(!self.checkActive(self.params.coursePackage[i])) {
										checkActive = false;
									}
								}
							}
							if(!checkActive) {
								self.$message.error("活动开启后至少要设置一个活动价或者加赠课时数");
								return;
							}
							self.deleCourseArr.forEach((item)=>{
								console.log(item)
								self.params.coursePackage.push(item);
							})
						}
						if(self.headImgArr.length === 0) {
							self.$message.error("请上传课程列表图片");
							return;
						}
						if(self.photoImgList.length === 0) {
							self.$message.error("请上传课程详情图片");
							return;
						}

						//处理课程列表图片
						self.params.imgListId = self.headImgArr[0].imgId;
						self.params.imgListUrl  = self.headImgArr[0].url;
						//新增时使用传递过来的参数
						if(!self.isEdit){
							self.params.lifeId = self.$route.query.lifeId;
						}						
						self.params.imageDetail = [];
						for(let i = 0; i < self.photoImgList.length; i++) {
							let obj = {
								imgDetailId: self.photoImgList[i].imgId,
								imgDetailUrl: self.photoImgList[i].url
							}
							self.params.imageDetail.push(obj)
						}
						//提交时改变权重为number避免重复校验
						self.params.sortNo = Number(self.params.sortNo);
						self.params.expectedEffect =self.params.expectedEffect?self.params.expectedEffect.trim():null
						let config = {
							okMsg: "保存成功",
							isNeedOkMsg: false,
							url: self.isGroup ? api.addOrEditGroupCourse : api.addOrEditCourse,
							param: self.params
						}
						restful.sendMyData(config, self, function(res) {
							if(res.code == 2000) {
								self.$message.success("保存成功");
								self.$router.push({
									path: self.isGroup?'/groupCourseList':'/trainerCourseList'
								})
							} else {
								//失败重置权重为字符串避免重复校验
								self.params.sortNo = '' + self.params.sortNo;
								self.$message.error(res.msg);
							}
						});
					} else {
						self.$message.error("未填写完整或填写内容不符合要求，请检查");
						return false;
					}
				});
			},
			//验证课时原价有效期等必填字段是否已经填写
			checkCoursePakeges(course) {
				//校验课时数
				let courseCount = (value) => {
					if(typeof value == "undefined" || value < 1 || value > 9999 || value % 1 !== 0) {
						return false;
					}
					return true;
				};
				//校验有效期
				let expireTime = (value) => {
					if(typeof value == "undefined" || value === '' || (value < 1 || value > 999) || value % 1 !== 0) {
						return false;
					}
					return true;
				};
				//校验原价
				var originalPrice = (value) => {
					if((typeof value == "undefined" || value == "") || (value < 0 || value > 9999) || !/^\d+(?:\.\d{1,2})?$/.test(value)) {
						return false;
					}
					return true;
				};
				return courseCount(course.courseCount) && expireTime(course.expireTime) && originalPrice(course.originalPrice);
			},
			//验证开启活动时必须设置活动价或者加赠课时其中一项
			checkActive(course) {
				//校验加赠课时数
				let courseCount = (value) => {
					if(typeof value == "undefined" || value < 1 || value > 99 || value % 1 !== 0) {
						return false;
					}
					return true;
				};
				//校验活动价
				var originalPrice = (value) => {
					if((typeof value == "undefined" || value == "") || (value < 0 || value > 9999) || !/^\d+(?:\.\d{1,2})?$/.test(value)) {
						return false;
					}
					return true;
				};
				return courseCount(course.activityAddCount) || originalPrice(course.activityPrice);
			},
			//重置填写数据
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		}
	}
</script>

<style scoped>
	/*课程详情图片集合*/
	
	.courseImgs {
		width: 160px;
		height: 120px;
		position: relative;
	}
	
	.courseImgs img {
		width: 160px;
		height: 120px;
	}
	
	.courseImgs i.delImg {
		width: 24px;
		height: 24px;
		position: absolute;
		right: 0;
		top: 0;
		background: url(../../../images/icon_closeimg.png);
		cursor: pointer;
	}
	
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
	
	.w180 {
		width: 180px;
	}
	
	.w100 {
		width: 100px;
	}
	
	.trainerCourseAdd_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	
	.mgt15 {
		margin-top: 15px;
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
	
	.bdr {
		border-right: 1px dashed #ccc;
	}
	
	.minWidth1024 {
		min-width: 1024px!important;
	}
	
	.minWidth300 {
		min-width: 400px!important;
	}
	.minHeight490{
		min-height: 490px;
	}
	.text-center {
		text-align: center;
	}
	/*增加课时*/
	
	.addCoursePakege {
		height: 150px;
		width: 150px;
		text-align: center;
		background: #F5F8F8;
		margin-left: 100px;
		margin-top: 100px;
		cursor: pointer;
		color: #5a5e66;
	}
	
	.addCoursePakege i {
		line-height: 100px;
		font-size: 50px;
	}
	/*上传图片相关*/
	
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		background: #ccc;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 208px;
		height: 104px;
		line-height: 104px;
		text-align: center;
		background: #F5F8F8;
	}
	
	.avatar-uploader-icon1 {
		font-size: 28px;
		color: #8c939d;
		width: 62px;
		height: 62px;
		line-height: 62px;
		text-align: center;
		background: #F5F8F8;
	}
	
	.avatar {
		width: 208px;
		height: 104px;
		display: block;
	}
	/*课程详情重置图片样式*/
	
	.el-upload .el-upload--picture-card {
		font-size: 28px;
		color: #8c939d;
		width: 208px!important;
		height: 104px!important;
		line-height: 104px;
		text-align: center;
		background: #ccc;
	}
	/*上传图片相关*/
	/*头像上传*/
	
	.yetUploadImgList {
		position: relative;
		width: 100%;
		height: 90px;
	}
	
	.yetUploadImgList ul {
		width: 100%;
		height: 90px;
	}
	
	.yetUploadImgList li {
		float: left;
		height: 90px;
		width: 120px;
		position: relative;
		margin-right:20px;
		margin-top: 20px;
	}
	.yetUploadImgList li img {
		height: 90px;
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
		background: url('../../../assets/images/icon_closeimg.png');
	}
	
	.loading {
		top: 30px;
		left: 150px;
		position: absolute;
	}
</style>