<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--私教课详情-->
<template>
	<el-main>
		<section class="trainerCourseDetail_main" v-if="checkPermission('api/manage/course/getCourseDetail')||checkPermission('api/manage/groupcourse/getGroupCourseDetail')">
			<el-row>
				<!--基本信息-->
				<el-col :span="24" class="minWidth1224">
					<!--标题信息-->
					<p class="trainerCourseDetail_title">基本信息</p>
					<!--左侧信息-->
					<div class="courseDetail_base_left fl">
						<div class="content fl pdt50">
							<div class="text-right pdr15 base_left fl">课程名称：</div>
							<div class="base_right fl">{{params.courseName}}</div>
						</div>
						<div class="content fl pdt30">
							<div class="text-right pdr15 base_left fl">课程列表图片：</div>
							<div class="base_right fl">
								<img :src="params.imgListUrl" alt="" class="courseListImg" />
							</div>
						</div>
						<div class="content fl pdt30">
							<div class="text-right pdr15 base_left fl">课程详情图片：</div>
							<div class="base_right fl" style="padding-top: 0;">
								<img :src="courseImg.imgDetailUrl" alt="" :key="index" v-for="(courseImg,index) in imageDetail" class="courseDetailImg noSpreed" />
								<el-collapse-transition>
									<div v-if="isSpread">
										<img :src="courseImg.imgDetailUrl" alt="" :key="courseImg.imgId" v-for="courseImg in isSpreadCourses" class="courseDetailImg" />
									</div>
								</el-collapse-transition>
								<p class="moreCourseImg" v-if="!isSpread && params.imageDetail.length>2" @click="moreCourseImg">展开<i class="el-icon-arrow-down"></i></p>
								<p class="moreCourseImg" v-if="isSpread && params.imageDetail.length>2" @click="moreCourseImg">收起<i class="el-icon-arrow-up"></i></p>
							</div>
						</div>
						<div class="content fl pdt50">
							<div class="text-right pdr15 base_left fl" v-if="!isGroup">授课教练：</div>
							<div class="base_right fl">{{params.coachName}}</div>
						</div>
						<div class="content fl pdt50">
							<div class="text-right pdr15 base_left fl">课程说明：</div>
							<div class="base_right fl">{{params.description}}</div>
						</div>
					</div>
					<!--右侧信息-->
					<div class="courseDetail_base_right  fl">
						<div class="content fl pdt50">
							<div class="text-right pdr15 base_left fl">排序权重：</div>
							<div class="base_right fl">{{params.sortNo}}</div>
						</div>
						<div class="content fl pdt30">
							<div class="text-right pdr15 base_left fl">达到效果：</div>
							<div class="base_right fl">{{params.expectedEffect}}</div>
						</div>
						<div class="content fl pdt30">
							<div class="text-right pdr15 base_left fl">课程时长：</div>
							<div class="base_right fl">{{params.duration}}</div>
						</div>
						<div class="content fl pdt30">
							<div class="text-right pdr15 base_left fl">课程id：</div>
							<div class="base_right fl">{{params.courseId}}</div>
						</div>
						<div class="content fl pdt30" v-if="isGroup">
							<div class="text-right pdr15 base_left fl">最大预约人数：</div>
							<div class="base_right fl">{{params.maxCount}}</div>
						</div>
					</div>
				</el-col>
				<!--课程价格和有效期-->
				<el-col :span="24" class="pdt50" v-if="!isGroup">
					<!--标题信息-->
					<p class="trainerCourseDetail_title">课程价格和有效期</p>
					<div class="coursePakegeDetail" style="margin-top: 30px;" :key="index" v-for="(item,index) in params.coursePackage">
						<p class="text-center pdt30 fz-border">课时数：{{item.courseCount}}节</p>
						<p class="text-center pdt30">
							<span>原价：{{item.originalPrice}}元</span>
							<span>有效期：{{item.expireTime}}天</span>
						</p>
						<p class="text-center pdt50 fz-border">活动设置：{{item.isActivity?"开启":"关闭"}}</p>
						<p class="text-center pdt30"v-if="item.isActivity">
							<span>活动价：{{item.activityPrice?item.activityPrice+"元":"暂无"}}</span>
							<span>加赠课时数：{{item.activityAddCount?item.activityAddCount+"节":"暂无赠送"}}</span>
						</p>
						<p class="text-center pdt30 pdb30">
							<span>特权服务：{{item.isPresentVip?"开启":"关闭"}}</span>
							<span>是否推荐：{{item.isRecommend?"开启":"关闭"}}</span>
						</p>
					</div>
					<div  v-if="!params.coursePackage||params.coursePackage.length==0">
						<p style="line-height: 50px;">暂无课时或无启用课时</p>
					</div>
				</el-col>

			</el-row>

		</section>
		<el-row class="text-left pdt50">
			<el-button type="primary" round @click="back()">返回列表</el-button>
		</el-row>

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
			}
		},
		// 数据绑定
		data() {
			return {
				isLoading: false,
				params: {
					"courseId": "",
					"courseName": "",
					"courseType": "",
					"description": "",
					"duration": "",
					"expectedEffect": "",
					"imageDetail": [{
						"imgDetailId": "",
						"imgDetailUrl": ""
					}],
					"imgListId": "",
					"imgListUrl": "",
					"lifeId": "",
					"maxCount": "",
					"sortNo": "",
					"coursePackage":[]
				},
				//展示课程图片数组
				isSpreadCourses: [],
				//不能展开的信息
				imageDetail: [],
				isSpread: false,
			}
		},
		created() {
			let self = this;
			//加载权限验证函数
			self.checkPermission = window.checkPermission;
			if(self.$route.params.id) {
				let config = {
					okMsg: "保存成功",
					isNeedOkMsg: false,
					url: self.isGroup ? api.getGroupCourseDetail : api.getCourseDetail,
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
						console.log(self.params,"这是返回参数");
						self.isSpreedMore();
					} else {
						self.$message.error(res.msg);
						self.$router.push({
							path: self.isGroup ?'/groupCourseList':'/trainerCourseList'
						})
					}
				});
			}
		},
		mounted() {

		},
		methods: {
			//展开、收起
			moreCourseImg() {
				let self = this;
				self.isSpread = !self.isSpread;
			},
			isSpreedMore() {
				var self = this;
				//能展开的集合 
				if(self.params.imageDetail && self.params.imageDetail.length > 2) {
					for(var i = 2; i < self.params.imageDetail.length; i++) {
						self.isSpreadCourses.push(self.params.imageDetail[i]);
					}
				}
				//不能展开的集合 
				if(self.params.imageDetail && self.params.imageDetail.length > 0) {
					for(var i = 0; i < self.params.imageDetail.length; i++) {
						if(i > 1) {
							break;
						}
						self.imageDetail.push(self.params.imageDetail[i]);
					}
				}
				console.log(self.isSpreadCourses, "这是能展开的");
				console.log(self.imageDetail, "这是不能能展开的");
			},
			//返回按钮
			back() {
				let self = this;
				self.$router.push({
					path: self.isGroup?'/groupCourseList' : '/trainerCourseList'
				})
			},

		}
	}
</script>

<style scoped>
	/*标题*/
	
	.trainerCourseDetail_title {
		font-family: PingFangSC-Medium;
		font-size: 24px;
		color: #444A49;
		line-height: 24px;
		font-weight: 600;
	}
	
	.courseDetail_base_left {
		width: 580px;
	}
	
	.courseDetail_base_right {
		width: 580px;
	}
	
	.courseDetail_base_left .content,
	.courseDetail_base_right .content {
		width: 100%;
		overflow: hidden;
	}
	
	.fl {
		float: left;
	}
	
	.base_left,
	.base_right {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #444A49;
		line-height: 20px;
	}
	
	.base_right {
		box-sizing: border-box;
		width: 440px;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #444A49;
		line-height: 20px;
	}
	/*展开、收起*/
	
	.moreCourseImg {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #B9BEBD;
		line-height: 50px;
		padding-left: 30px;
		cursor: pointer;
		width: 50px;
	}
	
	.base_left {
		box-sizing: border-box;
		width: 140px;
	}
	/*课程列表图片*/
	
	.courseListImg {
		width: 160px;
		height: 80px;
		border-radius:5px;
	}
	
	.courseDetailImg {
		width: 160px;
		height: 120px;
		margin-top: 10px;
		margin-right: 10px;
		border-radius:5px;
	}
	.courseDetailImg.noSpreed{
		margin-top: 0px!important;
	}
	.text-left {
		text-align: left;
	}
	
	.text-right {
		text-align: right;
	}
	
	.pdt50 {
		padding-top: 50px;
	}
	
	.pdt30 {
		padding-top: 30px;
	}
	
	.pdr15 {
		padding-right: 15px;
	}
	
	.w300 {
		width: 300px;
	}
	
	.w400 {
		width: 400px;
	}
	
	.trainerCourseDetail_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
	}
	/*课时详情*/
	
	.coursePakegeDetail {
		width: 300px;
		background: #FAFAFA;
		margin-left: 20px;
		float: left;
		min-height: 250px;
		
	}
	
	.coursePakegeDetail p {
		width: 100%;
		display: block;
		float: left;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #444A49;
		line-height: 12px;
	}
	
	.coursePakegeDetail p span {
		width: 50%;
		text-align: center;
		display: block;
		float: left;
	}
	
	.fz-border {
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #444A49;
		line-height: 12px;
		font-weight: 600;
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
	
	.minWidth1224 {
		min-width: 1164px!important;
	}
	
	.text-center {
		text-align: center;
	}
	
	.h80 {
		height: 80px;
	}
	
	.bgF5F8F8 {
		background: #F5F8F8;
	}
</style>