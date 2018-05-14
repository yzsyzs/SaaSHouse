<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--视频课程-列表-->
<template>
	<el-main>
		<section class="videoList_main" v-if="checkPermission('api/manage/video/list')">
			<el-row>
				<el-button v-if="checkPermission('api/manage/video/list')" @click="onQuery()" :loading="loading" type="primary" round icon="el-icon-add" size="medium">查询</el-button>
				<el-button v-if="checkPermission('api/manage/video/save')" @click="videoAdd()"  type="" round icon="el-icon-add" size="medium">新增视频课程</el-button>
			</el-row>
			<el-row style="padding-top:30px;">
				<el-table :data="videoList" style="width: 100%">
					<el-table-column label="序号" type="index" width="80px">
					</el-table-column>
					<el-table-column prop="createDate" label="上传时间">
					</el-table-column>
					<el-table-column prop="showTime" label="显示时间">
					</el-table-column>
					<el-table-column prop="name" width="300px" label="视频名称">
					</el-table-column>
					<el-table-column prop="price" label="视频封面">
						<template slot-scope="scope">
							<img style="width:80px;height: 60px;" :src="scope.row.videoImageUrl" />
						</template>
					</el-table-column>
					<el-table-column label="视频内容">
						<template slot-scope="scope">						
							<a v-if="scope.row.auditStatus=='审核通过'&&scope.row.transCodingStatus=='转码成功'" @click="playVideo(scope.row)">播放</a>
						</template>
					</el-table-column>
					<el-table-column prop="isOnlyVip" label="仅会员可见">
						<template slot-scope="scope">
							<span>{{scope.row.isOnlyVip==0?"是":"否"}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="transCodingStatus" label="转码状态">						
					</el-table-column>
					<el-table-column prop="auditStatus" label="审核状态">
					</el-table-column>
					<el-table-column prop="id" label="操作">
						<template slot-scope="scope">
							<a v-if="checkPermission('api/manage/video/save')" @click="videoEdit(scope.row.id)">
								编辑
							</a>
							|
							<a v-if="checkPermission('api/manage/video/delete')" class="danger" @click="videoDel(scope.row.id)">
								删除
							</a>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-row>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 40, 60, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;">
				</el-pagination>
			</el-row>
			<el-dialog title="" :close-on-click-modal="false" :visible.sync="isPlayVideo" width="50%">
				<div>
					<embed src="http://yuntv.letv.com/bcloud.swf" allowFullScreen="true" style="width: 100%;" quality="high" align="middle" allowScriptAccess="always" width="800" height="600" :flashvars="flashvars" type="application/x-shockwave-flash">
					</embed>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button round @click="isPlayVideo = false">关闭</el-button>
				</span>
			</el-dialog>
		</section>
		<!--视频播放-->

	</el-main>

</template>

<script>
	import { responeCode } from '@/config/config'
	import { api } from '@/config/api'
	import { restful } from '@/servers/server'
	export default {
		// 组件的名称
		name: 'videoList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {
				isLoading: false,
				videoList: [],
				params: {
					page: 0,
					count: 20
				},
				total: 0,
				flashvars: "",
				isPlayVideo: false,
				loading:false,
			}

		},
		created() {
			var self = this;
			self.onQuery();
			self.checkPermission = window.checkPermission
		},
		methods: {
			//查询
			onQuery() {
				var self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.videolist,
					//请求体参数
					param: self.params,
					//缓冲动画
					loading: "loading",
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */

				restful.sendMyData(config, self, function(res) {
					self.videoList = res.data;
					self.total = res.page_info.total;
				});
			},
			//重置
			onReset() {},
			//每页数量改变
			handleSizeChange(count) {
				this.params.count = count;
				this.onQuery()
			},
			//页码改变
			handleCurrentChange(page) {
				this.params.page = page - 1;
				this.onQuery()
			},
			//视频课程播放
			playVideo(item) {
				var self = this;
				self.flashvars = "uu=" + api.letvUu + "&vu=" + item.letvVunique + "&auto_play=1&gpcflag=1&lang=zh_CN"
				self.isPlayVideo = true;
			},
			//课程编辑
			videoEdit(id) {
				var self = this;
				self.$router.push({
					path: '/videoList/edit/' + id
				})
			},
			videoAdd() {
				var self = this;
				self.$router.push({
					path: '/videoList/add/'
				})
			},
			//视频课程删除
			videoDel(id) {
				var self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.videodelete,
					//请求体参数
					param: {
						videoId: id
					},
					//成功时的处理消息 错误信息由后台控制打印
					okMsg: "删除成功",
					//当前请求的缓冲字段名称
					loading: "isLoading"
				}
				self.$confirm('是否删除该视频课程', '删除视频课程', {
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
					restful.sendMyData(config, self, function() {
						self.onQuery()
					});
				}).catch(() => {
					self.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

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
		width: 300px;
	}
	
	.w400 {
		width: 400px;
	}
	
	.videoList_main {
		padding: 30px 20px;
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