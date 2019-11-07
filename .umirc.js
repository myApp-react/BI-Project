import { resolve } from 'path'
// ref: https://umijs.org/config/
export default {
  // treeShaking: true,
  publicPath: '/build/', // /build/dist/ | http://cdn.com/foo
  history: 'hash',
  ignoreMomentLocale: true,//忽略 moment 的 locale 文件，用于减少尺寸。
  outputPath: './build',
  hash: true,//开启 hash 文件后缀
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader',
      },
      title: 'BI-app',
      dll: {
        include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
      },
      esLint: false,
      // locale: {
      //   enable: true,
      //   default: 'en-US',
      // },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
      scripts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/js/swiper.min.js' },
      ],
    }],
  ],
  theme: './config/theme.config.js',
  proxy: {
    '/api': {//http://192.168.100.101:8076 http://bs.crcccd186.com:8051
      target: 'http://192.168.100.101:8076',// http://192.168.100.171:8010 http://114.55.128.154:5376
      changeOrigin: true,
      // pathRewrite: { "^/api" : "" }
    },
  },
  alias: {
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components'),
    api: resolve(__dirname, './src/services/'),
    utils: resolve(__dirname, './src/utils/'),
    themes: resolve(__dirname, './src/themes'),
  },
  "externals": {
    "swiper": "window.Swiper",
  },
  chainWebpack(config, { webpack }){
    if (process.env.NODE_ENV === 'production') {
      config.merge({
        plugin: {
          install: {
            plugin: require('uglifyjs-webpack-plugin'),
            args: [{
              sourceMap: false,
              uglifyOptions: {
                compress: {
                  // 删除所有的 `console` 语句
                  drop_console: true,
                },
                output: {
                  // 最紧凑的输出
                  beautify: false,
                  // 删除所有的注释
                  comments: false,
                },
              },
            }],
          },
        },
      });
    }
  },
}
