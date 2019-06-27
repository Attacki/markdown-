
##  ./mine_webpack.js 编译文件
```js
/*
*   npm link 
*   在项目中使用 npm link mine-pack  就建立连接了
*/ 

#! /usr/bin/env node
// 1. 需要找到当前执行名的路径 拿到webpack.config.js

let path = require('path');
//  config配置文件
let config = require(path.resolve('webpack.config.js'));

let Complier = require('../lib/Complier'); 
let complier = new Complier(config);

complier.run();
```

##  ../lib/Complier.js
```js
let fs = require('fs');
let path = require('path');
let babylon = require('babylon');
let traverse = require('@babel/traverse').default;
let t = require('@babel/types');
let generator = require('@babel/generator').default;
let ejs = require('ejs');
// babylon   主要是把源码 转换成ast
// @babel/traverse  遍历到对应的节点
// @babel/types     替换对应的节点
// @babel/gengerator   生成器

class Complier{
    constructor(config){
        // entry output
        this.config = config;
        // 需要保存入口文件的路径
        this.entryId; // './src/index.js'
        // 需要保存的所有的模块依赖
        this.modules = {}

        this.entry = config.entry;
        // 项目工作路径
        this.root = process.cwd();
    }

    getSource(modulePath){
        let rules = this.config.module.rules;
        let content = fs.readFileSync(modulePath,'utf8');
        for(let i=0; i<rules.length;i++){
            let rule = rules[i];
            let {test, use} = rule;
            let len = use.length - 1;
            if(test.test(modulePath)){ //这个模块要使用loader来转化
                function normalLoader(){
                    let loader = require(use[len--]);
                    content = loader(content)
                    if(len >= 0){
                        normalLoader()
                    }
                };
                normalLoader()
            }
        }
        return content
    }

    parse(source, parentPath){ //AST解析语法树
        let ast = babylon.parse(source);
        let dependences = [];
        traverse(ast,{
            CallExpression(p){ //调用表达式  require()
                let node = p.node  //对应的几点
                if(node.callee.name === 'require'){
                    node.callee.name = '__weppack_require_';
                    let moduleName = node.arguments[0].value //模块的名字
                    moduleName = moduleName + (path.extname(moduleName)?'':'.js');
                    moduleName =  path.join(parentPath, moduleName);
                    dependences.push(moduleName);
                    node.arguments = [t.stringLiteral(moduleName)];
                }
            }
        });
        let sourceCode = generator(ast).code;
        console.log({sourceCode, dependences})
        return {sourceCode, dependences}
    }

    // 构建模块
    buildModule(modulePath,isEntry){
        // 拿到模块中的内容
        let source = this.getSource(modulePath);
        // 模块id modulePath = modulePath - this.root  src/index.js
        let moduleName = './'+path.resolve(this.root,modulePath)
        if(isEntry){
            this.entryId = moduleName;
        }
        // 解析需要把source源码进行改造  返回一个依赖列表
        let {sourceCode, dependences} = this.parse(source,path.dirname(moduleName)); // ./src

        this.modules[moduleName] = sourceCode;
        
        dependences.forEach(dep=>{ //附属模块递归加载
            this.buildModule(dep,false)
        })
    }

    emitfile(){//发射文件
        // 用数据渲染模板
        // 拿到输出路径
        let main = path.join(this.config.output.path,this.config.output.filename);
        // 拿到模板内容
        let templateStr = this.getSource(path.join(__dirname,'main.ejs'))
        let code = ejs.render(templateStr,{ entryId:this.entryId,modules:this.modules});
        
        fs.writeFileSync(main,code)
    }

    run(){
        // 执行 并且创建，模块的依赖关系
        this.buildModule(path.resolve(this.root,this.entry),true); // true达标是一个主模块
        console.log(this.modules,this.entryId)
        this.emitfile()

    }
}

module.exports = Complier
```


## ./main.ejs   模版文件
```js
(function(modules) { // webpackBootstrap
	// The module cache
	var installedModules = {};

	// The require function
	function __webpack_require__(moduleId) {

		// Check if module is in cache
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};

		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		// Flag the module as loaded
		module.l = true;

		// Return the exports of the module
		return module.exports;
	}
	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = "<%-entryId%>");
})
({
    <% for (let key in modules){%>
    "<%-key%>":
        (function(module, __webpack_exports__, __webpack_require__) {
            eval(`<%-modules[key]%>`);
        }),
    <% } %>
});
```

## ./loader/less-loader   增加 less-loader

```js
let less = require('less')
function loader(source){
    let css = '';
    less.render(source,function(err,c){
        css = c.css;
    });
    console.log(c)
    css = css.replace(/\n/g,'\\n');
    return css
}

module.exports = loader
```

## ./loader/style-loader   增加 style-loader

```js
function loader(source){
    let style = `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
    `
    return style;
}

module.exports = loader;
```
