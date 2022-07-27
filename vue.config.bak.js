function onProxyReq(proxyReq, req, res) {
  //实在不知道代理后的路径，可以在这里打印出出来看看
  console.log(req.originalUrl, ' -> ' + req.path, '代理路径');
  console.log(res.headers);
}
const webpack = require('webpack');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}
module.exports = {
  // 部署应用时的基本 URL
  publicPath: './',

  // build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
  outputDir: 'dist',

  // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  //assetsDir: '',

  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  indexPath: 'index.html',

  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,

  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  lintOnSave: false,

  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,

  // Babel 显式转译列表
  //transpileDependencies: [],
  // externals: {
  //     'vue-router': 'VueRouter',
  //     'axios': 'axios',
  //     'element-ui': 'ELEMENT'
  // },
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性（注：仅影响构建时注入的标签）
  //crossorigin: '',

  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  //integrity: false,

  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  // 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
      // new webpack.total: 100()
    ],
  },
  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
  chainWebpack: config => {
    // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
    config.resolve.alias.set('@', resolve('src'));
    config.resolve.symlinks(true);
    config.plugin('html').tap(args => {
      args[0].title = '国防科技权威机构报告111';
      return args;
    });
  },

  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    disableHostCheck: true,
    port: 8190,
    open: true,
    https: false,
    hot: true,
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      '/authority_forecast': {
        // target: 'http://172.22.106.125:7002',
        target: 'http://192.168.200.139:7002',
        // target: 'http://10.208.58.11:30623',// 新
        changeOrigin: true,
        pathRewrite: {
          '^/authority_forecast': '',
        },
        onProxyReq,
      },
      '/login': {
        // target: 'http://10.170.130.240:30115/', // 天玑240
        target: 'http://192.168.200.127:8443/', // 749
        // target: 'http://114.113.145.5:8733', //外网
        // target: 'http://10.170.130.240:30118', //jyy
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/login': '',
        },
      },
      // 权限管理
      '/authority': {
        target: 'http://192.168.200.127:8182', //天玑
        // target: 'http://localhost:30113', //天玑
        // target: 'http://114.113.145.5:8732', //外网
        // target: 'http://10.170.130.240:30119', //jyy
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/authority': '',
        },
      },
    },
  },

  // 是否为 Babel 或 TypeScript 使用 thread-loader
  //parallel: require('os').cpus().length > 1,

  // 向 PWA 插件传递选项
  //pwa: {},

  // 可以用来传递任何第三方插件选项
  //pluginOptions: {}
};