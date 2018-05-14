<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
 <!--视频新增编辑组件-->
<template>
	<el-main>
		<section class="videoAdd_main" v-if="checkPermission('api/manage/video/save')&&checkPermission('api/manage/video/detail')">
			<el-form :model="params" status-icon :rules="rules" ref="params" label-width="100px" class="demo-ruleForm">
				<el-row class="pdt30">
					<el-col :span="6">
						<el-form-item label="视频名称：" prop="name">
							<el-input type="text" :maxlength="20" v-model="params.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="1" style="text-align: left;">
						<el-form-item label="仅会员可见：" prop="isOnlyVip">
							<el-switch v-model="params.isOnlyVip" active-text="是" inactive-text="否">
							</el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="显示时间：" prop="date">
							<el-date-picker :editable="false" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="params.date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>					
				</el-row>
				<el-row>
					<el-col :span="6" style="text-align: left;">
						<el-form-item label="视频封面：" prop="pass">
							<imgUpload @getLoading="getLoading" v-show="!yetVideoImg" :imageWidth="750" :imageHeight="422" ref="videoImg" upImgArr='videoImg' @getImgArr="getVideoImgArr"></imgUpload>
							<div class="loading" v-if="isVideoImgLoading" v-loading="isVideoImgLoading"></div>
							<div v-show="yetVideoImg"  class="yetUploadImgList" style="width: 160px;height: 120px;overflow: hidden;">
								<img :src="params.videoImgArr[0].url" alt="" />
								<i class="delImg" @click="delImg(params.videoImgArr[0])"></i>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="1">
						<el-form-item label="视频：" prop="checkPass">
							<videoUpload @getVideoInfo="getVideoInfo" @getProgress="getVideoProgess"></videoUpload>
							<el-progress v-if="videoProgess>0" :percentage="videoProgess"></el-progress>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="13">
						<el-form-item label="简介：" prop="introdution">
							<el-input type="textarea" :maxlength="300" autosize v-model="params.introdution" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="分享标题：" prop="shareTitle">
							<el-input type="text" v-model="params.shareTitle" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="1"  style="text-align: left;">
						<el-form-item label="分享图片：" prop="shareImg">
							<imgUpload v-show="!yetShareImg" @getLoading="getShareLoading" :isScale="true" :imageWidth="1" :imageHeight="1" ref="shareImg" upImgArr='shareImg' @getImgArr="getShareImgArr"></imgUpload>
							<div class="loading" v-if="isShareImgLoading" v-loading="isShareImgLoading"></div>
							<div v-show="yetShareImg" class="yetUploadImgList" style="width: 102px;height: 102px;" >
								<img style="width: 102px;height: 102px;" :src="params.shareImgArr[0].url" alt="" />
								<i class="delImg" @click="delShareImg(params.shareImgArr[0])"></i>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="13">
						<el-form-item label="分享内容：" prop="shareContext">
							<el-input type="textarea" :maxlength="300" autosize v-model="params.shareContext" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="text-align: left;" class="pdt30">
					<div style="background: #F5F8F8; padding: 20px 0;">
						<el-form-item>
							<el-button type="primary" round @click="submitForm('params')">确定</el-button>
							<el-button round @click="back()">取消</el-button>
						</el-form-item>
					</div>
				</el-row>
			</el-form>
		</section>
	</el-main>
</template>
<script>
	import { responeCode } from '@/config/config'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	import { tools } from '@/common/tools'
	import videoUpload from '@/components/upload/videoUpload.vue'
	import imgUpload from '@/components/upload/imgUpload.vue'
	export default {
		components: {
			videoUpload,
			imgUpload
		},
		name: 'videoAdd',
		props:{
			isEdit:{
				type: Boolean,
				default: false
			}
		},
		data() {
			//校验视频名称
			var checkVideoName = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('视频名称不能为空'));
				} else if(value.length > 30) {
					return callback(new Error('视频名称不能超过30个字'));
				} else {
					callback();
				}

			};
			//校验时间是否正确
			var validate = (rule, value, callback) => {
				if(!value) {
					callback(new Error('请选择时间'));
				} else {
					callback();
				}
			};
			//校验视频封面
			var validateVideoUrl = (rule, value, callback) => {
				if(!value) {
					callback(new Error('请选择时间'));
				} else {
					callback();
				}
			};
			//校验视频
			var validateVideo = (rule, value, callback) => {
				if(!value) {
					callback(new Error('请选择时间'));
				} else {
					callback();
				}
			};
			return {
				params: {
					trainerName: '',
					videoImgArr: [{}],
					shareImgArr: [{}],
					videoInfo:{},
					isOnlyVip:false,
					date:[],
				},
				//分享-缓冲
				isShareImgLoading:false,
				//视频封面缓冲
				isVideoImgLoading:false,
				//视频封面是否上传完成
				yetVideoImg: false,
				//分享图片是否完成
				yetShareImg: false,
				//视频上传进度
				videoProgess:0,
				trainerList: [{
					id: 1,
					name: "王",
				}],
				trainerLoading: false,
				states: [],
				rules: {
					//日期
					date: [{
						type: 'date',
						validator: validate,
						//required: true,
						trigger: 'change'

					}],
					//视频名称
					videoName: [{
						validator: checkVideoName,
						trigger: 'blur'
					}]
				}
			};
		},
		created(){
			this.checkPermission = window.checkPermission
		},
		mounted() {
			if(this.$route.params.id&&this.isEdit){
				this.getOldVideoInfo(this.$route.params.id);
			}
		},
		methods: {
			//若为编辑时先获取原来视频的信息
			getOldVideoInfo(id){
				let self = this;
				let config = {
					url: api.videoDetail,
					param:{
						videoId:id
					}
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						console.log("获取视频详情成功")	
						for(let key in res.data){
							self.params[key] = res.data[key]
						}
						let arr =[]
						arr[0] = tools.standTosimple(res.data.displayBegin,"-",true);;
						arr[1] = tools.standTosimple(res.data.displayEnd,"-",true);
						console.log(arr)
						self.$set(self.params,"date",arr)
						let videoImg = [{
							imgId:self.params.videoImageId,
							url:self.params.videoImageUrl,
						}]
						let shareImg = [{
							imgId:"1",
							url:self.params.shareIcon,
						}]	
						self.yetVideoImg = true;
						self.yetShareImg = true;
						self.params.videoImgArr = videoImg;
						self.params.shareImgArr = shareImg;
						//初始化头像图片上传数组
						self.$refs["videoImg"].init(videoImg);
						self.$refs["shareImg"].init(shareImg);
						console.log(self.params)
						//初始化视频信息
						self.params.videoInfo.video_id = self.params.letvVid;
						self.params.videoInfo.video_unique = self.params.letvVunique;
					} else {						
						self.$message.error(res.msg);
						self.$router.push({
							path: '/videoList'
						})
					}
				});
			},
			//是否正在上传图片
			getLoading(bool){
				this.isVideoImgLoading = bool;
			},
			//分享图片正在上传
			getShareLoading(bool){
				this.isShareImgLoading = bool;
			},
			//获取上传进度
			getVideoProgess(val){
				this.videoProgess = val;
			},
			//获取当前上传成功的视频信息
			getVideoInfo(video){
				this.params.videoInfo = video;
			},
			//获取视频封面上传完成后的图片
			getVideoImgArr(videoImgArr) {
				console.log('videoAdd methods getVideoUrl val ', videoImgArr)
				this.params.videoImgArr = videoImgArr;
				console.log(this.params.videoImgArr);
				this.yetVideoImg = true;
			},
			//删除当前视频封面
			delImg(childImg) {
				console.log(this.params.videoImgArr)
				let isDelOk = this.$refs["videoImg"].imgUploadDel(childImg);
				if(isDelOk) {
					this.yetVideoImg = false;
					//防止删除后图片找不到地址报错
					this.params.videoImgArr = [{}]
				} else {
					self.$message.error("图片删除失败");
				}
			},
			//获取视频分享上传完成后的图片
			getShareImgArr(shareImgArr) {
				console.log('videoAdd methods getVideoUrl val ', shareImgArr)
				this.params.shareImgArr = shareImgArr;
				console.log(this.params.shareImgArr);
				this.yetShareImg = true;
			},
			//删除当前分享图片
			delShareImg(childImg) {
				console.log(this.params.videoImgArr)
				let isDelOk = this.$refs["shareImg"].imgUploadDel(childImg);
				if(isDelOk) {
					this.yetShareImg = false;
					//防止删除后图片找不到地址报错
					this.params.shareImgArr = [{}]
				} else {
					self.$message.error("图片删除失败");
				}
			},
			submitForm(formName) {
				var self = this;
				self.$refs[formName].validate((valid) => {
					if(valid) {
						if(!self.params.date){
							self.$message.error("请选择视频显示时间段");
							return;
						}
						if(!self.params.videoImgArr[0].imgId){
							self.$message.error("请上传视频封面图片");
							return;
						}
						if(!self.params.shareImgArr[0].imgId){
							self.$message.error("请上传分享图片");
							return;
						}
						if(!self.params.videoInfo.video_id){
							self.$message.error("请上传视频");
							return;
						}
						let params = {};
						params.id = self.params.id;						
						params.displayBegin = tools.dateToTimeStamp(self.params.date[0]);
						params.displayEnd = tools.dateToTimeStamp(self.params.date[1]);
						params.letvVid = self.params.videoInfo.video_id;
						params.letvVunique = self.params.videoInfo.video_unique;
						params.videoImageId = self.params.videoImgArr[0].imgId;
						params.videoImageUrl = self.params.videoImgArr[0].url;
						params.shareIconId = self.params.shareImgArr[0].imgId;
						params.shareIcon = self.params.shareImgArr[0].url;
						params.name = self.params.name;
						params.introdution =self.params.introdution?self.params.introdution.trim():null;
						params.shareTitle = self.params.shareTitle?self.params.shareTitle.trim():null;
						params.shareContext = self.params.shareContext?self.params.shareContext.trim():null;
						params.isOnlyVip = self.params.isOnlyVip?1:0;
						params.trainerName = "固定的一个名字";
						console.log(params);
						let config = {
							url: api.videoSave,
							param:params
						}
						restful.sendMyData(config, self, function(res) {
							if(res.code == 2000) {
								self.$message.success("保存成功");
								self.$router.push({
									path: '/videoList'
								})
							} else {
								self.$message.error(res.msg);
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			back(formName) {
				this.$router.push({
					path: '/videoList'
				});
			},
		}
	}
</script>
<style scoped="scoped">
	.videoAdd_main {
		background: #fff;
	}
	
	.pdt30 {
		padding-top: 30px;
	}
	
	.yetUploadImgList {
		width: 160px;
		height: 120px;
		position: relative;
		overflow: hidden;
	}	
	.yetUploadImgList img {
		width: 100%;
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
	.loading{
		top: 30px;
		left: 150px;
		position: absolute;
	}
</style>