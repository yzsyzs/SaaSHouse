<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<template>
	<div class="avatar-uploader">
		<div class="el-upload el-upload--text">
			<i @click="openFile()" ref="uploadIcon" class="el-icon-plus avatar-uploader-icon"></i>
			<input type="file" @change="fileChange()" ref="imgUploadInput" name="" class="el-upload__input" />
		</div>
	</div>
</template>
<script>
	import { responeCode } from '@/config/config'
	import { restful } from '@/servers/server'
	import { api } from '@/config/api'
	import { showObjType } from '@/common/tools'
	export default {
		// 组件的名称
		name: 'imgUpload',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			//组件返回值接收的数组名称 比如fileImgList[upImgArr]为默认值
			upImgArr: {
				type: String,
				default: 'upImgArr'
			},
			//可上传的最大长度
			maxlength: {
				type: Number,
				default: 1
			},
			//是否按比例上传 若设置此属性则必须把快高设置为对应的比例 比如 宽2 高1
			isScale: {
				type: Boolean,
				default: false
			},
			//图片宽度
			imageWidth: {
				type: Number,
				default: 1124
			},
			//图片高度
			imageHeight: {
				type: Number,
				default: 843
			},
			//图片大小多少M
			size: {
				type: Number,
				default: 1
			},
		},
		// 数据绑定
		data() {
			return {
				//图片上传地址
				imgUploadUrl: api.uploadImages,
				//上传图片接收对象 接收返回成功后的结果 可以调用的组件类获取
				fileImgList: {},
				//当前选择的文件信息
				uploadVImgState: false,
				//开始上传
				loading: false,
			}
		},
		methods: {
			/**
			 * 初始化已经上传图片集合、用于修改页面使用
			 * @arr  {Array} [{imgId:"1",url:"21"}]
			 */
			init(arr){
				var self = this;
				self.fileImgList[self.upImgArr] = arr;
			},
			//点击图片打开文件选择
			openFile() {
				var self = this;
				let arr = self.fileImgList[self.upImgArr]
				//先判断当前已经上传图片的数量 若达到上限则不可上传
				if(!arr||(arr.length < self.maxlength)) {
					self.$refs["imgUploadInput"].click();
				} else {
					self.$message.error('最多上传'+ self.maxlength + "张图片");
				}
			},
			//选择文件是触发
			fileChange() {
				let self = this
				self.uploadVideoState = false
				let arr = self.fileImgList[self.upImgArr]
				if(((!arr && 1) || (arr && arr.length + 1)) > self.maxlength) {
					return self.$message.error('最多上传' + self.maxlength + '张图片')
				}
				let file = self.$refs["imgUploadInput"].files[0];
				const isImg = file.type.indexOf("image") > -1 ? 1 : 0;
				const isLimit = file.size / 1024 / 1024 < self.size;
				if(!isImg) {
					self.$message.error('只能上传jpeg文件');
					self.fileVideoList = [];
					return;
				}
				if(!isLimit) {
					self.$message.error('图片大小不能超过'+ self.size +'M');
					self.fileVideoList = [];
					return;
				}
				//判断图片尺寸
				var image = {};
				var reader = new FileReader();
				reader.readAsDataURL(file);
				var img = new Image();
				reader.onload = function(e) {
					//实例一个
					img.src = e.target.result;
					img.onload = function() {
						image.base64Str = e.target.result;
						image.xy = {};
						image.xy.width = img.width;
						image.xy.height = img.height;
						if(self.isScale && (img.width * self.imageHeight != img.height * self.imageWidth)) {
							self.$message.error("请上传" + self.imageWidth + "：" + self.imageHeight + "的图片");
							self.isScaleOk = false;
							return;
							//若设置具体宽度则使用这一条
						} else if(!self.isScale && (img.width != self.imageWidth || img.height != self.imageHeight)) {
							self.$message.error("请上传，宽：" + self.imageWidth + "px，高：" + self.imageHeight + "px的图片");
							return;
						}
						//验证通过
						self.uploadToServer([file])
					}
				}
			},
			/**
			 * 定义通用的请求函数
			 * @fileList  {Array} 需要上传的图片序列
			 */
			uploadToServer(fileList) {
				//定义文件上传列表
				let imageList = [];
				let self = this;
				self.$refs['imgUploadInput'].value = ''
				self.loading = true;
				self.$emit('getLoading', self.loading);
				let fd = new FormData();
				for(let j = 0; j < fileList.length; j++) {
					fd.append("imageList", fileList[j])
				}
				//文件上传参数配置
				let config = {
					okMsg: "图片上传成功",
					url: self.imgUploadUrl,
					headers: {
						"Content-Type": "multipart/form-data;"
					},
					param: fd
				}
				restful.sendMyData(config, self, function(res) {
					if(res.code == 2000) {
						if(showObjType(self.fileImgList[self.upImgArr]) === "Array") {
							self.fileImgList[self.upImgArr].push(res.data[0]);
						} else {
							self.fileImgList[self.upImgArr] = [];
							self.fileImgList[self.upImgArr].push(res.data[0]);
						}
						//返回上传完成后本次调用所有的上传完成图片集合
						self.$emit('getImgArr', self.fileImgList[self.upImgArr])
						// console.log('imgUpload uploadToServer ', self.fileImgList, self.fileImgList[self.upImgArr].length, self.fileImgList[self.upImgArr])
					} else if(res.code) {
						self.$message.error(res.msg);
					}
					self.loading = false;
					self.$emit('getLoading', self.loading);
				});
				
			},
			/**
			 * 定义通用的请求函数
			 * @item  {Object} 需要删除的对象 根据对象的imgid进行删除
			 * @return {Boolean}
			 */
			imgUploadDel(childImg) {
				let self = this;
				let index = 0;
				let isCanDel = false;
				for(let i = 0; i < self.fileImgList[self.upImgArr].length; i++) {
					if(childImg.imgId == self.fileImgList[self.upImgArr][i].imgId) {
						index = i;
						isCanDel = true;
						break;
					}
				}
				if(isCanDel) {
					//若可以删除则删除当前选择元素
					self.fileImgList[self.upImgArr].splice(index,1)
					return true;
				} else {
					self.$message.error("您删除的图片不在已上传列表中");
				}
				return false;
			}
		}
	}
</script>

<style scoped>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		border: dashed 1px #ccc;
	}

	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
