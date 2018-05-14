/**
 * 参照链接: https://router.vuejs.org/zh-cn/essentials/getting-started.html
 * vue vue-router 使用cdn引入，可以不用写import了
 */

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import dashboard from '@/components/dashboard/dashboard'
// TODO 后面看看要不要拆分路由,分模块引入

/**
 * 路由懒加载，用vue.js写单页面应用时，会出现打包后的JavaScript包非常大，影响页面加载，
 * 我们可以利用路由的懒加载去优化这个问题，当我们用到某个路由后，才去加载对应的组件，这样就会更加高效，
 */
// 首页
const dashboard = resolve => require(['@/components/dashboard/dashboard'], resolve)
// 404页面
const err404 = resolve => require(['@/components/err404/err404'], resolve)
// 员工列表
const staffList = resolve => require(['@/components/staffSet/staffList'], resolve)
// 新增员工
const staffAdd = resolve => require(['@/components/staffSet/staffAdd'], resolve)
// 编辑员工
const staffEdit = resolve => require(['@/components/staffSet/staffEdit'], resolve)
// 员工详情
const staffDetail = resolve => require(['@/components/staffSet/staffDetail'], resolve)
// 导师&教练列表
const trainerList = resolve => require(['@/components/trainer/trainerList'], resolve)
// 导师&教练新增
const trainerAdd = resolve => require(['@/components/trainer/trainerAdd'], resolve)
// 导师&教练编辑
const trainerEdit = resolve => require(['@/components/trainer/trainerEdit'], resolve)
// 导师&教练详情
const trainerDetail = resolve => require(['@/components/trainer/trainerDetail'], resolve)
// 薪资配置
const salarySet = resolve => require(['@/components/salary/salarySet'], resolve)
// 员工排班表
const schedule = resolve => require(['@/components/schedule/schedule'], resolve)

/* 场馆配置 start */
// 场馆列表
const pavilionsSet = resolve => require(['@/components/pavilionsSet/pavilionsSet'], resolve)
// 添加场馆
const addPavilions = resolve => require(['@/components/pavilionsSet/addPavilions'], resolve)
// 编辑场馆
const editPavilions = resolve => require(['@/components/pavilionsSet/editPavilions'], resolve)
// 场馆详情
const pavilionsDetail = resolve => require(['@/components/pavilionsSet/pavilionsDetail'], resolve)
/* 场馆配置 end */

/* 生活馆 start */
// 特权卡
const vipCardList = resolve => require(['@/components/vipCardSet/vipCardList'], resolve)
// 添加， 编辑 特权卡
const addVipCard = resolve => require(['@/components/vipCardSet/addVipCard'], resolve)
const editorVipCard = resolve => require(['@/components/vipCardSet/editorVipCard'], resolve)
/* 特权卡 end */

/* 管理员配置 start */
// 管理员列表
const administratorList = resolve => require(['@/components/administrator/administratorList'], resolve)
// 添加管理员
const addAdministrator = resolve => require(['@/components/administrator/addAdministrator'], resolve)
// 编辑管理员
const editAdministrator = resolve => require(['@/components/administrator/editAdministrator'], resolve)
/* 管理员配置 end */

/* 运营数据监控 start */
const lifehallView = resolve => require(['@/components/lifehallView/lifehallView'], resolve)
/* 运营数据监控 end */

/* 登录 start */
const loginBg = resolve => require(['@/components/loginBg/loginBg'], resolve)
/* 登录 end */

/* 系统配置 start */
// 权限设置
const accessConfiguration = resolve => require(['@/components/systemConfig/accessConfiguration'], resolve)
// 修改密码
const changePassword = resolve => require(['@/components/systemConfig/changePassword'], resolve)
// 操作记录
const operationRecord = resolve => require(['@/components/systemConfig/operationRecord'], resolve)
const uploadImage = resolve => require(['@/components/systemConfig/uploadImage'], resolve)
/* 系统配置 end */

/* 预约签到  start */
// 签到记录
const signRecord = resolve => require(['@/components/appointmentAndSign/signRecord'], resolve)
// 预约记录
const appointRecord = resolve => require(['@/components/appointmentAndSign/appointRecord'], resolve)
// 私教课
const personalTeachRecord = resolve => require(['@/components/appointmentAndSign/personalTeachRecord'], resolve)
// 预约团课
const teamTeachRecord = resolve => require(['@/components/appointmentAndSign/teamTeachRecord'], resolve)
// 选择代约团课用户
const selectUserRecord = resolve => require(['@/components/appointmentAndSign/selectUserRecord'], resolve)
/* 预约签到 end */

/* 课程管理 start */
// 私教课列表
const trainerCourseList = resolve => require(['@/components/courseManagement/trainerCourse/trainerCourseList'], resolve)
// 私教课配置
const trainerCourseAdd = resolve => require(['@/components/courseManagement/trainerCourse/trainerCourseAdd'], resolve)
// 私教课编辑
const trainerCourseEdit = resolve => require(['@/components/courseManagement/trainerCourse/trainerCourseEdit'], resolve)
// 私教课详情
const trainerCourseDetail = resolve => require(['@/components/courseManagement/trainerCourse/trainerCourseDetail'], resolve)
// 团课列表
const groupCourseList = resolve => require(['@/components/courseManagement/groupCourse/groupCourseList'], resolve)
// 团课配置
const groupCourseAdd = resolve => require(['@/components/courseManagement/groupCourse/groupCourseAdd'], resolve)
// 团课编辑
const groupCourseEdit = resolve => require(['@/components/courseManagement/groupCourse/groupCourseEdit'], resolve)
// 团课详情
const groupCourseDetail = resolve => require(['@/components/courseManagement/groupCourse/groupCourseDetail'], resolve)
// 课程表
// 团课排课表
const groupCurriculum = resolve => require(['@/components/courseManagement/curriculum/groupCurriculum'], resolve)
// 每日排课
const dayCurriculum = resolve => require(['@/components/courseManagement/curriculum/dayCurriculum'], resolve)
// 添加排课
const addCurriculum = resolve => require(['@/components/courseManagement/curriculum/addCurriculum'], resolve)
// 编辑排课
const editCurriculum = resolve => require(['@/components/courseManagement/curriculum/editCurriculum'], resolve)
// 视频课程-视频列表
const videoList = resolve => require(['@/components/courseManagement/videoManagement/videoList'], resolve)
// 视频课程-新增视频
const videoAdd = resolve => require(['@/components/courseManagement/videoManagement/videoAdd'], resolve)
// 视频课程-编辑视频
const videoEdit = resolve => require(['@/components/courseManagement/videoManagement/videoEdit'], resolve)
/* 课程管理 end */

/* 营销管理 开始 */
// 积分管理
const integralManagement = resolve => require(['@/components/MarketingManagement/integralManagement/integralManagement'], resolve)
// 分销体系
const distributionSystem = resolve => require(['@/components/MarketingManagement/distributionSystem/distributionSystem'], resolve)
// 亲友网络
const relatives = resolve => require(['@/components/MarketingManagement/distributionSystem/relatives'], resolve)
// 京东众筹列表
const raiseList = resolve => require(['@/components/MarketingManagement/JDRaise/raiseList'], resolve)
/* 营销管理 结束 */

/* 工作台 start */
const classSet = resolve => require(['@/components/workbench/classSet'], resolve)
/* 工作台 end */
/* 订单管理 start */
// 订单列表
const orderManage = resolve => require(['@/components/orderManage/orderManage'], resolve)
// 消费记录
const consumptionManagement = resolve => require(['@/components/orderManage/consumption/consumptionManagement'], resolve)
/* 订单管理 end */

// Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '首页',
      component: dashboard
    },
    {
      path: '/login',
      name: 'loginBg',
      component: loginBg
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard
    },
    /* 旧功能区 start */
    // 积分管理
    {
      path: '/integralManagement',
      name: '积分管理',
      component: integralManagement
    },
    // 分销体系
    {
      path: '/distributionSystem',
      name: '分销体系',
      component: distributionSystem
    },
    // 亲友网络
    {
      path: '/relatives',
      name: '亲友网络',
      component: relatives
    },
    // 京东众筹
    {
      path: '/raiseList',
      name: '众筹会员明细',
      component: raiseList
    },
    /* 旧功能区 end */
    // 视频管理-视频课程
    {
      path: '/videoList',
      name: '视频课程',
      component: videoList
    },
    {
      path: '/videoList/add',
      name: '新增视频',
      component: videoAdd,
      meta: [{path: '/videoList', name: '视频课程'}]
    },
    {
      path: '/videoList/edit/:id',
      name: '编辑视频',
      component: videoEdit,
      meta: [{path: '/videoList', name: '视频课程'}]
    },
    /* 课程表 start */

    // 团课排课表
    {
      path: '/groupCurriculum',
      name: '课程表',
      component: groupCurriculum
    },
    // 每日排课
    {
      path: '/dayCurriculum/:id',
      name: '每日排课',
      component: dayCurriculum,
      meta: [{path: '/groupCurriculum', name: '团课课程'}]
    },
    // 团课列表
    {
      path: '/addCurriculum/:id',
      name: '添加排课',
      component: addCurriculum,
      meta: [{path: '/dayCurriculum/:id', name: '每日排课'}, {path: '/groupCurriculum', name: '团课课程'}]
    },
    // 编辑排课
    {
      path: '/editCurriculum/:id/:courseScheduleId',
      name: '编辑排课',
      component: editCurriculum,
      meta: [{path: '/dayCurriculum/:id', name: '每日排课'}, {path: '/groupCurriculum', name: '团课课程'}]
    },
    /* 课程表 end */

    // 团课列表
    {
      path: '/groupCourseList',
      name: '团课课程 ',
      component: groupCourseList
    },
    // 配置团课
    {
      path: '/groupCourseList/add',
      name: '配置团课',
      component: groupCourseAdd,
      meta: [{path: '/groupCourseList', name: '团课课程'}]
    },
    // 编辑团课
    {
      path: '/groupCourseList/edit/:id',
      name: '编辑  ',
      component: groupCourseEdit,
      meta: [{path: '/groupCourseList', name: '团课课程'}]
    },
    {
      path: '/groupCourseList/detail/:id',
      name: '详情  ',
      component: groupCourseDetail,
      meta: [{path: '/groupCourseList', name: '团课课程'}]
    },
    // 私教课列表
    {
      path: '/trainerCourseList',
      name: '私教课课程',
      component: trainerCourseList
    },
    // 配置私教课
    {
      path: '/trainerCourseList/add',
      name: '配置私教课课 ',
      component: trainerCourseAdd,
      meta: [{path: '/trainerCourseList', name: '私教课课程'}]
    },
    // 编辑私教课
    {
      path: '/trainerCourseList/edit/:id',
      name: '编辑 ',
      component: trainerCourseEdit,
      meta: [{path: '/trainerCourseList', name: '私教课课程'}]
    },
    // 私教课详情
    {
      path: '/trainerCourseList/detail/:id',
      name: '详情 ',
      component: trainerCourseDetail,
      meta: [{path: '/trainerCourseList', name: '私教课课程'}]
    },
    // 工作人员列表
    {
      path: '/staffList',
      name: '工作人员',
      component: staffList
    },
    // 签到记录
    {
      path: '/signRecord',
      name: '签到记录',
      component: signRecord
    },
    {
      path: '/appointRecord',
      name: '预约记录',
      component: appointRecord
    },
    {
      path: '/personalTeachRecord',
      name: '代约私教课',
      component: personalTeachRecord,
      meta: [{path: '/appointRecord', name: '预约记录'}]
    },
    {
      path: '/teamTeachRecord',
      name: '代约团课',
      component: teamTeachRecord,
      meta: [{path: '/appointRecord', name: '预约记录'}]
    },
    {
      path: '/selectUserRecord/:id',
      name: '选择预约用户',
      component: selectUserRecord,
      meta: [{path: '/teamTeachRecord', name: '代约团课'}, {path: '/appointRecord', name: '预约记录'}]
    },
    // 添加工作人员
    {
      path: '/staffList/add',
      name: '添加 ',
      component: staffAdd,
      meta: [{path: '/staffList', name: '工作人员'}]
    },
    // 编辑工作人员
    {
      path: '/staffList/edit/:id',
      name: '编辑   ',
      component: staffEdit,
      meta: [{path: '/staffList', name: '工作人员'}]
    },
    // 工作人员详情
    {
      path: '/staffList/detail/:id',
      name: '详情    ',
      component: staffDetail,
      meta: [{path: '/staffList', name: '工作人员'}]
    },
    // 教练导师列表
    {
      path: '/trainerList',
      name: '教练&导师',
      component: trainerList
    },
    // 添加教练导师
    {
      path: '/trainerList/add',
      name: '添加',
      component: trainerAdd,
      meta: [{path: '/trainerList', name: '教练&导师'}]
    },
    // 编辑导师教练
    {
      path: '/trainerList/edit/:id',
      name: '编辑',
      component: trainerEdit,
      meta: [{path: '/trainerList', name: '教练&导师'}]
    },
    // 教练导师详情
    {
      path: '/trainerList/detail/:id',
      name: '详情',
      component: trainerDetail,
      meta: [{path: '/trainerList', name: '教练&导师'}]
    },
    // 薪资配置
    {
      path: '/salarySet',
      name: '薪资配置',
      component: salarySet
    },
    // 员工排班
    {
      path: '/schedule',
      name: '员工排班表',
      component: schedule
    },

    /* 生活馆 start */
    // 特权卡
    {
      path: '/vipCardList',
      name: '特权卡',
      component: vipCardList
    },
    {
      // 添加 特权卡
      path: '/addVipCard',
      name: '添加特权卡',
      component: addVipCard,
      meta: [{path: '/vipCardList', name: '特权卡'}]
    },
    {
      // 编辑 特权卡
      path: '/editorVipCard/:id',
      name: '编辑特权卡',
      component: editorVipCard,
      meta: [{path: '/vipCardList', name: '特权卡'}]
    },
    /* 生活馆 end */

    /* 场馆配置 start */
    // 场馆列表
    {
      path: '/pavilionsSet',
      name: '场馆列表',
      component: pavilionsSet
    },
    // 添加场馆
    {
      path: '/pavilionsSet/addPavilions',
      name: '添加场馆',
      component: addPavilions,
      // 设置这里的meta属性是为了展示面包屑
      meta: [{path: '/pavilionsSet', name: '场馆列表'}]
    },
    // 编辑场馆
    {
      path: '/pavilionsSet/editPavilions/:id',
      name: '编辑场馆',
      component: editPavilions,
      // 设置这里的meta属性是为了展示面包屑
      meta: [{path: '/pavilionsSet', name: '场馆列表'}]
    },
    // 场馆详情
    {
      path: '/pavilionsSet/pavilionsDetail/:id',
      name: '场馆详情',
      component: pavilionsDetail,
      // 设置这里的meta属性是为了展示面包屑
      meta: [{path: '/pavilionsSet', name: '场馆列表'}]
    },
    /* 场馆配置 end */

    /* 管理员配置 start */
    // 管理员列表
    {
      path: '/administratorList',
      name: '管理员列表',
      component: administratorList
    },
    {
      // 添加管理员
      path: '/administratorList/addAdministrator',
      name: '添加管理员',
      component: addAdministrator,
      meta: [{path: '/administratorList', name: '管理员列表'}]
    },
    {
      // 添加管理员
      path: '/administratorList/editAdministrator/:id',
      name: '编辑管理员',
      component: editAdministrator,
      meta: [{path: '/administratorList', name: '管理员列表'}]
    },
    /* 管理员配置 end */
    /* 系统配置 start */
    // 权限设置
    {
      path: '/accessConfiguration',
      name: '权限设置 ',
      component: accessConfiguration
    },
    // 修改密码
    {
      path: '/changePassword',
      name: '修改密码',
      component: changePassword
    },
    // 操作记录
    {
      path: '/operationRecord',
      name: '操作记录',
      component: operationRecord
    },
    {
      path: '/uploadImage',
      name: '上传图片',
      component: uploadImage
    },
    /* 系统配置 end */

    /* 工作台 start */
    {
      path: '/workbench/classSet',
      name: '上课安排',
      component: classSet
    },
    /* 工作台 end */
    // 运营数据监控 (体育总局)
    {
      path: '/lifehallView',
      name: '生活馆运营概览',
      component: lifehallView
    },
    /* 订单管理 start */

    // 订单列表
    {
      path: '/orderManage/orderManage',
      name: '订单',
      component: orderManage
    },

    // 消费记录
    {
      path: '/consumption/consumptionManagement',
      name: '消费记录',
      component: consumptionManagement
    },

    /* 订单管理 end */
    {
      path: '/err404',
      name: 'err404',
      component: err404
    },
    // 放到最后，如果匹配不到路由的话就跳转到登陆页面
    {
      path: '*',
      name: '404',
      redirect: '/err404',
      component: err404
    }
  ]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('accessToken') && to.path !== '/login') {
    // alert('请重新登录')
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

export default router
