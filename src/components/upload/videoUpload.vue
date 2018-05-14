<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<template>
	<div class="upload-demo">
		<div class="el-upload el-upload--text">
			<button type="button" @click="openFile()" class="el-button el-button--primary el-button--small"><span>选取文件</span></button>
			<input type="file" ref="videoFile" @change="fileChange()" name="" class="el-upload__input" value="" />
		</div>
		<button type="button" @click.stop="uploadToServer()" class="el-button el-button--success el-button--small">
			<span>上传到服务器</span>
		</button>
		<div class="el-upload__tip">请上传一般的视频文件如mp4、wma等，且不超过500M</div>
		<ul class="el-upload-list el-upload-list--text">
			<li class="el-upload-list__item is-success" v-for="file in fileVideoList">
				<a href="el-upload-list__item-name">
					<i class="el-icon-document"></i> {{file.name}}
				</a>
				<label for="" class="el-upload-list__item-status-label">
					<i v-if="progress>=100" class="el-icon-upload-success el-icon-circle-check"></i>
				</label>
				<i class="el-icon-close" @click="delVideo(file)"></i>
			</li>
		</ul>
	</div>
</template>
<script>
	import { responeCode } from '@/config/config'
	import { restful } from '@/servers/server'
	import { api } from '@/config/api'
	import axios from 'axios'
	export default {
		// 组件的名称
		name: 'videoUpload',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {

		},
		// 数据绑定
		data() {
			return {
				//视频上传初始化地址
				videoUploadInit: api.letvinit,
				//视频上传地址
				videoUploadUrl: "",
				//上传视频列表
				fileVideoList: [],
				//当前选择的文件信息
				uploadVideoState: false,
				progress: 0,
			}
		},
		methods: {
			openFile() {
				console.log(this.$refs["videoFile"].click())
			},
			//删除当前的视频选择
			delVideo(file) {
				let self =this;
				self.fileVideoList.splice(file, 1);
				self.progress=0;
				self.$emit('getProgress',self.progress)
			},
			//选择文件是触发
			fileChange() {
				let self = this;
				self.uploadVideoState = false;
				if(self.fileVideoList.length > 0) {
					this.$message.error('最多只能上传一个视频，请先删除已经选择的视频');
					return;
				}
				console.log(this.$refs["videoFile"].files[0])
				let file = this.$refs["videoFile"].files[0];
				const isVideo = file.type.indexOf("video") > -1 ? 1 : 0;
				const isLt500M = file.size / 1024 / 1024 < 500;
				if(!isVideo) {
					this.$message.error('只能上传视频文件');
					this.fileVideoList = [];
					return;
				}
				if(!isLt500M) {
					this.$message.error('视频大小不能超过500M');
					this.fileVideoList = [];
					return;
				}

				self.fileVideoList.push(file);
				//验证通过
				let config = {
					okMsg: "获取视频上传地址成功",
					url: self.videoUploadInit,
					param: {
						name: file.name
					}
				}

				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						self.upload = res.data.data
						self.videoUploadUrl = res.data.data.upload_url;
						console.log(self.videoUploadUrl);
					} else {
						self.trainerList = [];
						self.$message.error("获取视频上传初始信息失败");
					}
				});
			},
			//开始上传
			uploadToServer() {
				let self = this
				if(!self.videoUploadUrl){
					self.$message.error("请先选择需要上传的视频");
					return;
				}
				var instance = new axios.create()
				console.log('videoUpload methods uploadToServer self.aaaa', self.upload)
				instance({
					url: self.videoUploadUrl,
					method: 'post',
					withCredentials: false,
					data: self.upload
				}).then((res) => {
					if(res.data.code == 0 && res.data.message == "Success") {
						self.progress = 100;
						self.$emit('getVideoInfo', self.upload)
					} else {
						//回传视频信息
						self.$emit('getVideoInfo', {})
					}
				}, (rej) => {
					console.log("videoUpload methods uploadToServer rej ", rej)
				})
				let timer = setInterval(() => {
					if(self.progress>=98){
						self.$emit('getProgress',self.progress)
						clearInterval(timer);
						return;
					}
					self.progress++;
					self.$emit('getProgress',self.progress)
				}, 500)
			}
		}
	}
</script>

<style scoped>

</style>
