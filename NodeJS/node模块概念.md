## 用node 运行一个文件
```
node 文件名
```

## nodejs 
- 主线程是单线程(异步)callback，将后续的逻辑写成函数，传入到当前执行的函数中，当执行的函数得到了结果后，执行传入的函数(回调函数)
- 五个人同时吃一碗饭 异步
- 阻塞不能异步 （阻塞是针对内核说的）
- I/O操作，读写，异步读写，能异步就不同步
- event-driven 事件驱动（发布订阅）

web异步
- setTimeout
- callback
- onclick
- ajax


## node基础概念

> 在文件中打印this不是global属性，node自带模块化，一个js文件就是一个模块，模块this不是global
> 每个文件都有局部作用域，不会将属性挂载global上


### console、process 进程 (设置环境变量 区分开发还是线上)

```js
/* 在命令里配置Node_ENV,mac export/windows set */
set NODE_ENV=dev 

if(process.env.NODE_ENV == 'dev'){
    <!--开发环境-->
}else{
    <!--生产环境-->
}

//异步方法，在当前队列的底部，执行完当前队列同步代码，优先执行的代码
console.time('start');
process.nextTick(function(){
    console.log('nextTick');
    //this指的是global
})
console.timeEnd('start');

//第二个队列中的异步方法
setImmediate(function(){
    console.log('setImmediate')
    //this指的是setImmediate
})


// 形参(剩余运算符) 将剩余的内容放到一个数组中，args中['loveJS']
// 拓展运算符 展开运算符
console.log([...[1,4,8],...[2,3]]) //es6语法
console.log([...{love:'tu'},...{to:'miao'}]) //es7语法
setTimeout((...args)=>{//使用箭头函数，它中间没有this指向，没有arguments
    console.log(this);
    console.log(args);
    //this指的是setTimeout
},100,"loveJS")
```
### 全局变量 ，可以不声明，直接用
```js
console.log(arguments);
// exports、require、module、__filename、__dirname
// 模块化 低耦合 高内聚 方便维护 防止代码冲突（命名冲突）
// （闭包） 单例（不能保证一定不冲突，调用过长）
// CMD seajs（就近依赖） AMD 依赖前置 requirejs（浏览器端的模块化）

// noejs基于commonJS，基于文件的读写，node天生自带模块化
// 1、定义如何创建一个模块，一个js文件就是一个模块
// 2、如果使用一个模块 require 你要是用一个文件就require一个文件。自己写的文件使用相对路径调用，可省后缀，.js，.json,.node，如果是异步方法一般会有回调函数
// 3、导出一个模块 exports / module.exports

// require方法具有缓存功能，多次引用只执行一次。
```
> module.exports = exports  因为这个关系所以exports可以在模块上追加内容。最终导出的是module.exports


### 全局安装 -g（只能在"命令行"中使用） 
- 默认安装路径是 npm root -g
- 不会加入环境变量 而是通过npm 进行映射


```
npm install nrm -g [安装nrm]
nrm test [测试链接时间]
nrm ls [显示所有可用源]
nrm use [源的名字]
npm uninstall nrm -G [卸载nrm]
```
> npm，nrm，nvm (node registry manger)
### 本地安装
- 没有-g参数，安装之前需要初始化，记录安装依赖
```cmd
npm init -y
```
> package.json，目录总不能有中文，特殊字符，大写，默认先找当前目录下的package.json，如果当前没有会去上级查找，找不到才会认为在当前目录下安装
> package.json中scripts中可以生成一些配置一些快捷方式

### 项目依赖
- 开发和线上都需要使用
```
npm install vue@2.0.0
npm uninstall vue
```

### 开发依赖
- 开发时使用，线上不使用
```
npm install less --save-dev
npm uninstall less --save-dev
```

### 安装全部依赖
```
npm install
```

### yarn安装
```
yarn install -g yarn
yarn install 

<!-- 安装包 删除包 -->
yarn add 包名 --dev
yarn remove 包名
```

### 发布包
- 先要回到国外 nrm use npm 
- 包名不能和已有的一致
- 入口文件，作整合用的
- 注册帐号，如果有账号表示登陆，新用户需要校验邮箱
```
npm addUser
npm publish
```

### 第三方模块
> 通过npm来进行安装
> 第三方模块不需要./的形式引入 可以直接通过包名将文件引入，找package.json中的main对应的文件运行，如果当前目录下没找到，会继续向上级目录查找，直到根目录为止。

