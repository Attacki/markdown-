# 所需变量
```js
const url = require('url')
const path = require('path')
const publicPath = '/';
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');    //可以写多个，每个就代表一个css文件
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const htmlWithimgLoader = require('html-withimg-loader') 
const CopyWebpackPlugin = require('copy-webpack-plugin')
```

# 实时打包文件
```js
module.exports={
    ...

    watch:true,
    watchOptions: {
        poll:100,   // 每秒检查100次
        aggreatement: 500, //防抖 停止输入之后500毫秒再打包
        ignored:/node_modules/  //不需要进行监控哪个文件夹
    }
}
```

# mode     

> 'production'    //生产模式  
> 'development'   //开发环境

# entry    
`参数:String/Array/Object`
- 单个入口写法
```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
- 传入对象
```js
module.exports = {
  entry: {
    'index': './src/index.js',
    'details': './src/details.js'
  }
};
```
- 向 entry 属性传入文件路径数组，将创建出一个 多主入口(multi-main entry)
```js
module.exports = {
  entry: ["./src/index",'./src/test']
};
```

# output   
```js
let webpack = require('webpack')

module.exports={
    ...

    output:{
        filename:'[name].[hash:8].js',          //打包后的文件名
        path:path.resolve(__dirname,"dist"),    //路径必须是一个绝对路径
        publicPath:'http://www.beepool.org',     //为每一个资源引用加前缀
        library:'_dll_[name]', //  会将打包后的结果用abc这个变量来接收
        libraryTarget:'var' // commonJS var umd  使用这些方式来定义
    },

    plugins:[
        // 第一次打包，使用该插件把不变的js库打包好，之后就可以注释掉
        new webpack.DllPlugin({ // name == library
            name: '_dll_[name]',
            path: path.resolve(__dirname,'dist','manifest.json')
        }),
        // 在开发的时候使用，直接链接已经打包好的文件
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname,'dist','manifest.json')
        })
    ]
}
```

# optimization  压缩优化文件
```js
module.exports={
    ...

    optimization: {
        minimizer: [
            new TerserJSPlugin({}),         //因为设置了之后覆盖了webpack默认配置，需要重新配置js的压缩
            new OptimizeCSSAssetsPlugin({}) //压缩css文件
        ],
        splitChunks:{ //分割代码块
            cacheGroups:{//缓存组
                common:{ //一个公共的模块文件
                    chunks:'initial',   //从入口处开始就提取代码
                    minSize:0,      //大小大于0字节
                    minChunks:2     //引用了2次以上才抽离
                },
                vendor:{//第三方模块
                    priority:1,     //权重高一些，先抽离第三方模块，再抽离公共的
                    test:/node_modules/,  //该文件中用到的抽离出来
                    chunks:'initial',
                    minSize:0,      
                    minChunks:2     
                }
            }
        }
    }
}
```



# module   
```js
//loader 默认是由两部分组成  pitch noraml组成
// expose-loader 暴露全局的loader 内联loader
// pre  前置执行的loader
// normale 普通loader
// post 后置执行 例如postloader
// inline-loader 行内loader  1. -! 不会让文件再去通过pre + normal loader来处理了  2. ! 没有normal  3. !! 只要行内loader执行
let a = require('-!inline-loader!./a.js')
import $ from 'expose-loader?$!jquery'          //将jquery暴露到全局，第一种方法 
let webpack = require('webpack')
//引入图片使用 import或者require 不要直接写字符串

module.exports={
    ...
    
    module:{
        noParse:/jquery/, //因为jquery没有依赖其他文件，就不去解析 
        rules:[{ //规则  loader的顺序问题，从右向左  从下到上
                //将jquery暴露到全局，第二种方法
                test:require('jquery'), 
                use:'expose-loader?$'  
            }, {
                test:/\html$/,
                use:'htmlWithimgLoader' //处理html文件中的img图片
            },{
                test:/\.js$/,
                use:{
                    loader:'babel-loader',  //转化es6到es5
                    exclude:/node_modules/, //排除该文件夹
                    include: path.resolve('src'), //包含该文件夹
                    options:{
                        presets:[   
                            '@babel/preset-env'
                        ],
                        plugins:[
                            '@babel/plugin-proposal-class-properties' //添加类属性
                        ]
                    }
                }
            }, {
                test:/\.less$/,     //可以处理less文件
                use:  [
                        // css-loader接续 @import这种语法的
                        // style-loader 把css插入到header的标签中
                        // 字符串只会传单个loader，传递多个loader需要传一个数组
                        // loader是有顺序的，默认从右向左执行
                        // loader还可以写成对象
                    MiniCssExtractPlugin.loader,  //使用插件MiniCssExtractPlugin来将css代码抽离成文件
                    {
                        loader:'style-loader',
                        options:{
                            inserAt: 'top'
                        }
                    },
                    'css-loader',       //@import 解析路径
                    'post-loader',      
                    /*  post-loader配置
                    * 添加浏览器前缀   需要添加 postcss.config.js 文件来进行配置
                    * module.exports={
                    *     plugins:  [require('autoprefixer')]
                    * }
                    */ 
                    'less-loader'       //把less  ->  css
            },{
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,   //当图片小于10k
                        outputPath:'/img/',
                        publicPath:'http://www.beepool.org'    //只有图片加前缀
                    }
                }],
                enforce:'pre' // pre/post
            }
        ]
    }
}
```


# plugins  
```js
module.exports={
    ...
    
    plugins:[
        new HTMLPlugin({
            template:'./assets/template/index.html',    //模版文件
            filename:'index.html',              //生成的文件名
            chunks:['index','details'],         //引入entry的哪些模块
            minify:{
                removeAttributeQuotes:true,     //去除所有双引号
                collapseWhitespace:true         //使html压缩为一行
            },
            hash:true
        }),
        new HTMLPlugin({
            template:'./assets/template/details.html',
            filename:'details.html',
            chunks:['details']
        }),
        new CleanWebpackPlugin(),    //清理打包文件夹
        new MiniCssExtractPlugin({
            filename:'/css/main.css'     //抽离出的css文件名，
        }),
        new CopyWebpackPlugin([     //复制文件
            {from:'./doc',to:'./'}
        ]),
        new webpack.DefinePlugin({
            DEV:"'dev'",
            DEV:JSON.stringify('production'),
            FLAG:true,
            EXPRESSION:'1+1'
        })
        new webpack.ProvidePlugin({ //将jquery注入到每一个模块，第三种方法
            $:'jquery'
        }),
        new webapck.BannerPlugin('把代码署名'),
        new webpack.IgnorePlugin(/\.\/locale/,/moment/),     //在引入moment这个模块的时忽略引入'./locale' 
        new webpack.NameModulesPlugin(), //打印更新的模块
        new webpack.HotModuleReplacementPlugin()    //热更新插件
        /*
        *   import './test.js'
        *   if(module.hot){
        *       module.hot.accept('./test.js',()=>{  //监听该模块，只要更新就调用该函数，局部更新，而不是刷新页面
        *           let str = require('./test.js')
        *           console.log(str)
        *       })
        *   }
        */
    ]
}
```

# externals 引入不需要打包
```js
module.exports={
    ...

    externals:{ //不需要打包
        jquery:'jQuery'
    }
}
```

# devtool 增加映射文件  可以帮助我们调试源代码
```js
module.exports={
    ...

    // 1. source-map 源码映射  会单独生成一个sourcemap文件 ，报错时会标识当前报错的列和行
    // 2. eval-source-map 不会产生单独的文件，但是可以显示行和列
    // 3. cheap-module-source-map 不会产生列，但是是一个单独的映射文件，产生后可以保留下来
    // 4. cheap-module-eval-source-map 不会产生文件 集成在打包后的文件中 不会产生列
    devtool:'source-map'
}
```


# resolve  解析第三方包，起别名
```js
module.exports={ //解析 第三方包 common
    ...
    
    resolve:{
        modules:[
            path.resolve('node_modules')
        ],
        mainFields:['style','main'],  //查找模块文件时，先在style文件夹查找，再去main文件夹查找
        mainFiles:['bundle'],  //入口文件的名字 默认index.js，现在是bundle.js
        extensions:['js','css','json']
        alias:{
          'vue$': path.resolve(__dirname, './assets/static/vue.js'), // 以vue为结尾的导入
          'store':path.resolve(__dirname, './assets/common/store.js')
        }
    }
}
```

# resolveLoader 专门解析loader路径
```js
module.exports={
    ...
    
    resolveLoader:{
        modules:['node_modules',path.resolve(__dirname,'loaders')], //添加额外的路径，也可以指定自定义loader
        alias:{
          loader1: path.resolve(__dirname, 'loader','loader1.js'), 
        }
    }
}
```


# devServer
```js
module.exports={
    ...
    
    devServer:{
        // 3. 有服务端 不用代理来处理  能不能在服务端中启动webpack 端口用服务器端口
        // 在服务端启动webpack要使用webpack-dev-middleware中间件
        /*
        *   let app = express()
        *   let webpack = require('webpack')
        *   ley middle = require('webpack-dev-middleware')
        *   let config = require('./webpack.config.js')
        *   let complier = webpack(config)
        *   app.use(middle(complier))
        *   app.lister(3000)
        */

        // 2. 前端来mock数据
        before(app){   //提供的勾子函数
            app.get('/user',(req,res)=>{
                res.json({name:'厉害了-before'})
            })
        }
        hot:true,               //开启热更新
        host:'127.0.0.1',       //设置为本地ip
        port:'8080',            //设置端口为8080
        progress:true,          //是否显示进度条
        compress:true,          //设置gzip压缩
        contentBase:'./dist',   //设置文件打开的目录
        open:true,              //自动打开浏览器
        historyApiFallback: {   //刷新页面仍然能够根据路由查询对应视图
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        },       //将所有的url请求对应到index页面，如果是单页面应用后台也要这样做
        proxy:{ // 重写的方式把请求代理到express服务器
            '/api':{
                target:'loaclhost:3000',
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
```

# 根据不同的配置来进行调试或者打包
```js
let {smart} = require('webpack-merge') 
let base = require('./webpack.base.js')

// 生产环境
module.exports = smart(base,{
    mode:'develpoment',
    optimization:{

    },
})

// 开发环境

module.exports = smart(base,{
    mode:'develpoment',
    devServer:{

    },
    devtool:''
})
```

# 优化
- 单独创建一个文件，把需要用到并且不会变的文件更改，提前打包，使用动态链接库来引用，避免打包不变化的代码
- import  在生产环境下，会自动除去没用的代码  (tree-shaking)
- es6模块会把结果放到default上
- scope hosting作用域提升 webpack中会自动省略过程代码，直接把结果放在那里
- 可以使用import语法来实现模块懒加载，懒加载其实就是异步加载，比如按钮被点击之后再加载，也就是异步加载

### 一些工具库
- loader-utils
- mime
- schema-utils
    ```js
    let validateOptions = require('schema-utils');
    let schema = {
        type:'object',
        properties:{
            text:{
                type:'string'
            }
        }
    }
    validateOptions(schema,some___option,'报错是哪个loader')
    ```

