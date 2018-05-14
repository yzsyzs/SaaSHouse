# newhouseweb

> lifehouse-admin-for-web

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 开发规范【后续继续补充，有好的建议都可以写上】
  1. 所有组件都放在 src/components 目录下，尽可能做到通用的东西抽取成组件
  2. 除了基础组件（base 目录），其他的组件的建立方式都是先建立文件夹，再建立对应的组件，文件夹的名称跟组件的名称相同，比如 components/sidebar/sidebar.vue
  3. 通用的方法放到 src/common 目录下，已经建好的tools.js用于放置工具类方法，可以建立其他文件，按需所建
  4. 如果在写代码的过程中对哪个地方有存在疑问的，建议都先写上 TODO 作为标识
  5. src/filter 文件夹放置的是过滤器，先建立文件夹再建立与之对应的文件名称或者indx.js，按实际开发建立对应过滤器的名称，建立好的时候建议跟其他人说一下
  6. tpl文件夹放的是组件的模板代码，如果建立新组件的时候可从tpl.vue下拷贝粘贴按需使用
  7. 目前的话每个开发人员没有单独的开发分支，所以再公共的地方有所修改的话要先提前跟大家说声，避免代码冲突
  8. 编辑器的缩进建议使用四个缩进
  9. 路由组件里面的元素全部包在<el-main></el-main>中

# 开发环境要修改主题颜色的步骤

  1.在根目录下修改 element-variables.scss 里面的变量

  2.在控制台执行 et【必选先全局安装了element-chalk】 命令即可
